import type { CityId, Question } from '../domain/types';

export type RivalryCategory = 'players' | 'clubs' | 'artists' | 'derbies' | 'campus';

export interface RivalrySide {
  id: string;
  name: string;
  fanbaseName: string;
  shortCode: string;
  emoji: string;
  color: string;
  bg: string;
  supporters: number;
  votes: number;
  tagline: string;
}

export interface BanterComment {
  id: string;
  author: string;
  sideId: string;
  sideLabel: string;
  sideBg: string;
  sideColor: string;
  text: string;
  timeLabel: string;
  cheers: number;
  reps: number;
  cheeredByMe?: boolean;
  reppedByMe?: boolean;
  isFeatured?: boolean;
  replies: {
    id: string;
    author: string;
    sideLabel: string;
    text: string;
    timeLabel: string;
  }[];
}

export interface RivalryRoom {
  id: string;
  slug: string;
  category: 'players' | 'clubs' | 'artists';
  badgeLabel: string;
  phase: 'LIVE BANTER' | 'PRE-MATCH POLL' | 'RECEIPTS OUT';
  title: string;
  subtitle: string;
  headlinePrompt: string;
  receiptQuestion: string;
  cutoffLabel: string;
  sides: RivalrySide[];
  banterOfTheMatch: {
    sideId: string;
    sideLabel: string;
    author: string;
    quote: string;
    cheers: number;
  }[];
  comments: BanterComment[];
  quizQuestions: Question[];
}

export interface FavAssessmentOption {
  id: string;
  name: string;
  subtitle: string;
  fanbase: string;
  emoji: string;
  bg: string;
  color: string;
  votes: number;
  TraitTag: string;
}

export interface FavAssessmentPrompt {
  id: string;
  question: string;
  options: {
    label: string;
    vibeTag: string;
    points: number;
  }[];
}

export interface FavAssessment {
  id: string;
  category: 'football-players' | 'artists-celebs' | 'football-clubs' | 'city-vibes' | 'campus-alumni' | 'nollywood-creators';
  categoryLabel: string;
  title: string;
  subtitle: string;
  xpReward: number;
  participantsCount: number;
  favOptions: FavAssessmentOption[];
  prompts: FavAssessmentPrompt[];
}

export interface DerbyFixture {
  id: string;
  slug: string;
  edition: 'inter-city' | 'lagos' | 'abuja' | 'campus' | 'alumni';
  editionLabel: string;
  countryCode?: 'USA' | 'CANADA' | 'UK' | 'NIGERIA' | 'OTHERS' | 'GLOBAL';
  format: 'derby' | 'open-challenge';
  status: 'open' | 'scheduled' | 'review' | 'final';
  title: string;
  subtitle: string;
  deadlineLabel: string;
  minTurnoutPerSide: number;
  sides: {
    id: string;
    name: string;
    city?: CityId;
    emoji: string;
    color: string;
    bg: string;
    eligibleTurnout: number;
    totalCorrect: number;
    totalQuestionsAttempted: number;
    cheers: number;
  }[];
  questions: Question[];
}

export interface InstitutionSide {
  id: string;
  name: string;
  shortName: string;
  kind: 'campus' | 'alumni';
  categoryLabel: string; // e.g. Federal University, Private University, Unity School, Old Boys/Girls
  state: string;
  city: string;
  countryCode?: 'USA' | 'CANADA' | 'UK' | 'NIGERIA' | 'OTHERS' | 'GLOBAL';
  mottoOrTag: string;
  emoji: string;
  verifiedMembers: number;
  weeklyScorePct: number;
  totalXp: number;
  activeSetOrChapter: string;
}

// ============================================================================
// 1. FIRST-VISIT INSTANT PLAY: "YOUR FEEL ABOUT YOUR FAV" ASSESSMENTS
// ============================================================================

