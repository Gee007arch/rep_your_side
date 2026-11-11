import React, { useState } from 'react';
import {
  INITIAL_INSTITUTIONS,
  type InstitutionSide
} from '../../data/rivalryData';
import { MAIN_COUNTRY_LIST, type CountryCode } from '../../data/countries';
import { Icon } from '../../ui/icons';
import { Pill } from '../../ui/Pill';
import { award } from '../../domain/model';
import { usePassport } from '../../context/PassportContext';

export interface InstitutionsDialogProps {
  initialKind?: 'campus' | 'alumni';
}

const INSTITUTIONS_STORAGE_KEY = 'rys.v15.institutions.v1';

function loadInstitutions(): {
  list: InstitutionSide[];
  affiliatedIds: string[];
  cohortNotes: Record<string, string>;
} {
  if (typeof window === 'undefined') {
    return {
      list: structuredClone(INITIAL_INSTITUTIONS),
      affiliatedIds: [],
      cohortNotes: {}
    };
  }
  try {
    const raw = window.localStorage.getItem(INSTITUTIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.list)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    list: structuredClone(INITIAL_INSTITUTIONS),
    affiliatedIds: [],
    cohortNotes: {}
  };
}

function saveInstitutions(data: {
  list: InstitutionSide[];
  affiliatedIds: string[];
  cohortNotes: Record<string, string>;
}) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(INSTITUTIONS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function InstitutionsDialog({ initialKind = 'campus' }: InstitutionsDialogProps) {
  const { state, persist, showToast, publishFeedActivity } = usePassport();
  const [store, setStore] = useState(() => loadInstitutions());
  const [activeKind, setActiveKind] = useState<'campus' | 'alumni'>(initialKind);
  const [searchTerm, setSearchTerm] = useState('');
  const [cohortInput, setCohortInput] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [countryFilter, setCountryFilter] = useState<'ALL' | CountryCode>('ALL');

  // Request-to-add missing institution form
  const [reqName, setReqName] = useState('');
  const [reqState, setReqState] = useState('Lagos');
  const [reqCategory, setReqCategory] = useState('Federal University');
  const [reqMotto, setReqMotto] = useState('');

  const filtered = store.list
    .filter((inst) => inst.kind === activeKind)
    .filter((inst) => {
      if (countryFilter === 'ALL') return true;
      if (countryFilter === 'NIGERIA') return !inst.countryCode || inst.countryCode === 'NIGERIA';
      return inst.countryCode === countryFilter;
    })
    .filter((inst) => {
      if (!searchTerm.trim()) return true;
      const target = `${inst.name} ${inst.shortName} ${inst.state} ${inst.city} ${inst.mottoOrTag}`.toLowerCase();
      return target.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => b.totalXp - a.totalXp);

  const handleAffiliate = (inst: InstitutionSide) => {
    const alreadyAffiliated = store.affiliatedIds.includes(inst.id);
    if (alreadyAffiliated) {
      showToast(`You are already verified with ${inst.shortName}!`);
      return;
    }

    const note =
      cohortInput.trim() ||
      (inst.kind === 'campus' ? 'Current Student Cohort' : 'Verified Alumni Set');

    const updatedList = store.list.map((item) =>
      item.id === inst.id
        ? {
            ...item,
            verifiedMembers: item.verifiedMembers + 1,
            totalXp: item.totalXp + 50
          }
        : item
    );

    const nextStore = {
      list: updatedList,
      affiliatedIds: [...store.affiliatedIds, inst.id],
      cohortNotes: { ...store.cohortNotes, [inst.id]: note }
    };

    setStore(nextStore);
    saveInstitutions(nextStore);

    const nextState = structuredClone(state);
    const gained = award(nextState, `affiliation:${inst.id}`, 30);
    if (gained > 0) {
      persist(nextState);
    }

    publishFeedActivity({
      kind: 'checkin',
      actionText: `verified ${inst.kind === 'campus' ? 'Campus' : 'Alumni'} affiliation with`,
      targetTitle: inst.name,
      detailText: `${state.nickname || 'Explorer'} joined ${inst.shortName} (${note}) — "${inst.mottoOrTag}"`,
      xpGained: gained > 0 ? gained : undefined
    });

    showToast(
      `Verified for ${inst.shortName}! Added to your multi-edition Passport (+${gained || 30} XP)`
    );
  };

  const handleRequestAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (reqName.trim().length < 3) {
      showToast('Enter the full name of your institution or secondary school.');
      return;
    }

    const newInst: InstitutionSide = {
      id: `custom-${Date.now()}`,
      name: reqName.trim(),
      shortName: reqName.trim(),
      kind: activeKind,
      categoryLabel: reqCategory,
      state: reqState,
      city: reqState,
      mottoOrTag: reqMotto.trim() || 'Community Requested Institution · Active Cohort',
      emoji: activeKind === 'campus' ? '🎓' : '🛡️',
      verifiedMembers: 1,
      weeklyScorePct: 85.0,
      totalXp: 500,
      activeSetOrChapter: 'Founding Pioneer Cohort'
    };

    const nextStore = {
      list: [newInst, ...store.list],
      affiliatedIds: [...store.affiliatedIds, newInst.id],
      cohortNotes: { ...store.cohortNotes, [newInst.id]: 'Founding Verifier' }
    };

    setStore(nextStore);
    saveInstitutions(nextStore);
    setReqName('');
    setReqMotto('');
    setShowRequestForm(false);

    showToast(`${newInst.name} added to the directory and linked to your Passport!`);
  };

  return (
    <div className="institutions-hub-page">
      <div className="rivalry-hero-banner">
        <div className="card-row">
          <Pill variant="purple-pill">
            {activeKind === 'campus'
              ? '🎓 NATIONWIDE CAMPUS EDITION'
              : '🛡️ SECONDARY SCHOOL ALUMNI EDITION'}
          </Pill>
          <span className="small muted">36 States + FCT Eligibility · Independent of City Side</span>
        </div>

        <p className="rivalry-subtitle">
          {activeKind === 'campus'
            ? 'Current higher-institution students represent their university, polytechnic or college of education across Nigeria.'
            : 'Secondary-school old boys and old girls represent their former school, graduating class or alumni chapter nationwide.'}
        </p>

        <div className="rivalry-action-bar">
          <div className="chips">
            <button
              type="button"
              className={`chip ${activeKind === 'campus' ? 'selected' : ''}`}
              onClick={() => setActiveKind('campus')}
            >
              🎓 Higher Institutions (Campus)
            </button>
            <button
              type="button"
              className={`chip ${activeKind === 'alumni' ? 'selected' : ''}`}
              onClick={() => setActiveKind('alumni')}
            >
              🛡️ Secondary School Alumni (Old Boys/Girls)
            </button>
          </div>

          <div className="chips" style={{ marginTop: '8px' }}>
            <button
              type="button"
              className={`chip ${countryFilter === 'ALL' ? 'selected' : ''}`}
              style={{ padding: '3px 10px', fontSize: '0.82rem' }}
              onClick={() => setCountryFilter('ALL')}
            >
              🌐 All Chapters
            </button>
            {MAIN_COUNTRY_LIST.map((c) => (
              <button
                key={c.code}
                type="button"
                className={`chip ${countryFilter === c.code ? 'selected' : ''}`}
                style={{ padding: '3px 10px', fontSize: '0.82rem' }}
                onClick={() => setCountryFilter(c.code)}
              >
                {c.flag} {c.shortLabel}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn outline"
            onClick={() => setShowRequestForm((prev) => !prev)}
          >
            {showRequestForm ? 'Close Form' : '+ Request Missing School'}
          </button>
        </div>
      </div>

      {showRequestForm ? (
        <form className="card banter-composer" onSubmit={handleRequestAdd} style={{ marginBottom: '20px' }}>
          <span className="eyebrow">OPERATOR DIRECTORY REQUEST · ZERO-DEPLOY ACTIVATION</span>
          <h3>Add Your {activeKind === 'campus' ? 'Higher Institution' : 'Secondary School'}</h3>
          <div className="field">
            <label htmlFor="inst-name">Institution / School Name</label>
            <input
              id="inst-name"
              type="text"
              value={reqName}
              onChange={(e) => setReqName(e.target.value)}
              placeholder="e.g. Lagos State University / Federal Government Girls College Bida"
            />
          </div>
          <div className="two-cards" style={{ marginBottom: '12px' }}>
            <div className="field">
              <label htmlFor="inst-state">State / FCT</label>
              <input
                id="inst-state"
                type="text"
                value={reqState}
                onChange={(e) => setReqState(e.target.value)}
                placeholder="e.g. Lagos, FCT, Oyo, Enugu, Rivers..."
              />
            </div>
            <div className="field">
              <label htmlFor="inst-cat">Institution Category</label>
              <input
                id="inst-cat"
                type="text"
                value={reqCategory}
                onChange={(e) => setReqCategory(e.target.value)}
                placeholder="e.g. Federal University, Polytechnic, Unity School..."
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="inst-motto">Motto, Slogan or Alumni Association Name</label>
            <input
              id="inst-motto"
              type="text"
              value={reqMotto}
              onChange={(e) => setReqMotto(e.target.value)}
              placeholder="e.g. Pro Unitate / Great Akokites"
            />
          </div>
          <button type="submit" className="btn coral">
            Activate & Rep My School <Icon name="arrow" />
          </button>
        </form>
      ) : null}

      <div className="filter-row" style={{ marginBottom: '16px' }}>
        <div className="searchbox" style={{ flex: 1 }}>
          <Icon name="search" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${
              activeKind === 'campus' ? 'UNILAG, UI, OAU, ABU, Covenant...' : 'King’s College, Queen’s College, Loyola, FGC...'
            }`}
          />
        </div>
        <div className="field" style={{ margin: 0, minWidth: '240px' }}>
          <input
            type="text"
            value={cohortInput}
            onChange={(e) => setCohortInput(e.target.value)}
            placeholder={
              activeKind === 'campus'
                ? 'Optional: Faculty / Level (e.g. Eng 300L)'
                : 'Optional: Graduating Set (e.g. Class of 2016)'
            }
          />
        </div>
      </div>

      <div className="institutions-grid">
        {filtered.map((inst, index) => {
          const isAffiliated = store.affiliatedIds.includes(inst.id);
          return (
            <article
              key={inst.id}
              className={`card institution-card ${isAffiliated ? 'affiliated' : ''}`}
            >
              <div className="card-row">
                <span className="eyebrow">
                  #{index + 1} · {inst.state.toUpperCase()} · {inst.categoryLabel}
                </span>
                {isAffiliated ? (
                  <Pill variant="green-pill">✓ VERIFIED AFFILIATION</Pill>
                ) : null}
              </div>

              <div className="institution-head">
                <span className="rivalry-side-emoji">{inst.emoji}</span>
                <div>
                  <h3>{inst.name}</h3>
                  <p className="small muted">{inst.mottoOrTag}</p>
                </div>
              </div>

              <div className="rivalry-side-stats" style={{ margin: '12px 0' }}>
                <span>
                  <b>{inst.verifiedMembers}</b> verified reps
                </span>
                <span>
                  Avg Accuracy: <b>{inst.weeklyScorePct}%</b>
                </span>
                <span>
                  <b>{inst.totalXp.toLocaleString()}</b> XP
                </span>
              </div>

              {isAffiliated && store.cohortNotes[inst.id] ? (
                <p className="small muted" style={{ marginBottom: '10px' }}>
                  Your Cohort: <b>{store.cohortNotes[inst.id]}</b>
                </p>
              ) : null}

              <button
                type="button"
                className={isAffiliated ? 'btn outline full' : 'btn dark full'}
                onClick={() => handleAffiliate(inst)}
              >
                {isAffiliated
                  ? `✓ Repping ${inst.shortName}`
                  : `Verify & Rep ${inst.shortName} (+30 XP)`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

