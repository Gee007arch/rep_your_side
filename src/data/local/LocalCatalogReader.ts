import type { CatalogReader } from '../../ports/CatalogReader';
import type {
  CityId,
  CityConfig,
  SourceItem,
  Question,
  Place,
  PulseEntry,
  CircleItem,
  StoryChapter
} from '../../domain/types';
import {
  SOURCES,
  CITIES,
  QUESTIONS,
  STREET,
  PLACES,
  PULSE,
  CIRCLES,
  CHAPTERS
} from '../fixtures';

export class LocalCatalogReader implements CatalogReader {
  getSources(): Record<string, SourceItem> {
    return SOURCES;
  }

  getSource(id: string): SourceItem | undefined {
    return SOURCES[id];
  }

  getCities(): Record<CityId, CityConfig> {
    return CITIES;
  }

  getCity(city: CityId): CityConfig {
    return CITIES[city];
  }

  getQuestions(city: CityId): Question[] {
    return QUESTIONS[city] ?? [];
  }

  getStreetQuestions(_city?: CityId): Question[] {
    return STREET;
  }

  getPlaces(city?: CityId): Place[] {
    return city ? PLACES.filter((p) => p.city === city) : PLACES;
  }

  getPlaceById(id: string): Place | undefined {
    return PLACES.find((p) => p.id === id);
  }

  getPulseEntries(city?: CityId): PulseEntry[] {
    return city ? PULSE.filter((p) => p.city === city) : PULSE;
  }

  getPulseById(id: string): PulseEntry | undefined {
    return PULSE.find((p) => p.id === id);
  }

  getCircles(): CircleItem[] {
    return CIRCLES;
  }

  getCircleById(id: string): CircleItem | undefined {
    return CIRCLES.find((c) => c.id === id);
  }

  getChapters(_city?: CityId): StoryChapter[] {
    return CHAPTERS;
  }
}

export const defaultCatalogReader = new LocalCatalogReader();
