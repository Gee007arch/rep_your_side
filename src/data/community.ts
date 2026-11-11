import type { CityId, CircleId } from '../domain/types';

export type FeedActivityKind = 'quiz' | 'reflection' | 'discovery' | 'story' | 'checkin' | 'circle';

export interface FeedComment {
  id: string;
  author: string;
  area: string;
  avatarBg: string;
  text: string;
  timeLabel: string;
}

export interface FeedActivityItem {
  id: string;
  city: CityId;
  author: string;
  area: string;
  avatarBg: string;
  avatarColor: string;
  kind: FeedActivityKind;
  actionText: string;
  targetTitle: string;
  detailText: string;
  xpGained?: number;
  circleId?: CircleId;
  placeId?: string;
  timeLabel: string;
  createdAt: number;
  cheers: number;
  reps: number;
  cheeredByMe?: boolean;
  reppedByMe?: boolean;
  isCurrentUser?: boolean;
  comments: FeedComment[];
}

export interface SideStanding {
  area: string;
  city: CityId;
  explorers: number;
  baseXp: number;
  discoveries: number;
  activeNow: number;
  topTag: string;
}

export interface CircleSocialStats {
  circleId: CircleId;
  lagosMembers: number;
  abujaMembers: number;
  weeklyReflections: number;
  recentMembers: { initials: string; name: string; area: string; bg: string; color: string }[];
}

export const SIDE_STANDINGS: Record<CityId, SideStanding[]> = {
  lagos: [
    { area: 'Surulere', city: 'lagos', explorers: 148, baseXp: 5420, discoveries: 312, activeNow: 19, topTag: 'Storytellers' },
    { area: 'Lekki', city: 'lagos', explorers: 136, baseXp: 4980, discoveries: 289, activeNow: 16, topTag: 'Nature & Walkers' },
    { area: 'Yaba', city: 'lagos', explorers: 124, baseXp: 4610, discoveries: 264, activeNow: 15, topTag: 'Quiz Leaders' },
    { area: 'Ikeja', city: 'lagos', explorers: 112, baseXp: 4190, discoveries: 230, activeNow: 12, topTag: 'City Pulse' },
    { area: 'Lagos Island', city: 'lagos', explorers: 98, baseXp: 3750, discoveries: 215, activeNow: 11, topTag: 'Heritage' },
    { area: 'Ikorodu', city: 'lagos', explorers: 86, baseXp: 3280, discoveries: 178, activeNow: 9, topTag: 'Community' },
    { area: 'Victoria Island', city: 'lagos', explorers: 82, baseXp: 3110, discoveries: 164, activeNow: 8, topTag: 'Culture' },
    { area: 'Festac', city: 'lagos', explorers: 74, baseXp: 2840, discoveries: 152, activeNow: 7, topTag: 'Makers' }
  ],
  abuja: [
    { area: 'Wuse', city: 'abuja', explorers: 132, baseXp: 4860, discoveries: 276, activeNow: 17, topTag: 'Quiz Leaders' },
    { area: 'Maitama', city: 'abuja', explorers: 118, baseXp: 4420, discoveries: 251, activeNow: 14, topTag: 'Green Stewards' },
    { area: 'Jabi', city: 'abuja', explorers: 109, baseXp: 4050, discoveries: 228, activeNow: 13, topTag: 'Photo Walkers' },
    { area: 'Garki', city: 'abuja', explorers: 96, baseXp: 3690, discoveries: 204, activeNow: 11, topTag: 'Storytellers' },
    { area: 'Gwarinpa', city: 'abuja', explorers: 91, baseXp: 3480, discoveries: 192, activeNow: 10, topTag: 'Street Sense' },
    { area: 'Kubwa', city: 'abuja', explorers: 79, baseXp: 2950, discoveries: 163, activeNow: 8, topTag: 'Makers' },
    { area: 'Asokoro', city: 'abuja', explorers: 68, baseXp: 2590, discoveries: 140, activeNow: 6, topTag: 'City Pulse' },
    { area: 'Bwari', city: 'abuja', explorers: 64, baseXp: 2410, discoveries: 135, activeNow: 6, topTag: 'Craft & Heritage' }
  ]
};

