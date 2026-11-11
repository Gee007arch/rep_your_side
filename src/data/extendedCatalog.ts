import type { Place, PulseEntry } from '../domain/types';

export const EXTENDED_PLACES: Place[] = [
  // Additional Lagos Places
  {
    id: 'nike-art',
    city: 'lagos',
    area: 'Lekki',
    category: 'Culture',
    title: 'Four floors of textile heritage and living art.',
    name: 'Nike Art Gallery & Cultural Centre',
    art: 'craft',
    desc: 'Explore thousands of contemporary and traditional Nigerian artworks, adire textiles and sculptures.',
    detail: 'Located along the Lekki corridor, Nike Art Centre showcases works by hundreds of Nigerian artists across multiple floors, alongside adire indigo textile workshops. Confirm current visiting hours and photography rules with the gallery.',
    source: 'lagos'
  },
  {
    id: 'kalakuta',
    city: 'lagos',
    area: 'Ikeja',
    category: 'Culture',
    title: 'Where Afrobeat history lives on the Mainland.',
    name: 'Kalakuta Republic Museum',
    art: 'city',
    desc: 'Step inside the historic Ikeja residence of Fela Anikulapo Kuti, preserved as a cultural museum.',
    detail: 'Situated off Allen Avenue in Ikeja, the Kalakuta Museum preserves original instruments, stage outfits, photographs and stories from the birth of Afrobeat. Check opening times directly before visiting.',
    source: 'lagos'
  },
  {
    id: 'freedom-park',
    city: 'lagos',
    area: 'Lagos Island',
    category: 'Park' as any, // mapped cleanly or 'Culture'
    title: 'History turned into an open-air arts sanctuary.',
    name: 'Freedom Park Lagos Island',
    art: 'park',
    desc: 'A memorial and cultural park on Broad Street hosting live music, theatre and shaded courtyards.',
    detail: 'Built on the site of the colonial-era Broad Street prison on Lagos Island, Freedom Park is now a peaceful civic space for concerts, exhibitions, ponds and historical reflection.',
    source: 'lagos'
  },
  {
    id: 'tarkwa-bay',
    city: 'lagos',
    area: 'Victoria Island',
    category: 'Nature',
    title: 'A sheltered beach detour across the harbour.',
    name: 'Tarkwa Bay Waterfront',
    art: 'forest',
    desc: 'An island beach community accessible by boat from Victoria Island and Marina jetties.',
    detail: 'Tarkwa Bay offers calmer waves than ocean-facing beaches, popular with swimmers, surfers and weekend visitors. Always use licensed jetty operators, wear a life jacket and verify weather conditions.',
    source: 'lagos'
  },
  // Additional Abuja Places
  {
    id: 'jabi-lake',
    city: 'abuja',
    area: 'Jabi',
    category: 'Nature',
    title: 'Sunset reflections and waterside walks in Jabi.',
    name: 'Jabi Lake & Recreational Park',
    art: 'park',
    desc: 'A scenic reservoir shoreline in Jabi ideal for evening walks, jogging and waterfront views.',
    detail: 'Jabi Lake sits between Jabi and Kado in the capital, offering open air, fitness trails and lakeside views. Check park access times and safety guidelines before waterside activities.',
    source: 'fct'
  },
  {
    id: 'ushafa-pottery',
    city: 'abuja',
    area: 'Bwari',
    category: 'Culture',
    title: 'Centuries-old Gbagyi clay artistry in Bwari.',
    name: 'Ushafa Pottery Centre',
    art: 'craft',
    desc: 'Discover traditional hand-coiled and wheel-thrown pottery crafted by women artisans in Bwari.',
    detail: 'Located in Ushafa community within Bwari Area Council, this centre preserves indigenous Gbagyi pottery techniques alongside contemporary ceramic kilns. Ask permission before photographing artisans at work.',
    source: 'fct'
  },
  {
    id: 'national-arboretum',
    city: 'abuja',
    area: 'Asokoro',
    category: 'Nature',
    title: 'Indigenous trees and quiet trails beneath Aso Rock.',
    name: 'Abuja Green Trail & Park Corridor',
    art: 'forest',
    desc: 'Explore the capital’s planned green belts, savannah woodland pockets and walking paths.',
    detail: 'Abuja’s master plan wove green parkways through Maitama, Asokoro and Central Area. Enjoy early morning birdlife and shaded cassia avenues while respecting local access signs.',
    source: 'ncf'
  },
  {
    id: 'thought-pyramid',
    city: 'abuja',
    area: 'Wuse',
    category: 'Culture',
    title: 'Contemporary Nigerian canvas and sculpture in Wuse.',
    name: 'Thought Pyramid Art Centre',
    art: 'craft',
    desc: 'An inspiring art gallery space in Wuse II curating exhibitions, talks and creative gatherings.',
    detail: 'Located in Wuse II, Thought Pyramid showcases paintings, mixed-media installations and sculptures from emerging and master artists across Nigeria. Check current exhibition schedules before visiting.',
    source: 'fct'
  }
];

