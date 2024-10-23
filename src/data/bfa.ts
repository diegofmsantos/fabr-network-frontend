import { Team } from "@/types/team";

export const BFA: Team[] = [
    {
        id: 1,
        nome: "Almirantes",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "almirantes.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false,
    },
    {
        id: 2,
        nome: "América Locomotiva",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "america-locomotiva.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 3,
        nome: "Caruaru Wolves",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "caruaru-wolves.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 4,
        nome: "Cavalaria 2 de Julho",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "cavalaria-2-de-julho.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 5,
        nome: "Cuiabá Arsenal",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "cuiaba-arsenal.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 6,
        nome: "Fortaleza Tritões",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "fortaleza-tritoes.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 7,
        nome: "Galo",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "galo.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 8,
        nome: "Istepôs",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "istepos.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 9,
        nome: "João Pessoa Espectros",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "joao-pessoa-espectros.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 10,
        nome: "Manaus",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "manaus.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 11,
        nome: "Mossoró Petroleiros",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "mossoro-petroleiros.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 12,
        nome: "Porto Velho Miners",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "porto-velho-miners.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 13,
        nome: "Recife Mariners",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "recife-mariners.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false,
        jogadores: [
            {
                id: 1,
                nome: "Athos Daniel",
                time: "Recife Mariners",
                posicao: "TE",
                numero: 0,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "athos.png",
                estatisticas: [
                    {
                        jardas_passadas: "100",
                        passes_tentados: "10",
                        passes_completos: "15",
                        precisao_passes: "70%",
                        avg_passes: "11",
                        touchdowns: 10,
                        interceptacoes: 5
                    }
                ]
            },
            {
                id: 2,
                nome: "Danillo Farias",
                time: "Recife Mariners",
                posicao: "WR",
                numero: 1,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "danillo.png",
                estatisticas: [
                    {
                        jardas_recebidas: "100",
                        alvo_passe: "10",
                        recepcoes: "15",
                        avg_recepcoes: "70%",
                        touchdowns_recebidos: 5
                    }
                ]
            },
            {
                id: 3,
                nome: "Vinicius Moura",
                time: "Recife Mariners",
                posicao: "RB",
                numero: 2,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "vinicius.png",
                estatisticas: [
                    {
                        jardas_corridas: "100",
                        corridas: "10",
                        avg_corridas: "15",
                        touchdowns_corridos: "70%",
                        flumbles: 5
                    }
                ]
            },
            {
                id: 4,
                nome: "Pedro Brito",
                time: "Recife Mariners",
                posicao: "CB",
                numero: 3,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 5,
                nome: "Isaac James",
                time: "Recife Mariners",
                posicao: "CB/R",
                numero: 4,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "athos.png",
                estatisticas: [
                    {
                        jardas_passadas: "100",
                        passes_tentados: "10",
                        passes_completos: "15",
                        precisao_passes: "70%",
                        avg_passes: "11",
                        touchdowns: 10,
                        interceptacoes: 5
                    }
                ]
            },
            {
                id: 6,
                nome: "Marcos Hercules",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 5,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "danillo.png",
                estatisticas: [
                    {
                        jardas_recebidas: "100",
                        alvo_passe: "10",
                        recepcoes: "15",
                        avg_recepcoes: "70%",
                        touchdowns_recebidos: 5
                    }
                ]
            },
            {
                id: 7,
                nome: "Oshay Dunmore",
                time: "Recife Mariners",
                posicao: "S",
                numero: 6,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "vinicius.png",
                estatisticas: [
                    {
                        jardas_corridas: "100",
                        corridas: "10",
                        avg_corridas: "15",
                        touchdowns_corridos: "70%",
                        flumbles: 5
                    }
                ]
            },
            {
                id: 8,
                nome: "Pedro Henrique",
                time: "Recife Mariners",
                posicao: "CB",
                numero: 7,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 9,
                nome: "Davi Renan",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 9,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "athos.png",
                estatisticas: [
                    {
                        jardas_passadas: "100",
                        passes_tentados: "10",
                        passes_completos: "15",
                        precisao_passes: "70%",
                        avg_passes: "11",
                        touchdowns: 10,
                        interceptacoes: 5
                    }
                ]
            },
            {
                id: 10,
                nome: "Leonardo Fragoso",
                time: "Recife Mariners",
                posicao: "WR",
                numero: 10,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "danillo.png",
                estatisticas: [
                    {
                        jardas_recebidas: "100",
                        alvo_passe: "10",
                        recepcoes: "15",
                        avg_recepcoes: "70%",
                        touchdowns_recebidos: 5
                    }
                ]
            },
            {
                id: 11,
                nome: "Alvaro Fadini",
                time: "Recife Mariners",
                posicao: "QB",
                numero: 11,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "vinicius.png",
                estatisticas: [
                    {
                        jardas_corridas: "100",
                        corridas: "10",
                        avg_corridas: "15",
                        touchdowns_corridos: "70%",
                        flumbles: 5
                    }
                ]
            },
            {
                id: 12,
                nome: "José Victor",
                time: "Recife Mariners",
                posicao: "WR",
                numero: 13,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 13,
                nome: "Renan Sousa",
                time: "Recife Mariners",
                posicao: "RB",
                numero: 14,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "athos.png",
                estatisticas: [
                    {
                        jardas_passadas: "100",
                        passes_tentados: "10",
                        passes_completos: "15",
                        precisao_passes: "70%",
                        avg_passes: "11",
                        touchdowns: 10,
                        interceptacoes: 5
                    }
                ]
            },
            {
                id: 14,
                nome: "Sávio Pereira",
                time: "Recife Mariners",
                posicao: "QB",
                numero: 16,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "danillo.png",
                estatisticas: [
                    {
                        jardas_recebidas: "100",
                        alvo_passe: "10",
                        recepcoes: "15",
                        avg_recepcoes: "70%",
                        touchdowns_recebidos: 5
                    }
                ]
            },
            {
                id: 15,
                nome: "Paulo Henrique Mota",
                time: "Recife Mariners",
                posicao: "K",
                numero: 17,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "vinicius.png",
                estatisticas: [
                    {
                        jardas_corridas: "100",
                        corridas: "10",
                        avg_corridas: "15",
                        touchdowns_corridos: "70%",
                        flumbles: 5
                    }
                ]
            },
            {
                id: 16,
                nome: "Michael Alves",
                time: "Recife Mariners",
                posicao: "WR",
                numero: 18,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 17,
                nome: "David Anderson",
                time: "Recife Mariners",
                posicao: "WR",
                numero: 19,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "athos.png",
                estatisticas: [
                    {
                        jardas_passadas: "100",
                        passes_tentados: "10",
                        passes_completos: "15",
                        precisao_passes: "70%",
                        avg_passes: "11",
                        touchdowns: 10,
                        interceptacoes: 5
                    }
                ]
            },
            {
                id: 18,
                nome: "Iuri Borges",
                time: "Recife Mariners",
                posicao: "CB",
                numero: 20,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "danillo.png",
                estatisticas: [
                    {
                        jardas_recebidas: "100",
                        alvo_passe: "10",
                        recepcoes: "15",
                        avg_recepcoes: "70%",
                        touchdowns_recebidos: 5
                    }
                ]
            },
            {
                id: 19,
                nome: "Erivelton Glosma",
                time: "Recife Mariners",
                posicao: "CB",
                numero: 21,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "vinicius.png",
                estatisticas: [
                    {
                        jardas_corridas: "100",
                        corridas: "10",
                        avg_corridas: "15",
                        touchdowns_corridos: "70%",
                        flumbles: 5
                    }
                ]
            },
            {
                id: 20,
                nome: "Vinicius Guerra",
                time: "Recife Mariners",
                posicao: "CB",
                numero: 22,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 21,
                nome: "Guilherme Bunn",
                time: "Recife Mariners",
                posicao: "CB",
                numero: 23,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 22,
                nome: "Pedro Accioly",
                time: "Recife Mariners",
                posicao: "S",
                numero: 25,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 23,
                nome: "Marcelo Sherman",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 26,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 24,
                nome: "Gustavo Frazão",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 27,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 25,
                nome: "Douglas Soares",
                time: "Recife Mariners",
                posicao: "P",
                numero: 29,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 26,
                nome: "Eduardo Santos",
                time: "Recife Mariners",
                posicao: "S",
                numero: 30,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 27,
                nome: "Roberto de Lemos",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 31,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 28,
                nome: "Thomaz Beda",
                time: "Recife Mariners",
                posicao: "S",
                numero: 32,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 29,
                nome: "Erick Santos",
                time: "Recife Mariners",
                posicao: "S",
                numero: 33,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 30,
                nome: "Iuri Perrier",
                time: "Recife Mariners",
                posicao: "S",
                numero: 35,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 31,
                nome: "Felipe Xavier",
                time: "Recife Mariners",
                posicao: "RB",
                numero: 38,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 32,
                nome: "Gabriel Benjamin",
                time: "Recife Mariners",
                posicao: "S",
                numero: 39,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 33,
                nome: "Ysrael Yoseph",
                time: "Recife Mariners",
                posicao: "CB",
                numero: 40,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 34,
                nome: "Pedro Manoel",
                time: "Recife Mariners",
                posicao: "RB",
                numero: 42,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 35,
                nome: "Lucas Adolfo",
                time: "Recife Mariners",
                posicao: "RB",
                numero: 44,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "lucas-adolfo.jpeg",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 36,
                nome: "Igor Silvério",
                time: "Recife Mariners",
                posicao: "S",
                numero: 48,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 37,
                nome: "Walber Sena",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 49,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 38,
                nome: "Felipe Siqueira",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 50,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 39,
                nome: "Marcelo Barbosa",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 51,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 40,
                nome: "Samuel Braz",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 52,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 41,
                nome: "Caio Vieira",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 53,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 42,
                nome: "Guilherme Costa",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 54,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 43,
                nome: "Tharcio Alves",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 55,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 44,
                nome: "João Neto",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 56,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 45,
                nome: "Gabriel Tavares",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 57,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 46,
                nome: "Rodolfo Henrique",
                time: "Recife Mariners",
                posicao: "LB",
                numero: 58,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 47,
                nome: "Pedro Henrique Corrêa",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 59,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 48,
                nome: "Flávio Santos",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 62,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 49,
                nome: "Felipe José",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 64,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 50,
                nome: "David José",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 65,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 51,
                nome: "Ricardo Augusto",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 66,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 52,
                nome: "Bruno Sherman",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 68,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 53,
                nome: "Lenin Albuquerque",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 71,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 54,
                nome: "Breno Araujo",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 72,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 55,
                nome: "Alvaro Carneiro",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 73,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 56,
                nome: "Marcos Munhoz",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 75,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 57,
                nome: "Luan Caio",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 77,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 58,
                nome: "Josué Severino",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 78,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 59,
                nome: "Josimar Antônio",
                time: "Recife Mariners",
                posicao: "OL",
                numero: 79,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 60,
                nome: "Vinicius Santiago",
                time: "Recife Mariners",
                posicao: "WR",
                numero: 83,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 61,
                nome: "Alexsandro Costa",
                time: "Recife Mariners",
                posicao: "TE",
                numero: 86,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 62,
                nome: "Jose Henrique",
                time: "Recife Mariners",
                posicao: "TE",
                numero: 87,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 63,
                nome: "Akin Dagba",
                time: "Recife Mariners",
                posicao: "WR",
                numero: 88,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 64,
                nome: "Pedro Morais",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 88,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 65,
                nome: "Victor José",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 91,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 66,
                nome: "Diogo Sales",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 92,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 67,
                nome: "Nelson Ferreira",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 93,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 68,
                nome: "Matheus Bacalhau",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 94,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 69,
                nome: "Gilberto Portela",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 96,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 70,
                nome: "Tulio Albuquerque",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 97,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
            {
                id: 71,
                nome: "João Guilherme",
                time: "Recife Mariners",
                posicao: "DL",
                numero: 99,
                idade: 31,
                altura: "1,73",
                peso: 67,
                cidade: "Recife",
                nacionalidade: "brasileiro",
                foto: "pedro.png",
                estatisticas: [
                    {
                        sack: "1",
                        interceptacao: "5",
                        tackles: "5",
                        tackles_loss: "5",
                        pressoes: "5",
                        flumbles_forcado: "5",
                        flumble_recuperado: "5",
                        passe_desviado: "5",
                        safety: "5",
                        pic_six: "5",
                        flumble_td: "5"
                    }
                ]
            },
        ]
    },
    {
        id: 14,
        nome: "Remo Lions",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "remo-lions.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 15,
        nome: "Rondonópolis Hawks",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "rondonopolis-hawks.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 16,
        nome: "Santa Maria Soldiers",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "santa-maria-soldiers.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 17,
        nome: "Sergipe Redentores",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "sergipe-redentores.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 18,
        nome: "Sinop Coyotes",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "sinop-coyotes.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 19,
        nome: "Timbó Rex",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "timbo-rex.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 20,
        nome: "Tubarões do Cerrado",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "tubaroes-do-cerrado.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    },
    {
        id: 21,
        nome: "Vasco Almirantes",
        cidade: "Recife",
        fundacao: "01/01/2000",
        logo: "vasco-almirantes.png",
        background: "bg-recife-mariners.png",
        conferencia: 1,
        nacionais: 1,
        brasileirao: false
    }
]