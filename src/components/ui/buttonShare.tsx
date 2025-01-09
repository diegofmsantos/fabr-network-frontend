"use client"

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faFacebookF,
    faTwitter,
    faWhatsapp,
    faInstagram
} from '@fortawesome/free-brands-svg-icons'

interface ShareButtonProps {
    title: string  // Nome do time (ex: "Recife Mariners")
    image: string  // Caminho da imagem do capacete
}

export function ShareButton({ title, image }: ShareButtonProps) {
    // Formata a URL de acordo com o padrão necessário
    const formatUrlPath = (name: string) => {
        const words = name.split(' ')
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('%20')
    }

    const baseUrl = 'https://fabrnetwork.com.br'
    const currentUrl = `${baseUrl}/${formatUrlPath(title)}`

    // Texto para o WhatsApp com o nome do time e a URL formatada
    const whatsappText = `FABR-Network\n\n${title} - ${currentUrl}`

    return (
        <div className="flex gap-2">
            {/* WhatsApp */}
            <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#25D366] hover:opacity-80 text-white transition-all"
            >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
            </a>

            {/* Facebook */}
            <a
                href={`http<as://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&picture=${encodeURIComponent(image)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#1877F2] hover:opacity-80 text-white transition-all"
            >
                <FontAwesomeIcon icon={faFacebookF} className="w-5 h-5" />
            </a>

            {/* Twitter */}
            <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#1DA1F2] hover:opacity-80 text-white transition-all"
            >
                <FontAwesomeIcon icon={faTwitter} className="w-5 h-5" />
            </a>

            {/* Instagram */}
            <a
                href={`instagram://library?AssetPath=${encodeURIComponent(image)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-[#E4405F] hover:opacity-80 text-white transition-all"
            >
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
            </a>
        </div>
    )
}