// app/noticias/[id]/page.tsx
"use client"

import { Noticias } from '@/data/noticias'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function NoticiaDetalhes() {
  const params = useParams()
  const noticiaId = Number(params.id)

  const noticia = Noticias.find(n => n.id === noticiaId)

  if (!noticia) {
    return (
      <div className="min-h-screen bg-[#1C1C24] flex justify-center items-center">
        <p className="text-white">Notícia não encontrada</p>
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

          <div className="flex justify-between items-center text-sm text-gray-500 mb-8">
            <span>Por {noticia.autor}</span>
            <span>{new Date(noticia.createdAt).toLocaleDateString('pt-BR')}</span>
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