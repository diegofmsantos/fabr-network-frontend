import { Team } from "@/types/team"
import { differenceInYears, format } from "date-fns"
import { ptBR } from "date-fns/locale"

type Props = {
    currentTeam: Team
}

export const Time = ({ currentTeam }: Props) => {

    // Parse a data de fundação e calcula a idade
    const fundacaoDate = new Date(
        currentTeam.fundacao.split('/').reverse().join('-')
    );
    const idade = differenceInYears(new Date(), fundacaoDate);
    const fundacaoFormatada = format(fundacaoDate, "dd/MM/yyyy", { locale: ptBR });


    return (
        <div className="p-4 flex flex-col gap-8 xl:max-w-[1200px] xl:min-w-[1100px] xl:m-auto">
            <div>
                <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                    style={{ backgroundColor: currentTeam.cor }}>BIO</div>
                <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                    <div className="border-b border-black/40">
                        <div className="text-sm">FUNDAÇÃO</div>
                        <div className="text-lg font-extrabold italic mb-1">{`${fundacaoFormatada} (${idade} anos)`}</div>
                    </div>
                    <div className="border-b border-black/40">
                        <div className="text-sm">CIDADE</div>
                        <div className="text-lg font-extrabold italic mb-1">{currentTeam.cidade.toLocaleUpperCase()}</div>
                    </div>
                    <div>
                        <div className="text-sm">ESTÁDIO</div>
                        <div className="text-xl font-extrabold italic">{currentTeam.estadio.toLocaleUpperCase()}</div>
                    </div>
                </div>
            </div>
            <div >
                <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                    style={{ backgroundColor: currentTeam.cor }}>STAFF</div>
                <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                    <div className="border-b border-black/40">
                        <div className="text-sm">PRESIDENTE</div>
                        <div className="text-xl font-extrabold italic mb-1">{currentTeam.presidente}</div>
                    </div>
                    <div className="border-b border-black/40">
                        <div className="text-sm">HEAD COACH</div>
                        <div className="text-xl font-extrabold italic mb-1">{currentTeam.head_coach}</div>
                    </div>
                    <div className="border-b border-black/40">
                        <div className="text-sm">COORDENADOR OFENSIVO</div>
                        <div className="text-xl font-extrabold italic mb-1">{currentTeam.coord_ofen}</div>
                    </div>
                    <div>
                        <div className="text-sm">COORDENADOR DEFENSIVO</div>
                        <div className="text-xl font-extrabold italic">{currentTeam.coord_defen}</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="border py-2 px-3 font-extrabold text-white text-xs w-16 flex justify-center items-center rounded-md mb-3"
                    style={{ backgroundColor: currentTeam.cor }}>TÍTULOS</div>
                {currentTeam.titulos.length > 0 &&
                    <div className="bg-[#D9D9D9]/50 flex flex-col gap-4 p-4 rounded-lg">
                        <div className="border-b border-black/40">
                            <div className="text-sm">NACIONAIS</div>
                            <div className="text-xl font-extrabold italic mb-1">{currentTeam.titulos[0].nacionais}</div>
                        </div>
                        <div className="border-b border-black/40">
                            <div className="text-sm">REGIONAIS</div>
                            <div className="text-xl font-extrabold italic mb-1">{currentTeam.titulos[0].regionais}</div>
                        </div>
                        <div>
                            <div className="text-sm">ESTADUAIS</div>
                            <div className="text-xl font-extrabold italic">{currentTeam.titulos[0].estaduais}</div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}