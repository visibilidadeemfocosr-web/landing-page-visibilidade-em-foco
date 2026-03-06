'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Mail, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface ArtistCardData {
  id: string
  name: string
  bio: string
  photo: string | null
  main_artistic_language: string
  other_artistic_languages: string
  instagram: string
  facebook: string
  linkedin: string
  email: string | null
}

interface ArtistsGridProps {
  artists: ArtistCardData[]
}

export function ArtistsGrid({ artists }: ArtistsGridProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortMode, setSortMode] = useState<'recentes' | 'nome'>('recentes')
  const [visibleCount, setVisibleCount] = useState<number>(9)
  const [openArtist, setOpenArtist] = useState<ArtistCardData | null>(null)

  const languageOptions = useMemo(() => {
    const set = new Set<string>()
    artists.forEach((artist) => {
      if (artist.main_artistic_language) {
        set.add(artist.main_artistic_language)
      }
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [artists])

  const filteredArtists = useMemo(() => {
    const base = artists.filter((artist) => {
      const matchesLanguage =
        selectedLanguages.length === 0 ||
        selectedLanguages.some(
          (lang) => artist.main_artistic_language.toLowerCase() === lang.toLowerCase()
        )

      if (!matchesLanguage) return false

      if (!searchQuery.trim()) return true

      const q = searchQuery.toLowerCase()
      const inName = artist.name.toLowerCase().includes(q)
      const inInstagram = artist.instagram?.toLowerCase().includes(q)

      return inName || inInstagram
    })

    if (sortMode === 'nome') {
      return [...base].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    }

    // 'recentes' mantém a ordem original vinda do servidor
    return base
  }, [artists, selectedLanguages, searchQuery, sortMode])

  // Se a URL tiver um hash #artista-<id>, abrir a modal automaticamente
  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash || !hash.startsWith('#artista-')) return

    const id = hash.replace('#artista-', '')
    const artistFromHash = artists.find((a) => a.id === id)
    if (!artistFromHash) return

    setOpenArtist(artistFromHash)

    // Rolagem suave até o card correspondente
    const el = document.getElementById(`artista-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [artists])

  if (!artists || artists.length === 0) {
    return (
      <div className="border border-dashed border-gray-300 rounded-2xl p-10 text-center bg-white">
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Em breve, artistas em foco por aqui
        </p>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          A curadoria está em andamento. Assim que os perfis forem aprovados e publicados nas redes,
          eles também aparecerão nesta página.
        </p>
      </div>
    )
  }

  return (
    <>
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:w-80">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Buscar por nome ou @
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: Madu, @artista..."
              className="w-full rounded-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
            />
          </div>

          <div className="w-full sm:w-56">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Ordenar por
            </label>
            <div className="inline-flex rounded-full border border-gray-300 bg-white p-1 text-xs">
              <button
                type="button"
                onClick={() => setSortMode('recentes')}
                className={`px-3 py-1 rounded-full ${
                  sortMode === 'recentes'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Mais recentes
              </button>
              <button
                type="button"
                onClick={() => setSortMode('nome')}
                className={`px-3 py-1 rounded-full ${
                  sortMode === 'nome'
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Nome A–Z
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            Filtrar por linguagem artística (pode escolher mais de uma)
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedLanguages([])}
              className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${
                selectedLanguages.length === 0
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
              }`}
            >
              Todas as linguagens
            </button>
            {languageOptions.map((lang) => {
              const isActive = selectedLanguages.includes(lang)
              const shortLabel = lang.includes('(') ? lang.split('(')[0].trim() : lang
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() =>
                    setSelectedLanguages((current) =>
                      isActive ? current.filter((l) => l !== lang) : [...current, lang]
                    )
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-medium tracking-wide max-w-full ${
                    isActive
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <span className="truncate max-w-[180px] inline-block align-middle">
                    {shortLabel}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {filteredArtists.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
          Nenhum artista encontrado para os filtros atuais. Tente limpar a busca ou escolher outra
          linguagem.
        </div>
      ) : (
        <>
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {filteredArtists.slice(0, visibleCount).map((artist) => (
            <button
              key={artist.id}
              id={`artista-${artist.id}`}
              type="button"
              onClick={() => setOpenArtist(artist)}
              className="text-left"
            >
              <article
                className="group h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                {artist.photo && (
                  <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image
                      src={artist.photo}
                      alt={`Foto de ${artist.name}`}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex-1 flex flex-col p-5 sm:p-6">
                  <div className="mb-3 space-y-2">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                      {artist.name}
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-purple-50 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-purple-700">
                      {(artist.main_artistic_language &&
                        artist.main_artistic_language.split('(')[0].trim()) ||
                        'Artista em foco'}
                    </span>
                  </div>

                  {artist.other_artistic_languages && (
                    <p className="text-xs text-gray-500 mb-2">
                      Outras linguagens:{' '}
                      <span className="font-medium">{artist.other_artistic_languages}</span>
                    </p>
                  )}

                  {artist.bio && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-5 whitespace-pre-line">
                      {artist.bio}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {artist.instagram && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white px-3 py-1">
                          <span>@</span>
                          <span className="font-medium truncate max-w-[120px]">
                            {artist.instagram}
                          </span>
                        </span>
                      )}
                      {!artist.instagram && artist.linkedin && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-3 py-1">
                          <span className="font-medium truncate max-w-[120px]">LinkedIn</span>
                        </span>
                      )}
                      {!artist.instagram && !artist.linkedin && artist.facebook && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1">
                          <span className="font-medium truncate max-w-[120px]">Facebook</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </button>
          ))}
        </div>

        {visibleCount < filteredArtists.length && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 9)}
              className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              Carregar mais artistas
            </button>
          </div>
        )}
        </>
      )}
    </div>

    {openArtist && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {openArtist.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenArtist(null)}
              className="rounded-full border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
            >
              Fechar
            </button>
          </div>

          {openArtist.photo && (
            <div className="mt-4 relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black">
              <Image
                src={openArtist.photo}
                alt={`Foto de ${openArtist.name}`}
                fill
                className="object-contain"
              />
            </div>
          )}

          {openArtist.main_artistic_language && (
            <p className="mt-4 text-xs uppercase tracking-wide text-purple-700">
              {openArtist.main_artistic_language}
            </p>
          )}

          {openArtist.other_artistic_languages && (
            <p className="mt-4 text-xs text-gray-600">
              <span className="font-semibold">Outras linguagens: </span>
              {openArtist.other_artistic_languages}
            </p>
          )}

          {openArtist.bio && (
            <div className="mt-4 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {openArtist.bio}
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-4 space-y-4 text-xs text-gray-700">
            <div>
              <p className="mb-1 font-semibold text-gray-800">
                Conheça mais meu trabalho
              </p>
              <div className="flex flex-wrap gap-2">
                {openArtist.instagram && (
                  <a
                    href={`https://instagram.com/${openArtist.instagram.replace('@', '').trim()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-gray-900 text-white px-3 py-1 hover:bg-black transition-colors"
                  >
                    <span>@</span>
                    <span className="font-medium truncate max-w-[160px]">
                      {openArtist.instagram}
                    </span>
                  </a>
                )}
                {openArtist.facebook && (
                  <a
                    href={openArtist.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 hover:bg-blue-100 transition-colors"
                  >
                    <span className="font-medium truncate max-w-[160px]">
                      Facebook
                    </span>
                  </a>
                )}
                {openArtist.linkedin && (
                  <a
                    href={openArtist.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-3 py-1 hover:bg-sky-100 transition-colors"
                  >
                    <span className="font-medium truncate max-w-[160px]">
                      LinkedIn
                    </span>
                  </a>
                )}
              </div>
            </div>

            {openArtist.email && (
              <div>
                <p className="mt-2 mb-1 font-semibold text-gray-800">
                  Entre em contato
                </p>
                <a
                  href={`mailto:${openArtist.email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-900 bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-black hover:border-black transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="truncate max-w-[220px]">{openArtist.email}</span>
                </a>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              const shareUrl = `${window.location.origin}${window.location.pathname}#artista-${openArtist.id}`

              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard
                  .writeText(shareUrl)
                  .then(() => {
                    toast.success('Link do artista copiado. Agora é só colar onde quiser.')
                  })
                  .catch(() => {
                    // Fallback: mostrar o link para copiar manualmente
                    window.prompt(
                      'Não foi possível copiar automaticamente. Copie o link abaixo:',
                      shareUrl
                    )
                  })
              } else {
                window.prompt('Copie o link do artista:', shareUrl)
              }
            }}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-800 hover:bg-gray-100"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Copiar link do artista</span>
          </button>
        </div>
      </div>
    )}
    </>
  )
}

