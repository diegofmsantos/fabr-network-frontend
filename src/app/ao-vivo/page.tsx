"use client"

import { Loading } from '@/components/ui/Loading'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'
import { useNoticiaAoVivo } from '@/hooks/queries'

export default function AoVivoPage() {
  const { data: noticia, isLoading } = useNoticiaAoVivo()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ECECEC] flex justify-center items-center">
        <Loading />
      </div>
    )
  }

  if (!noticia) {
    return (
      <div className="bg-[#ECECEC] min-h-screen pb-16 pt-[83px] max-w-[800px] mx-auto xl:ml-96 xl:mr-12 2xl:ml-[550px] 2xl:mr-20 2xl:max-w-[1000px]">
        <Link
          href={`/`}
          className='fixed top-8 left-5 rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-gray-300/40 z-50 xl:left-[380px] 2xl:left-[550px]'
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Link>
        <div className="max-w-4xl mx-auto p-4 mr-1 bg-white text-center py-20">
          <h1 className="text-2xl font-bold mb-2">Nenhuma transmissão no momento</h1>
          <p className="text-gray-500">Volte na sexta-feira antes do fim de semana de jogos para ver os links das transmissões.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#ECECEC] min-h-screen pb-16 pt-[83px] max-w-[800px] mx-auto xl:ml-96 xl:mr-12 2xl:ml-[550px] 2xl:mr-20 2xl:max-w-[1000px]">
      <Link
        href={`/`}
        className='fixed top-8 left-5 rounded-full text-xs text-[#63E300] p-2 w-8 h-8 flex justify-center items-center bg-gray-300/40 z-50 xl:left-[380px] 2xl:left-[550px]'
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </Link>

      <div className="max-w-4xl mx-auto p-4 mr-1 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{noticia.titulo}</h1>
          <h2 className="text-[18px] text-gray-400 mb-6">{noticia.subtitulo}</h2>

          <div className="relative w-full max-w-4xl mx-auto mb-8">
            <div className="relative w-full">
              <Image
                src={noticia.imagem || '/placeholder-avatar.png'}
                alt={noticia.titulo}
                width={1200}
                height={800}
                className="w-full rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-avatar.png'
                }}
                priority
              />
            </div>
            {noticia.legenda && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-sm">
                {noticia.legenda}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between items-start gap-2 mb-8">
            <div className='flex items-center gap-3'>
              <div className="relative w-10 h-10">
                <Image
                  src={noticia.autorImage || '/placeholder-avatar.png'}
                  alt={noticia.autor}
                  fill
                  className="rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/placeholder-avatar.png'
                  }}
                />
              </div>
              <span className="text-xs text-gray-500">Por {noticia.autor}</span>
            </div>
            <div className='flex gap-2 italic'>
              <span className="text-xs text-gray-500">
                Atualizado: {new Date(noticia.updatedAt).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Sao_Paulo'
                })}
              </span>
            </div>
          </div>

          <div
            className="materia-content prose max-w-none flex flex-col gap-1 [&_a]:text-[#0066cc] [&_a]:underline hover:[&_a]:no-underline [&>p]:mb-2 [&>p]:leading-relaxed [&>strong]:font-bold [&>em]:italic"
            dangerouslySetInnerHTML={{
              __html: noticia.texto
                .replace(/<p>&nbsp;<\/p>/g, '')
                .split('\n')
                .filter((line: string) => line.trim())
                .map((line: string) => `<p>${line}</p>`)
                .join('')
                .replace(/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi, (match: string) => {
                  const entities: { [key: string]: string } = {
                    '&aacute;': 'á',
                    '&eacute;': 'é',
                    '&iacute;': 'í',
                    '&oacute;': 'ó',
                    '&uacute;': 'ú',
                    '&ccedil;': 'ç',
                    '&atilde;': 'ã',
                    '&otilde;': 'õ',
                    '&acirc;': 'â',
                    '&ecirc;': 'ê',
                    '&ocirc;': 'ô',
                    '&nbsp;': ' ',
                  }
                  return entities[match] || match
                })
            }}
          />
        </div>
      </div>
    </div>
  )
}
