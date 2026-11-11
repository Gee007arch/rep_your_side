export type CountryCode = 'USA' | 'CANADA' | 'UK' | 'NIGERIA' | 'OTHERS';

export interface CountryConfig {
  code: CountryCode;
  name: string;
  shortLabel: string;
  flag: string;
  tagline: string;
  hubs: string[];
  featuredDerbyTitle: string;
}

export interface UserProfileAccount {
  id: string;
  fullName: string;
  nickname: string;
  email: string;
  country: CountryCode;
  customCountryName?: string;
  hubOrArea: string;
  cityEdition: 'lagos' | 'abuja';
  favFootballerOrClub: string;
  favArtistOrCeleb: string;
  campusOrAlmaMater: string;
  bioNote: string;
  createdAt: string;
  isVerified: boolean;
}

export const COUNTRIES: Record<CountryCode, CountryConfig> = {
  USA: {
    code: 'USA',
    name: 'United States (USA)',
    shortLabel: 'USA',
    flag: '🇺🇸',
    tagline: 'From Houston & Atlanta to NY, DMV & LA — repping the Stateside energy.',
    hubs: [
      'Houston, TX',
      'Atlanta, GA',
      'New York / NJ',
      'DMV (Maryland / DC / VA)',
      'Dallas–Fort Worth, TX',
      'Chicago, IL',
      'Los Angeles, CA',
      'Boston, MA'
    ],
    featuredDerbyTitle: 'Houston vs Atlanta: Stateside Rep Derby'
  },
  CANADA: {
    code: 'CANADA',
    name: 'Canada',
    shortLabel: 'Canada',
    flag: '🇨🇦',
    tagline: 'From the GTA & Brampton to Calgary, Ottawa & Vancouver.',
    hubs: [
      'Toronto (GTA), ON',
      'Brampton / Mississauga, ON',
      'Calgary, AB',
      'Edmonton, AB',
      'Ottawa, ON',
      'Vancouver, BC',
      'Montreal, QC',
      'Winnipeg, MB'
    ],
    featuredDerbyTitle: 'Toronto (GTA) vs Calgary: Maple Derby'
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom (UK)',
    shortLabel: 'UK',
    flag: '🇬🇧',
    tagline: 'South London to Manchester, Birmingham & Leeds — UK massive.',
    hubs: [
      'South London (Peckham / Lewisham)',
      'North & East London',
      'Manchester',
      'Birmingham / West Midlands',
      'Leeds / Yorkshire',
      'Liverpool',
      'Glasgow / Edinburgh',
      'Bristol'
    ],
    featuredDerbyTitle: 'South London vs North/East London Derby'
  },
  NIGERIA: {
    code: 'NIGERIA',
    name: 'Nigeria',
    shortLabel: 'Nigeria',
    flag: '🇳🇬',
    tagline: 'Lagos, Abuja & all 36 States — home soil headquarters.',
    hubs: [
      'Yaba · Lagos',
      'Surulere · Lagos',
      'Lekki · Lagos',
      'Victoria Island · Lagos',
      'Ikeja · Lagos',
      'Wuse · Abuja',
      'Gwarinpa · Abuja',
      'Maitama · Abuja',
      'Jabi · Abuja',
      'Port Harcourt / Ibadan / Enugu / Kano'
    ],
    featuredDerbyTitle: 'Abuja vs Lagos: The Flagship Derby'
  },
  OTHERS: {
    code: 'OTHERS',
    name: 'Others (Global)',
    shortLabel: 'Others',
    flag: '🌍',
    tagline: 'Repping from Europe, Africa, Middle East, Asia & Australia.',
    hubs: [
      'Johannesburg / Cape Town (South Africa)',
      'Accra (Ghana)',
      'Dubai / Abu Dhabi (UAE)',
      'Dublin (Ireland)',
      'Berlin / Frankfurt (Germany)',
      'Paris (France)',
      'Sydney / Melbourne (Australia)',
      'Other Global City'
    ],
    featuredDerbyTitle: 'Global Citizens Open Challenge'
  }
};

export const MAIN_COUNTRY_LIST: CountryConfig[] = [
  COUNTRIES.USA,
  COUNTRIES.CANADA,
  COUNTRIES.UK,
  COUNTRIES.NIGERIA,
  COUNTRIES.OTHERS
];

export const AUTH_STORAGE_KEY = 'rys.v15.auth.v1';

export interface StoredAuthState {
  currentUser: UserProfileAccount | null;
  selectedCountry: CountryCode;
  registeredAccounts: (UserProfileAccount & { passwordHash: string })[];
}

const DEFAULT_SEEDED_ACCOUNTS: (UserProfileAccount & { passwordHash: string })[] = [
  {
    id: 'usr-demo-usa',
    fullName: 'Tolu Adeyemi',
    nickname: 'ToluHTX',
    email: 'tolu@example.com',
    passwordHash: 'demo123',
    country: 'USA',
    hubOrArea: 'Houston, TX',
    cityEdition: 'lagos',
    favFootballerOrClub: 'Victor Osimhen · Arsenal FC',
    favArtistOrCeleb: 'Burna Boy (Outsiders)',
    campusOrAlmaMater: 'UNILAG · Houston Alumni Chapter',
    bioNote: 'Repping Houston TX & Surulere roots!',
    createdAt: '2026-11-10',
    isVerified: true
  },
  {
    id: 'usr-demo-uk',
    fullName: 'Kemi Okafor',
    nickname: 'KemiLDN',
    email: 'kemi@example.com',
    passwordHash: 'demo123',
    country: 'UK',
    hubOrArea: 'South London (Peckham / Lewisham)',
    cityEdition: 'lagos',
    favFootballerOrClub: 'Bukayo Saka · Starboy FC',
    favArtistOrCeleb: 'Wizkid FC & Tems',
    campusOrAlmaMater: 'Queen’s College · UK Old Girls',
    bioNote: 'South London massive, Eko for show!',
    createdAt: '2026-11-10',
    isVerified: true
  },
  {
    id: 'usr-demo-ca',
    fullName: 'Chuka Nwosu',
    nickname: 'ChukaGTA',
    email: 'chuka@example.com',
    passwordHash: 'demo123',
    country: 'CANADA',
    hubOrArea: 'Toronto (GTA), ON',
    cityEdition: 'abuja',
    favFootballerOrClub: 'Ademola Lookman · Chelsea FC',
    favArtistOrCeleb: 'Davido (30BG)',
    campusOrAlmaMater: 'Loyola Jesuit · Canada Chapter',
    bioNote: 'GTA by way of Wuse II Abuja.',
    createdAt: '2026-11-10',
    isVerified: true
  }
];

export function loadAuthState(): StoredAuthState {
  if (typeof window === 'undefined') {
    return {
      currentUser: null,
      selectedCountry: 'USA',
      registeredAccounts: structuredClone(DEFAULT_SEEDED_ACCOUNTS)
    };
  }
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          currentUser: parsed.currentUser ?? null,
          selectedCountry: parsed.selectedCountry ?? 'USA',
          registeredAccounts:
            Array.isArray(parsed.registeredAccounts) && parsed.registeredAccounts.length > 0
              ? parsed.registeredAccounts
              : structuredClone(DEFAULT_SEEDED_ACCOUNTS)
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    currentUser: null,
    selectedCountry: 'USA',
    registeredAccounts: structuredClone(DEFAULT_SEEDED_ACCOUNTS)
  };
}

export function saveAuthState(state: StoredAuthState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

