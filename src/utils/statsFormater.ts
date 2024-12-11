import { StatConfig } from "./statMappings";

export class StatsFormatter {
  static format(value: number | string | null, config: StatConfig): string {
    if (value === null) return 'N/A';

    // Para FGs e estatísticas no formato X/Y
    if (typeof value === 'string' && value.includes('/')) {
      return value; // Retorna o formato X/Y original
    }

    // Para médias
    if (config.isCalculated && config.key.includes('media')) {
      return typeof value === 'number' ? value.toFixed(1) : 'N/A';
    }

    // Para percentuais
    if (config.isCalculated && (
      config.key.includes('percentual') ||
      config.key === 'field_goals' ||
      config.key === 'extra_points'
    )) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A';
    }

    // Para valores inteiros
    return typeof value === 'number' ? Math.round(value).toString() : 'N/A';
  }

  // Função específica para converter string X/Y em porcentagem se necessário
  static formatFGString(value: string): string {
    const [made, attempted] = value.split('/').map(Number);
    if (isNaN(made) || isNaN(attempted) || attempted === 0) return 'N/A';
    return `${Math.round((made / attempted) * 100)}%`;
  }
}