'use client'

import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { ZoomIn, ZoomOut } from 'lucide-react'

const ZOOM_MIN = 0.5
const ZOOM_MAX = 3
const ZOOM_STEP = 0.1
const ZOOM_BUTTON_STEP = 0.25

interface PhotoCropEditorProps {
  photoUrl: string
  open: boolean
  onClose: () => void
  onSave: (result: CroppedImageResult) => void
  initialCrop?: CropData
}

export interface CropData {
  x: number
  y: number
  zoom: number
  width: number
  height: number
}

export interface CroppedImageResult {
  croppedImageUrl: string
  cropData: CropData
}

export function PhotoCropEditor({ 
  photoUrl, 
  open, 
  onClose, 
  onSave,
  initialCrop 
}: PhotoCropEditorProps) {
  const [crop, setCrop] = useState({ x: initialCrop?.x || 0, y: initialCrop?.y || 0 })
  const [zoom, setZoom] = useState(initialCrop?.zoom ?? 0.5)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  // Sincronizar estado quando o dialog abrir ou initialCrop mudar
  useEffect(() => {
    if (open) {
      setCrop({ x: initialCrop?.x || 0, y: initialCrop?.y || 0 })
      setZoom(initialCrop?.zoom ?? 0.5)
    }
  }, [open, initialCrop?.x, initialCrop?.y, initialCrop?.zoom])

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    if (croppedAreaPixels) {
      try {
        const cropData: CropData = {
          x: crop.x,
          y: crop.y,
          zoom,
          width: croppedAreaPixels.width,
          height: croppedAreaPixels.height
        }
        
        // Processar imagem no servidor (evita problema de CORS)
        const response = await fetch('/api/admin/crop-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: photoUrl,
            cropData: {
              x: croppedAreaPixels.x,
              y: croppedAreaPixels.y,
              width: croppedAreaPixels.width,
              height: croppedAreaPixels.height
            }
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || `Erro ao processar imagem: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        
        if (!result.url) {
          throw new Error('URL da imagem cropada não retornada')
        }
        
        onSave({
          croppedImageUrl: result.url,
          cropData
        })
        onClose()
      } catch (error: any) {
        console.error('Erro ao processar imagem:', error)
        alert(`Erro ao processar imagem: ${error.message || 'Erro desconhecido'}\n\nVerifique o console para mais detalhes.`)
      }
    }
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(0.5)
  }

  const handleZoomOut = () => {
    setZoom((z) => Math.max(ZOOM_MIN, Math.round((z - ZOOM_BUTTON_STEP) * 100) / 100))
  }
  const handleZoomIn = () => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.round((z + ZOOM_BUTTON_STEP) * 100) / 100))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] bg-white dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>Ajustar Foto para o Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Área de Crop */}
          <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={photoUrl}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: {
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f3f4f6'
                }
              }}
            />
          </div>

          {/* Controle de Zoom: botões + valor + slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">Zoom</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  aria-label="Diminuir zoom"
                  className="h-10 w-10 shrink-0"
                >
                  <ZoomOut className="w-5 h-5" />
                </Button>
                <span className="min-w-[3.5rem] text-center text-sm font-semibold tabular-nums" aria-live="polite">
                  {zoom.toFixed(1)}x
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  aria-label="Aumentar zoom"
                  className="h-10 w-10 shrink-0"
                >
                  <ZoomIn className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="py-2 px-1">
              <Slider
                value={[zoom]}
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                step={ZOOM_STEP}
                onValueChange={(values) => setZoom(values[0])}
                className="w-full"
                aria-label="Controle de zoom da foto"
              />
            </div>
          </div>

          {/* Instruções */}
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Como usar:</strong> Clique e arraste a foto em qualquer direção (↑ ↓ ← →) para reposicionar. 
              Use o controle de zoom (0.5x a 3x) para aproximar ou afastar. 
              A área circular mostra como a foto aparecerá no Post 1. Comece com zoom reduzido para ver a foto completa.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Resetar
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
            Salvar Ajuste
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