export const INITIAL_FAV_ASSESSMENTS: FavAssessment[] = [
  {
    id: 'fav-naija-ballers',
    category: 'football-players',
    categoryLabel: '⚽ Football Players Banter',
    title: 'Your Feel About Your Fav: Naija & Global Ballers',
    subtitle: 'Pick the footballer you rep hardest, rate their aura in 3 quick taps, and unlock your fan receipt.',
    xpReward: 35,
    participantsCount: 1420,
    favOptions: [
      {
        id: 'osimhen',
        name: 'Victor Osimhen',
        subtitle: 'Masked Striker · Relentless 9',
        fanbase: 'VO9 Brigade',
        emoji: '🎭',
        bg: '#edcebc',
        color: '#83543a',
        votes: 542,
        TraitTag: 'Pure Passion & Aerial Power'
      },
      {
        id: 'lookman',
        name: 'Ademola Lookman',
        subtitle: 'Final Hat-Trick Hero · Ballon d’Or Nominee',
        fanbase: 'Mola Nation',
        emoji: '⚡',
        bg: '#dce7cd',
        color: '#2d5a3c',
        votes: 498,
        TraitTag: 'Big-Game Clutch Finisher'
      },
      {
        id: 'saka',
        name: 'Bukayo Saka',
        subtitle: 'Starboy · Right Wing Maestro',
        fanbase: 'Starboy FC',
        emoji: '🌟',
        bg: '#f5e3ab',
        color: '#8c6b2c',
        votes: 380,
        TraitTag: 'Consistency & World-Class IQ'
      }
    ],
    prompts: [
      {
        id: 'p1',
        question: '1. What is the #1 thing that makes your fav untouchable on pitch?',
        options: [
          { label: 'Shows up in the biggest finals when the lights are brightest', vibeTag: 'Big-Stage Gladiator', points: 40 },
          { label: 'Carries the entire attack on their back every single weekend', vibeTag: 'System Carrier', points: 35 },
          { label: 'Pure street flair, confidence and cold celebrations', vibeTag: 'Aura & Tekkers', points: 30 }
        ]
      },
      {
        id: 'p2',
        question: '2. When rival fans try to banter your fav, what receipt do you drop first?',
        options: [
          { label: 'Goals + Assists per 90 and African/European silverware', vibeTag: 'Stats & Trophies Receipt', points: 40 },
          { label: 'Eye test! Watch the full 90 minutes, not just highlights', vibeTag: 'Pure Ball Knowledge', points: 35 },
          { label: 'Their manager and teammates call them world-class for a reason', vibeTag: 'Locker Room Respect', points: 30 }
        ]
      },
      {
        id: 'p3',
        question: '3. How high is your confidence in your fav for the rest of the season?',
        options: [
          { label: '100/100 — Ballon d’Or / POTY podium incoming, bookmark this!', vibeTag: 'Day-One Believer', points: 40 },
          { label: '90/100 — Guaranteed 25+ G/A if everyone stays fit', vibeTag: 'Tactical Realist', points: 35 },
          { label: 'Riding with my fav win, lose or draw — loyalty over hype', vibeTag: 'Die-Hard Loyalist', points: 35 }
        ]
      }
    ]
  },
  {
    id: 'fav-afrobeats-icons',
    category: 'artists-celebs',
    categoryLabel: '🎤 Artists & Celebrities',
    title: 'Your Feel About Your Fav: Afrobeats & Music Royalty',
    subtitle: 'Who owns your playlist and your loyalty? Pick your fav artist and drop your official music receipt.',
    xpReward: 35,
    participantsCount: 1890,
    favOptions: [
      {
        id: 'wizkid',
        name: 'Wizkid (Big Wiz)',
        subtitle: 'Starboy · Made in Lagos & Morayo',
        fanbase: 'Wizkid FC',
        emoji: '🦅',
        bg: '#f5e3ab',
        color: '#8c6b2c',
        votes: 590,
        TraitTag: 'Timeless Melodies &Steeze'
      },
      {
        id: 'davido',
        name: 'Davido (001)',
        subtitle: 'OBO · Timeless & 5ive Energy',
        fanbase: '30BG',
        emoji: '⏳',
        bg: '#edcebc',
        color: '#83543a',
        votes: 575,
        TraitTag: 'Hitmaker & People’s Champion'
      },
      {
        id: 'burna',
        name: 'Burna Boy (Odogwu)',
        subtitle: 'African Giant · Stadium Conqueror',
        fanbase: 'Outsiders',
        emoji: '🦍',
        bg: '#dce7cd',
        color: '#2d5a3c',
        votes: 540,
        TraitTag: 'Live Performance & Grammy Pedigree'
      },
      {
        id: 'tems-ayra-rema-asake',
        name: 'Tems / Asake / Rema / Ayra',
        subtitle: 'Leading Vibe · Mr Money · Ravers · Sabi Girl',
        fanbase: 'New Wave Icons',
        emoji: '✨',
        bg: '#e1d9e9',
        color: '#6d567e',
        votes: 485,
        TraitTag: 'Global Charts & Fresh Sound'
      }
    ],
    prompts: [
      {
        id: 'a1',
        question: '1. What makes your fav’s catalog hit harder than anyone else’s?',
        options: [
          { label: 'Zero skips on the album — you can play it from track 1 to the end', vibeTag: 'Album Purist', points: 40 },
          { label: 'Shut-down anthems that turn every party, wedding and stadium upside down', vibeTag: 'Anthem Specialist', points: 35 },
          { label: 'Global vocal delivery and live band mastery across continents', vibeTag: 'Stage Monarch', points: 35 }
        ]
      },
      {
        id: 'a2',
        question: '2. What is your favourite era of your fav?',
        options: [
          { label: 'The classic throwbacks that raised the whole generation', vibeTag: 'OG Historian', points: 35 },
          { label: 'Their current global run — breaking records every month', vibeTag: 'Global Era Witness', points: 40 },
          { label: 'Every single era! Unmatched longevity from day one', vibeTag: 'Catalog Scholar', points: 40 }
        ]
      },
      {
        id: 'a3',
        question: '3. If you had Aux cord control for 10 minutes, what are you playing first?',
        options: [
          { label: 'The smooth late-night cruise record for pure vibes', vibeTag: 'Smooth Curator', points: 35 },
          { label: 'The high-tempo street anthem that gets everyone on their feet', vibeTag: 'Energy Captain', points: 40 },
          { label: 'The deep album cut only real day-one fans know word for word', vibeTag: 'Deep-Cut Connoisseur', points: 40 }
        ]
      }
    ]
  },
  {
    id: 'fav-city-lifestyle',
    category: 'city-vibes',
    categoryLabel: '🏙️ Abuja vs Lagos Vibes',
    title: 'Your Feel About Your City: Eko Energy vs Capital Calm',
    subtitle: 'Are you built for Lagos 24/7 electric hustle or Abuja wide roads and sunset parks? Take the 30-second check.',
    xpReward: 30,
    participantsCount: 1120,
    favOptions: [
      {
        id: 'lagos-mainland',
        name: 'Lagos Mainland (Yaba / Surulere / Ikeja)',
        subtitle: 'Culture, Tech, Cinema & Real Eko Heart',
        fanbase: 'Mainland Titans',
        emoji: '🚌',
        bg: '#f5e3ab',
        color: '#8c6b2c',
        votes: 340,
        TraitTag: 'Street Smart & Creative Energy'
      },
      {
        id: 'lagos-island',
        name: 'Lagos Island & Lekki Corridor',
        subtitle: 'Lagoon Breeze, Beaches, Art & Nightlife',
        fanbase: 'Island Cruisers',
        emoji: '🌊',
        bg: '#d8e6f3',
        color: '#2b547e',
        votes: 310,
        TraitTag: 'Coastal Vibes & Detours'
      },
      {
        id: 'abuja-central',
        name: 'Abuja Central (Wuse / Maitama / Jabi)',
        subtitle: 'Green Canopies, Lake Views & Evening Suya',
        fanbase: 'Capital Royals',
        emoji: '⛰️',
        bg: '#dce7cd',
        color: '#2d5a3c',
        votes: 295,
        TraitTag: 'Peace of Mind & Clean Roads'
      },
      {
        id: 'abuja-hubs',
        name: 'Gwarinpa / Kubwa / Guzape',
        subtitle: 'Biggest Estates, Hilltop Views & Community Spirit',
        fanbase: 'FCT Heavyweights',
        emoji: '🏡',
        bg: '#edcebc',
        color: '#83543a',
        votes: 265,
        TraitTag: 'True Neighbourhood Pride'
      }
    ],
    prompts: [
      {
        id: 'c1',
        question: '1. What is your ideal Saturday afternoon on your Side?',
        options: [
          { label: 'Canopy walk, park picnic or quiet lakefront breeze with friends', vibeTag: 'Green Seeker', points: 35 },
          { label: 'Art gallery hop, bookstore cafe and live music at night', vibeTag: 'Culture Explorer', points: 40 },
          { label: 'Neighbourhood football turf, street suya spot and banter with the gang', vibeTag: 'Community MVP', points: 40 }
        ]
      },
      {
        id: 'c2',
        question: '2. What is the undefeated flex about your Side?',
        options: [
          { label: 'Everything happens here first — food, fashion, music and ideas', vibeTag: 'Trendsetter Side', points: 40 },
          { label: 'Zero stress, fresh air, 15-minute drives and scenic hills', vibeTag: 'Soft Life Side', points: 40 },
          { label: 'Neighbours actually know each other and look out for the community', vibeTag: 'Heart of the City', points: 35 }
        ]
      },
      {
        id: 'c3',
        question: '3. When someone visits your city for the first time, where do you take them?',
        options: [
          { label: 'A hidden local gem that isn’t on every tourist blog', vibeTag: 'Insider Guide', points: 40 },
          { label: 'Our flagship conservation park or heritage landmark', vibeTag: 'Heritage Ambassador', points: 35 },
          { label: 'Straight to the best local food spot on my Side', vibeTag: 'Chief Taste Officer', points: 35 }
        ]
      }
    ]
  },
  {
    id: 'fav-nollywood-creators',
    category: 'nollywood-creators',
    categoryLabel: '🎬 Screen & Creator Icons',
    title: 'Your Feel About Your Fav: Box Office Queens & Comedy Kings',
    subtitle: 'From cinema blockbusters to daily skits that cure stress — who gets your ultimate flower?',
    xpReward: 30,
    participantsCount: 940,
    favOptions: [
      {
        id: 'funke',
        name: 'Funke Akindele',
        subtitle: 'Box Office Queen · Jenifa & Tribe Called Judah',
        fanbase: 'Jenifans & Box Office Gang',
        emoji: '👑',
        bg: '#f5e3ab',
        color: '#8c6b2c',
        votes: 310,
        TraitTag: 'Billion-Naira Storytelling'
      },
      {
        id: 'toyin',
        name: 'Toyin Abraham',
        subtitle: 'Alakada & Malaika Powerhouse',
        fanbase: 'Toyin Titans',
        emoji: '🌟',
        bg: '#edcebc',
        color: '#83543a',
        votes: 260,
        TraitTag: 'Raw Emotion & Comedy Timing'
      },
      {
        id: 'sabinus',
        name: 'Sabinus (Mr Funny)',
        subtitle: 'Investor Vibes & Blue Suit Icon',
        fanbase: 'Investors Club',
        emoji: '💼',
        bg: '#d8e6f3',
        color: '#2b547e',
        votes: 290,
        TraitTag: 'Relatable Everyday Humour'
      },
      {
        id: 'macaroni-taaooma',
        name: 'Mr Macaroni & Taaooma',
        subtitle: 'Freaky Freaky · Mummy Wa · Iya Tao Multi-Roles',
        fanbase: 'Skit Royalty',
        emoji: '🎭',
        bg: '#dce7cd',
        color: '#2d5a3c',
        votes: 275,
        TraitTag: 'Masterclass Character Acting'
      }
    ],
    prompts: [
      {
        id: 'n1',
        question: '1. Why does your fav never miss on screen?',
        options: [
          { label: 'They turn real Nigerian family life into unforgettable cinema', vibeTag: 'Storyteller Supreme', points: 40 },
          { label: 'One facial expression alone becomes a nationwide meme for months', vibeTag: 'Meme & Reaction Legend', points: 35 },
          { label: 'Work ethic and production quality keep raising the bar every year', vibeTag: 'Industry Trailblazer', points: 40 }
        ]
      },
      {
        id: 'n2',
        question: '2. How do you watch your fav’s new release?',
        options: [
          { label: 'Opening weekend at the cinema with popcorn and the whole crew', vibeTag: 'Box Office Supporter', points: 40 },
          { label: 'Sharing the clip in three family and friend group chats immediately', vibeTag: 'Chief Viral Officer', points: 35 },
          { label: 'Rewatching classic scenes whenever I need a good laugh', vibeTag: 'Comfort Watch Loyal', points: 35 }
        ]
      },
      {
        id: 'n3',
        question: '3. Pick the ultimate flowers for your fav:',
        options: [
          { label: 'National cultural treasure — protect them at all costs!', vibeTag: 'National Treasure Stamp', points: 40 },
          { label: 'Undisputed GOAT of their lane with the numbers to prove it', vibeTag: 'Numbers Don’t Lie', points: 40 },
          { label: 'Pure joy bringer for millions of people home and abroad', vibeTag: 'Joy Ambassador', points: 35 }
        ]
      }
    ]
  }
];

// ============================================================================
// 2. RIVALRY & BANTER ROOMS (PLAYERS, CLUBS, ARTISTS & CELEBRITIES)
// ============================================================================

