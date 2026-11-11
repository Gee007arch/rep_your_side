import type {
  CityId,
  CityConfig,
  SourceItem,
  Question,
  Place,
  PulseEntry,
  CircleItem,
  StoryChapter
} from '../domain/types';

/**
 * Port interface for reading curated city, trivia, place, pulse, circle, and story content.
 * Phase F0-F4 uses `LocalCatalogReader` (static fixtures).
 * Phase L1/L2 swaps in `HttpCatalogReader` against the Laravel backend without changing UI components.
 */
export interface CatalogReader {
  getSources(): Record<string, SourceItem>;
  getSource(id: string): SourceItem | undefined;
  getCities(): Record<CityId, CityConfig>;
  getCity(city: CityId): CityConfig;
  getQuestions(city: CityId): Question[];
  getStreetQuestions(city: CityId): Question[];
  getPlaces(city?: CityId): Place[];
  getPlaceById(id: string): Place | undefined;
  getPulseEntries(city?: CityId): PulseEntry[];
  getPulseById(id: string): PulseEntry | undefined;
  getCircles(): CircleItem[];
  getCircleById(id: string): CircleItem | undefined;
  getChapters(city: CityId): StoryChapter[];
}

