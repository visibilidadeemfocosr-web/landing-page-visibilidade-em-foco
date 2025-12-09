'use client'

import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AudioDescriptionButtonProps {
  text: string
  sectionId?: string
  className?: string
  variant?: 'default' | 'subtle' | 'icon-only'
  label?: string
}

/**
 * Componente para leitura de texto usando SpeechSynthesis API nativa
 * Detecta automaticamente se há leitor de tela ativo para evitar conflitos
 */
export function AudioDescriptionButton({ 
  text, 
  sectionId,
  className,
  variant = 'default',
  label = 'Ouvir descrição em voz alta'
}: AudioDescriptionButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [hasScreenReader, setHasScreenReader] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)

  // Verificar suporte e detectar leitor de tela
  useEffect(() => {
    // Verificar se a API está disponível
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true)
      synthesisRef.current = window.speechSynthesis

      // Detectar leitor de tela através de várias técnicas
      const detectScreenReader = () => {
        // Detecção conservadora - apenas indicadores claros de leitor de tela
        
        // 1. Verificar user agent (alguns leitores modificam isso)
        const ua = navigator.userAgent.toLowerCase()
        const screenReaderIndicators = [
          'nvda', 'jaws', 'voiceover', 'talkback', 'orca', 'chromevox'
        ]
        const hasScreenReaderUA = screenReaderIndicators.some(indicator => ua.includes(indicator))

        // 2. Verificar se há extensões ativas conhecidas (menos confiável, mas útil)
        // Alguns leitores podem deixar rastros no DOM ou window object
        
        // 3. Verificar preferências explícitas de acessibilidade
        // Mas apenas se combinado com outros indicadores para evitar falsos positivos
        
        return hasScreenReaderUA
      }

      setHasScreenReader(detectScreenReader())
    }

    // Cleanup ao desmontar
    return () => {
      if (synthesisRef.current && isPlaying) {
        synthesisRef.current.cancel()
      }
    }
  }, [])

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (synthesisRef.current) {
        synthesisRef.current.cancel()
      }
    }
  }, [])

  const handlePlay = () => {
    if (!isSupported || !synthesisRef.current) {
      console.warn('SpeechSynthesis não está disponível')
      return
    }

    // Se já estiver tocando, pausar
    if (isPlaying && !isPaused) {
      synthesisRef.current.pause()
      setIsPaused(true)
      return
    }

    // Se estiver pausado, continuar
    if (isPaused) {
      synthesisRef.current.resume()
      setIsPaused(false)
      return
    }

    // Criar nova utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pt-BR'
    utterance.rate = 1.0 // Velocidade normal
    utterance.pitch = 1.0 // Tom normal
    utterance.volume = 1.0 // Volume máximo

    // Event listeners
    utterance.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      utteranceRef.current = null
    }

    utterance.onerror = (event) => {
      // "interrupted" é um erro esperado quando o usuário cancela/pausa a fala
      // Não é necessário logar ou tratar como erro real
      if (event.error !== 'interrupted') {
        console.warn('Erro na síntese de voz:', event.error)
      }
      setIsPlaying(false)
      setIsPaused(false)
      utteranceRef.current = null
    }

    utteranceRef.current = utterance
    synthesisRef.current.speak(utterance)
  }

  const handleStop = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setIsPlaying(false)
      setIsPaused(false)
      utteranceRef.current = null
    }
  }

  // Não renderizar se houver leitor de tela detectado ou se não for suportado
  if (hasScreenReader || !isSupported) {
    return null
  }

  // Variantes de estilo
  const getButtonStyles = () => {
    switch (variant) {
      case 'icon-only':
        return 'p-2 rounded-full shadow-md border border-gray-200 transition-all touch-manipulation hover:brightness-110'
      case 'subtle':
        return 'px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 bg-gray-100/80 hover:bg-gray-200 rounded-full transition-all touch-manipulation'
      default:
        return 'px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 touch-manipulation'
    }
  }
  
  const getButtonBgColor = () => {
    if (variant === 'icon-only') {
      return { backgroundColor: '#89f336' }
    }
    return {}
  }

  const getIcon = () => {
    const iconClassName = "w-4 h-4 text-gray-600"
    if (isPlaying && !isPaused) {
      return <Volume2 className={iconClassName} />
    }
    if (isPaused) {
      return <Loader2 className={iconClassName + " animate-spin"} />
    }
    return <Volume2 className={iconClassName} />
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <button
        onClick={handlePlay}
        onDoubleClick={handleStop}
        aria-label={isPlaying && !isPaused ? 'Pausar leitura' : isPaused ? 'Continuar leitura' : label}
        aria-pressed={isPlaying}
        className={cn(getButtonStyles(), 'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2')}
        style={getButtonBgColor()}
        title={isPlaying && !isPaused ? 'Clique para pausar. Duplo clique para parar' : isPaused ? 'Continuar leitura' : label}
      >
        {getIcon()}
        {variant !== 'icon-only' && (
          <span>
            {isPlaying && !isPaused ? 'Pausar' : isPaused ? 'Continuar' : 'Ouvir'}
          </span>
        )}
      </button>
      {isPlaying && (
        <button
          onClick={handleStop}
          aria-label="Parar leitura"
          className="text-xs text-gray-500 hover:text-gray-700 underline"
          title="Parar leitura"
        >
          Parar
        </button>
      )}
    </div>
  )
}