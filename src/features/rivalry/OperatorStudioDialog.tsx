import { useState } from 'react';
import {
  INITIAL_DERBY_FIXTURES,
  INITIAL_RIVALRY_ROOMS,
  INITIAL_INSTITUTIONS,
  type DerbyFixture
} from '../../data/rivalryData';
import { Pill } from '../../ui/Pill';
import { usePassport } from '../../context/PassportContext';

export function OperatorStudioDialog() {
  const { showToast } = usePassport();
  const [activeTab, setActiveTab] = useState<'fixtures' | 'moderation' | 'schools' | 'audit'>('fixtures');

  // Local state for managed fixtures
  const [fixtures, setFixtures] = useState<DerbyFixture[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DERBY_FIXTURES;
    try {
      const raw = window.localStorage.getItem('rys.v15.derbies.v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.fixtures) {
          return Object.values(parsed.fixtures);
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_DERBY_FIXTURES;
  });

  // Room locks state
  const [roomLocks, setRoomLocks] = useState<Record<string, boolean>>({});

  // Audit log entries
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; time: string; target: string }>>([
    {
      id: 'log-1',
      action: 'FIXTURE_SCHEDULED',
      target: 'Abuja vs Lagos Flagship Derby',
      time: '10 Nov 2026 21:00 WAT'
    },
    {
      id: 'log-2',
      action: 'BANTER_PINNED',
      target: 'Arsenal vs Chelsea: London Rivalry Room',
      time: '10 Nov 2026 21:30 WAT'
    },
    {
      id: 'log-3',
      action: 'SCHOOL_VERIFIED',
      target: 'University of Lagos (UNILAG)',
      time: '10 Nov 2026 22:15 WAT'
    }
  ]);

  const handleToggleRoomLock = (roomId: string, roomTitle: string) => {
    const isLocked = !roomLocks[roomId];
    setRoomLocks((prev) => ({ ...prev, [roomId]: isLocked }));
    const logItem = {
      id: `log-${Date.now()}`,
      action: isLocked ? 'ROOM_LOCKED' : 'ROOM_UNLOCKED',
      target: roomTitle,
      time: 'Just now'
    };
    setAuditLogs((prev) => [logItem, ...prev]);
    showToast(isLocked ? `Room locked for "${roomTitle}". Comments frozen.` : `Room unlocked for "${roomTitle}".`);
  };

  const handleToggleFixtureStatus = (fixtureId: string) => {
    setFixtures((prev) =>
      prev.map((f) => {
        if (f.id !== fixtureId) return f;
        const nextStatus = f.status === 'open' ? 'review' : f.status === 'review' ? 'final' : 'open';
        const logItem = {
          id: `log-${Date.now()}`,
          action: `STATUS_${nextStatus.toUpperCase()}`,
          target: f.title,
          time: 'Just now'
        };
        setAuditLogs((l) => [logItem, ...l]);
        return { ...f, status: nextStatus };
      })
    );
    showToast('Fixture status updated & audited!');
  };

  return (
    <div className="operator-studio-view">
      <div className="rivalry-hero-banner" style={{ backgroundColor: '#183e35', color: '#fffff8' }}>
        <div className="card-row">
          <Pill variant="orange-pill">🛠️ ZERO-DEPLOY OPERATOR &amp; MODERATION STUDIO</Pill>
          <span className="small" style={{ color: '#d9e0ce' }}>
            Role: Fixture Director &amp; Head of Safety
          </span>
        </div>
        <h2 style={{ color: '#f7f7ef', marginTop: '8px', fontSize: '26px' }}>
          Back-Office Fixture, Moderation &amp; Telemetry Studio
        </h2>
        <p style={{ color: '#d6dfd0', fontSize: '13px' }}>
          Manage derbies, open challenges, matchday room locks, and institution directories
          without deploying code.
        </p>

        {/* Tab Controls */}
        <div className="chips" role="tablist" style={{ marginTop: '16px' }}>
          <button
            type="button"
            className={`chip ${activeTab === 'fixtures' ? 'selected' : ''}`}
            onClick={() => setActiveTab('fixtures')}
          >
            🏆 Fixtures &amp; Scoring ({fixtures.length})
          </button>
          <button
            type="button"
            className={`chip ${activeTab === 'moderation' ? 'selected' : ''}`}
            onClick={() => setActiveTab('moderation')}
          >
            🛡️ Room Locks &amp; Banter Moderation
          </button>
          <button
            type="button"
            className={`chip ${activeTab === 'schools' ? 'selected' : ''}`}
            onClick={() => setActiveTab('schools')}
          >
            🎓 Campus &amp; School Directories
          </button>
          <button
            type="button"
            className={`chip ${activeTab === 'audit' ? 'selected' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            📜 Audit Trail &amp; Telemetry
          </button>
        </div>
      </div>

      {/* TAB 1: FIXTURES & SCORING */}
      {activeTab === 'fixtures' ? (
        <div className="operator-tab-content" style={{ marginTop: '20px' }}>
          <div className="card-row" style={{ marginBottom: '12px' }}>
            <span className="eyebrow">PUBLISHED TOURNAMENTS &amp; DERBY ENGINE</span>
            <span className="small muted">Formula: Total Correct ÷ (Turnout × Qs)</span>
          </div>

          <div className="two-cards">
            {fixtures.map((f) => (
              <div key={f.id} className="card" style={{ padding: '18px' }}>
                <div className="card-row">
                  <Pill variant="green-pill">{f.editionLabel}</Pill>
                  <span className="rivalry-phase-pill">{f.status.toUpperCase()}</span>
                </div>
                <h3>{f.title}</h3>
                <p className="small muted">{f.subtitle}</p>

                <div className="rivalry-side-stats" style={{ margin: '12px 0' }}>
                  <span>
                    Min Turnout: <b>{f.minTurnoutPerSide} players/side</b>
                  </span>
                  <span>
                    Sides: <b>{f.sides.map((s) => s.name).join(' vs ')}</b>
                  </span>
                </div>

                <div className="card-row" style={{ marginTop: '14px' }}>
                  <button
                    type="button"
                    className="btn dark"
                    onClick={() => handleToggleFixtureStatus(f.id)}
                  >
                    Transition: {f.status === 'open' ? 'Review' : f.status === 'review' ? 'Finalise' : 'Open'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* TAB 2: MODERATION & ROOM LOCKS */}
      {activeTab === 'moderation' ? (
        <div className="operator-tab-content" style={{ marginTop: '20px' }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">LIVE MATCHDAY SAFETY SHIELDS</span>
              <h2>Room Locks &amp; Comment Triage</h2>
              <p>Lock rooms during peak incidents while preserving read-only &amp; trivia play.</p>
            </div>
          </div>

          <div className="two-cards">
            {INITIAL_RIVALRY_ROOMS.map((room) => {
              const isLocked = !!roomLocks[room.id];
              return (
                <div key={room.id} className="card" style={{ padding: '18px' }}>
                  <div className="card-row">
                    <Pill variant="orange-pill">{room.badgeLabel}</Pill>
                    <span
                      className="rivalry-phase-pill"
                      style={{
                        backgroundColor: isLocked ? '#fed7d7' : '#dce7cd',
                        color: isLocked ? '#9b2c2c' : '#183e35'
                      }}
                    >
                      {isLocked ? '🔒 ROOM LOCKED' : '💬 BANTER ACTIVE'}
                    </span>
                  </div>

                  <h3>{room.title}</h3>
                  <p className="small muted">{room.subtitle}</p>

                  <div className="card-row" style={{ marginTop: '14px' }}>
                    <span className="small muted">
                      {room.comments.length} total comments · {room.sides.length} sides
                    </span>
                    <button
                      type="button"
                      className={isLocked ? 'btn coral' : 'btn outline'}
                      onClick={() => handleToggleRoomLock(room.id, room.title)}
                    >
                      {isLocked ? 'Unlock Room' : '🔒 Toggle Room Lock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* TAB 3: CAMPUS & SCHOOL DIRECTORIES */}
      {activeTab === 'schools' ? (
        <div className="operator-tab-content" style={{ marginTop: '20px' }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow">DIRECTORY INTEGRITY</span>
              <h2>Campus &amp; Secondary School Roster ({INITIAL_INSTITUTIONS.length} Active)</h2>
              <p>Instant zero-deploy activation across all 36 states and the FCT.</p>
            </div>
          </div>

          <div className="two-cards">
            {INITIAL_INSTITUTIONS.slice(0, 6).map((inst) => (
              <div key={inst.id} className="card" style={{ padding: '16px' }}>
                <div className="card-row">
                  <Pill variant={inst.kind === 'campus' ? 'green-pill' : 'purple-pill'}>
                    {inst.kind === 'campus' ? 'CAMPUS' : 'ALUMNI'}
                  </Pill>
                  <span className="small muted">{inst.state}</span>
                </div>
                <h3>
                  {inst.emoji} {inst.name}
                </h3>
                <p className="small muted">{inst.mottoOrTag}</p>
                <div className="card-row" style={{ marginTop: '10px' }}>
                  <span className="small" style={{ color: '#183e35' }}>
                    Verified Members: <b>{inst.verifiedMembers}</b>
                  </span>
                  <span className="small muted">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* TAB 4: AUDIT TRAIL & TELEMETRY */}
      {activeTab === 'audit' ? (
        <div className="operator-tab-content" style={{ marginTop: '20px' }}>
          <div className="live-metrics-strip" style={{ marginBottom: '20px' }}>
            <div className="card live-metric-tile">
              <span className="eyebrow">FIXTURE VIEWS</span>
              <strong>3,420</strong>
              <small>Across derbies &amp; rooms</small>
            </div>
            <div className="card live-metric-tile">
              <span className="eyebrow">ATTEMPTS SUBMITTED</span>
              <strong>1,894</strong>
              <small>Zero score leakage</small>
            </div>
            <div className="card live-metric-tile">
              <span className="eyebrow">RECEIPTS LOCKED</span>
              <strong>4,120</strong>
              <small>Pre-match predictions</small>
            </div>
            <div className="card live-metric-tile">
              <span className="eyebrow">MODERATION ACTIONS</span>
              <strong>{auditLogs.length}</strong>
              <small>All logged with timestamps</small>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <span className="eyebrow">IMMUTABLE OPERATOR AUDIT TRAIL</span>
            <div className="review-list" style={{ marginTop: '12px' }}>
              {auditLogs.map((log) => (
                <section key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <b>[{log.action}]</b> <span style={{ marginLeft: '8px' }}>{log.target}</span>
                  </div>
                  <span className="small muted">{log.time}</span>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