export const CIRCLE_SOCIAL_STATS: Record<CircleId, CircleSocialStats> = {
  lens: {
    circleId: 'lens',
    lagosMembers: 84,
    abujaMembers: 67,
    weeklyReflections: 39,
    recentMembers: [
      { initials: 'KO', name: 'Kemi O.', area: 'Lekki', bg: '#edcebc', color: '#83543a' },
      { initials: 'NE', name: 'Ngozi E.', area: 'Jabi', bg: '#bdcc9d', color: '#4e6a45' },
      { initials: 'TA', name: 'Tunde A.', area: 'Surulere', bg: '#e9c66e', color: '#8c6b2c' },
      { initials: 'SM', name: 'Seyi M.', area: 'Lagos Island', bg: '#d8c8e0', color: '#8e719f' }
    ]
  },
  green: {
    circleId: 'green',
    lagosMembers: 72,
    abujaMembers: 78,
    weeklyReflections: 44,
    recentMembers: [
      { initials: 'ID', name: 'Ibrahim D.', area: 'Maitama', bg: '#dce7cd', color: '#4e6a45' },
      { initials: 'FO', name: 'Funmi O.', area: 'Ikeja', bg: '#f5e3ab', color: '#8c6b2c' },
      { initials: 'AK', name: 'Amina K.', area: 'Wuse', bg: '#edcebc', color: '#83543a' },
      { initials: 'CN', name: 'Chidi N.', area: 'Yaba', bg: '#d8c8e0', color: '#8e719f' }
    ]
  },
  makers: {
    circleId: 'makers',
    lagosMembers: 91,
    abujaMembers: 62,
    weeklyReflections: 31,
    recentMembers: [
      { initials: 'BA', name: 'Bolanle A.', area: 'Yaba', bg: '#f5e3ab', color: '#8c6b2c' },
      { initials: 'MY', name: 'Musa Y.', area: 'Garki', bg: '#edcebc', color: '#83543a' },
      { initials: 'DT', name: 'Damilola T.', area: 'Gwarinpa', bg: '#bdcc9d', color: '#4e6a45' },
      { initials: 'EA', name: 'Emeka A.', area: 'Festac', bg: '#d8c8e0', color: '#8e719f' }
    ]
  },
  books: {
    circleId: 'books',
    lagosMembers: 96,
    abujaMembers: 74,
    weeklyReflections: 52,
    recentMembers: [
      { initials: 'ZB', name: 'Zainab B.', area: 'Ikeja', bg: '#d8c8e0', color: '#8e719f' },
      { initials: 'HC', name: 'Halima C.', area: 'Asokoro', bg: '#edcebc', color: '#83543a' },
      { initials: 'OO', name: 'Oluwaseun O.', area: 'Ikorodu', bg: '#bdcc9d', color: '#4e6a45' },
      { initials: 'TA', name: 'Tunde A.', area: 'Surulere', bg: '#e9c66e', color: '#8c6b2c' }
    ]
  }
};

