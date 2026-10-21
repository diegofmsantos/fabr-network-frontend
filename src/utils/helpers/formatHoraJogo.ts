// O horário é gravado no banco como digitado (ex.: 14:00Z = 14:00), então é exibido em UTC.
// Jogos sem horário definido ficam em 00:00 e não exibem hora.
export const formatHoraJogo = (dataJogo?: string | Date | null): string => {
  if (!dataJogo) return ''
  const data = new Date(dataJogo)
  if (isNaN(data.getTime())) return ''
  if (data.getUTCHours() === 0 && data.getUTCMinutes() === 0) return ''
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
}
