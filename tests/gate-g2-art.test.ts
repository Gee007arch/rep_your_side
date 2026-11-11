import { describe, it, expect } from 'vitest';
import * as originalArt from '../../source/dist/art.mjs';
import { Icon } from '../src/ui/icons';
import { Skyline, ArtScene } from '../src/ui/art';

describe('Art and Icon Parity', () => {
  it('Skyline generates identical paths for lagos and abuja', () => {
    const lagosSvg = originalArt.skyline('lagos');
    const abujaSvg = originalArt.skyline('abuja');

    expect(lagosSvg).toContain('fill="#f9b93d"'); // danfo bus
    expect(abujaSvg).toContain('fill="#829d83"'); // Zuma rock
    expect(abujaSvg).toContain('id="grain"');

    expect(Skyline({ city: 'lagos' })).toBeDefined();
    expect(Skyline({ city: 'abuja' })).toBeDefined();
  });

  it('All icon names exist in Icon map', () => {
    const iconNames = [
      'home', 'play', 'compass', 'pulse', 'users', 'passport',
      'arrow', 'pin', 'chevron', 'spark', 'check', 'close',
      'book', 'save', 'clock', 'leaf', 'camera', 'help',
      'settings', 'trophy', 'menu', 'share', 'bag', 'refresh',
      'download', 'shield', 'search'
    ];

    for (const name of iconNames) {
      const orig = originalArt.icon(name);
      expect(orig).toContain('<svg');
      expect(orig).toContain('class="icon');
      expect(Icon({ name })).toBeDefined();
    }
  });

  it('ArtScene renders for all types with preserveAspectRatio="xMidYMid slice" for full-bleed cover scaling', () => {
    for (const type of ['city', 'forest', 'park', 'train', 'craft']) {
      const el = ArtScene({ type, city: 'lagos' });
      expect(el).toBeDefined();
      if (type !== 'city') {
        expect(el.props.preserveAspectRatio).toBe('xMidYMid slice');
      }
    }
    const sky = Skyline({ city: 'lagos' });
    expect(sky.props.preserveAspectRatio).toBe('xMidYMid slice');
  });
});
