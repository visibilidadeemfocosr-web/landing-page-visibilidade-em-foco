'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { ZoomIn, ZoomOut } from 'lucide-react'

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
  const [zoom, setZoom] = useState(initialCrop?.zoom || 0.5)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

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
          throw new Error('Erro ao processar imagem')
        }

        const { url: croppedImageUrl } = await response.json()
        
        onSave({
          croppedImageUrl,
          cropData
        })
        onClose()
      } catch (error) {
        console.error('Erro ao processar imagem:', error)
      }
    }
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(0.5)
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

          {/* Controle de Zoom */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <ZoomOut className="w-4 h-4" />
                Zoom
              </span>
              <span className="text-muted-foreground flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
              </span>
            </div>
            <Slider
              value={[zoom]}
              min={0.5}
              max={3}
              step={0.05}
              onValueChange={(values) => setZoom(values[0])}
              className="w-full"
            />
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

