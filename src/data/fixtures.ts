import type {
  CityConfig,
  CircleItem,
  CityId,
  Place,
  PulseEntry,
  Question,
  SourceItem,
  StoryChapter
} from '../domain/types';

export const SOURCES: Record<string, SourceItem> = {
  fct: {
    name: 'FCT Administration · Municipal FAQs',
    url: 'https://www.fcta.gov.ng/faq/',
    date: 'Publication date not stated'
  },
  ncf: {
    name: 'Nigerian Conservation Foundation',
    url: 'https://ncfnigeria.org/our-centers/',
    date: 'Publication date not stated'
  },
  lcc: {
    name: 'Nigerian Conservation Foundation · Lekki',
    url: 'https://ncfnigeria.org/lekki-conservation-centre-the-green-soul-of-lagos-metropolis/',
    date: 'Publication date not stated'
  },
  lagos: {
    name: 'Lagos State · Resilience Strategy',
    url: 'https://lasbca.lagosstate.gov.ng/wp-content/uploads/2021/05/Lagos_Resilience_Strategy.pdf',
    date: '2020 strategy'
  },
  rail: {
    name: 'LAMATA · Blue Line timetable',
    url: 'https://www.lamata-ng.com/blue-line-train-schedule/',
    date: 'Live operator page; times may change'
  }
};

export const CITIES: Record<CityId, CityConfig> = {
  lagos: {
    name: 'Lagos',
    tag: 'Eko energy. Every side counts.',
    short: 'The city of a thousand stories.',
    areas: [
      'Yaba',
      'Ikeja',
      'Surulere',
      'Lekki',
      'Victoria Island',
      'Lagos Island',
      'Ikorodu',
      'Epe',
      'Badagry',
      'Agege',
      'Ajah',
      'Alimosho'
    ],
    colour: '#f8bb39',
    emoji: '🌊',
    fact: 'Five divisions. Many different stories.',
    pulseTitle: 'There is more than one way to know Lagos.'
  },
  abuja: {
    name: 'Abuja',
    tag: 'Capital vibes. Community heart.',
    short: 'Find a new side to the capital.',
    areas: [
      'Wuse',
      'Garki',
      'Gwarinpa',
      'Maitama',
      'Asokoro',
      'Jabi',
      'Kubwa',
      'Lugbe',
      'Guzape',
      'Kuje',
      'Bwari',
      'Gwagwalada',
      'Kwali',
      'Abaji'
    ],
    colour: '#a9bd9b',
    emoji: '⛰️',
    fact: 'One territory. Six area councils.',
    pulseTitle: 'Your neighbourhood is part of a bigger FCT.'
  }
};

export const QUESTIONS: Record<CityId, Question[]> = {
  lagos: [
    {
      q: 'Lagos has five administrative divisions. Which is one of them?',
      a: ['Lekki', 'Ikeja', 'Ajah', 'Yaba'],
      correct: 1,
      why: 'Ikeja is one of the five: Ikeja, Badagry, Ikorodu, Lagos Island and Epe.',
      source: 'lagos'
    },
    {
      q: 'How many Local Government Areas does Lagos State have?',
      a: ['12', '37', '20', '57'],
      correct: 2,
      why: 'Lagos has 20 LGAs. The 37 LCDAs are a different category.',
      source: 'lagos'
    },
    {
      q: 'Who manages Lekki Conservation Centre?',
      a: ['Nigerian Conservation Foundation', 'LAMATA', 'Federal Airports Authority', 'National Library'],
      correct: 0,
      why: 'NCF manages the centre, a place for conservation and learning.',
      source: 'lcc'
    },
    {
      q: 'The published Blue Line timetable links Marina with…',
      a: ['Epe', 'Badagry', 'Ikeja', 'Mile 2'],
      correct: 3,
      why: 'LAMATA lists the Marina–Mile 2 corridor. Check its timetable before travelling.',
      source: 'rail'
    },
    {
      q: 'Which stop appears between Marina and Iganmu on that timetable?',
      a: ['National Theatre', 'Oshodi', 'Yaba', 'Agege'],
      correct: 0,
      why: 'National Theatre is listed between Marina and Iganmu.',
      source: 'rail'
    }
  ],
  abuja: [
    {
      q: 'How many area councils make up the FCT?',
      a: ['Five', 'Six', 'Seven', 'Twelve'],
      correct: 1,
      why: 'The FCT has six area councils.',
      source: 'fct'
    },
    {
      q: 'Which of these is an FCT area council?',
      a: ['Ikeja', 'Keffi', 'Kuje', 'Minna'],
      correct: 2,
      why: 'Kuje is one of the six, alongside AMAC, Abaji, Gwagwalada, Bwari and Kwali.',
      source: 'fct'
    },
    {
      q: 'In which year was the Federal Capital Territory established?',
      a: ['1960', '1991', '2004', '1976'],
      correct: 3,
      why: 'The FCT was established in 1976. FCTA’s later administrative reform was in 2004.',
      source: 'fct'
    },
    {
      q: 'Which place does FCTA list among Abuja’s attractions?',
      a: ['Millennium Park', 'Tarkwa Bay', 'Olumo Rock', 'Tinapa'],
      correct: 0,
      why: 'Millennium Park appears on FCTA’s attractions list.',
      source: 'fct'
    },
    {
      q: 'NCF locates Abuja Conservation Centre in which community?',
      a: ['Guzape', 'Yaba', 'Epe', 'Bonny'],
      correct: 0,
      why: 'NCF identifies Guzape, Garki 2, Abuja, as the centre’s location.',
      source: 'ncf'
    }
  ]
};