export const INITIAL_RIVALRY_ROOMS: RivalryRoom[] = [
  {
    id: 'room-osimhen-lookman',
    slug: 'osimhen-vs-lookman',
    category: 'players',
    badgeLabel: '⚽ PLAYERS BANTER · NAIJA CROWN',
    phase: 'LIVE BANTER',
    title: 'Victor Osimhen vs Ademola Lookman',
    subtitle: 'Who holds the ultimate Super Eagles & African Footballer aura right now?',
    headlinePrompt: 'One brought Naples its first Scudetto in 33 years; the other dropped a historic European final hat-trick. Who gets your #1 spot?',
    receiptQuestion: 'THE RECEIPTS POLL: Who finishes 2026 with more combined Goals + Assists for club and country?',
    cutoffLabel: 'Poll locks Friday 20:00 WAT',
    sides: [
      {
        id: 'side-osimhen',
        name: 'Victor Osimhen (VO9)',
        fanbaseName: 'VO9 Brigade',
        shortCode: 'VO9',
        emoji: '🎭',
        color: '#83543a',
        bg: '#edcebc',
        supporters: 642,
        votes: 534,
        tagline: 'Relentless presser, aerial monster & Scudetto king'
      },
      {
        id: 'side-lookman',
        name: 'Ademola Lookman (Mola)',
        fanbaseName: 'Mola Nation',
        shortCode: 'MOLA',
        emoji: '⚡',
        color: '#183e35',
        bg: '#dce7cd',
        supporters: 618,
        votes: 516,
        tagline: 'Two-footed wizard, Dublin hat-trick legend & big-game clutch'
      }
    ],
    banterOfTheMatch: [
      {
        sideId: 'side-osimhen',
        sideLabel: 'VO9 Brigade',
        author: 'Kelechi O. · Surulere',
        quote: 'When Osimhen puts on that mask and leaps 8 feet in the air, two centre-backs aren’t enough. He bullies entire defensive lines for 90 minutes!',
        cheers: 49
      },
      {
        sideId: 'side-lookman',
        sideLabel: 'Mola Nation',
        author: 'Sadiq M. · Wuse',
        quote: 'Lookman scored a hat-trick against an unbeaten European giant in a final with his left, right and weak foot! That is pure Ballon d’Or heritage.',
        cheers: 52
      }
    ],
    comments: [
      {
        id: 'bc-1',
        author: 'Tunde A.',
        sideId: 'side-osimhen',
        sideLabel: 'VO9 Brigade',
        sideBg: '#edcebc',
        sideColor: '#83543a',
        text: 'Osimhen’s mentality when playing for the green and white is unmatched. Every loose ball is war for him.',
        timeLabel: '4m ago',
        cheers: 24,
        reps: 15,
        replies: [
          {
            id: 'r-1',
            author: 'Amina K.',
            sideLabel: 'Mola Nation',
            text: 'We love both for Super Eagles! But Lookman’s close control in tight spaces right now is pure cinema.',
            timeLabel: '2m ago'
          }
        ]
      },
      {
        id: 'bc-2',
        author: 'Chinedu E.',
        sideId: 'side-lookman',
        sideLabel: 'Mola Nation',
        sideBg: '#dce7cd',
        sideColor: '#183e35',
        text: 'Mola cutting inside from the left wing is an automatic goal threat. The efficiency is crazy.',
        timeLabel: '11m ago',
        cheers: 19,
        reps: 12,
        replies: []
      }
    ],
    quizQuestions: [
      {
        q: 'In which city did Ademola Lookman score his famous European final hat-trick in May 2024?',
        a: ['Dublin', 'Rome', 'London', 'Athens'],
        correct: 0,
        why: 'Lookman scored all three goals for Atalanta in the final held at the Aviva Stadium in Dublin.'
      },
      {
        q: 'Victor Osimhen won the Serie A Capocannoniere (Golden Boot) while helping which club win the 2022–23 Scudetto?',
        a: ['AC Milan', 'Napoli', 'Inter Milan', 'Lille'],
        correct: 1,
        why: 'Osimhen scored 26 league goals to power Napoli to their historic Serie A title.'
      },
      {
        q: 'Both Osimhen and Lookman have been crowned CAF African Footballer of the Year. True or False?',
        a: ['True — back-to-back Nigerian winners', 'False — only one has won it', 'Neither has won it', 'They shared the award in the same year'],
        correct: 0,
        why: 'Osimhen won the 2023 CAF award and Lookman followed up in 2024, giving Nigeria consecutive crowns.'
      }
    ]
  },
  {
    id: 'room-saka-palmer',
    slug: 'saka-vs-palmer',
    category: 'players',
    badgeLabel: '⚽ PLAYERS BANTER · STARBOY VS COLD',
    phase: 'LIVE BANTER',
    title: 'Bukayo Saka vs Cole Palmer',
    subtitle: 'Starboy consistency vs Cold Palmer magic — who is the premier attacking talisman?',
    headlinePrompt: 'North London’s Golden Boy against Stamford Bridge’s Ice Man. Drop your take with receipts!',
    receiptQuestion: 'THE RECEIPTS POLL: Who creates more big chances + goals in top-six clashes this campaign?',
    cutoffLabel: 'Matchday cutoff Saturday 12:30 UTC',
    sides: [
      {
        id: 'side-saka',
        name: 'Bukayo Saka (Starboy)',
        fanbaseName: 'Starboy FC',
        shortCode: 'SAKA',
        emoji: '🌶️',
        color: '#9b2c2c',
        bg: '#fed7d7',
        supporters: 580,
        votes: 490,
        tagline: 'Double-marked every week and still delivers season after season'
      },
      {
        id: 'side-palmer',
        name: 'Cole Palmer (Cold)',
        fanbaseName: 'Cold Palmer Crew',
        shortCode: 'COLD',
        emoji: '🥶',
        color: '#2b547e',
        bg: '#d8e6f3',
        supporters: 545,
        votes: 465,
        tagline: 'Four goals in one half, no-look passes & ice-cold penalties'
      }
    ],
    banterOfTheMatch: [
      {
        sideId: 'side-saka',
        sideLabel: 'Starboy FC',
        author: 'Femi G. · Yaba',
        quote: 'Saka has been doing it at the highest level in Champions League nights and title races for 4 straight years while tracking back like a wing-back!',
        cheers: 41
      },
      {
        sideId: 'side-palmer',
        sideLabel: 'Cold Palmer Crew',
        author: 'Dami T. · Lekki',
        quote: 'Palmer plays football like he’s in his backyard. One through-ball splits five defenders before they even blink. Pure maverick.',
        cheers: 38
      }
    ],
    comments: [
      {
        id: 'bc-sp-1',
        author: 'Femi G.',
        sideId: 'side-saka',
        sideLabel: 'Starboy FC',
        sideBg: '#fed7d7',
        sideColor: '#9b2c2c',
        text: 'Watch how teams put two defenders on Saka from minute one and he still finds the bottom corner.',
        timeLabel: '7m ago',
        cheers: 17,
        reps: 9,
        replies: []
      },
      {
        id: 'bc-sp-2',
        author: 'Dami T.',
        sideId: 'side-palmer',
        sideLabel: 'Cold Palmer Crew',
        sideBg: '#d8e6f3',
        sideColor: '#2b547e',
        text: 'Cold Palmer doesn’t feel pressure. Panenka in a packed stadium like it’s a training ground.',
        timeLabel: '14m ago',
        cheers: 16,
        reps: 11,
        replies: []
      }
    ],
    quizQuestions: [
      {
        q: 'Bukayo Saka has Nigerian roots through his parents, who hail from which Nigerian heritage?',
        a: ['Yoruba heritage (Lagos/Southwest Nigeria)', 'Hausa heritage', 'Kanuri heritage', 'Tiv heritage'],
        correct: 0,
        why: 'Bukayo Saka’s parents emigrated from Nigeria to London, and he has visited Lagos to connect with communities.'
      },
      {
        q: 'How many goals did Cole Palmer score in the first half alone against Brighton in September 2024?',
        a: ['Two', 'Three', 'Four', 'Five'],
        correct: 2,
        why: 'Palmer became the first player in Premier League history to score four goals in the first half of a match.'
      },
      {
        q: 'Which shirt number is iconic for Bukayo Saka at Arsenal?',
        a: ['No. 7', 'No. 4', 'No. 9', 'No. 23'],
        correct: 0,
        why: 'Saka wears the famous No. 7 shirt for Arsenal.'
      }
    ]
  },
  {
    id: 'room-big3-afrobeats',
    slug: 'wizkid-vs-davido-vs-burna',
    category: 'artists',
    badgeLabel: '🎤 ARTISTS & CELEBS · AFROBEATS ARENA',
    phase: 'LIVE BANTER',
    title: 'Wizkid FC vs 30BG vs Outsiders',
    subtitle: 'The Big 3 Cultural Rivalry Room — Catalog, Live Stages, Global Impact & Pure Vibes',
    headlinePrompt: 'Keep it fun, bring your catalog receipts! Which fanbase runs the culture this weekend?',
    receiptQuestion: 'THE RECEIPTS POLL: Which factor truly crowns the #1 Afrobeats icon?',
    cutoffLabel: 'Weekly Culture Recap every Sunday 21:00 WAT',
    sides: [
      {
        id: 'side-wizkid',
        name: 'Wizkid (Big Wiz)',
        fanbaseName: 'Wizkid FC',
        shortCode: 'FC',
        emoji: '🦅',
        color: '#8c6b2c',
        bg: '#f5e3ab',
        supporters: 890,
        votes: 740,
        tagline: 'Superstar to Made in Lagos to Morayo — effortless steeze'
      },
      {
        id: 'side-davido',
        name: 'Davido (OBO)',
        fanbaseName: '30BG',
        shortCode: '30BG',
        emoji: '⏳',
        color: '#83543a',
        bg: '#edcebc',
        supporters: 875,
        votes: 725,
        tagline: 'Back-to-back anthems, high energy & the people’s champion'
      },
      {
        id: 'side-burna',
        name: 'Burna Boy (Odogwu)',
        fanbaseName: 'Outsiders',
        shortCode: 'ODG',
        emoji: '🦍',
        color: '#183e35',
        bg: '#dce7cd',
        supporters: 850,
        votes: 710,
        tagline: 'Grammy winner, stadium tour machine & live band king'
      }
    ],
    banterOfTheMatch: [
      {
        sideId: 'side-wizkid',
        sideLabel: 'Wizkid FC',
        author: 'Seyi M. · Lagos Island',
        quote: 'Play Superstar from 2011 and play Made In Lagos right after — nobody has smoother replay value across 15 years than Big Wiz!',
        cheers: 64
      },
      {
        sideId: 'side-davido',
        sideLabel: '30BG',
        author: 'Bolanle A. · Ikeja',
        quote: 'No party in Nigeria or the diaspora is complete until OBO’s voice comes through the speakers. Joy giver since Dami Duro!',
        cheers: 61
      },
      {
        sideId: 'side-burna',
        sideLabel: 'Outsiders',
        author: 'Ibrahim D. · Maitama',
        quote: 'Watch Burna Boy with the Outsiders live band for two hours straight in an 80,000-capacity stadium. Vocal breath control on 100!',
        cheers: 63
      }
    ],
    comments: [
      {
        id: 'bc-afro-1',
        author: 'Seyi M.',
        sideId: 'side-wizkid',
        sideLabel: 'Wizkid FC',
        sideBg: '#f5e3ab',
        sideColor: '#8c6b2c',
        text: 'Essence really changed global summer playlists forever. That’s a permanent cultural stamp.',
        timeLabel: '3m ago',
        cheers: 32,
        reps: 18,
        replies: [
          {
            id: 'r-afro-1',
            author: 'Zainab B.',
            sideLabel: '30BG',
            text: 'And Unavailable had the whole world doing the challenge from athletes to presidents! Nigerian music stays winning.',
            timeLabel: '1m ago'
          }
        ]
      },
      {
        id: 'bc-afro-2',
        author: 'Ibrahim D.',
        sideId: 'side-burna',
        sideLabel: 'Outsiders',
        sideBg: '#dce7cd',
        sideColor: '#183e35',
        text: 'Last Last and Ye back-to-back in a stadium is a spiritual experience.',
        timeLabel: '8m ago',
        cheers: 28,
        reps: 14,
        replies: []
      }
    ],
    quizQuestions: [
      {
        q: 'Which Wizkid album features the global hit song "Essence" with Tems?',
        a: ['Ayo', 'Sounds From the Other Side', 'Made in Lagos', 'More Love, Less Ego'],
        correct: 2,
        why: '"Essence" featuring Tems is the standout track on Wizkid’s acclaimed 2020 album Made in Lagos.'
      },
      {
        q: 'Burna Boy won the Best Global Music Album Grammy Award in 2021 for which album?',
        a: ['African Giant', 'Twice as Tall', 'Love, Damini', 'I Told Them...'],
        correct: 1,
        why: 'Twice as Tall won the Grammy Award for Best Global Music Album in 2021.'
      },
      {
        q: 'Davido’s record-breaking 2023 album that includes "Unavailable" and "Feel" is titled:',
        a: ['A Good Time', 'A Better Time', 'Timeless', 'Son of Mercy'],
        correct: 2,
        why: 'Timeless (2023) shattered streaming records across platforms upon release.'
      }
    ]
  },
  {
    id: 'room-arsenal-chelsea',
    slug: 'arsenal-vs-chelsea',
    category: 'clubs',
    badgeLabel: '🏟️ CLUB MATCHDAY ROOM · LONDON DERBY',
    phase: 'PRE-MATCH POLL',
    title: 'Arsenal vs Chelsea: London Rivalry Room',
    subtitle: 'From Surulere viewing centres to Wuse sports lounges — is London Red or Blue?',
    headlinePrompt: 'Lock in your pre-match scoreline receipt before kickoff and rep your club in the comments!',
    receiptQuestion: 'THE RECEIPTS: Lock your matchday call before kickoff freezes the poll!',
    cutoffLabel: 'Receipts freeze at Kickoff (Sunday 16:30 UTC)',
    sides: [
      {
        id: 'side-arsenal',
        name: 'Arsenal FC',
        fanbaseName: 'Gooners',
        shortCode: 'ARS',
        emoji: '🔴',
        color: '#9b2c2c',
        bg: '#fed7d7',
        supporters: 720,
        votes: 580,
        tagline: 'North London pride, Invincibles heritage & set-piece kings'
      },
      {
        id: 'side-chelsea',
        name: 'Chelsea FC',
        fanbaseName: 'Blues Faithful',
        shortCode: 'CHE',
        emoji: '🔵',
        color: '#2b547e',
        bg: '#d8e6f3',
        supporters: 695,
        votes: 545,
        tagline: 'Pride of London, European trophies & Drogba/Mikel heritage'
      }
    ],
    banterOfTheMatch: [
      {
        sideId: 'side-arsenal',
        sideLabel: 'Gooners',
        author: 'Chidi N. · Yaba',
        quote: 'Kanu Nwankwo’s 15-minute hat-trick at Stamford Bridge is the reason half of us fell in love with the Arsenal badge!',
        cheers: 55
      },
      {
        sideId: 'side-chelsea',
        sideLabel: 'Blues Faithful',
        author: 'Emeka A. · Festac',
        quote: 'John Mikel Obi and Celestine Babayaro wore the Royal Blue and brought Champions League and FA Cup glory home. Up Chels!',
        cheers: 53
      }
    ],
    comments: [
      {
        id: 'bc-ac-1',
        author: 'Chidi N.',
        sideId: 'side-arsenal',
        sideLabel: 'Gooners',
        sideBg: '#fed7d7',
        sideColor: '#9b2c2c',
        text: 'Locking in a 2-1 Arsenal win in The Receipts! Our corner routines are unstoppable right now.',
        timeLabel: '6m ago',
        cheers: 21,
        reps: 10,
        replies: []
      },
      {
        id: 'bc-ac-2',
        author: 'Emeka A.',
        sideId: 'side-chelsea',
        sideLabel: 'Blues Faithful',
        sideBg: '#d8e6f3',
        sideColor: '#2b547e',
        text: 'Keep this receipt: Chelsea midfield transitions will shock everyone on Sunday.',
        timeLabel: '10m ago',
        cheers: 19,
        reps: 11,
        replies: []
      }
    ],
    quizQuestions: [
      {
        q: 'Which Nigerian legend scored a famous 15-minute second-half hat-trick for Arsenal against Chelsea at Stamford Bridge in 1999?',
        a: ['Kanu Nwankwo', 'Jay-Jay Okocha', 'Finidi George', 'Yakubu Aiyegbeni'],
        correct: 0,
        why: 'Kanu Nwankwo turned a 2-0 deficit into a 3-2 Arsenal victory in one of Premier League history’s most iconic performances.'
      },
      {
        q: 'Which Super Eagles captain spent 11 years at Chelsea and won the 2012 UEFA Champions League final in Munich?',
        a: ['Victor Moses', 'John Mikel Obi', 'Kenneth Omeruo', 'Ola Aina'],
        correct: 1,
        why: 'John Mikel Obi delivered a masterclass in midfield in the 2012 Champions League final win over Bayern Munich.'
      },
      {
        q: 'Which Nigerian wing-back won the 2016–17 Premier League title with Chelsea under Antonio Conte?',
        a: ['Victor Moses', 'Alex Iwobi', 'Taiwo Awoniyi', 'Wilfred Ndidi'],
        correct: 0,
        why: 'Victor Moses excelled at right wing-back, playing 34 league matches in Chelsea’s 2016–17 title triumph.'
      }
    ]
  },
  {
    id: 'room-tems-ayra-rema-asake',
    slug: 'tems-vs-ayra-rema-vs-asake',
    category: 'artists',
    badgeLabel: '🌟 ARTISTS BANTER · NEW WAVE GIANTS',
    phase: 'LIVE BANTER',
    title: 'Tems & Ayra Starr vs Rema & Asake',
    subtitle: 'Global Leading Vibes & Sabi Girls vs Ravers & Mr Money With The Vibe',
    headlinePrompt: 'The new vanguard of Nigerian music is selling out arenas from O2 London to Madison Square Garden. Who owns your speakers?',
    receiptQuestion: 'THE RECEIPTS POLL: Whose live concert experience is #1 on your bucket list?',
    cutoffLabel: 'Open Fan Poll · Instant Receipts',
    sides: [
      {
        id: 'side-queens',
        name: 'Tems & Ayra Starr',
        fanbaseName: 'Leading Vibe & Mobstarrs',
        shortCode: 'QUEENS',
        emoji: '👑',
        color: '#6d567e',
        bg: '#e1d9e9',
        supporters: 610,
        votes: 520,
        tagline: 'Grammy & Oscar stages, celestial vocals & unstoppable confidence'
      },
      {
        id: 'side-kings',
        name: 'Rema & Asake',
        fanbaseName: 'Ravers & Mr Money Gang',
        shortCode: 'KINGS',
        emoji: '🔥',
        color: '#83543a',
        bg: '#edcebc',
        supporters: 625,
        votes: 535,
        tagline: 'Billion-stream records, Fuji-Amapiano fusion & futuristic stagecraft'
      }
    ],
    banterOfTheMatch: [
      {
        sideId: 'side-queens',
        sideLabel: 'Leading Vibe & Mobstarrs',
        author: 'Ngozi E. · Jabi',
        quote: 'Tems writing Oscar-nominated songs and winning Grammys while Ayra Starr commands festival stages worldwide—the women are leading From The Front!',
        cheers: 47
      },
      {
        sideId: 'side-kings',
        sideLabel: 'Ravers & Mr Money Gang',
        author: 'Tariq S. · Kubwa',
        quote: 'Asake turning Fuji choirs into global arena anthems while Rema’s HEIS album reinvented the whole sound—unreal creativity!',
        cheers: 46
      }
    ],
    comments: [
      {
        id: 'bc-nw-1',
        author: 'Ngozi E.',
        sideId: 'side-queens',
        sideLabel: 'Leading Vibe & Mobstarrs',
        sideBg: '#e1d9e9',
        sideColor: '#6d567e',
        text: 'Born in the Wild and The Year I Turned 21 stayed on repeat all year.',
        timeLabel: '9m ago',
        cheers: 22,
        reps: 14,
        replies: []
      }
    ],
    quizQuestions: [
      {
        q: 'Tems won the 2025 Grammy Award for Best African Music Performance for which hit song?',
        a: ['Love Me JeJe', 'Free Mind', 'Me & U', 'Damages'],
        correct: 0,
        why: '"Love Me JeJe" won Best African Music Performance at the Grammy Awards.'
      },
      {
        q: 'Rema’s global smash hit "Calm Down" surpassed 1 billion streams on Spotify featuring which pop star on the remix?',
        a: ['Selena Gomez', 'Dua Lipa', 'Rihanna', 'Camila Cabello'],
        correct: 0,
        why: 'The "Calm Down" remix with Selena Gomez became one of the most-streamed songs in history.'
      }
    ]
  },
  {
    id: 'room-nollywood-royalty',
    slug: 'funke-vs-toyin-sabinus-vs-macaroni',
    category: 'artists',
    badgeLabel: '🎬 CELEBRITIES & SCREEN · NOLLYWOOD & SKITS',
    phase: 'RECEIPTS OUT',
    title: 'Funke Akindele & Toyin Abraham vs Sabinus & Mr Macaroni',
    subtitle: 'Cinema Blockbuster Queens vs Digital Comedy Titans — Celebrate Your Screen Fav!',
    headlinePrompt: 'Who has given Nigerians the most iconic lines, memes, and unforgettable cinema nights?',
    receiptQuestion: 'THE RECEIPTS POLL: Cinema Box Office Night Out vs Daily Skit Therapy — what wins your weekend?',
    cutoffLabel: 'Receipts Live · Vote to Update Split',
    sides: [
      {
        id: 'side-cinema',
        name: 'Funke Akindele & Toyin Abraham',
        fanbaseName: 'Box Office Royalty',
        shortCode: 'CINEMA',
        emoji: '🍿',
        color: '#8c6b2c',
        bg: '#f5e3ab',
        supporters: 490,
        votes: 420,
        tagline: 'Billion-naira cinema attendance & unforgettable family drama'
      },
      {
        id: 'side-skits',
        name: 'Sabinus, Macaroni & Taaooma',
        fanbaseName: 'Comedy Skit Icons',
        shortCode: 'SKITS',
        emoji: '😂',
        color: '#183e35',
        bg: '#dce7cd',
        supporters: 510,
        votes: 435,
        tagline: 'Instant daily laughter, viral catchphrases & cultural satire'
      }
    ],
    banterOfTheMatch: [
      {
        sideId: 'side-cinema',
        sideLabel: 'Box Office Royalty',
        author: 'Funmi O. · Victoria Island',
        quote: 'Seeing a packed cinema in Lagos or Abuja cheering and laughing together during a Funke Akindele or Toyin Abraham holiday movie is unmatched!',
        cheers: 39
      },
      {
        sideId: 'side-skits',
        sideLabel: 'Comedy Skit Icons',
        author: 'Musa Y. · Garki',
        quote: 'After a long day in traffic, one 2-minute Sabinus or Taaooma video resets your mood immediately!',
        cheers: 42
      }
    ],
    comments: [],
    quizQuestions: [
      {
        q: 'Which Funke Akindele film became the first Nollywood movie to gross over ₦1 Billion at the Nigerian box office?',
        a: ['Omo Ghetto: The Saga', 'A Tribe Called Judah', 'Battle on Buka Street', 'Everybody Loves Jenifa'],
        correct: 0,
        why: 'A Tribe Called Judah made history as the first Nollywood title to cross the ₦1 Billion mark at the box office.'
      }
    ]
  }
];