export const INITIAL_COMMUNITY_FEED: FeedActivityItem[] = [
  // Lagos Feed Items
  {
    id: 'feed-lg-1',
    city: 'lagos',
    author: 'Tunde A.',
    area: 'Surulere',
    avatarBg: '#edcebc',
    avatarColor: '#83543a',
    kind: 'quiz',
    actionText: 'scored 5/5 on',
    targetTitle: 'Lagos in five',
    detailText: 'That IBILE administrative divisions question almost caught me out. Surulere is showing up strong this week!',
    xpGained: 70,
    timeLabel: '2m ago',
    createdAt: 1794250000000 - 120000,
    cheers: 18,
    reps: 11,
    comments: [
      {
        id: 'c-lg-1',
        author: 'Chidi N.',
        area: 'Yaba',
        avatarBg: '#f5e3ab',
        text: 'Clean 5/5! Yaba is right behind Surulere on the board though 👀',
        timeLabel: '1m ago'
      }
    ]
  },
  {
    id: 'feed-lg-2',
    city: 'lagos',
    author: 'Kemi O.',
    area: 'Lekki',
    avatarBg: '#dce7cd',
    avatarColor: '#4e6a45',
    kind: 'reflection',
    actionText: 'shared a reflection in',
    targetTitle: 'Side Photo Walkers',
    detailText: '“Noticed how the late-afternoon sun hits the terracotta roofs and danfo yellow along the corridor—warmest palette in the city.”',
    xpGained: 20,
    circleId: 'lens',
    timeLabel: '9m ago',
    createdAt: 1794250000000 - 540000,
    cheers: 24,
    reps: 9,
    comments: [
      {
        id: 'c-lg-2',
        author: 'Seyi M.',
        area: 'Lagos Island',
        avatarBg: '#d8c8e0',
        text: 'Golden hour on the Island and Lekki hits different.',
        timeLabel: '5m ago'
      }
    ]
  },
  {
    id: 'feed-lg-3',
    city: 'lagos',
    author: 'Chidi N.',
    area: 'Yaba',
    avatarBg: '#f5e3ab',
    avatarColor: '#8c6b2c',
    kind: 'discovery',
    actionText: 'collected a local discovery:',
    targetTitle: 'The Blue Line corridor',
    detailText: 'Checked out the Marina–Mile 2 rail stops. Seeing the lagoon from the elevated track gives you a whole new angle on Lagos Island.',
    xpGained: 10,
    placeId: 'blueline',
    timeLabel: '18m ago',
    createdAt: 1794250000000 - 1080000,
    cheers: 15,
    reps: 7,
    comments: []
  },
  {
    id: 'feed-lg-4',
    city: 'lagos',
    author: 'Zainab B.',
    area: 'Ikeja',
    avatarBg: '#e1d9e9',
    avatarColor: '#6d567e',
    kind: 'story',
    actionText: 'completed all 5 chapters of',
    targetTitle: 'The Postcard Trail',
    detailText: 'Followed Tomi’s postcard clues all the way to the final chapter. The quiet community courtyard choice felt just like home.',
    xpGained: 50,
    circleId: 'books',
    timeLabel: '31m ago',
    createdAt: 1794250000000 - 1860000,
    cheers: 19,
    reps: 8,
    comments: []
  },
  {
    id: 'feed-lg-5',
    city: 'lagos',
    author: 'Bolanle A.',
    area: 'Ikorodu',
    avatarBg: '#edcebc',
    avatarColor: '#83543a',
    kind: 'reflection',
    actionText: 'shared a skill note in',
    targetTitle: 'Local Makers & Skills',
    detailText: '“I can teach anyone how to mend clothes and hem trousers by hand in twenty minutes—saves a trip to the tailor!”',
    xpGained: 20,
    circleId: 'makers',
    timeLabel: '47m ago',
    createdAt: 1794250000000 - 2820000,
    cheers: 29,
    reps: 14,
    comments: []
  },

  // Abuja Feed Items
  {
    id: 'feed-ab-1',
    city: 'abuja',
    author: 'Amina K.',
    area: 'Wuse',
    avatarBg: '#dce7cd',
    avatarColor: '#4e6a45',
    kind: 'quiz',
    actionText: 'scored 5/5 on',
    targetTitle: 'Abuja in five',
    detailText: 'Five out of five for Wuse! Knowing the difference between our informal Sides and the six FCT Area Councils came in handy.',
    xpGained: 70,
    timeLabel: '3m ago',
    createdAt: 1794250000000 - 180000,
    cheers: 21,
    reps: 12,
    comments: [
      {
        id: 'c-ab-1',
        author: 'Ibrahim D.',
        area: 'Maitama',
        avatarBg: '#f5e3ab',
        text: 'Wuse always brings the energy! Maitama is catching up fast.',
        timeLabel: '1m ago'
      }
    ]
  },
  {
    id: 'feed-ab-2',
    city: 'abuja',
    author: 'Ibrahim D.',
    area: 'Maitama',
    avatarBg: '#f5e3ab',
    avatarColor: '#8c6b2c',
    kind: 'reflection',
    actionText: 'shared a reflection in',
    targetTitle: 'Green Side Stewards',
    detailText: '“Walked past the shaded cassia trees near Millennium Park before the sun got high—still the most peaceful green pocket in the capital.”',
    xpGained: 20,
    circleId: 'green',
    timeLabel: '12m ago',
    createdAt: 1794250000000 - 720000,
    cheers: 26,
    reps: 10,
    comments: []
  },
  {
    id: 'feed-ab-3',
    city: 'abuja',
    author: 'Ngozi E.',
    area: 'Jabi',
    avatarBg: '#edcebc',
    avatarColor: '#83543a',
    kind: 'discovery',
    actionText: 'collected a local discovery:',
    targetTitle: 'Ushafa Pottery Centre',
    detailText: 'Loved reading the background on Bwari’s pottery heritage. Bookmarking this for a calm Saturday morning detour.',
    xpGained: 10,
    placeId: 'ushafa',
    timeLabel: '24m ago',
    createdAt: 1794250000000 - 1440000,
    cheers: 16,
    reps: 6,
    comments: []
  },
  {
    id: 'feed-ab-4',
    city: 'abuja',
    author: 'Damilola T.',
    area: 'Gwarinpa',
    avatarBg: '#e1d9e9',
    avatarColor: '#6d567e',
    kind: 'quiz',
    actionText: 'completed',
    targetTitle: 'Street Sense',
    detailText: '3/3 on the everyday community scenarios. Keeping the banter friendly and checking sources first!',
    xpGained: 50,
    timeLabel: '39m ago',
    createdAt: 1794250000000 - 2340000,
    cheers: 14,
    reps: 9,
    comments: []
  },
  {
    id: 'feed-ab-5',
    city: 'abuja',
    author: 'Musa Y.',
    area: 'Garki',
    avatarBg: '#dce7cd',
    avatarColor: '#4e6a45',
    kind: 'reflection',
    actionText: 'shared a story note in',
    targetTitle: 'Everyday Story Collectors',
    detailText: '“Our tea seller in Area 11 remembers everyone’s exact order even if you haven’t stopped by in three months.”',
    xpGained: 20,
    circleId: 'books',
    timeLabel: '52m ago',
    createdAt: 1794250000000 - 3120000,
    cheers: 31,
    reps: 15,
    comments: []
  }
];