export const STREET: Question[] = [
  {
    q: 'A “local gig” asks for your banking code before sharing a brief. Your move?',
    a: ['Send the code', 'Stop and verify the opportunity independently', 'Pay to secure the slot'],
    correct: 1,
    why: 'Keep passwords and payment codes private. A credible brief should explain the work and terms. This is a fictional learning scenario.'
  },
  {
    q: 'You want to photograph a neighbour’s shop for a Side story. What comes first?',
    a: ['Ask permission and agree what you can share', 'Post the owner’s phone number', 'Record people secretly'],
    correct: 0,
    why: 'Ask permission and protect personal details. Being a helpful storyteller includes respecting the people in the story.'
  },
  {
    q: 'A forwarded message claims a road is closed. What should you share?',
    a: ['The rumour as fact', 'An invented alternative route', 'A dated, attributable update after checking'],
    correct: 2,
    why: 'Separate a report from a confirmed fact. A date and a credible source help others judge whether information is useful.'
  }
];

export const PLACES: Place[] = [
  {
    id: 'lcc',
    city: 'lagos',
    area: 'Lekki',
    category: 'Nature',
    title: 'A little less rush. A little more green.',
    name: 'Lekki Conservation Centre',
    art: 'forest',
    desc: 'Discover the forest environment and canopy walkway described by NCF.',
    detail: 'A conservation stop for a different view of Lagos. NCF describes wildlife, forest habitats and a canopy walkway. Read the operator’s information and confirm access, prices, suitability and opening times directly before a visit.',
    source: 'lcc'
  },
  {
    id: 'blue',
    city: 'lagos',
    area: 'Lagos Island',
    category: 'Move',
    title: 'See the city from a different line.',
    name: 'The Blue Line corridor',
    art: 'train',
    desc: 'Get to know the stops on the Marina–Mile 2 corridor.',
    detail: 'The operator’s timetable lists Marina, National Theatre, Iganmu, Alaba and Mile 2. Use the current LAMATA timetable to plan. This pilot does not provide live arrivals, ticketing, fares or directions from your doorstep.',
    source: 'rail'
  },
  {
    id: 'ibile',
    city: 'lagos',
    area: 'All sides',
    category: 'Culture',
    title: 'Meet the five sides of the story.',
    name: 'The IBILE discovery trail',
    art: 'city',
    desc: 'A reading trail through the five divisions of Lagos State.',
    detail: 'Explore Ikeja, Badagry, Ikorodu, Lagos Island and Epe through the state’s Resilience Strategy. This is a self-guided reading activity, not a scheduled tour. Pick one division you know less about and learn something new.',
    source: 'lagos'
  },
  {
    id: 'millennium',
    city: 'abuja',
    area: 'City-wide',
    category: 'Nature',
    title: 'Make room for a slower afternoon.',
    name: 'Millennium Park',
    art: 'park',
    desc: 'A green-space discovery from FCTA’s attractions list.',
    detail: 'FCTA lists Millennium Park among the capital’s attractions. Save it as an idea, then confirm present opening conditions, access and facilities before travelling. No event, group visit or booking is arranged by this pilot.',
    source: 'fct'
  },
  {
    id: 'craft',
    city: 'abuja',
    area: 'Central Area',
    category: 'Culture',
    title: 'There is a story in every handmade piece.',
    name: 'Arts and Crafts Village',
    art: 'craft',
    desc: 'Explore a place FCTA describes for arts, crafts and exhibitions.',
    detail: 'FCTA describes the village as a place to display and sell arts and crafts. Confirm its current access and trading arrangements directly. Ask permission before taking photographs; appreciate the work behind the object.',
    source: 'fct'
  },
  {
    id: 'acc',
    city: 'abuja',
    area: 'Guzape',
    category: 'Nature',
    title: 'The capital has a wild side, too.',
    name: 'Abuja Conservation Centre',
    art: 'forest',
    desc: 'Discover NCF’s conservation site in Guzape.',
    detail: 'NCF identifies this conservation site in Guzape, Garki 2. Its purpose includes protecting flora and fauna in the FCT. Confirm whether visits are available, and any access requirements, directly with NCF before setting out.',
    source: 'ncf'
  }
];

