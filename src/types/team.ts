import { Player } from "./player"

export type Team = {
    id: number,
    nome: string,
    sigla: string
    abreviacao: string
    cor?: string
    cidade: string,
    fundacao: string,
    logo: string,
    capacete: string
    estadio: string,
    presidente: string,
    head_coach: string,
    coord_ofen: string,
    coord_defen: string,
    titulos: Object[],
    brasileirao?: boolean
    jogadores?: Player[]
}