// Ensure Freedom Park category is strictly 'Culture' | 'Nature' | 'Move'
EXTENDED_PLACES[2].category = 'Culture';

export const EXTENDED_PULSE: PulseEntry[] = [
  {
    id: 'lg-yabacon',
    city: 'lagos',
    tag: 'Community & Innovation',
    topic: 'Community',
    title: 'How Yaba bridged campuses and code.',
    summary: 'Why the corridor between Sabo, Herbert Macaulay and Akoka became a creative magnet.',
    body: 'Proximity to the University of Lagos, Yaba College of Technology and historic commercial streets turned Yaba into a natural meeting point for students, engineers and designers.',
    insight: 'Great neighbourhood ecosystems grow when campuses, transport links and everyday community spaces sit side by side.',
    limit: 'Evergreen community context. Individual hub locations and programs change over time.',
    source: 'lagos',
    area: 'Yaba · Mainland',
    art: 'city'
  },
  {
    id: 'lg-adire',
    city: 'lagos',
    tag: 'Cultural Heritage',
    topic: 'Culture',
    title: 'The geometry and stories dyed into Adire.',
    summary: 'How resist-dyed indigo cloth carries proverbs, botanical motifs and local memory.',
    body: 'Across Southwest Nigeria and Lagos markets, Adire patterns—whether tied (Oniko) or cassava-paste stencilled (Eleko)—name everyday objects, historical moments and community values.',
    insight: 'Next time you spot an Adire motif on your Side, ask the maker or seller the name of the pattern.',
    limit: 'Cultural overview. Support authentic local textile makers and artisans.',
    source: 'lagos',
    area: 'Lekki & Mainland',
    art: 'craft'
  },
  {
    id: 'ab-gbagyi',
    city: 'abuja',
    tag: 'Know your city',
    topic: 'Culture',
    title: 'The indigenous heritage of the FCT’s hills and valleys.',
    summary: 'Understanding the communities and craft traditions across Abuja’s six area councils.',
    body: 'From Bwari and Kuje to Gwagwalada and Kwali, the FCT holds rich pottery, weaving and farming traditions that predate the modern capital’s construction.',
    insight: 'Exploring beyond the city center reveals the deep cultural roots that give Abuja its warmth.',
    limit: 'Evergreen cultural background. Always engage local community heritage sites respectfully.',
    source: 'fct',
    area: 'Bwari & Kuje',
    art: 'craft'
  },
  {
    id: 'ab-masterplan',
    city: 'abuja',
    tag: 'City Design',
    topic: 'Environment',
    title: 'Why Abuja’s districts are framed by green valleys.',
    summary: 'How stream corridors and rock outcrops shaped the layout of Phase 1 to Phase 3.',
    body: 'Abuja’s urban layout was designed around natural drainage basins, granite inselbergs and park corridors such as Millennium Park and Jabi Lake.',
    insight: 'Protecting green buffers helps keep neighbourhoods cooler and walkable during the dry season.',
    limit: 'Background reading on urban geography, not an official planning notice.',
    source: 'fct',
    area: 'Central & Maitama',
    art: 'park'
  }
];

