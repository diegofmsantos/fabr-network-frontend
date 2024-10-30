export type Player = {
    id: number,
    nome: string,
    time: string,
    posicao: string,
    setor: "Ataque" | "Defesa" | "Special",
    experiencia: number
    numero: number,
    idade: number,
    altura: string,
    peso: number,
    cidade: string,
    nacionalidade: string,
    camisa: string
    estatisticas?: Object[]
}