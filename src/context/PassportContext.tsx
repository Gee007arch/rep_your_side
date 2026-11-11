import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type {
  PilotPassportV1,
  StorageIssue,
  CityId,
  RoundKind,
  CircleId
} from '../domain/types';
import type {
  CatalogReader,
  ProgressStore,
  BackupCodec,
  BrowserServices
} from '../ports';
import {
  defaultCatalogReader,
  defaultProgressStore,
  defaultBackupCodec,
  defaultBrowserServices
} from '../data/local';
import {
  fresh,
  setSide,
  award,
  toggle
} from '../domain/model';
import {
  type FeedActivityItem,
  type FeedActivityKind,
  LIVE_PULSE_QUEUE,
  loadCommunityFeed,
  saveCommunityFeed
} from '../data/community';
import {
  type CountryCode,
  type UserProfileAccount,
  COUNTRIES,
  loadAuthState,
  saveAuthState
} from '../data/countries';

export type ModalState =
  | { type: 'side' }
  | { type: 'guide' }
  | { type: 'settings' }
  | { type: 'storage' }
  | { type: 'export' }
  | { type: 'restore' }
  | { type: 'confirm-restore'; pending: PilotPassportV1 }
  | { type: 'raw-save' }
  | { type: 'reset' }
  | { type: 'place'; id: string }
  | { type: 'pulse'; id: string }
  | { type: 'circle'; id: string }
  | { type: 'community' }
  | { type: 'activity'; id: string }
  | { type: 'correction'; id?: string; kind?: 'place' | 'pulse'; index?: number }
  | { type: 'quiz'; roundType: RoundKind; forcePractice?: boolean }
  | { type: 'result'; score: number; gained: number; round: any }
  | { type: 'review'; round: any }
  | { type: 'share'; round: any }
  | { type: 'story' }
  | { type: 'rivalry-room'; roomId: string }
  | { type: 'derby'; derbyId: string }
  | { type: 'institutions'; initialKind?: 'campus' | 'alumni' }
  | { type: 'calendar'; initialFilter?: string }
  | { type: 'operator-studio' }
  | { type: 'country' }
  | { type: 'auth'; initialMode?: 'login' | 'register' | 'profile' }
  | null;

export interface PassportPorts {
  catalog?: CatalogReader;
  progressStore?: ProgressStore;
  backupCodec?: BackupCodec;
  browserServices?: BrowserServices;
}

export interface PassportProviderProps {
  children: React.ReactNode;
  ports?: PassportPorts;
  initialState?: PilotPassportV1;
  initialIssue?: StorageIssue;
  initialModal?: ModalState;
}

export interface PassportContextType {
  state: PilotPassportV1;
  storageIssue: StorageIssue;
  activeModal: ModalState;
  menuOpen: boolean;
  filter: string;
  search: string;
  pulseFilter: string;
  toast: string | null;
  isOffline: boolean;
  catalog: CatalogReader;
  progressStore: ProgressStore;
  backupCodec: BackupCodec;
  browserServices: BrowserServices;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  showToast: (msg: string) => void;
  setMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setFilter: (f: string) => void;
  setSearch: (s: string) => void;
  setPulseFilter: (f: string) => void;
  resetFilters: () => void;
  persist: (customState?: PilotPassportV1) => boolean;
  updateSide: (city: CityId, area: string, nickname: string) => { success: boolean; areaError?: string; nicknameError?: string };
  toggleSavePlace: (id: string) => boolean;
  collectContent: (id: string) => boolean;
  toggleCircleInterest: (id: CircleId) => boolean;
  restorePassport: (candidate: PilotPassportV1) => boolean;
  resetPilot: () => void;
  retrySave: () => boolean;
  communityFeed: FeedActivityItem[];
  publishFeedActivity: (entry: {
    kind: FeedActivityKind;
    actionText: string;
    targetTitle: string;
    detailText: string;
    xpGained?: number;
    circleId?: CircleId;
    placeId?: string;
    cityOverride?: CityId;
    areaOverride?: string;
    authorOverride?: string;
  }) => void;
  toggleFeedReaction: (itemId: string, reaction: 'cheer' | 'rep') => void;
  addFeedComment: (itemId: string, text: string) => boolean;
  postSideCheckin: (text: string) => boolean;
  simulateLivePulse: () => void;
  currentUser: UserProfileAccount | null;
  selectedCountry: CountryCode;
  selectedCountryHub: string;
  demoAccounts: UserProfileAccount[];
  setSelectedCountry: (country: CountryCode, hub?: string) => void;
  loginAccount: (email: string, password?: string) => { success: boolean; error?: string; user?: UserProfileAccount };
  registerAccount: (input: Omit<UserProfileAccount, 'id' | 'createdAt' | 'isVerified'>) => { success: boolean; error?: string; user?: UserProfileAccount };
  updateProfileAccount: (updates: Partial<UserProfileAccount>) => void;
  logoutAccount: () => void;
}

