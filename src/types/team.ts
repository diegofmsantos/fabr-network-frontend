import { Player } from "./player"

export type Team = {
    id: number,
    nome: string,
    sigla: string
    cor?: string
    cidade: string,
    fundacao: string,
    logo: string,
    capacete: string
    background: string,
    conferencia: number,
    nacionais: number
    brasileirao?: boolean
    jogadores?: Player[]
}