import { CorridaStats, PasseStats, StatsBase } from "@/types/Stats";

export class StatsCalculator {
    private static calculatePasseMedia(stats: PasseStats): number | null {
      return stats.passes_tentados > 0 
        ? stats.jardas_de_passe / stats.passes_tentados 
        : null;
    }
  
    private static calculatePassePercentual(stats: PasseStats): number | null {
      return stats.passes_tentados > 0 
        ? (stats.passes_completos / stats.passes_tentados) * 100 
        : null;
    }
  
    private static calculateCorridaMedia(stats: CorridaStats): number | null {
      return stats.corridas > 0 
        ? stats.jardas_corridas / stats.corridas 
        : null;
    }
  
    static calculate(stats: StatsBase[keyof StatsBase], key: string): number | null {
      switch (key) {
        case 'jardas_media':
          return this.calculatePasseMedia(stats as PasseStats);
        case 'passes_percentual':
          return this.calculatePassePercentual(stats as PasseStats);
        case 'jardas_corridas_media':
          return this.calculateCorridaMedia(stats as CorridaStats);
        default:
          return (stats as any)[key] ?? null;
      }
    }
  }