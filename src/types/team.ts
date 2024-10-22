export type Team = {
    id: number,
    nome: string,
    cidade: string,
    fundacao: string,
    logo: string,
    background: string,
    conferencia: number,
    nacionais: number
    jogadores?:Object[]
}