"use client"

import Link from 'next/link'
import Image from 'next/image'
import { Loading } from '@/components/ui/Loading'
import { useNoticias } from '@/hooks/queries'

export default function NoticiasPage() {
    const {
        data: noticias = [],
        isLoading: loading
    } = useNoticias()

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ECECEC] flex justify-center items-center">
                <Loading />
            </div>
        )
    }

    return (
        <div className="bg-[#ECECEC] min-h-screen pb-20 pt-4">
            <h1 className="text-[40px] bg-[#ECECEC] fixed mt-16 z-50 ml-2 text-black w-full p-4 px-2 font-extrabold italic leading-[55px] tracking-[-5px] uppercase xl:ml-20 2xl:ml-44">
                Últimas Notícias
            </h1>
            <div className="container mx-auto max-w-7xl px-4 mt-40 mb-10">
                <div className="grid grid-cols-1 gap-6">
                    {noticias.map((noticia) => (
                        <Link href={`/noticias/${noticia.id}`} key={noticia.id}>
                            <div className="rounded-lg overflow-hidden shadow-lg bg-white flex flex-col md:flex-row md:h-60">
                                <div className="relative w-full md:w-2/5 h-48 md:h-full">
                                    <Image
                                        src={noticia.imagem}
                                        alt={noticia.titulo}
                                        width={800}
                                        height={600}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex flex-col justify-between w-full md:w-3/5 p-4">
                                    <div>
                                        <h2 className="text-xl font-bold mb-2">{noticia.titulo}</h2>
                                        <p className="text-gray-400">{noticia.subtitulo}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 h-10">
                                                <Image
                                                    src={noticia.autorImage}
                                                    alt={noticia.autor}
                                                    fill
                                                    className="rounded-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium">Por {noticia.autor}</span>
                                        </div>
                                        <span>{new Date(noticia.createdAt).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}