// ============================================================================
// 3. COMMUNITY & INTER-CITY DERBIES + OPEN CHALLENGES
// ============================================================================

export const INITIAL_DERBY_FIXTURES: DerbyFixture[] = [
  {
    id: 'derby-abuja-vs-lagos',
    slug: 'abuja-vs-lagos-flagship',
    edition: 'inter-city',
    editionLabel: '🏆 INTER-CITY LEAGUE · FLAGSHIP DERBY',
    format: 'derby',
    status: 'open',
    title: 'Abuja vs Lagos: The Flagship Inter-City Derby',
    subtitle: 'Capital composure meets Eko energy. Lock your city, play the balanced 5-question round, and push your Side’s accuracy!',
    deadlineLabel: 'Closes Sunday 22:00 WAT · Min. 25 players/city',
    minTurnoutPerSide: 25,
    sides: [
      {
        id: 'city-lagos',
        name: 'Team Lagos (Eko)',
        city: 'lagos',
        emoji: '🌊',
        color: '#8c6b2c',
        bg: '#f5e3ab',
        eligibleTurnout: 74,
        totalCorrect: 316,
        totalQuestionsAttempted: 370,
        cheers: 142
      },
      {
        id: 'city-abuja',
        name: 'Team Abuja (Capital)',
        city: 'abuja',
        emoji: '⛰️',
        color: '#183e35',
        bg: '#dce7cd',
        eligibleTurnout: 68,
        totalCorrect: 289,
        totalQuestionsAttempted: 340,
        cheers: 135
      }
    ],
    questions: [
      {
        q: 'How many administrative divisions make up Lagos State’s IBILE structure, compared to the FCT’s six area councils?',
        a: ['5 divisions in Lagos & 6 area councils in the FCT', '6 in Lagos & 5 in the FCT', '20 in Lagos & 12 in the FCT', '4 in each'],
        correct: 0,
        why: 'Lagos State has 5 IBILE administrative divisions (Ikeja, Badagry, Ikorodu, Lagos Island, Epe) while the FCT has 6 area councils.'
      },
      {
        q: 'Which organisation manages both the Lekki Conservation Centre in Lagos and the Abuja Conservation Centre in Guzape?',
        a: ['Nigerian Conservation Foundation (NCF)', 'LAMATA', 'Federal Ministry of Works', 'National Theatre Board'],
        correct: 0,
        why: 'The Nigerian Conservation Foundation (NCF) stewards both conservation centres.'
      },
      {
        q: 'In which year was the Federal Capital Territory (Abuja) formally established by decree?',
        a: ['1976', '1960', '1999', '2004'],
        correct: 0,
        why: 'The FCT was established in 1976, before the formal relocation of the seat of government in 1991.'
      },
      {
        q: 'The Lagos Rail Mass Transit Blue Line Phase 1 corridor connects Marina with which terminal stop?',
        a: ['Mile 2', 'Epe', 'Ikorodu', 'Murtala Muhammed Airport'],
        correct: 0,
        why: 'LAMATA’s Blue Line Phase 1 runs along the Marina–Mile 2 corridor.'
      },
      {
        q: 'Which of these pairs accurately matches a famous green/cultural landmark to its city?',
        a: ['Millennium Park (Abuja) & National Theatre Iganmu (Lagos)', 'Zuma Rock (Lagos) & Tarkwa Bay (Abuja)', 'Olumo Rock (Abuja) & Yankari (Lagos)', 'Aso Rock (Lagos) & Third Mainland Bridge (Abuja)'],
        correct: 0,
        why: 'Millennium Park is a centerpiece of Abuja, while the National Theatre at Iganmu is an iconic Lagos landmark.'
      }
    ]
  },
  {
    id: 'derby-yaba-vs-surulere',
    slug: 'yaba-vs-surulere',
    edition: 'lagos',
    editionLabel: '🌊 LAGOS COMMUNITIES · MAINLAND DERBY',
    format: 'derby',
    status: 'open',
    title: 'Yaba vs Surulere: Mainland Classic Derby',
    subtitle: 'Tech & campus corridors of Yaba face the sports, cinema & cultural heart of Surulere.',
    deadlineLabel: 'Open Now · Min. 15 players/side',
    minTurnoutPerSide: 15,
    sides: [
      {
        id: 'side-surulere',
        name: 'Surulere Side',
        city: 'lagos',
        emoji: '🎬',
        color: '#83543a',
        bg: '#edcebc',
        eligibleTurnout: 42,
        totalCorrect: 181,
        totalQuestionsAttempted: 210,
        cheers: 88
      },
      {
        id: 'side-yaba',
        name: 'Yaba Side',
        city: 'lagos',
        emoji: '💻',
        color: '#8c6b2c',
        bg: '#f5e3ab',
        eligibleTurnout: 39,
        totalCorrect: 169,
        totalQuestionsAttempted: 195,
        cheers: 84
      }
    ],
    questions: [
      {
        q: 'Which famous stadium cluster and sports city is a landmark of Surulere?',
        a: ['National Stadium Surulere & Teslim Balogun Stadium', 'Godswill Akpabio Stadium', 'Moshood Abiola Stadium', 'Enyimba International Stadium'],
        correct: 0,
        why: 'Surulere is famously home to both the National Stadium and Teslim Balogun Stadium across the road from each other.'
      },
      {
        q: 'Yaba is widely known as Nigeria’s "Yabacon Valley" because it hosts:',
        a: ['A dense cluster of tech startups, hubs and higher institutions like UNILAG & YabaTech', 'An international seaport', 'A wildlife game reserve', 'A gold mining quarry'],
        correct: 0,
        why: 'Yaba connects major higher institutions with technology hubs and creative spaces.'
      },
      {
        q: 'Which Blue Line stop sits closest to the Surulere / Mainland link corridor?',
        a: ['National Theatre / Iganmu', 'Epe', 'Lekki Phase 1', 'Badagry Roundabout'],
        correct: 0,
        why: 'National Theatre and Iganmu serve the immediate mainland bridgehead near Surulere and Yaba.'
      }
    ]
  },
  {
    id: 'derby-gwarinpa-vs-wuse',
    slug: 'gwarinpa-vs-wuse',
    edition: 'abuja',
    editionLabel: '⛰️ ABUJA COMMUNITIES · CAPITAL DERBY',
    format: 'derby',
    status: 'open',
    title: 'Gwarinpa vs Wuse: Capital Heavyweights Derby',
    subtitle: 'West Africa’s famous residential estate takes on the bustling commercial & social hub of Wuse.',
    deadlineLabel: 'Open Now · Min. 15 players/side',
    minTurnoutPerSide: 15,
    sides: [
      {
        id: 'side-wuse',
        name: 'Wuse Side',
        city: 'abuja',
        emoji: '✨',
        color: '#183e35',
        bg: '#dce7cd',
        eligibleTurnout: 38,
        totalCorrect: 164,
        totalQuestionsAttempted: 190,
        cheers: 79
      },
      {
        id: 'side-gwarinpa',
        name: 'Gwarinpa Side',
        city: 'abuja',
        emoji: '🏘️',
        color: '#6d567e',
        bg: '#e1d9e9',
        eligibleTurnout: 36,
        totalCorrect: 156,
        totalQuestionsAttempted: 180,
        cheers: 76
      }
    ],
    questions: [
      {
        q: 'Both Wuse and Gwarinpa fall within which of the six FCT Area Councils?',
        a: ['Abuja Municipal Area Council (AMAC)', 'Bwari Area Council', 'Kuje Area Council', 'Abaji Area Council'],
        correct: 0,
        why: 'Wuse and Gwarinpa are located within the Abuja Municipal Area Council (AMAC).'
      },
      {
        q: 'Gwarinpa is famously numbered by avenues (1st Avenue, 2nd Avenue, 3rd Avenue, etc.). What is it renowned for?',
        a: ['Being one of the largest planned housing estates in West Africa', 'Having an international ocean port', 'Being the capital of Kaduna State', 'Hosting the Blue Line train'],
        correct: 0,
        why: 'Gwarinpa Housing Estate is celebrated for its scale and self-contained neighbourhood avenues.'
      },
      {
        q: 'Wuse is divided into numbered zones (Wuse Zone 1–7) as well as:',
        a: ['Wuse II (Wuse 2)', 'Wuse Island', 'Wuse Lagoon', 'Wuse Peninsula'],
        correct: 0,
        why: 'Wuse comprises Wuse Zones 1 to 7 and the vibrant district of Wuse II.'
      }
    ]
  },
  {
    id: 'derby-lekki-vs-vi',
    slug: 'lekki-vs-victoria-island',
    edition: 'lagos',
    editionLabel: '🌊 LAGOS COMMUNITIES · ISLAND SHOWDOWN',
    format: 'derby',
    status: 'open',
    title: 'Lekki vs Victoria Island: Island Corridor Derby',
    subtitle: 'Canopy walkways & art galleries of Lekki face the cultural, beach & business hub of VI.',
    deadlineLabel: 'Open Now · Min. 15 players/side',
    minTurnoutPerSide: 15,
    sides: [
      {
        id: 'side-lekki',
        name: 'Lekki Side',
        city: 'lagos',
        emoji: '🌴',
        color: '#2d5a3c',
        bg: '#dce7cd',
        eligibleTurnout: 34,
        totalCorrect: 145,
        totalQuestionsAttempted: 170,
        cheers: 67
      },
      {
        id: 'side-vi',
        name: 'Victoria Island Side',
        city: 'lagos',
        emoji: '🌆',
        color: '#2b547e',
        bg: '#d8e6f3',
        eligibleTurnout: 31,
        totalCorrect: 131,
        totalQuestionsAttempted: 155,
        cheers: 62
      }
    ],
    questions: [
      {
        q: 'Lekki Conservation Centre is famous for having one of Africa’s longest:',
        a: ['Canopy walkways', 'Underground railway tunnels', 'Cable car ski lifts', 'Suspension road bridges'],
        correct: 0,
        why: 'NCF’s Lekki Conservation Centre features a celebrated elevated canopy walkway over the forest.'
      },
      {
        q: 'Victoria Island and Lekki are connected by a famous cable-stayed bridge linking Ikoyi and Lekki Phase 1. What is it commonly called?',
        a: ['Lekki–Ikoyi Link Bridge', 'Carter Bridge', 'Eko Bridge', 'Niger Bridge'],
        correct: 0,
        why: 'The Lekki–Ikoyi Link Bridge is an iconic cable-stayed landmark connecting the island corridors.'
      },
      {
        q: 'Under Lagos State’s five IBILE divisions, Victoria Island and Lekki historically align with the:',
        a: ['Lagos Island / Eti-Osa & Epe corridor divisions', 'Badagry division', 'Ikorodu division', 'Agege division'],
        correct: 0,
        why: 'The Island and Lekki peninsula stretch across the Lagos Island (Eko) and Epe corridor divisions.'
      }
    ]
  },
  {
    id: 'derby-usa-houston-vs-atlanta',
    slug: 'houston-vs-atlanta-usa-derby',
    edition: 'inter-city',
    editionLabel: '🇺🇸 USA DIASPORA LEAGUE · TEXAS VS GEORGIA',
    countryCode: 'USA',
    format: 'derby',
    status: 'open',
    title: 'Houston (H-Town) vs Atlanta (ATL): USA Hub Derby',
    subtitle: 'Southwest Houston & Sugar Land take on Buckhead & Metro Atlanta in the flagship US diaspora cultural & roots showdown!',
    deadlineLabel: 'Open Now · Min. 15 players/side',
    minTurnoutPerSide: 15,
    sides: [
      {
        id: 'side-usa-houston',
        name: 'Team Houston (TX)',
        city: 'lagos',
        emoji: '🤠',
        color: '#83543a',
        bg: '#edcebc',
        eligibleTurnout: 48,
        totalCorrect: 208,
        totalQuestionsAttempted: 240,
        cheers: 112
      },
      {
        id: 'side-usa-atlanta',
        name: 'Team Atlanta (GA)',
        city: 'abuja',
        emoji: '🍑',
        color: '#183e35',
        bg: '#dce7cd',
        eligibleTurnout: 45,
        totalCorrect: 194,
        totalQuestionsAttempted: 225,
        cheers: 106
      }
    ],
    questions: [
      {
        q: 'Which two US metropolitan hubs are widely celebrated for hosting some of the largest African & Nigerian cultural corridors in North America?',
        a: ['Houston (Texas) & Atlanta (Georgia)', 'Anchorage & Boise', 'Fargo & Cheyenne', 'Helena & Pierre'],
        correct: 0,
        why: 'Greater Houston and Metro Atlanta are two of the most vibrant African diaspora cultural, culinary, and professional hubs in the United States.'
      },
      {
        q: 'When Afrobeats superstars sell out US arenas, which iconic venues in Houston and Atlanta are top stops?',
        a: ['Toyota Center (Houston) & State Farm Arena (Atlanta)', 'Wembley & O2 Arena', 'Scotiabank Arena & Bell Centre', 'Teslim Balogun & Moshood Abiola'],
        correct: 0,
        why: 'Toyota Center in Houston and State Farm Arena in Atlanta have hosted historic sold-out Afrobeats tours.'
      },
      {
        q: 'In Rep Your Side, how does a supporter in Houston, Atlanta, DMV, or New York contribute to their Side?',
        a: ['By selecting USA + their hub, locking a Side in derbies, and repping both their diaspora hub and home roots', 'Only by mailing a physical postcard', 'Scores are decided by weather forecasts', 'By spectator mode only'],
        correct: 0,
        why: 'Every player can select their Country & Hub while repping their Side across global and home fixtures.'
      }
    ]
  },
  {
    id: 'derby-uk-south-vs-north-london',
    slug: 'south-london-vs-north-east-london',
    edition: 'inter-city',
    editionLabel: '🇬🇧 UK DIASPORA LEAGUE · LONDON DERBY',
    countryCode: 'UK',
    format: 'derby',
    status: 'open',
    title: 'South London vs North & East London: UK Derby',
    subtitle: 'Peckham, Greenwich & Lewisham face off against Tottenham, Hackney, Barking & Stratford!',
    deadlineLabel: 'Open Now · Min. 15 players/side',
    minTurnoutPerSide: 15,
    sides: [
      {
        id: 'side-uk-south-london',
        name: 'South London Side',
        city: 'lagos',
        emoji: '🦁',
        color: '#2b547e',
        bg: '#d8e6f3',
        eligibleTurnout: 52,
        totalCorrect: 226,
        totalQuestionsAttempted: 260,
        cheers: 119
      },
      {
        id: 'side-uk-north-east-london',
        name: 'North & East London Side',
        city: 'abuja',
        emoji: '⚡',
        color: '#6d567e',
        bg: '#e1d9e9',
        eligibleTurnout: 49,
        totalCorrect: 211,
        totalQuestionsAttempted: 245,
        cheers: 114
      }
    ],
    questions: [
      {
        q: 'Which South London neighbourhood is internationally famous as "Little Lagos" for its vibrant Nigerian markets, suya spots, and culture?',
        a: ['Peckham (Rye Lane)', 'Mayfair', 'Cotswolds', 'St Andrews'],
        correct: 0,
        why: 'Peckham in South London is globally renowned as a cultural heartland of the British-Nigerian community.'
      },
      {
        q: 'Which iconic London peninsula venue has Burna Boy, Wizkid, Davido, and Asake famously headlined to sold-out UK crowds?',
        a: ['The O2 Arena (Greenwich) & London Stadium (Stratford)', 'Crucible Theatre Sheffield', 'Stonehenge', 'Eden Project'],
        correct: 0,
        why: 'The O2 Arena and London Stadium in Stratford have hosted landmark Afrobeats concerts in the UK.'
      },
      {
        q: 'Which Nigerian-heritage football stars grew up or starred across London clubs like Arsenal, Chelsea, and Crystal Palace?',
        a: ['Bukayo Saka, Eberechi Eze, Noni Madueke & Alex Iwobi', 'Lionel Messi & Neymar', 'Luka Modric & Toni Kroos', 'Son Heung-min & Kim Min-jae'],
        correct: 0,
        why: 'London clubs have been a major proving ground for stars with strong Nigerian roots.'
      }
    ]
  },
  {
    id: 'derby-canada-gta-vs-calgary',
    slug: 'toronto-gta-vs-calgary-canada-derby',
    edition: 'inter-city',
    editionLabel: '🇨🇦 CANADA DIASPORA LEAGUE · ONTARIO VS ALBERTA',
    countryCode: 'CANADA',
    format: 'derby',
    status: 'open',
    title: 'Toronto (GTA / Brampton) vs Calgary & Edmonton: Canada Derby',
    subtitle: 'Mississauga, Brampton & Scarborough rep Ontario against the booming Alberta crew in Calgary & Edmonton!',
    deadlineLabel: 'Open Now · Min. 15 players/side',
    minTurnoutPerSide: 15,
    sides: [
      {
        id: 'side-ca-gta',
        name: 'Toronto / GTA Side',
        city: 'lagos',
        emoji: '🍁',
        color: '#8c6b2c',
        bg: '#f5e3ab',
        eligibleTurnout: 41,
        totalCorrect: 178,
        totalQuestionsAttempted: 205,
        cheers: 94
      },
      {
        id: 'side-ca-alberta',
        name: 'Calgary & Edmonton Side',
        city: 'abuja',
        emoji: '🏔️',
        color: '#183e35',
        bg: '#dce7cd',
        eligibleTurnout: 37,
        totalCorrect: 161,
        totalQuestionsAttempted: 185,
        cheers: 89
      }
    ],
    questions: [
      {
        q: 'In the Greater Toronto Area (GTA), which cities are famous hubs for Nigerian-Canadian families, jollof spots, and community festivals?',
        a: ['Toronto, Brampton, Mississauga & Vaughan', 'Whitehorse & Iqaluit', 'Dawson City & Churchill', 'Alert & Banff'],
        correct: 0,
        why: 'Toronto, Brampton, Mississauga, and surrounding GTA municipalities host thriving Nigerian-Canadian communities.'
      },
      {
        q: 'Which Canadian province is home to both Calgary and Edmonton, two of the fastest-growing diaspora professional hubs?',
        a: ['Alberta', 'Prince Edward Island', 'Nova Scotia', 'Yukon'],
        correct: 0,
        why: 'Calgary and Edmonton in Alberta have grown into major tech, energy, and cultural hubs for the community.'
      },
      {
        q: 'Which Toronto arena has hosted sold-out Canadian stops for Burna Boy, Davido, Rema, and Asake?',
        a: ['Scotiabank Arena', 'BC Place', 'Olympic Stadium Montreal', 'Saddledome'],
        correct: 0,
        why: 'Scotiabank Arena in downtown Toronto is a premier stage for global Afrobeats tours in Canada.'
      }
    ]
  }
];

