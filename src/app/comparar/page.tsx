"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CompararPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redireciona automaticamente para comparar jogadores
    router.replace('/comparar/jogadores')
  }, [router])

  return null 
}