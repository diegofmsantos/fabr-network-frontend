import { StatConfig } from "./statMappings"

export class StatsFormatter {
  static format(value: number | string | null, config: StatConfig): string {
    if (value === null) return 'N/A'

    // Para FGs e estatísticas no formato X/Y
    if (typeof value === 'string' && value.includes('/')) {
      return value; // Retorna o formato X/Y original
    }

    // Para médias
    if (config.isCalculated && config.key.includes('media')) {
      return typeof value === 'number' ? value.toFixed(1).replace('.', ',') : 'N/A'
    }

    // Para percentuais
    if (config.isCalculated && (
      config.key.includes('percentual') ||
      config.key === 'field_goals' ||
      config.key === 'extra_points'
    )) {
      return typeof value === 'number' ? `${Math.round(value)}%` : 'N/A'
    }

    // Para valores inteiros
    return typeof value === 'number' ? Math.round(value).toLocaleString('pt-BR') : 'N/A'
  }
}