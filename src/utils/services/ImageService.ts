
export class ImageService {
  // SVG inline como fallback (evita requisições 404)
  private static readonly DEFAULT_LOGO_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='%23374151'/%3E%3Ctext x='50' y='55' font-size='20' fill='white' text-anchor='middle' font-family='Arial'%3E?%3C/text%3E%3C/svg%3E`;
  
  private static readonly DEFAULT_HELMET_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cellipse cx='50' cy='50' rx='45' ry='35' fill='%23374151'/%3E%3C/svg%3E`;
  
  private static readonly DEFAULT_SHIRT_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='20' y='20' width='60' height='60' fill='%23374151'/%3E%3C/svg%3E`;

  static normalizeForFilePath(input: string): string {
    if (!input) return '';

    return input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')  
      .normalize('NFD')      
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-z0-9-]/g, '');   
  }

  static getTeamLogo(teamName: string): string {
    if (!teamName) return this.DEFAULT_LOGO_SVG;
    const normalized = this.normalizeForFilePath(teamName);
    return `/assets/times/logos/${normalized}.png`;
  }

  static getTeamHelmet(teamName: string, customHelmet?: string): string {
    if (customHelmet) {
      return `/assets/times/capacetes/${customHelmet}`;
    }

    const specialCases: { [key: string]: string } = {
      'Bravos FA': 'capacete-bravos.png',
      'Istepôs FA': 'capacete-istepos.png',
    }

    if (specialCases[teamName]) {
      return `/assets/times/capacetes/${specialCases[teamName]}`;
    }

    const normalized = this.normalizeForFilePath(teamName);
    return `/assets/times/capacetes/capacete-${normalized}.png`;
  }

  static getPlayerShirt(teamName: string, shirtCode: string): string {
    if (!teamName || !shirtCode) {
      return this.DEFAULT_SHIRT_SVG;
    }
    
    const normalizedTeam = this.normalizeForFilePath(teamName);
    return `/assets/times/camisas/${normalizedTeam}/${shirtCode}`;
  }

  static getStateBanner(bannerCode: string): string {
    if (!bannerCode) return '';
    return `/assets/bandeiras/${bannerCode}`;
  }

  static getNationalityFlag(flagCode: string): string {
    if (!flagCode) return '';
    return `/assets/bandeiras/${flagCode}`;
  }

  static handleImageError(
    event: React.SyntheticEvent<HTMLImageElement>,
    fallbackSrc: string,
    debugInfo?: string
  ): void {
    const target = event.currentTarget;

    // ✅ IMPORTANTE: Evitar loop infinito
    if (target.src === fallbackSrc || target.dataset.errorHandled === 'true') {
      return;
    }

    // Marcar que o erro já foi tratado
    target.dataset.errorHandled = 'true';

    if (debugInfo && process.env.NODE_ENV === 'development') {
      console.warn(`Failed to load image: ${debugInfo}`);
    }

    // O Next.js Image (fill/responsive) gera um srcset com várias resoluções.
    // Sem limpar isso, o navegador continua priorizando essas variações
    // (todas quebradas) sobre a troca manual do src, deixando o ícone de
    // imagem quebrada visível em vez do fallback.
    target.removeAttribute('srcset');
    target.src = fallbackSrc;
  }

  static handleTeamLogoError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    teamName: string
  ) => {
    this.handleImageError(
      event,
      this.DEFAULT_LOGO_SVG, // ✅ Usar SVG inline em vez de arquivo
      `Team logo for: ${teamName}`
    );
  };

  static handleTeamHelmetError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    teamName: string
  ) => {
    this.handleImageError(
      event,
      this.DEFAULT_HELMET_SVG, // ✅ Usar SVG inline
      `Team helmet for: ${teamName}`
    );
  };

  static handlePlayerShirtError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    teamName: string,
    shirtCode: string
  ) => {
    this.handleImageError(
      event,
      this.DEFAULT_SHIRT_SVG, // ✅ Usar SVG inline
      `Player shirt for: ${teamName}/${shirtCode}`
    );
  };
}


export class UrlService {

  static getTeamUrl(teamName: string, params?: Record<string, string>): string {
    const normalized = ImageService.normalizeForFilePath(teamName);
    let url = `/${normalized}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  static getPlayerStatsUrl(category: string, statTitle: string): string {
    const categoryLower = category ? category.toLowerCase() : '';
    const normalizedTitle = ImageService.normalizeForFilePath(statTitle);
    return `/ranking/stats?stat=${categoryLower}-${normalizedTitle}`;
  }

  static getTeamStatsUrl(category: string, statTitle: string): string {
    const categoryLower = category ? category.toLowerCase() : '';
    const normalizedTitle = ImageService.normalizeForFilePath(statTitle);
    return `/ranking/times/stats?stat=${categoryLower}-${normalizedTitle}`;
  }

  static getPlayerUrl(teamName: string, playerName: string, params?: Record<string, string>): string {
    const normalizedTeam = ImageService.normalizeForFilePath(teamName);
    const normalizedPlayer = ImageService.normalizeForFilePath(playerName);
    let url = `/${normalizedTeam}/${normalizedPlayer}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    return url;
  }
}


export const normalizeForFilePath = ImageService.normalizeForFilePath;
export const formatValue = (value: string | number, title: string): string => {
  if (typeof value === 'string' && !isNaN(Number(value.replace(/[^0-9.,]/g, '')))) {
    const isPercentage = title.includes('(%)') || ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);
    if (isPercentage) {
      const numValue = Number(value.replace(/[^0-9.,]/g, ''));
      return `${Math.round(numValue)}%`;
    }
  }

  if (!isNaN(Number(value))) {
    const numValue = Number(value);
    const isPercentage = title.includes('(%)') || ['PASSES(%)', 'FG(%)', 'XP(%)'].includes(title);
    if (isPercentage) {
      return `${Math.round(numValue)}%`;
    }
    return numValue.toLocaleString('pt-BR');
  }

  return String(value);
};