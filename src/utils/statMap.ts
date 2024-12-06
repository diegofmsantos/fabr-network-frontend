const statMap: Record<string, string> = {
  // Passe
  "jardas_de_passe": "passe.jardas_de_passe",
  "passes_percentual": "passe.passes_percentual",
  "jardas_media": "passe.jardas_media",
  "td_passados": "passe.td_passados",
  "passes_completos": "passe.passes_completos",
  "passes_tentados": "passe.passes_tentados",
  "interceptacoes_sofridas": "passe.interceptacoes_sofridas",
  "sacks_sofridos": "passe.sacks_sofridos",
  "fumble_de_passador": "passe.fumble_de_passador",

  // Corrida
  "jardas_corridas": "corrida.jardas_corridas",
  "corridas": "corrida.corridas",
  "jardas_corridas_media": "corrida.jardas_corridas_media",
  "tds_corridos": "corrida.tds_corridos",
  "fumble_de_corredor": "corrida.fumble_de_corredor",

  // Recepção
  "jardas_recebidas": "recepcao.jardas_recebidas",
  "recepcoes": "recepcao.recepcoes",
  "tds_recebidos": "recepcao.tds_recebidos",
  "jardas_recebidas_media": "recepcao.jardas_recebidas_media",
  "alvo": "recepcao.alvo",
  "fumble_de_recebedor": "recepcao.fumble_de_recebedor",

  // Retorno
  "jardas_retornadas": "retorno.jardas_retornadas",
  "retornos": "retorno.retornos",
  "td_retornados": "retorno.td_retornados",
  "jardas_retornadas_media": "retorno.jardas_retornadas_media",
  "fumble_retornador": "retorno.fumble_retornador",

  // Defesa
  "sacks_forcado": "defesa.sacks_forcado",
  "interceptacao_forcada": "defesa.interceptacao_forcada",
  "fumble_forcado": "defesa.fumble_forcado",
  "td_defensivo": "defesa.td_defensivo",
  "tackles_for_loss": "defesa.tackles_for_loss",
  "tackles_totais": "defesa.tackles_totais",
  "passe_desviado": "defesa.passe_desviado",
  "safety": "defesa.safety",

  // Kicker
  "extra_points": "kicker.extra_points",
  "xp_bons": "kicker.xp_bons",
  "tentativas_de_xp": "kicker.tentativas_de_xp",
  "fg_bons": "kicker.fg_bons",
  "tentativas_de_fg": "kicker.tentativas_de_fg",
  "fg_mais_longo": "kicker.fg_mais_longo",
  "fg_0_10": "kicker.fg_0_10",
  "fg_11_20": "kicker.fg_11_20",
  "fg_21_30": "kicker.fg_21_30",
  "fg_31_40": "kicker.fg_31_40",
  "fg_41_50": "kicker.fg_41_50",

  // Punter
  "jardas_punt_media": "punter.jardas_punt_media",
  "punts": "punter.punts",
  "jardas_de_punt": "punter.jardas_de_punt",
};


// Função para normalizar as chaves, substituindo "-" por "_"
const normalizeKey = (key: string): string => {
  return key.replace(/-/g, "_").toLowerCase();
};

// Função para obter o caminho da chave correta no statMap
export const getStatKeyPath = (key: string): string | undefined => {
  const normalizedKey = normalizeKey(key);
  console.log("Procurando chave de estatística:", normalizedKey);

  const mappedKey = statMap[normalizedKey];
  if (!mappedKey) {
    console.error(`Chave de estatística não encontrada para: ${normalizedKey}`);
  }
  return mappedKey;
};

export default statMap;
