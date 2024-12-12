"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { ButtonTime } from "@/components/ui/buttonTime";
import Image from "next/image";
import { Time } from "@/types/time";

type TimeHeaderProps = {
    currentTeam: Time;
    selectedButton: string;
    selectedSetor: string;
};

export default function TimeHeader({
    currentTeam,
    selectedButton,
    selectedSetor,
}: TimeHeaderProps) {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);
    const height = useTransform(scrollY, [0, 200], [330, 50]);
    const capacetePath = `/assets/times/capacetes/${currentTeam.capacete || "default-capacete.png"}`;

    return (
        <motion.div className="w-full fixed z-50" style={{ height }}>
            <motion.div
                className="p-4 w-full h-full flex flex-col justify-center items-center rounded-b-xl"
                style={{ backgroundColor: currentTeam.cor || "#000" }}
            >
                <Link
                    href="/"
                    className="absolute top-4 left-5 rounded-xl text-xs text-white py-1 px-2 bg-black/20"
                >
                    {currentTeam.sigla || "N/A"}
                    <FontAwesomeIcon icon={faAngleDown} className="ml-1" />
                </Link>

                <motion.div className="flex flex-col justify-center items-center" style={{ opacity }}>
                    <div className="text-[45px] text-white text-center px-6 font-extrabold italic leading-[35px] tracking-[-3px]">
                        {currentTeam.nome?.toUpperCase() || "Time Indefinido"}
                    </div>

                    {currentTeam.capacete && (
                        <div className="w-40 h-40 rotate-[15deg]">
                            <Image
                                src={capacetePath}
                                alt={`${currentTeam.nome || "Time"} capacete`}
                                width={160}
                                height={160}
                                quality={100}
                                priority
                                className="w-auto h-auto"
                            />
                        </div>
                    )}
                </motion.div>

                <motion.div className="flex justify-between gap-8 -mt-3" style={{ opacity }}>
                    <ButtonTime
                        label="TIME"
                        href={`/${currentTeam?.nome?.toLowerCase()}?show=time`}
                        isSelected={selectedButton === "time"}
                    />
                    <ButtonTime
                        label="JOGADORES"
                        href={`/${currentTeam?.nome?.toLowerCase()}?show=jogadores&setor=${selectedSetor}`}
                        isSelected={selectedButton === "jogadores"}
                    />

                </motion.div>
            </motion.div>
        </motion.div>
    );
}
