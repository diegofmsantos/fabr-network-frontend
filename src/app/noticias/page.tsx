"use client"

import { Noticias } from '@/data/noticias'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Noticia } from '@/types/noticia'
import { getNoticias } from '@/api/api'
import { Loading } from '@/components/ui/Loading'

export default function NoticiasPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                // Usa a função getNoticias para buscar as notícias
                const noticiasResponse = await getNoticias();
                setNoticias(noticiasResponse);
            } catch (error) {
                console.error('Erro ao carregar notícias:', error);
            } finally {
                setLoading(false)
            }
        }

        fetchNoticias()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#ECECEC] flex justify-center items-center">
                <Loading />
            </div>
        )
    }


    return (
        <div className="bg-[#ECECEC] min-h-screen pb-20 pt-4">
            <h1
                className="text-[40px] bg-[#ECECEC] fixed mt-16 z-50 ml-2 text-black w-full p-4 px-2 font-extrabold italic leading-[55px] tracking-[-5px] uppercase xl:ml-20 2xl:ml-44">
                Últimas Notícias
            </h1>
            <div className="container mx-auto px-4 mt-40 mb-10">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {noticias.map((noticia) => (
                        <Link href={`/noticias/${noticia.id}`} key={noticia.id}>
                            <div className="rounded-lg overflow-hidden shadow-lg bg-white">
                                <div className="relative h-48 w-full">
                                    <Image
                                        src={noticia.imagem}
                                        alt={noticia.titulo}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-2">{noticia.titulo}</h2>
                                    <p className="text-gray-400 mb-4">{noticia.subtitulo}</p>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
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