export const PULSE: PulseEntry[] = [
  {
    id: 'lg-divisions',
    city: 'lagos',
    tag: 'Know your city',
    topic: 'Community',
    title: 'IBILE: five divisions, one Lagos.',
    summary: 'The names behind a familiar Lagos expression.',
    body: 'Lagos State’s Resilience Strategy names five administrative divisions: Ikeja, Badagry, Ikorodu, Lagos Island and Epe. These are distinct from the 20 LGAs and 37 LCDAs.',
    insight: 'A familiar neighbourhood name and an administrative boundary may describe different things. In Rep Your Side, your Side is a community identity.',
    limit: 'Evergreen background, not a new government announcement. Local histories deserve additional community voices.',
    source: 'lagos',
    area: 'State-wide',
    art: 'city'
  },
  {
    id: 'lg-rail',
    city: 'lagos',
    tag: 'Official information',
    topic: 'Transport',
    title: 'Know the stops before you go.',
    summary: 'A quick introduction to the Blue Line corridor.',
    body: 'LAMATA’s published timetable lists Marina, National Theatre, Iganmu, Alaba and Mile 2 on the Blue Line corridor.',
    insight: 'Check the operator’s page on the day you travel. Build your plan around the current timetable and your starting area.',
    limit: 'No live service status, fare guarantee or door-to-door routing is provided here.',
    source: 'rail',
    area: 'Marina–Mile 2',
    art: 'train'
  },
  {
    id: 'lg-green',
    city: 'lagos',
    tag: 'Know your city',
    topic: 'Environment',
    title: 'There is a forest chapter in the Lagos story.',
    summary: 'Meet the conservation work behind LCC.',
    body: 'NCF describes Lekki Conservation Centre as a forest and wildlife environment with a canopy walkway.',
    insight: 'Local discovery can include learning about the ecosystems around a city, as well as its buildings.',
    limit: 'Confirm current access, costs and suitability with the operator. This is background information, not a booking.',
    source: 'lcc',
    area: 'Lekki',
    art: 'forest'
  },
  {
    id: 'ab-councils',
    city: 'abuja',
    tag: 'Know your city',
    topic: 'Community',
    title: 'Abuja is a city. The FCT reaches further.',
    summary: 'Six area councils, many community identities.',
    body: 'FCTA lists AMAC, Kuje, Abaji, Gwagwalada, Bwari and Kwali as the FCT’s six area councils.',
    insight: 'A district, a community and an area council are different ways to describe a place. Your chosen Side need not be an administrative unit.',
    limit: 'Evergreen background. The Abuja edition includes wider FCT communities and does not describe the FCT as a state.',
    source: 'fct',
    area: 'FCT-wide',
    art: 'city'
  },
  {
    id: 'ab-green',
    city: 'abuja',
    tag: 'Know your city',
    topic: 'Environment',
    title: 'Guzape has a conservation story.',
    summary: 'A discovery from the Nigerian Conservation Foundation.',
    body: 'NCF identifies Abuja Conservation Centre in Guzape, Garki 2, as a site for conserving flora and fauna in the FCT.',
    insight: 'Explore the purpose of a place before making a plan to visit it.',
    limit: 'Visitor access, opening times and facilities have not been checked with the operator. Contact NCF before a visit.',
    source: 'ncf',
    area: 'Guzape',
    art: 'forest'
  },
  {
    id: 'ab-craft',
    city: 'abuja',
    tag: 'Know your city',
    topic: 'Culture',
    title: 'Discover the makers behind the objects.',
    summary: 'A first look at the Arts and Crafts Village.',
    body: 'FCTA describes the Arts and Crafts Village as a place for arts and crafts sales, display and exhibitions.',
    insight: 'Ask a maker about their process. A respectful question can reveal more than a quick photograph.',
    limit: 'This is a discovery idea. Current access and trading arrangements need direct confirmation.',
    source: 'fct',
    area: 'Central Area',
    art: 'craft'
  }
];