const PassportContext = createContext<PassportContextType | null>(null);

export function PassportProvider({
  children,
  ports,
  initialState,
  initialIssue,
  initialModal = null
}: PassportProviderProps) {
  const catalog = ports?.catalog ?? defaultCatalogReader;
  const progressStore = ports?.progressStore ?? defaultProgressStore;
  const backupCodec = ports?.backupCodec ?? defaultBackupCodec;
  const browserServices = ports?.browserServices ?? defaultBrowserServices;

  // Synchronous initial load to guarantee zero flash of default state
  const [loadedOnMount] = useState(() => {
    if (initialState) {
      return { state: initialState, issue: initialIssue ?? null };
    }
    return progressStore.load();
  });

  const [state, setState] = useState<PilotPassportV1>(loadedOnMount.state);
  const [storageIssue, setStorageIssue] = useState<StorageIssue>(loadedOnMount.issue);
  const [activeModal, setActiveModal] = useState<ModalState>(initialModal);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [pulseFilter, setPulseFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(() => !browserServices.isOnline());
  const [communityFeed, setCommunityFeed] = useState<FeedActivityItem[]>(() => loadCommunityFeed());
  const [authData, setAuthData] = useState(() => loadAuthState());
  const [selectedCountryHub, setSelectedCountryHub] = useState<string>(() => {
    const loaded = loadAuthState();
    if (loaded.currentUser?.hubOrArea) return loaded.currentUser.hubOrArea;
    return COUNTRIES[loaded.selectedCountry]?.hubs[0] || 'Houston, TX';
  });
  const pulseQueueIndexRef = useRef(0);

  const stateRef = useRef(state);
  stateRef.current = state;

  const returnFocusRef = useRef<HTMLElement | null>(null);
  const toastTimerRef = useRef<any>(null);

  useEffect(() => {
    return browserServices.subscribeOnlineStatus((online) => {
      setIsOffline(!online);
    });
  }, [browserServices]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const persist = useCallback((customState?: PilotPassportV1) => {
    const target = structuredClone(customState ?? stateRef.current);
    stateRef.current = target;
    setState(target);
    const ok = progressStore.save(target);
    setStorageIssue(ok ? null : 'save');
    if (!ok) {
      showToast('Progress is in memory only. Open Help to retry saving.');
    }
    return ok;
  }, [progressStore, showToast]);

  const openModal = useCallback((modal: ModalState) => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    setActiveModal(modal);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'instant' });
      } catch {
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    if (returnFocusRef.current) {
      returnFocusRef.current.focus?.();
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilter('All');
    setSearch('');
    setPulseFilter('All');
  }, []);

  const publishFeedActivity = useCallback(
    (entry: {
      kind: FeedActivityKind;
      actionText: string;
      targetTitle: string;
      detailText: string;
      xpGained?: number;
      circleId?: CircleId;
      placeId?: string;
      cityOverride?: CityId;
      areaOverride?: string;
      authorOverride?: string;
    }) => {
      const current = stateRef.current;
      const city = entry.cityOverride ?? current.city;
      const area = entry.areaOverride ?? (current.area || 'Visitor');
      const author = entry.authorOverride ?? (current.nickname || 'Explorer');

      const newItem: FeedActivityItem = {
        id: `feed-user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        city,
        author,
        area,
        avatarBg: '#183e35',
        avatarColor: '#f3c572',
        kind: entry.kind,
        actionText: entry.actionText,
        targetTitle: entry.targetTitle,
        detailText: entry.detailText,
        xpGained: entry.xpGained,
        circleId: entry.circleId,
        placeId: entry.placeId,
        timeLabel: 'Just now',
        createdAt: Date.now(),
        cheers: 1,
        reps: 1,
        cheeredByMe: true,
        reppedByMe: false,
        isCurrentUser: true,
        comments: []
      };

      setCommunityFeed((prev) => {
        const next = [newItem, ...prev];
        saveCommunityFeed(next);
        return next;
      });
    },
    []
  );

  const toggleFeedReaction = useCallback((itemId: string, reaction: 'cheer' | 'rep') => {
    setCommunityFeed((prev) => {
      const next = prev.map((item) => {
        if (item.id !== itemId) return item;
        if (reaction === 'cheer') {
          const active = !item.cheeredByMe;
          return {
            ...item,
            cheeredByMe: active,
            cheers: Math.max(0, item.cheers + (active ? 1 : -1))
          };
        } else {
          const active = !item.reppedByMe;
          return {
            ...item,
            reppedByMe: active,
            reps: Math.max(0, item.reps + (active ? 1 : -1))
          };
        }
      });
      saveCommunityFeed(next);
      return next;
    });
  }, []);

  const addFeedComment = useCallback((itemId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 280) return false;
    const current = stateRef.current;
    const newComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      author: current.nickname || 'Explorer',
      area: current.area || (current.city === 'lagos' ? 'Lagos' : 'Abuja'),
      avatarBg: '#e4e8d7',
      text: trimmed,
      timeLabel: 'Just now'
    };

    setCommunityFeed((prev) => {
      const next = prev.map((item) =>
        item.id === itemId
          ? { ...item, comments: [...item.comments, newComment] }
          : item
      );
      saveCommunityFeed(next);
      return next;
    });
    return true;
  }, []);

  const postSideCheckin = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < 3 || trimmed.length > 280) return false;
      const current = stateRef.current;
      const cities = catalog.getCities();
      const cityName = cities[current.city]?.name || 'Lagos';
      const areaLabel = current.area ? `${current.area} · ${cityName}` : cityName;
      publishFeedActivity({
        kind: 'checkin',
        actionText: 'checked in from',
        targetTitle: areaLabel,
        detailText: trimmed
      });
      showToast('Posted to your Side live feed!');
      return true;
    },
    [catalog, publishFeedActivity, showToast]
  );

  const simulateLivePulse = useCallback(() => {
    const currentCity = stateRef.current.city;
    const cityCandidates = LIVE_PULSE_QUEUE.filter((q) => q.city === currentCity);
    const pool = cityCandidates.length > 0 ? cityCandidates : LIVE_PULSE_QUEUE;
    const template = pool[pulseQueueIndexRef.current % pool.length];
    pulseQueueIndexRef.current += 1;

    const liveItem: FeedActivityItem = {
      ...template,
      id: `feed-live-${Date.now()}-${pulseQueueIndexRef.current}`,
      timeLabel: 'Just now',
      createdAt: Date.now(),
      comments: [...template.comments]
    };

    setCommunityFeed((prev) => {
      const next = [liveItem, ...prev];
      saveCommunityFeed(next);
      return next;
    });
    showToast(`Live update from ${liveItem.author} in ${liveItem.area}!`);
  }, [showToast]);

  // Atomic Side updater (Resolves D-01)
  const updateSide = useCallback(
    (city: CityId, area: string, nickname: string) => {
      const cities = catalog.getCities();
      const trimmedName = nickname.trim() || 'Explorer';
      if (!cities[city] || !cities[city].areas.includes(area)) {
        return { success: false, areaError: 'Pick an area to represent. You can change it later.' };
      }
      if (trimmedName.length > 30) {
        return { success: false, nicknameError: 'Keep your nickname to 30 characters or fewer.' };
      }

      const next = structuredClone(stateRef.current);
      setSide(next, city, area, cities);
      next.nickname = trimmedName;

      setState(next);
      persist(next);
      publishFeedActivity({
        kind: 'checkin',
        actionText: 'is now repping',
        targetTitle: `${area} · ${cities[city].name}`,
        detailText: `${trimmedName} stepped up to represent ${area} in the ${cities[city].name} edition.`,
        cityOverride: city,
        areaOverride: area,
        authorOverride: trimmedName
      });
      closeModal();
      showToast(`${area}, ${cities[city].name}. Your Side is set!`);
      return { success: true };
    },
    [catalog, persist, publishFeedActivity, closeModal, showToast]
  );

  const toggleSavePlace = useCallback(
    (id: string) => {
      const next = structuredClone(stateRef.current);
      const isNowSaved = toggle(next.saved, id);
      setState(next);
      persist(next);
      showToast(isNowSaved ? 'Saved to your Passport.' : 'Removed from saved.');
      return isNowSaved;
    },
    [persist, showToast]
  );

  const collectContent = useCallback(
    (id: string) => {
      const next = structuredClone(stateRef.current);
      if (!next.read.includes(id)) {
        next.read.push(id);
        award(next, 'discovery:' + id, 10);
        setState(next);
        persist(next);
        const place = catalog.getPlaceById(id);
        const pulse = catalog.getPulseById(id);
        const title = place?.name || pulse?.title || 'a local story';
        publishFeedActivity({
          kind: 'discovery',
          actionText: 'collected a local discovery:',
          targetTitle: title,
          detailText: place?.desc || pulse?.summary || 'Added a new local discovery to their Side Passport.',
          xpGained: 10,
          placeId: place?.id
        });
        showToast('A new discovery. +10 XP!');
        return true;
      }
      return false;
    },
    [catalog, persist, publishFeedActivity, showToast]
  );

  const toggleCircleInterest = useCallback(
    (id: CircleId) => {
      const next = structuredClone(stateRef.current);
      const isInterested = toggle(next.interests, id);
      setState(next);
      persist(next);
      if (isInterested) {
        const circle = catalog.getCircleById(id);
        if (circle) {
          publishFeedActivity({
            kind: 'circle',
            actionText: 'joined the Circle preview:',
            targetTitle: circle.name,
            detailText: circle.desc,
            circleId: id
          });
        }
      }
      showToast(
        isInterested
          ? 'Interest saved. You’re helping shape this pilot.'
          : 'Interest removed from your Passport.'
      );
      return isInterested;
    },
    [catalog, persist, publishFeedActivity, showToast]
  );

  const restorePassport = useCallback(
    (candidate: PilotPassportV1) => {
      const next = structuredClone(candidate);
      setState(next);
      persist(next);
      closeModal();
      showToast('Your Passport is back. Welcome home.');
      return true;
    },
    [persist, closeModal, showToast]
  );

  const resetPilot = useCallback(() => {
    const next = fresh();
    setState(next);
    persist(next);
    closeModal();
    showToast('Fresh start. Your next discovery is waiting.');
  }, [persist, closeModal, showToast]);

  const retrySave = useCallback(() => {
    const ok = persist();
    if (ok) {
      showToast('Your current progress is saved on this browser.');
      closeModal();
    } else {
      showToast('Still unable to save. Make a recovery copy to keep your progress.');
    }
    return ok;
  }, [persist, showToast, closeModal]);

  const setSelectedCountry = useCallback(
    (country: CountryCode, hub?: string) => {
      setAuthData((prev) => {
        const next = { ...prev, selectedCountry: country };
        saveAuthState(next);
        return next;
      });
      const defaultHub = hub || COUNTRIES[country]?.hubs[0] || '';
      setSelectedCountryHub(defaultHub);
      showToast(`${COUNTRIES[country]?.flag || '🌍'} Selected ${COUNTRIES[country]?.name || country}`);
    },
    [showToast]
  );

  const loginAccount = useCallback(
    (email: string, password?: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const found = authData.registeredAccounts.find(
        (a) => a.email.toLowerCase() === cleanEmail
      );
      if (!found) {
        return { success: false, error: 'No account found with this email. Please register.' };
      }
      if (password && found.passwordHash && found.passwordHash !== password.trim()) {
        return { success: false, error: 'Incorrect password. (Hint: demo accounts use demo123)' };
      }
      const { passwordHash: _, ...userProfile } = found;
      setAuthData((prev) => {
        const next = { ...prev, currentUser: userProfile, selectedCountry: userProfile.country };
        saveAuthState(next);
        return next;
      });
      if (userProfile.hubOrArea) setSelectedCountryHub(userProfile.hubOrArea);

      // Sync nickname to passport state
      if (userProfile.nickname) {
        const nextState = structuredClone(stateRef.current);
        nextState.nickname = userProfile.nickname;
        if (userProfile.cityEdition) nextState.city = userProfile.cityEdition;
        setState(nextState);
        persist(nextState);
      }

      publishFeedActivity({
        kind: 'checkin',
        actionText: 'signed in from',
        targetTitle: `${userProfile.hubOrArea || userProfile.country} (${COUNTRIES[userProfile.country]?.flag || '🌍'})`,
        detailText: `${userProfile.nickname} logged in. Repping ${userProfile.country}!`,
        authorOverride: userProfile.nickname
      });

      showToast(`Welcome back, ${userProfile.nickname}! (${userProfile.country})`);
      return { success: true, user: userProfile };
    },
    [authData.registeredAccounts, persist, publishFeedActivity, showToast]
  );

  const registerAccount = useCallback(
    (input: Omit<UserProfileAccount, 'id' | 'createdAt' | 'isVerified'>) => {
      const cleanEmail = input.email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' };
      }
      if (!input.nickname.trim()) {
        return { success: false, error: 'Please choose a nickname.' };
      }
      if (authData.registeredAccounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists. Please log in.' };
      }

      const newUser: UserProfileAccount = {
        ...input,
        id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        email: cleanEmail,
        createdAt: new Date().toISOString().split('T')[0],
        isVerified: true
      };

      const newRegistered = [...authData.registeredAccounts, { ...newUser, passwordHash: 'pass123' }];
      setAuthData((prev) => {
        const next = {
          ...prev,
          currentUser: newUser,
          selectedCountry: newUser.country,
          registeredAccounts: newRegistered
        };
        saveAuthState(next);
        return next;
      });
      if (newUser.hubOrArea) setSelectedCountryHub(newUser.hubOrArea);

      const nextState = structuredClone(stateRef.current);
      nextState.nickname = newUser.nickname;
      if (newUser.cityEdition) nextState.city = newUser.cityEdition;
      setState(nextState);
      persist(nextState);

      publishFeedActivity({
        kind: 'checkin',
        actionText: 'just joined & repped',
        targetTitle: `${newUser.hubOrArea || newUser.country} (${COUNTRIES[newUser.country]?.flag || '🌍'})`,
        detailText: `${newUser.fullName} (${newUser.nickname}) created their verified account!`,
        authorOverride: newUser.nickname
      });

      showToast(`Welcome to Rep Your Side, ${newUser.nickname}! 🚀`);
      return { success: true, user: newUser };
    },
    [authData.registeredAccounts, persist, publishFeedActivity, showToast]
  );

  const updateProfileAccount = useCallback(
    (updates: Partial<UserProfileAccount>) => {
      if (!authData.currentUser) return;
      const updated: UserProfileAccount = { ...authData.currentUser, ...updates };
      const updatedRegistered = authData.registeredAccounts.map((a) =>
        a.id === updated.id ? { ...a, ...updates } : a
      );
      setAuthData((prev) => {
        const next = {
          ...prev,
          currentUser: updated,
          selectedCountry: updated.country,
          registeredAccounts: updatedRegistered
        };
        saveAuthState(next);
        return next;
      });
      if (updated.hubOrArea) setSelectedCountryHub(updated.hubOrArea);
      if (updated.nickname) {
        const nextState = structuredClone(stateRef.current);
        nextState.nickname = updated.nickname;
        if (updated.cityEdition) nextState.city = updated.cityEdition;
        setState(nextState);
        persist(nextState);
      }
      showToast('Profile updated!');
    },
    [authData.currentUser, authData.registeredAccounts, persist, showToast]
  );

  const logoutAccount = useCallback(() => {
    setAuthData((prev) => {
      const next = { ...prev, currentUser: null };
      saveAuthState(next);
      return next;
    });
    showToast('Signed out. You are now playing as a guest.');
  }, [showToast]);

  const demoAccounts = authData.registeredAccounts.map(({ passwordHash: _, ...rest }) => rest);

  return (
    <PassportContext.Provider
      value={{
        state,
        storageIssue,
        activeModal,
        menuOpen,
        filter,
        search,
        pulseFilter,
        toast,
        isOffline,
        catalog,
        progressStore,
        backupCodec,
        browserServices,
        openModal,
        closeModal,
        showToast,
        setMenuOpen,
        setFilter,
        setSearch,
        setPulseFilter,
        resetFilters,
        persist,
        updateSide,
        toggleSavePlace,
        collectContent,
        toggleCircleInterest,
        restorePassport,
        resetPilot,
        retrySave,
        communityFeed,
        publishFeedActivity,
        toggleFeedReaction,
        addFeedComment,
        postSideCheckin,
        simulateLivePulse,
        currentUser: authData.currentUser,
        selectedCountry: authData.selectedCountry,
        selectedCountryHub,
        demoAccounts,
        setSelectedCountry,
        loginAccount,
        registerAccount,
        updateProfileAccount,
        logoutAccount
      }}
    >
      {children}
    </PassportContext.Provider>
  );
}

export function usePassport() {
  const context = useContext(PassportContext);
  if (!context) {
    throw new Error('usePassport must be used within a PassportProvider');
  }
  return context;
}
