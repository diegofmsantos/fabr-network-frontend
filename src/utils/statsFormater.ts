import { StatConfig } from "./statMappings";

export class StatsFormatter {
    static format(value: number, config: StatConfig): string {
      if (!value && value !== 0) return 'N/A';
  
      if (config.isCalculated && this.shouldUseDecimals(config.key)) {
        return value.toFixed(1);
      }
  
      return Math.round(value).toString();
    }
  
    private static shouldUseDecimals(key: string): boolean {
      return key.includes('media') || 
             key.includes('percentual') || 
             ['field_goals', 'extra_points'].includes(key);
    }
  }