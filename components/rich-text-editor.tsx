'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Bold, Italic, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] p-4',
      },
    },
  })

  const [selectedColor, setSelectedColor] = useState('#000000')

  // Sincronizar cor selecionada com a cor atual do editor
  useEffect(() => {
    if (editor) {
      const updateColor = () => {
        const color = editor.getAttributes('textStyle').color
        if (color) {
          setSelectedColor(color)
        }
      }
      
      editor.on('selectionUpdate', updateColor)
      editor.on('transaction', updateColor)
      
      return () => {
        editor.off('selectionUpdate', updateColor)
        editor.off('transaction', updateColor)
      }
    }
  }, [editor])

  if (!editor) {
    return null
  }

  const handleColorChange = (color: string) => {
    if (color && /^#[0-9A-Fa-f]{6}$/i.test(color)) {
      setSelectedColor(color)
      editor.chain().focus().setColor(color).run()
    }
  }

  const getCurrentColor = () => {
    const color = editor.getAttributes('textStyle').color
    return color || selectedColor || '#000000'
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50 flex-wrap">
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-gray-600" />
          <div className="flex gap-2 items-center">
            <Input
              type="color"
              value={getCurrentColor()}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-10 h-8 p-1 cursor-pointer"
              title="Selecione a cor"
            />
            <Input
              type="text"
              value={selectedColor}
              onChange={(e) => {
                const value = e.target.value
                if (/^#[0-9A-Fa-f]{0,6}$/i.test(value)) {
                  setSelectedColor(value)
                  if (value.length === 7) {
                    handleColorChange(value)
                  }
                }
              }}
              placeholder="#000000"
              className="w-24 h-8 text-xs"
              maxLength={7}
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="h-8 px-2 text-xs ml-2"
        >
          Sem cor
        </Button>
      </div>
      
      {/* Editor */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
      
      {placeholder && !editor.getText() && (
        <div className="absolute top-16 left-4 text-gray-400 text-sm pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}