// ============================================================================
// 4. NATIONWIDE CAMPUS & SECONDARY SCHOOL ALUMNI DIRECTORY
// ============================================================================

export const INITIAL_INSTITUTIONS: InstitutionSide[] = [
  // Campus Edition (Higher Institutions)
  {
    id: 'camp-unilag',
    name: 'University of Lagos (UNILAG)',
    shortName: 'UNILAG · Akoka',
    kind: 'campus',
    categoryLabel: 'Federal University',
    state: 'Lagos',
    city: 'Akoka, Yaba',
    mottoOrTag: 'In Deed and in Truth · Akokites',
    emoji: '🎓',
    verifiedMembers: 312,
    weeklyScorePct: 88.4,
    totalXp: 14200,
    activeSetOrChapter: 'Lagoon Front Campus Hub'
  },
  {
    id: 'camp-ui',
    name: 'University of Ibadan (UI)',
    shortName: 'UI · First & Best',
    kind: 'campus',
    categoryLabel: 'Federal University',
    state: 'Oyo',
    city: 'Ibadan',
    mottoOrTag: 'Recte Sapere Fons · Great Mellanbites & Zikites',
    emoji: '🏛️',
    verifiedMembers: 289,
    weeklyScorePct: 89.1,
    totalXp: 13850,
    activeSetOrChapter: 'Premier Campus League'
  },
  {
    id: 'camp-oau',
    name: 'Obafemi Awolowo University (OAU)',
    shortName: 'OAU · Great Ife',
    kind: 'campus',
    categoryLabel: 'Federal University',
    state: 'Osun',
    city: 'Ile-Ife',
    mottoOrTag: 'For Learning and Culture · Great Ife!',
    emoji: '🦁',
    verifiedMembers: 276,
    weeklyScorePct: 87.6,
    totalXp: 13100,
    activeSetOrChapter: 'Oduduwa Amphitheatre Hub'
  },
  {
    id: 'camp-abu',
    name: 'Ahmadu Bello University (ABU)',
    shortName: 'ABU · Zaria',
    kind: 'campus',
    categoryLabel: 'Federal University',
    state: 'Kaduna',
    city: 'Samaru, Zaria',
    mottoOrTag: 'Naturally Ahead · Great Abusites',
    emoji: '🐎',
    verifiedMembers: 264,
    weeklyScorePct: 86.9,
    totalXp: 12640,
    activeSetOrChapter: 'Samaru & Kongo Chapters'
  },
  {
    id: 'camp-covenant',
    name: 'Covenant University (CU)',
    shortName: 'Covenant · Ota',
    kind: 'campus',
    categoryLabel: 'Private University',
    state: 'Ogun',
    city: 'Canaanland, Ota',
    mottoOrTag: 'Raising a New Generation of Leaders · Eagles',
    emoji: '🦅',
    verifiedMembers: 245,
    weeklyScorePct: 88.0,
    totalXp: 11900,
    activeSetOrChapter: 'Hebron Eagles Network'
  },
  {
    id: 'camp-uniben',
    name: 'University of Benin (UNIBEN)',
    shortName: 'UNIBEN · Ugbowo',
    kind: 'campus',
    categoryLabel: 'Federal University',
    state: 'Edo',
    city: 'Benin City',
    mottoOrTag: 'Knowledge for Service · Unibest',
    emoji: '🐆',
    verifiedMembers: 238,
    weeklyScorePct: 86.2,
    totalXp: 11420,
    activeSetOrChapter: 'Ugbowo & Ekehuan Hub'
  },
  {
    id: 'camp-unn',
    name: 'University of Nigeria, Nsukka (UNN)',
    shortName: 'UNN · Lions & Lionesses',
    kind: 'campus',
    categoryLabel: 'Federal University',
    state: 'Enugu',
    city: 'Nsukka / Enugu',
    mottoOrTag: 'To Restore the Dignity of Man · The Den',
    emoji: '🦁',
    verifiedMembers: 231,
    weeklyScorePct: 85.8,
    totalXp: 11100,
    activeSetOrChapter: 'Nsukka & Enugu Campus'
  },
  {
    id: 'camp-uniabuja',
    name: 'University of Abuja (UniAbuja)',
    shortName: 'UniAbuja · Gwagwalada',
    kind: 'campus',
    categoryLabel: 'Federal University',
    state: 'FCT',
    city: 'Gwagwalada, Abuja',
    mottoOrTag: 'For Unity and Scholarship · Capital Varsity',
    emoji: '⛰️',
    verifiedMembers: 215,
    weeklyScorePct: 85.4,
    totalXp: 10450,
    activeSetOrChapter: 'Main Campus Airport Road'
  },

  // Secondary School Alumni Edition
  {
    id: 'alum-kings',
    name: 'King’s College, Lagos (KC)',
    shortName: 'King’s College · Old Boys',
    kind: 'alumni',
    categoryLabel: 'Federal / Heritage School (Est. 1909)',
    state: 'Lagos',
    city: 'Tafawa Balewa Sq / Victoria Island',
    mottoOrTag: 'Floreat Collegium · KCOB Association',
    emoji: '🛡️',
    verifiedMembers: 228,
    weeklyScorePct: 89.5,
    totalXp: 11800,
    activeSetOrChapter: 'All Sets & Lagos/Abuja Chapters'
  },
  {
    id: 'alum-queens',
    name: 'Queen’s College, Lagos (QC)',
    shortName: 'Queen’s College · Old Girls',
    kind: 'alumni',
    categoryLabel: 'Federal / Heritage School (Est. 1927)',
    state: 'Lagos',
    city: 'Yaba, Lagos',
    mottoOrTag: 'Pass On The Torch · QCOGA',
    emoji: '🔦',
    verifiedMembers: 234,
    weeklyScorePct: 90.2,
    totalXp: 12150,
    activeSetOrChapter: 'Pass On The Torch Sets'
  },
  {
    id: 'alum-loyola',
    name: 'Loyola Jesuit College, Abuja (LJC)',
    shortName: 'Loyola Jesuit · ALJC',
    kind: 'alumni',
    categoryLabel: 'Mission / Boarding Alumni',
    state: 'FCT',
    city: 'Karshi / Gidan Mangoro, Abuja',
    mottoOrTag: 'Service of God and Others · Men & Women for Others',
    emoji: '⚜️',
    verifiedMembers: 198,
    weeklyScorePct: 91.0,
    totalXp: 10900,
    activeSetOrChapter: 'National & Diaspora Alumni'
  },
  {
    id: 'alum-fgc-ijanikin',
    name: 'Federal Government College, Lagos (Ijanikin)',
    shortName: 'FGC Lagos · FEGOCOLOSA',
    kind: 'alumni',
    categoryLabel: 'Unity School Alumni',
    state: 'Lagos',
    city: 'Ijanikin, Lagos',
    mottoOrTag: 'Pro Unitate · Unity Old Students',
    emoji: '🤝',
    verifiedMembers: 186,
    weeklyScorePct: 86.7,
    totalXp: 9840,
    activeSetOrChapter: 'FEGOCOLOSA National Chapter'
  },
  {
    id: 'alum-fgc-kwali',
    name: 'Federal Government College, Kwali',
    shortName: 'FGC Kwali · Old Students',
    kind: 'alumni',
    categoryLabel: 'Unity School Alumni',
    state: 'FCT',
    city: 'Kwali, Abuja',
    mottoOrTag: 'Pro Unitate · Sheda & Kwali Sets',
    emoji: '🏛️',
    verifiedMembers: 174,
    weeklyScorePct: 86.1,
    totalXp: 9320,
    activeSetOrChapter: 'Abuja & National Chapters'
  },
  {
    id: 'alum-barewa',
    name: 'Barewa College, Zaria',
    shortName: 'Barewa · BOBA',
    kind: 'alumni',
    categoryLabel: 'Heritage School (Est. 1921)',
    state: 'Kaduna',
    city: 'Zaria',
    mottoOrTag: 'Man Jadda Wajada (He Who Strives Shall Succeed)',
    emoji: '📜',
    verifiedMembers: 169,
    weeklyScorePct: 87.3,
    totalXp: 9100,
    activeSetOrChapter: 'BOBA National Chapter'
  },
  {
    id: 'alum-command',
    name: 'Command Secondary School (Ipaja / Suleja / Kaduna)',
    shortName: 'Command Alumni · Ex-Commandos',
    kind: 'alumni',
    categoryLabel: 'Command Schools Network',
    state: 'Nationwide',
    city: 'Lagos / Abuja / Kaduna / Ibadan',
    mottoOrTag: 'Discipline and Knowledge · Ex-Commandos',
    emoji: '⭐',
    verifiedMembers: 210,
    weeklyScorePct: 87.8,
    totalXp: 10600,
    activeSetOrChapter: 'Combined Command Alumni Sets'
  },
  // Global & Diaspora Chapters (USA, Canada, UK, Others)
  {
    id: 'alum-usa-unilag-na',
    name: 'UNILAG Alumni North America (USA Chapter)',
    shortName: 'UNILAG USA · Houston / Atlanta / DMV',
    kind: 'alumni',
    categoryLabel: '🇺🇸 USA Diaspora Chapter',
    state: 'USA (TX / GA / DMV)',
    city: 'Houston, Atlanta & Washington DC',
    countryCode: 'USA',
    mottoOrTag: 'Akokites in the United States · In Deed and in Truth',
    emoji: '🇺🇸',
    verifiedMembers: 192,
    weeklyScorePct: 89.4,
    totalXp: 11250,
    activeSetOrChapter: 'Houston, Atlanta, DMV & NY Chapters'
  },
  {
    id: 'alum-uk-kcob-qcoga',
    name: 'King’s & Queen’s College UK Chapter (London & Manchester)',
    shortName: 'KC/QC UK · London Hub',
    kind: 'alumni',
    categoryLabel: '🇬🇧 UK Diaspora Chapter',
    state: 'United Kingdom',
    city: 'London, Manchester & Birmingham',
    countryCode: 'UK',
    mottoOrTag: 'Floreat Collegium & Pass On The Torch · UK Branch',
    emoji: '🇬🇧',
    verifiedMembers: 184,
    weeklyScorePct: 90.1,
    totalXp: 10980,
    activeSetOrChapter: 'London Reunion & UK Sets'
  },
  {
    id: 'alum-canada-feghosa',
    name: 'Unity Schools Alumni Canada (USAC · GTA & Alberta)',
    shortName: 'Unity Alumni Canada · GTA / Calgary',
    kind: 'alumni',
    categoryLabel: '🇨🇦 Canada Diaspora Chapter',
    state: 'Canada (ON / AB)',
    city: 'Toronto (GTA), Brampton & Calgary',
    countryCode: 'CANADA',
    mottoOrTag: 'Pro Unitate · Canadian Chapters',
    emoji: '🇨🇦',
    verifiedMembers: 168,
    weeklyScorePct: 88.7,
    totalXp: 9950,
    activeSetOrChapter: 'Ontario & Alberta Chapters'
  },
  {
    id: 'camp-global-scholars',
    name: 'Global Nigerian & Diaspora Student Network (Europe, UAE & SA)',
    shortName: 'Global Scholars · Europe / UAE / SA',
    kind: 'campus',
    categoryLabel: '🌍 Global / Others Campus Network',
    state: 'Global Diaspora',
    city: 'Dublin, Berlin, Dubai & Johannesburg',
    countryCode: 'OTHERS',
    mottoOrTag: 'Repping Home Across Every Timezone',
    emoji: '🌍',
    verifiedMembers: 154,
    weeklyScorePct: 87.2,
    totalXp: 9120,
    activeSetOrChapter: 'EU, Middle East & Pan-African Hubs'
  }
];

