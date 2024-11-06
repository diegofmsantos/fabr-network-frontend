"use client";

import { useParams, useRouter } from 'next/navigation'
import { Times } from '../../../data/times'
import { Brasileirao } from '../../../data/brasileirao'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Player } from '../../../types/player'
import { Team } from '../../../types/team'

// Função para buscar o jogador por ID
const findJogador = (times: Team[], jogadorId: number): { jogador: Player, time: Team } | null => {
    for (let time of times) {
        if (time && Array.isArray(time.jogadores)) {
            const jogador = time.jogadores.find((j: Player) => j.id === jogadorId);
            if (jogador) {
                return { jogador, time };
            }
        }
    }
    return null;
}

export default function JogadorPage() {
    const params = useParams();
    const router = useRouter();
    const jogadorId = Array.isArray(params.jogador) ? parseInt(params.jogador[0], 10) : parseInt(params.jogador, 10);

    // Busca o jogador na fonte de dados única 'Times'
    const jogadorData = findJogador(Times, jogadorId);

    // Se não encontrar o jogador, exibe mensagem de erro
    if (!jogadorData) {
        return <div>Jogador não encontrado</div>;
    }

    const { jogador: currentPlayer, time: currentTeam } = jogadorData;

    // Caminho para o logo do time e para a camisa do jogador com a nova estrutura de pastas
    const logopath = `/assets/times/logos/${currentTeam.logo}`;
    const camisasPath = `/assets/times/camisas/${currentTeam.nome}/${currentPlayer.camisa}`;

    return (
        <div>
            <div className='fixed px-6 w-full h-[375px] flex flex-col justify-center items-center rounded-b-xl md:h-[400px]' style={{ backgroundColor: currentTeam?.cor }}>
                <button
                    onClick={() => router.back()} 
                    className='absolute top-10 left-5 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center bg-black/20'>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <div className='text-white font-bold text-xs mb-4 md:pt-4'>{currentTeam?.nome}</div>
                <div className='flex justify-center items-end md:w-screen md:justify-around md:items-center max-w-[1200px]'>
                    <div className='flex flex-col items-start'>
                        <div className='text-[32px] text-white px-2 font-extrabold italic leading-[35px] tracking-[-3px] md:text-[40px] lg:text-5xl'>
                            {currentPlayer.nome.toLocaleUpperCase()}
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='text-[34px] text-[#D9D9D9] text-center px-2 font-extrabold italic tracking-[-3px] md:text-4xl'>
                                {currentPlayer.posicao}
                            </div>
                            <div>
                                <Image src={'/assets/brasil.png'} alt='logo-bandeira' width={40} height={40} quality={100} />
                            </div>
                        </div>
                        <div className='-mt-5'>
                            <Image src={logopath} alt='logo' width={100} height={100} quality={70} />
                        </div>
                    </div>
                    <div className='flex justify-center items-center min-w-48 min-h-48 md:min-w-72 md:min-h-72 lg:min-w-84 lg:min-h-84 xl:min-w-96 xl:min-h-84'>
                        <Image
                            src={camisasPath}
                            alt={`${currentTeam?.nome} camisa`}
                            width={250}
                            height={250}
                            quality={100}
                        />
                    </div>
                </div>
            </div>
            <div className='p-4 flex flex-col gap-8 pt-[400px] md:pt-[430px]'>
                <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                    <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                        style={{ backgroundColor: currentTeam?.cor }}>BIO</div>
                    <div className="bg-[#D9D9D9]/50 flex flex-col justify-start gap-4 p-4 rounded-lg">
                        <div className="border-b border-black/40 flex justify-start">
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">PESO</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.peso}</div>
                            </div>
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">ALTURA</div>
                                <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.altura.toFixed(2).replace('.', ',')}</div>
                            </div>
                        </div>
                        <div className="border-b border-black/40 flex justify-start">
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">IDADE</div>
                                <div className="text-base font-extrabold italic mb-1 md:text-lg">{currentPlayer.idade}</div>
                            </div>
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">CIDADE</div>
                                <div className="text-base font-extrabold italic mb-1 md:text-lg">{currentPlayer?.cidade.toLocaleUpperCase()}</div>
                            </div>
                        </div>
                        <div className='flex justify-start'>
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">EXPERIÊNCIA</div>
                                <div className="text-base font-extrabold italic md:text-lg">-</div>
                            </div>
                            <div className='flex-1 justify-start'>
                                <div className="text-sm md:text-lg">TIME FORMADOR</div>
                                <div className='flex gap-2 items-center'>
                                    <div className="text-base font-extrabold italic md:text-lg">{currentTeam?.nome.toLocaleUpperCase()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {currentPlayer.estatisticas?.passe &&
                    (
                        currentPlayer.estatisticas.passe.passes_completos > 0 ||
                        currentPlayer.estatisticas.passe.jardas_de_passe > 0 ||
                        currentPlayer.estatisticas.passe.td_passados > 0 ||
                        currentPlayer.estatisticas.passe.interceptacoes_sofridas > 0 ||
                        currentPlayer.estatisticas.passe.sacks_sofridos > 0 ||
                        currentPlayer.estatisticas.passe.fumble_de_passador > 0
                    ) &&
                    (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (PASSE)
                            </div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col justify-start gap-4 p-4 rounded-lg lg:p-6">
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">PASSES(COMP/TENT)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.passe.passes_completos}/{currentPlayer.estatisticas.passe.passes_tentados}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">PASSES(%)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {(
                                                (currentPlayer.estatisticas.passe.passes_completos / currentPlayer.estatisticas.passe.passes_tentados) * 100
                                            ).toFixed(1).replace('.', ',')}%
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (TOTAIS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.passe.jardas_de_passe.toLocaleString('pt-BR')}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (AVG)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {(currentPlayer.estatisticas.passe.jardas_de_passe / currentPlayer.estatisticas.passe.passes_tentados)
                                                .toFixed(1)
                                                .replace('.', ',')}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">TOUCHDOWNS</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.passe.td_passados}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">INTERCEPTAÇÕES</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.passe.interceptacoes_sofridas}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-start gap-28'>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">SACKS</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.passe.sacks_sofridos}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FUMBLES</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.passe.fumble_de_passador}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {currentPlayer.estatisticas?.corrida &&
                    (
                        currentPlayer.estatisticas.corrida.corridas > 0 ||
                        currentPlayer.estatisticas.corrida.jardas_corridas > 0 ||
                        currentPlayer.estatisticas.corrida.tds_corridos > 0 ||
                        currentPlayer.estatisticas.corrida.fumble_de_corredor > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div
                                className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}
                            >
                                STATS (CORRIDA)
                            </div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">CORRIDAS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.corrida.corridas}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (TOTAIS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.corrida.jardas_corridas}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (AVG)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {(currentPlayer.estatisticas.corrida.jardas_corridas / currentPlayer.estatisticas.corrida.corridas)
                                                .toFixed(1)
                                                .replace('.', ',')}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">TOUCHDOWNS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.corrida.tds_corridos}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-start gap-16'>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FUMBLES</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.corrida.fumble_de_corredor}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                }

                {currentPlayer.estatisticas?.recepcao &&
                    (
                        currentPlayer.estatisticas.recepcao.jardas_recebidas > 0 ||
                        currentPlayer.estatisticas.recepcao.recepcoes > 0 ||
                        currentPlayer.estatisticas.recepcao.alvo > 0 ||
                        currentPlayer.estatisticas.recepcao.fumble_de_recebedor > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (RECEPÇÃO)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (TOTAIS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.recepcao.jardas_recebidas}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (AVG)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {(currentPlayer.estatisticas.recepcao.jardas_recebidas / currentPlayer.estatisticas.recepcao.alvo)
                                                .toFixed(1)
                                                .replace('.', ',')}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">RECEPÇÕES</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.recepcao.recepcoes}/{currentPlayer.estatisticas.recepcao.alvo}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">TOUCHDOWNS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.recepcao.tds_recebidos}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-start gap-20'>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FUMBLES</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.recepcao.fumble_de_recebedor}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                {currentPlayer.estatisticas?.retorno &&
                    (
                        currentPlayer.estatisticas.retorno.jardas_retornadas > 0 ||
                        currentPlayer.estatisticas.retorno.td_retornados > 0 ||
                        currentPlayer.estatisticas.retorno.fumble_retornador > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (RETORNO)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (TOTAIS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.retorno.jardas_retornadas}</div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">TOUCHDOWNS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.retorno.td_retornados}</div>
                                    </div>
                                </div>
                                <div className="flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FUMBLES</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.retorno.fumble_retornador}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {currentPlayer.estatisticas?.defesa &&
                    (
                        currentPlayer.estatisticas.defesa.tackles_totais > 0 ||
                        currentPlayer.estatisticas.defesa.tackles_for_loss > 0 ||
                        currentPlayer.estatisticas.defesa.sacks_forcado > 0 ||
                        currentPlayer.estatisticas.defesa.fumble_forcado > 0 ||
                        currentPlayer.estatisticas.defesa.interceptacao_forcada > 0 ||
                        currentPlayer.estatisticas.defesa.passe_desviado > 0 ||
                        currentPlayer.estatisticas.defesa.safety > 0 ||
                        currentPlayer.estatisticas.defesa.td_defensivo > 0
                    ) &&
                    (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (DEFESA)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">TACKELS (TOTAIS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.defesa.tackles_totais}</div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">TACKLES (FOR LOSS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.defesa.tackles_for_loss}</div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">SACKS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.defesa.sacks_forcado}</div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FUMBLES FORÇADOS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.defesa.fumble_forcado}</div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">INTERCEPTAÇÕES</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.defesa.interceptacao_forcada}</div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">PASSES DESVIADOS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">{currentPlayer.estatisticas.defesa.passe_desviado}</div>
                                    </div>
                                </div>
                                <div className='flex justify-start gap-28'>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">SAFETY</div>
                                        <div className="text-[34px] font-extrabold italic">{currentPlayer.estatisticas.defesa.safety}</div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">TOUCHDOWNS</div>
                                        <div className="text-[34px] font-extrabold italic">{currentPlayer.estatisticas.defesa.td_defensivo}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {currentPlayer.estatisticas?.kicker &&
                    (
                        currentPlayer.estatisticas.kicker.xp_bons > 0 ||
                        currentPlayer.estatisticas.kicker.tentativas_de_xp > 0 ||
                        currentPlayer.estatisticas.kicker.fg_bons > 0 ||
                        currentPlayer.estatisticas.kicker.tentativas_de_fg > 0 ||
                        currentPlayer.estatisticas.kicker.fg_mais_longo > 0 ||
                        currentPlayer.estatisticas.kicker.fg_0_10 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_11_20 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_21_30 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_31_40 !== "" ||
                        currentPlayer.estatisticas.kicker.fg_41_50 !== ""
                    ) &&
                    (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (KICKER)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">EXTRA-POINTS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.kicker.xp_bons}/{currentPlayer.estatisticas.kicker.tentativas_de_xp}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">EXTRA-POINTS (%)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.kicker.tentativas_de_xp > 0
                                                ? ((currentPlayer.estatisticas.kicker.xp_bons / currentPlayer.estatisticas.kicker.tentativas_de_xp) * 100)
                                                    .toFixed(1)
                                                    .replace('.', ',') + '%'
                                                : '0%'}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FIELD GOALS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.kicker.fg_bons}/{currentPlayer.estatisticas.kicker.tentativas_de_fg}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FIELD GOALS (%)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.kicker.tentativas_de_fg > 0
                                                ? ((currentPlayer.estatisticas.kicker.fg_bons / currentPlayer.estatisticas.kicker.tentativas_de_fg) * 100)
                                                    .toFixed(1)
                                                    .replace('.', ',') + '%'
                                                : '0%'}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">MAIS LONGO</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.kicker.fg_mais_longo}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FG (0-10 JDS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.kicker.fg_0_10}
                                        </div>
                                    </div>
                                </div>
                                <div className='border-b border-black/40 flex justify-start gap-28'>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FG (11-20 JDS)</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.kicker.fg_11_20}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FG (21-30 JDS)</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.kicker.fg_21_30}
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-start gap-28'>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FG (31-40 JDS)</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.kicker.fg_31_40}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">FG (41-50 JDS)</div>
                                        <div className="text-[34px] font-extrabold italic">
                                            {currentPlayer.estatisticas.kicker.fg_41_50}
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}

                {currentPlayer.estatisticas?.punter &&
                    (
                        currentPlayer.estatisticas.punter.punts > 0 ||
                        currentPlayer.estatisticas.punter.jardas_de_punt > 0
                    ) && (
                        <div className='xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto'>
                            <div className="border py-2 px-3 font-extrabold text-white text-xs w-36 flex justify-center items-center rounded-md mb-3"
                                style={{ backgroundColor: currentTeam?.cor }}>STATS (PUNTER)</div>
                            <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                                <div className="border-b border-black/40 flex justify-start gap-24">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">PUNTS</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.punter.punts}
                                        </div>
                                    </div>
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (TOTAIS)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.punter.jardas_de_punt}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-b border-black/40 flex justify-start gap-28">
                                    <div className='flex-1 justify-start'>
                                        <div className="text-xs xl:text-lg">JARDAS (AVG)</div>
                                        <div className="text-[34px] font-extrabold italic mb-1">
                                            {currentPlayer.estatisticas.punter.punts > 0
                                                ? (currentPlayer.estatisticas.punter.jardas_de_punt / currentPlayer.estatisticas.punter.punts).toFixed(1)
                                                : '0'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
            </div>
        </div>
    );
}
