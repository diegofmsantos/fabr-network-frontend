"use client";

import { Time } from "@/types/time";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PageSkeleton } from "./ui/PageSkeleton";
import { TimeSkeleton } from "./ui/TimeSkeleton";

type Props = {
    times: Time[];
};

export const ListaTimes = ({ times }: Props) => {
    const itemVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    };

    const [loading, setLoading] = useState(true);

    // Simulando carregamento
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false); // Alterar para false após um pequeno delay
        }, 1000); // Delay de 1 segundo para simular o carregamento
        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return (
            <TimeSkeleton />
        );
    }

    return (
        <motion.div
            className="grid grid-cols-4 gap-4 p-3 bg-[#ECECEC] relative"
            initial="hidden"
            animate="visible"
            variants={{
                visible: { transition: { staggerChildren: 0.1 } },
            }}
        >
            {times
                .sort((a, b) => (a.sigla ?? "").localeCompare(b.sigla ?? ""))
                .map((item) => (
                    <motion.div
                        key={item.nome}
                        variants={itemVariants}
                        className="relative border border-gray-300 rounded-lg overflow-hidden group"
                    >
                        <Link href={`/${item.nome}`} className="relative z-20">
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity"
                                style={{ backgroundColor: item.cor ?? "#000" }}
                            ></div>
                            <div className="relative text-center font-extrabold italic z-10 min-[320px]:text-[22px] min-[400px]:text-[31px] md:text-[45px]">
                                <div>{item.sigla ?? "N/A"}</div>
                                <div className="flex flex-col -mt-5 justify-center items-center gap-2 min-h-28 p-2">
                                    <Image
                                        src={`/assets/times/capacetes/${item.capacete}`}
                                        alt="Capacete"
                                        width={90}
                                        height={90}
                                        quality={100}
                                        className="w-auto h-auto rotate-12"
                                    />
                                    <Image
                                        src={`/assets/times/logos/${item.logo}`}
                                        alt="Logo"
                                        width={35}
                                        height={35}
                                        quality={100}
                                        className="w-auto h-auto"
                                    />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
        </motion.div>
    );
};
