export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    passe: 'PASSE',
    corrida: 'CORRIDA',
    recepcao: 'RECEPÇÃO',
    retorno: 'RETORNO',
    defesa: 'DEFESA',
    kicker: 'CHUTE',
    punter: 'PUNT'
  }

  return labels[category] || 'ESTATÍSTICAS'
}