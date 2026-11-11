import { SIDE_STANDINGS } from '../../data/community';
import { xp } from '../../domain/model';
import { Icon } from '../../ui/icons';
import { usePassport } from '../../context/PassportContext';

export function SideStandingsCard() {
  const { state, catalog, openModal } = usePassport();
  const currentCity = catalog.getCity(state.city);
  const userScore = xp(state);

  const rawStandings = SIDE_STANDINGS[state.city] || [];

  // Merge user's own XP & participation into their chosen Side
  const merged = rawStandings.map((item) => {
    const isMySide =
      !!state.area && item.area.toLowerCase() === state.area.toLowerCase();
    return {
      ...item,
      isMySide,
      totalXp: item.baseXp + (isMySide ? userScore : 0),
      totalExplorers: item.explorers + (isMySide ? 1 : 0)
    };
  });

  // If user chose an area not in the top seeded list, add it dynamically
  if (
    state.area &&
    !merged.some((m) => m.area.toLowerCase() === state.area.toLowerCase())
  ) {
    merged.push({
      area: state.area,
      city: state.city,
      explorers: 42,
      baseXp: 1680,
      discoveries: 84 + state.read.length,
      activeNow: 5,
      topTag: 'Rising Side',
      isMySide: true,
      totalXp: 1680 + userScore,
      totalExplorers: 43
    });
  }

  const sorted = [...merged].sort((a, b) => b.totalXp - a.totalXp);
  const topXp = sorted[0]?.totalXp || 5000;

  // Show top 5, plus ensure user's Side is visible if ranked > 5
  const topFive = sorted.slice(0, 5);
  const mySideEntry = sorted.find((s) => s.isMySide);
  const displayList =
    mySideEntry && !topFive.some((s) => s.area === mySideEntry.area)
      ? [...topFive.slice(0, 4), mySideEntry]
      : topFive;

  return (
    <section className="card standings-card" aria-label="Side participation standings">
      <div className="standings-head">
        <span className="eyebrow">SIDE PARTICIPATION</span>
        <h3>Most active Sides in {currentCity.name}</h3>
        <p className="small muted">
          Every round, discovery and reflection adds to your Side’s collective pulse.
        </p>
      </div>

      <div className="standings-list">
        {displayList.map((side) => {
          const rank = sorted.findIndex((s) => s.area === side.area) + 1;
          const barWidth = Math.max(18, Math.round((side.totalXp / topXp) * 100));

          return (
            <div
              key={side.area}
              className={`standing-row ${side.isMySide ? 'is-my-side' : ''}`.trim()}
            >
              <div className="standing-row-top">
                <div className="standing-name-wrap">
                  <span className="standing-rank">
                    {String(rank).padStart(2, '0')}
                  </span>
                  <b>{side.area}</b>
                  {side.isMySide ? (
                    <span className="your-side-pill">YOUR SIDE</span>
                  ) : null}
                </div>
                <strong className="standing-xp">
                  {side.totalXp.toLocaleString()} <small>XP</small>
                </strong>
              </div>

              <div className="standing-bar-track">
                <span style={{ width: `${barWidth}%` }} />
              </div>

              <div className="standing-row-meta">
                <span>
                  {side.totalExplorers} explorers · {side.activeNow} live
                </span>
                <span>{side.topTag}</span>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="full-link"
        onClick={() =>
          state.area
            ? openModal({ type: 'quiz', roundType: 'city' })
            : openModal({ type: 'side' })
        }
      >
        {state.area
          ? `Boost ${state.area} with a round`
          : 'Pick your Side to join the board'}{' '}
        <Icon name="arrow" />
      </button>
    </section>
  );
}