export const LIVE_PULSE_QUEUE: Omit<FeedActivityItem, 'id' | 'createdAt' | 'timeLabel'>[] = [
  {
    city: 'lagos',
    author: 'Funmi O.',
    area: 'Victoria Island',
    avatarBg: '#dce7cd',
    avatarColor: '#4e6a45',
    kind: 'discovery',
    actionText: 'bookmarked & collected:',
    targetTitle: 'Lekki Conservation Centre',
    detailText: 'Adding the canopy walkway to my weekend list. Nature right in the middle of Lekki.',
    xpGained: 10,
    placeId: 'lcc',
    cheers: 6,
    reps: 4,
    comments: []
  },
  {
    city: 'lagos',
    author: 'Emeka A.',
    area: 'Festac',
    avatarBg: '#f5e3ab',
    avatarColor: '#8c6b2c',
    kind: 'quiz',
    actionText: 'finished a round of',
    targetTitle: 'Street Sense',
    detailText: 'Festac is on the board! Good instincts all round.',
    xpGained: 50,
    cheers: 9,
    reps: 5,
    comments: []
  },
  {
    city: 'abuja',
    author: 'Halima C.',
    area: 'Asokoro',
    avatarBg: '#e1d9e9',
    avatarColor: '#6d567e',
    kind: 'discovery',
    actionText: 'collected a local discovery:',
    targetTitle: 'Millennium Park',
    detailText: 'A classic Maitama green space. Great context on how the park fits the city master plan.',
    xpGained: 10,
    placeId: 'millennium',
    cheers: 8,
    reps: 4,
    comments: []
  },
  {
    city: 'abuja',
    author: 'Tariq S.',
    area: 'Kubwa',
    avatarBg: '#edcebc',
    avatarColor: '#83543a',
    kind: 'checkin',
    actionText: 'checked in from',
    targetTitle: 'Kubwa · Abuja',
    detailText: 'Evening breeze in Kubwa! Seeing more neighbours from our Side joining the pilot today.',
    cheers: 11,
    reps: 7,
    comments: []
  }
];

export const COMMUNITY_STORAGE_KEY = 'rys.community.v1';

export function loadCommunityFeed(): FeedActivityItem[] {
  if (typeof window === 'undefined') return structuredClone(INITIAL_COMMUNITY_FEED);
  try {
    const raw = window.localStorage.getItem(COMMUNITY_STORAGE_KEY);
    if (!raw) return structuredClone(INITIAL_COMMUNITY_FEED);
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // Fallback to default seeded feed
  }
  return structuredClone(INITIAL_COMMUNITY_FEED);
}

export function saveCommunityFeed(items: FeedActivityItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COMMUNITY_STORAGE_KEY, JSON.stringify(items.slice(0, 60)));
  } catch {
    // Ignore storage quota errors for social feed cache
  }
}

