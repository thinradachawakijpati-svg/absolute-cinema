import type { Movie, ProviderId, ProviderStat } from '../types';

export function calculateAllProviders(movies: Movie[]): ProviderStat[] {
  if (movies.length === 0) return [];
  const stats: Record<ProviderId, ProviderStat> = {
    netflix: { providerId: 'netflix', name: 'Netflix', price: 169, color: 'bg-red-600', matchedCount: 0, matchedMovies: [], totalMinutes: 0, coveragePercent: 0, costPerMovie: 0 },
    disney: { providerId: 'disney', name: 'Disney+ Hotstar', price: 289, color: 'bg-blue-600', matchedCount: 0, matchedMovies: [], totalMinutes: 0, coveragePercent: 0, costPerMovie: 0 },
    prime: { providerId: 'prime', name: 'Prime Video', price: 149, color: 'bg-sky-500', matchedCount: 0, matchedMovies: [], totalMinutes: 0, coveragePercent: 0, costPerMovie: 0 },
    hbo: { providerId: 'hbo', name: 'HBO GO', price: 199, color: 'bg-purple-600', matchedCount: 0, matchedMovies: [], totalMinutes: 0, coveragePercent: 0, costPerMovie: 0 },
  };

  movies.forEach((movie: Movie) => {
    movie.providers.forEach((pId: ProviderId) => {
      if (stats[pId]) {
        stats[pId].matchedCount += 1;
        stats[pId].matchedMovies.push(movie);
        stats[pId].totalMinutes += movie.runtime;
      }
    });
  });

  return Object.values(stats)
    .filter((s: ProviderStat) => s.matchedCount > 0)
    .map((s: ProviderStat) => ({
      ...s,
      coveragePercent: Math.round((s.matchedCount / movies.length) * 100),
      costPerMovie: Math.round(s.price / s.matchedCount),
    }))
    .sort((a: ProviderStat, b: ProviderStat) =>
      b.matchedCount !== a.matchedCount ? b.matchedCount - a.matchedCount : a.costPerMovie - b.costPerMovie
    );
}

export function calculateBestProvider(movies: Movie[]): ProviderStat | undefined {
  return calculateAllProviders(movies)[0];
}