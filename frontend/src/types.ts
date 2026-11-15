export type ProviderId = 'netflix' | 'disney' | 'prime' | 'hbo';

export interface Provider {
  id: ProviderId;
  name: string;
  price: number;
  color: string;
}

export interface Movie {
  id: string;
  title: string;
  poster: string;
  backdrop?: string;
  genres: string[];
  year: number;
  runtime: number;
  providers: ProviderId[];
  voteAverage?: number;
  releaseDate?: string;
  ageRating?: string;
  tagline?: string;
  overview?: string;
}

export interface ProviderStat {
  providerId: ProviderId;
  name: string;
  price: number;
  color: string;
  matchedCount: number;
  matchedMovies: Movie[];
  totalMinutes: number;
  coveragePercent: number;
  costPerMovie: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  activeSubscriptions: ProviderId[];
  preferredDailyHours: number;
}

export interface WatchSchedule {
  id: string;
  title: string;
  movies: Movie[];
  createdAt: string;
}

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  price: number;
  color: string;
}