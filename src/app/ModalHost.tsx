import React, { useEffect } from 'react';
import type { PageRoute } from '../domain/types';
import { Icon } from '../ui/icons';
import { usePassport } from '../context/PassportContext';
import { SideDialog } from '../features/side/SideDialog';
import { QuizDialog } from '../features/play/QuizDialog';
import { ResultDialog } from '../features/play/ResultDialog';
import { ReviewDialog } from '../features/play/ReviewDialog';
import { ShareDialog } from '../features/play/ShareDialog';
import { StoryDialog } from '../features/play/StoryDialog';
import { ActivityDialog } from '../features/play/ActivityDialog';
import { PlaceDialog } from '../features/discover/PlaceDialog';
import { PulseDialog } from '../features/pulse/PulseDialog';
import { CircleDialog } from '../features/circles/CircleDialog';
import { CommunityPromiseDialog } from '../features/circles/CommunityPromiseDialog';
import { CorrectionDialog } from '../features/passport/CorrectionDialog';
import { GuideDialog } from '../features/passport/GuideDialog';
import { SettingsDialog } from '../features/passport/SettingsDialog';
import { ExportDialog } from '../features/passport/ExportDialog';
import { RestoreDialog } from '../features/passport/RestoreDialog';
import { ConfirmRestoreDialog } from '../features/passport/ConfirmRestoreDialog';
import { StorageDialog } from '../features/passport/StorageDialog';
import { RawSaveDialog } from '../features/passport/RawSaveDialog';
import { ResetDialog } from '../features/passport/ResetDialog';
import { RivalryRoomDialog } from '../features/rivalry/RivalryRoomDialog';
import { DerbyMatchDialog } from '../features/rivalry/DerbyMatchDialog';
import { InstitutionsDialog } from '../features/rivalry/InstitutionsDialog';
import { PublicCalendarDialog } from '../features/rivalry/PublicCalendarDialog';
import { OperatorStudioDialog } from '../features/rivalry/OperatorStudioDialog';
import { AuthDialog } from '../features/auth/AuthDialog';
import { CountryLandingDialog } from '../features/country/CountryLandingDialog';
import { CITIES, PLACES, PULSE, CIRCLES } from '../data/fixtures';
import { EXTENDED_PLACES, EXTENDED_PULSE } from '../data/extendedCatalog';
import { INITIAL_RIVALRY_ROOMS, INITIAL_DERBY_FIXTURES } from '../data/rivalryData';

export interface ModalHostProps {
  currentPage?: PageRoute;
  onNavigate?: (page: PageRoute) => void;
}

const BACK_LABELS: Record<PageRoute, string> = {
  home: 'My Side',
  play: 'Play & progress',
  discover: 'Discover',
  pulse: 'City Pulse',
  circles: 'Circles',
  passport: 'My Passport'
};

