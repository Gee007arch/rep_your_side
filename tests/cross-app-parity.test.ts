import { describe, it, expect } from 'vitest';
import * as protoModel from '../../source/dist/model.mjs';
import * as reactModel from '../src/domain/model';
import { CITIES, QUESTIONS, STREET, PLACES, PULSE } from '../src/data/fixtures';
import { LocalBackupCodec, LocalProgressStore, LocalCatalogReader } from '../src/data/local';

describe('Gate G2 & WP F4.4: Cross-App Domain & Backup Parity (Prototype vs React)', () => {
  it('executes identical command sequences on prototype model.mjs and React model.ts with 100% JSON parity', () => {
    const fixedCreated = 1762700000000;
    const fixedDate = 1762700100000;

    const protoState = protoModel.fresh();
    protoState.created = fixedCreated;

    const reactState = reactModel.fresh();
    reactState.created = fixedCreated;

    // 1. Set Side to Lagos / Yaba
    expect(protoModel.setSide(protoState, 'lagos', 'Yaba', CITIES)).toBe(true);
    expect(reactModel.setSide(reactState, 'lagos', 'Yaba', CITIES)).toBe(true);
    protoState.nickname = 'Tunde';
    reactState.nickname = 'Tunde';

    // 2. Play Lagos city starter round (answers: 1, 0, 2, 1, 1)
    const lagosCityKey = reactModel.roundKey('lagos', 'city', 'starter-v1');
    expect(protoModel.roundKey('lagos', 'city', 'starter-v1')).toBe(lagosCityKey);

    const answers = [1, 0, 2, 1, 1];
    answers.forEach((ans, idx) => {
      expect(protoModel.markAnswer(protoState, lagosCityKey, idx, ans, QUESTIONS.lagos)).toBe(true);
      expect(reactModel.markAnswer(reactState, lagosCityKey, idx, ans, QUESTIONS.lagos)).toBe(true);
    });

    const protoRes = protoModel.complete(protoState, lagosCityKey, QUESTIONS.lagos);
    const reactRes = reactModel.complete(reactState, lagosCityKey, QUESTIONS.lagos);
    expect(reactRes).toEqual(protoRes);

    // 3. Play Abuja street sense round (3 scenarios in STREET)
    const abujaStreetKey = reactModel.roundKey('abuja', 'street', 'starter-v1');
    expect(protoModel.roundKey('abuja', 'street', 'starter-v1')).toBe(abujaStreetKey);
    [1, 0, 2].forEach((ans, idx) => {
      protoModel.markAnswer(protoState, abujaStreetKey, idx, ans, STREET);
      reactModel.markAnswer(reactState, abujaStreetKey, idx, ans, STREET);
    });
    expect(reactModel.complete(reactState, abujaStreetKey, STREET)).toEqual(
      protoModel.complete(protoState, abujaStreetKey, STREET)
    );

    // 4. Save & collect places/pulse
    protoModel.toggle(protoState.saved, PLACES[0].id);
    reactModel.toggle(reactState.saved, PLACES[0].id);

    protoState.read.push(PLACES[0].id, PULSE[0].id);
    reactState.read.push(PLACES[0].id, PULSE[0].id);
    protoModel.award(protoState, 'discovery:' + PLACES[0].id, 10);
    reactModel.award(reactState, 'discovery:' + PLACES[0].id, 10);
    protoModel.award(protoState, 'discovery:' + PULSE[0].id, 10);
    reactModel.award(reactState, 'discovery:' + PULSE[0].id, 10);

    // 5. Complete Lagos story
    protoState.story.lagos = { chapter: 4, choices: [0, 1, 0, 1, 0], done: true };
    reactState.story.lagos = { chapter: 4, choices: [0, 1, 0, 1, 0], done: true };
    protoModel.award(protoState, 'story:lagos', 50);
    reactModel.award(reactState, 'story:lagos', 50);

    // 6. Toggle circle interest & submit reflection
    protoModel.toggle(protoState.interests, 'lens');
    reactModel.toggle(reactState.interests, 'lens');
    protoState.activity.lens = { text: 'Noticed the yellow buses lining up at dusk.', date: fixedDate };
    reactState.activity.lens = { text: 'Noticed the yellow buses lining up at dusk.', date: fixedDate };
    protoModel.award(protoState, 'activity:lens', 20);
    reactModel.award(reactState, 'activity:lens', 20);

    // 7. Create correction draft
    const draft = {
      id: PLACES[0].id,
      kind: 'place' as const,
      title: PLACES[0].name,
      text: 'Opening hours on Sundays start at 10am according to the park board.',
      date: fixedDate
    };
    protoState.drafts.push(draft);
    reactState.drafts.push(draft);

    // 8. Verify 100% JSON and XP parity
    expect(reactModel.xp(reactState)).toBe(protoModel.xp(protoState));
    expect(JSON.stringify(reactState)).toBe(JSON.stringify(protoState));
    expect(protoModel.validate(reactState)).toBe(true);
    expect(reactModel.validate(protoState)).toBe(true);
  });

  it('WP F4.4: Bidirectional backup round-trip (Prototype export -> React restore -> React export -> Prototype load)', () => {
    const codec = new LocalBackupCodec();

    // Create a rich state in Prototype using valid place ID ('millennium')
    const protoState = protoModel.fresh();
    protoModel.setSide(protoState, 'abuja', 'Wuse', CITIES);
    protoState.nickname = 'Amina';
    protoModel.award(protoState, 'story:abuja', 50);
    protoState.story.abuja = { chapter: 4, choices: [1, 1, 0, 0, 1], done: true };
    protoModel.toggle(protoState.saved, 'millennium');

    // Prototype export is JSON.stringify(state)
    const protoBackupString = JSON.stringify(protoState);

    // Decode and validate in React via LocalBackupCodec
    const decodedInReact = codec.decode(protoBackupString);
    expect(decodedInReact.ok).toBe(true);
    if (!decodedInReact.ok) return;

    expect(decodedInReact.candidate).toEqual(protoState);

    // Re-export from React
    const reactExportString = codec.encode(decodedInReact.candidate);

    // Load back into Prototype's loadState
    const protoLoaded = protoModel.loadState({
      getItem: (k: string) => (k === protoModel.KEY ? reactExportString : null)
    });
    expect(protoLoaded.issue).toBeNull();
    expect(protoLoaded.state).toEqual(protoState);
  });

  it('verifies LocalCatalogReader and LocalProgressStore ports behave identically to direct fixtures and storage', () => {
    const catalog = new LocalCatalogReader();
    expect(catalog.getCities()).toEqual(CITIES);
    expect(catalog.getCity('lagos').name).toBe('Lagos');
    expect(catalog.getPlaces('lagos').every((p) => p.city === 'lagos')).toBe(true);
    expect(catalog.getPulseEntries('abuja').every((p) => p.city === 'abuja')).toBe(true);
    expect(catalog.getPlaceById('lcc')?.name).toBe('Lekki Conservation Centre');

    const mem: Record<string, string> = {};
    const store = new LocalProgressStore(() => ({
      getItem: (k) => mem[k] ?? null,
      setItem: (k, v) => {
        mem[k] = v;
      }
    }));

    expect(store.readRaw()).toBe('No stored save');
    const initial = store.load();
    expect(initial.issue).toBeNull();
    expect(initial.state.city).toBe('lagos');

    initial.state.nickname = 'PortTester';
    expect(store.save(initial.state)).toBe(true);
    expect(store.readRaw()).toContain('PortTester');

    const reloaded = store.load();
    expect(reloaded.state.nickname).toBe('PortTester');
  });
});
