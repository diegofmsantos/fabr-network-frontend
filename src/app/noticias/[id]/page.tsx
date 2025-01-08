"use client"

import { getNoticias } from '@/api/api'
import { Noticia } from '@/types/noticia'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function NoticiaDetalhes() {
  const params = useParams()
  const noticiaId = Number(params.id) // Obtém o ID da notícia a partir da URL
  const [loading, setLoading] = useState(true)
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [noticia, setNoticia] = useState<Noticia | null>(null)

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        // Usa a função getNoticias para buscar as notícias
        const noticiasResponse = await getNoticias();
        setNoticias(noticiasResponse);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        setLoading(false) // Marca o carregamento como concluído
      }
    };

    fetchNoticias();
  }, []);

  // Filtra a notícia específica com base no ID
  useEffect(() => {
    if (noticias.length > 0) {
      const foundNoticia = noticias.find(n => n.id === noticiaId)
      setNoticia(foundNoticia || null)
    }
  }, [noticias, noticiaId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex justify-center items-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex justify-center items-center">
        <p>Notícia não encontrada</p>
      </div>
    )
  }

  return (
    <div className="bg-[#ECECEC] min-h-screen pb-16 pt-[83px]">
      <Link
        href={`/noticias`}
        className='fixed top-8 left-5 rounded-full text-xs text-white p-2 w-8 h-8 flex justify-center items-center bg-gray-200/20 z-50 xl:left-32 2xl:left-[500px]'
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </Link>
      <div className="container mx-auto p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
          <h2 className="text-xl text-gray-400 mb-6">{noticia.subtitulo}</h2>

          <div className="relative h-64 w-full mb-8">
            <Image
              src={noticia.imagem}
              alt={noticia.titulo}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="flex justify-between items-center gap-1 mb-8">
            <div className='flex items-center gap-1'>
              <div className="relative w-10 h-10">
                <Image
                  src={noticia.autorImage}
                  alt={noticia.autor}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-xs text-gray-500">Por {noticia.autor}</span>
            </div>
            <div className='flex flex-col gap-2 italic'>
              <span className="text-xs text-gray-500">
                Postado: {new Date(noticia.createdAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="text-xs text-gray-500">
                Atualizado: {new Date(noticia.updatedAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div
            className="prose max-w-none"
            style={{ whiteSpace: 'pre-line' }}
          >
            {noticia.texto}
          </div>
        </div>
      </div>
    </div>
  )
}