export function ModalHost({ currentPage = 'home', onNavigate: _onNavigate }: ModalHostProps) {
  const { activeModal, closeModal, state } = usePassport();

  useEffect(() => {
    if (!activeModal || typeof window === 'undefined') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, closeModal]);

  if (!activeModal) {
    return <div id="modal" aria-labelledby="modal-title" className="hidden" />;
  }

  const currentCity = CITIES[state.city];
  let title = '';
  let sectionEyebrow = 'REP YOUR SIDE';
  let isWide = false;
  let content: React.ReactNode = null;

  switch (activeModal.type) {
    case 'side':
      title = 'Where’s your side?';
      sectionEyebrow = 'CHOOSE YOUR SIDE';
      isWide = true;
      content = <SideDialog />;
      break;

    case 'quiz': {
      const cityConfig = CITIES[state.city];
      title = activeModal.roundType === 'city' ? `${cityConfig.name} in five` : 'Street Sense';
      sectionEyebrow = 'PLAY & PROGRESS';
      content = (
        <QuizDialog
          roundType={activeModal.roundType}
          forcePractice={activeModal.forcePractice}
        />
      );
      break;
    }

    case 'result':
      title = 'You showed up for your Side.';
      sectionEyebrow = 'ROUND COMPLETE';
      content = (
        <ResultDialog
          score={activeModal.score}
          gained={activeModal.gained}
          round={activeModal.round}
        />
      );
      break;

    case 'review':
      title = 'Every answer is a little discovery.';
      sectionEyebrow = 'ANSWER REVIEW';
      content = <ReviewDialog round={activeModal.round} />;
      break;

    case 'share':
      title = 'A little challenge for a friend.';
      sectionEyebrow = 'SHARE CHALLENGE';
      content = <ShareDialog round={activeModal.round} />;
      break;

    case 'story': {
      const storyState = state.story[state.city];
      title = storyState?.done ? 'A story worth collecting.' : 'The Postcard Trail';
      sectionEyebrow = 'THE SIDE STORIES';
      content = <StoryDialog />;
      break;
    }

    case 'activity':
      title = 'A little moment of participation.';
      sectionEyebrow = 'SELF-PACED ACTIVITY';
      content = <ActivityDialog circleId={activeModal.id} />;
      break;

    case 'place': {
      const p =
        PLACES.find((item) => item.id === activeModal.id) ||
        EXTENDED_PLACES.find((item) => item.id === activeModal.id);
      title = p?.name || 'Place';
      sectionEyebrow = `DISCOVER · ${currentCity.name.toUpperCase()}`;
      isWide = true;
      content = <PlaceDialog id={activeModal.id} />;
      break;
    }

    case 'pulse': {
      const p =
        PULSE.find((item) => item.id === activeModal.id) ||
        EXTENDED_PULSE.find((item) => item.id === activeModal.id);
      title = p?.title || 'City Pulse';
      sectionEyebrow = `CITY PULSE · ${currentCity.name.toUpperCase()}`;
      isWide = true;
      content = <PulseDialog id={activeModal.id} />;
      break;
    }

    case 'circle': {
      const c = CIRCLES.find((item) => item.id === activeModal.id);
      title = c?.name || 'Circle';
      sectionEyebrow = `CIRCLES · ${currentCity.name.toUpperCase()}`;
      isWide = true;
      content = <CircleDialog id={activeModal.id} />;
      break;
    }

    case 'community':
      title = 'Big love for every Side.';
      sectionEyebrow = 'COMMUNITY PROMISE';
      isWide = true;
      content = <CommunityPromiseDialog />;
      break;

    case 'correction':
      title = 'Help make the little details better.';
      sectionEyebrow = 'CORRECTION DRAFT';
      isWide = true;
      content = (
        <CorrectionDialog
          id={activeModal.id}
          kind={activeModal.kind}
          index={activeModal.index}
        />
      );
      break;

    case 'guide':
      title = 'Your area. Your people. Your stories.';
      sectionEyebrow = 'HOW IT WORKS';
      isWide = true;
      content = <GuideDialog />;
      break;

    case 'settings':
      title = 'Your pilot. Your progress.';
      sectionEyebrow = 'PILOT & PRIVACY';
      isWide = true;
      content = <SettingsDialog />;
      break;

    case 'export':
      title = 'Keep a little backup.';
      sectionEyebrow = 'PASSPORT BACKUP';
      content = <ExportDialog />;
      break;

    case 'restore':
      title = 'Bring your discoveries back.';
      sectionEyebrow = 'PASSPORT RESTORE';
      content = <RestoreDialog />;
      break;

    case 'confirm-restore':
      title = 'This is the Passport we found.';
      sectionEyebrow = 'CONFIRM RESTORE';
      content = <ConfirmRestoreDialog pending={activeModal.pending} />;
      break;

    case 'storage':
      title = 'Your progress has a way back.';
      sectionEyebrow = 'STORAGE RECOVERY';
      content = <StorageDialog />;
      break;

    case 'raw-save':
      title = 'Your previous stored save.';
      sectionEyebrow = 'RAW SAVE DATA';
      content = <RawSaveDialog />;
      break;

    case 'reset':
      title = 'Start a fresh little adventure?';
      sectionEyebrow = 'RESET PILOT';
      content = <ResetDialog />;
      break;

    case 'rivalry-room': {
      const rm =
        INITIAL_RIVALRY_ROOMS.find(
          (r) => r.id === activeModal.roomId || r.slug === activeModal.roomId
        ) || INITIAL_RIVALRY_ROOMS[0];
      title = rm.title;
      sectionEyebrow = rm.badgeLabel;
      isWide = true;
      content = <RivalryRoomDialog roomId={rm.id} />;
      break;
    }

    case 'derby': {
      const db =
        INITIAL_DERBY_FIXTURES.find(
          (d) => d.id === activeModal.derbyId || d.slug === activeModal.derbyId
        ) || INITIAL_DERBY_FIXTURES[0];
      title = db.title;
      sectionEyebrow = db.editionLabel;
      isWide = true;
      content = <DerbyMatchDialog derbyId={db.id} />;
      break;
    }

    case 'institutions':
      title =
        activeModal.initialKind === 'alumni'
          ? 'Secondary School Alumni Directory & League'
          : 'Nationwide Campus Directory & League';
      sectionEyebrow = 'CAMPUS & ALUMNI EDITIONS';
      isWide = true;
      content = <InstitutionsDialog initialKind={activeModal.initialKind} />;
      break;

    case 'calendar':
      title = 'Public Competition Calendar & Fixtures';
      sectionEyebrow = 'PUBLIC CALENDAR';
      isWide = true;
      content = <PublicCalendarDialog initialFilter={activeModal.initialFilter} />;
      break;

    case 'operator-studio':
      title = 'Operator Studio & Moderation Console';
      sectionEyebrow = 'OPERATOR CONSOLE';
      isWide = true;
      content = <OperatorStudioDialog />;
      break;

    case 'country':
      title = 'Select Your Country & Diaspora Hub';
      sectionEyebrow = 'GLOBAL JURISDICTIONS';
      isWide = true;
      content = <CountryLandingDialog />;
      break;

    case 'auth':
      title =
        activeModal.initialMode === 'register'
          ? 'Create Your Verified Profile'
          : activeModal.initialMode === 'profile'
          ? 'My Global Profile & Affiliations'
          : 'Log In to Rep Your Side';
      sectionEyebrow = 'GLOBAL MEMBERSHIP & VERIFICATION';
      isWide = true;
      content = <AuthDialog initialMode={activeModal.initialMode} />;
      break;

    default:
      title = 'Page';
      content = null;
      break;
  }

  const backTargetLabel = BACK_LABELS[currentPage] || 'My Side';

  return (
    <section
      id="modal"
      className={`subpage-shell ${isWide ? 'wide-dialog' : ''}`.trim()}
      aria-labelledby="modal-title"
    >
      <div className="subpage-topbar">
        <button
          type="button"
          className="btn outline subpage-back-btn"
          onClick={closeModal}
        >
          <span className="back-arrow">←</span> Back to {backTargetLabel}
        </button>

        <span className="eyebrow subpage-crumb">
          {sectionEyebrow} <span className="dot-sep">/</span> {currentCity.name.toUpperCase()} EDITION
        </span>
      </div>

      <article className="card subpage-card">
        <div className="modal-head">
          <span className="eyebrow">{sectionEyebrow}</span>
          <button
            type="button"
            className="text-btn subpage-close-link"
            aria-label="Close dialog"
            onClick={closeModal}
          >
            Close <Icon name="close" />
          </button>
        </div>
        <div className={`modal-content ${isWide ? 'wide' : ''}`.trim()}>
          <h2 id="modal-title">{title}</h2>
          {content}
        </div>
      </article>
    </section>
  );
}