export const CIRCLES: CircleItem[] = [
  {
    id: 'lens',
    name: 'Through Our Lens',
    tag: 'Photography',
    icon: 'camera',
    colour: 'pink',
    desc: 'Notice the colours, textures and small stories on your side.',
    task: 'Find a familiar object that tells a local story. Write a caption without posting anyone’s private details.'
  },
  {
    id: 'green',
    name: 'The Slow Lane',
    tag: 'Nature & walking',
    icon: 'leaf',
    colour: 'green',
    desc: 'For people who like their city with a little more green.',
    task: 'From a comfortable, safe place, notice three natural sounds. No travel or group meeting is required.'
  },
  {
    id: 'makers',
    name: 'Side Hustle Society',
    tag: 'Ideas & creativity',
    icon: 'spark',
    colour: 'yellow',
    desc: 'Small ideas, useful skills and people who love making things.',
    task: 'Draft a one-sentence description of a skill you could offer. Add the scope and what a fair brief should contain.'
  },
  {
    id: 'books',
    name: 'One More Chapter',
    tag: 'Books & stories',
    icon: 'book',
    colour: 'purple',
    desc: 'Good reads and the local stories we should tell more often.',
    task: 'Choose a story about a place. Note whose voice is included and whose perspective you would like to hear.'
  }
];

export const CHAPTERS: StoryChapter[] = [
  {
    title: 'The postcard with no address',
    text: 'Tomi finds a hand-drawn postcard in a borrowed book. On the back: “Every side has a story. Find ours before sunset.” A small paper sun marks the first clue.',
    choices: [
      ['Follow the sketch', 'You notice the shape of a tiny tree on the edge of the drawing.'],
      ['Ask the bookseller', 'The bookseller smiles: “Start with what people overlook.”']
    ]
  },
  {
    title: 'A different kind of landmark',
    text: 'The next clue is not a famous building. It is an ordinary bench, imagined by the storyteller, where neighbours have traded stories for years. A ribbon holds two possible trails.',
    choices: [
      ['Take the trail of sounds', 'You hear a rhythm that becomes the next clue.'],
      ['Take the trail of colours', 'A line of painted shapes leads you to the next clue.']
    ]
  },
  {
    title: 'The maker’s question',
    text: 'At an imaginary workshop, a maker asks Tomi: “What makes a place yours?” A map? A memory? The people? There is no single correct answer in this story.',
    choices: [
      ['Choose the memories', 'Tomi sketches a place that feels like home.'],
      ['Choose the people', 'Tomi writes down the name of someone who made a place welcoming.']
    ]
  },
  {
    title: 'Room for another story',
    text: 'Two storytellers remember the same street differently. Tomi can collect both versions without deciding that one person owns the entire story of a place.',
    choices: [
      ['Listen to both', 'The postcard gains a second voice, and the picture grows richer.'],
      ['Ask what changed', 'The storytellers find a shared memory of the street before it changed.']
    ]
  },
  {
    title: 'The side we share',
    text: 'At the fictional sunset gathering, the postcard becomes a little book. The final empty page is for the next person. The mystery was an invitation to notice, listen and make room.',
    choices: [
      ['Leave a new clue', 'Tomi draws a small sun for the next explorer. The story goes on.'],
      ['Add a welcome', 'Tomi writes: “Your story belongs here too.” The story goes on.']
    ]
  }
];

