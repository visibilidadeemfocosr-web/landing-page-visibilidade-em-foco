'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, GripVertical, Check, X, Bold as BoldIcon, Italic as ItalicIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { Question, FieldType } from '@/lib/supabase/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// Componente para renderizar HTML formatado
function FormattedQuestionText({ html }: { html: string }) {
  if (!html) return null
  
  // Verificar se contém tags HTML
  const hasHtml = /<[a-z][\s\S]*>/i.test(html)
  
  if (hasHtml) {
    return (
      <span 
        dangerouslySetInnerHTML={{ __html: html }}
        className="[&_strong]:font-bold [&_em]:italic [&_i]:italic [&_p]:mb-0 [&_p]:inline [&_p_strong]:font-bold [&_p_em]:italic"
      />
    )
  }
  
  return <span>{html}</span>
}

// Componente SortableItem para cada pergunta
function SortableQuestionItem({ question, onEdit, onDelete }: { question: Question; onEdit: (q: Question) => void; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors bg-background"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none"
            type="button"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>
          <span className="text-sm text-muted-foreground">#{question.order}</span>
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
            {translateFieldType(question.field_type)}
          </span>
          {question.required && (
            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
              Obrigatório
            </span>
          )}
          {!question.active && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              Inativa
            </span>
          )}
        </div>
        <p className="font-medium text-base">
          <FormattedQuestionText html={question.text} />
        </p>
      </div>
      <div className="flex gap-2 ml-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(question)}
          className="min-h-[44px] min-w-[44px] touch-manipulation"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(question.id)}
          className="min-h-[44px] min-w-[44px] touch-manipulation"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Componente de Editor Rico
function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[100px] p-3',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!mounted || !editor) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="min-h-[100px] p-3 bg-muted/30 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
          title="Negrito (Ctrl+B)"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
          title="Itálico (Ctrl+I)"
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
      </div>
      {/* Editor */}
      <div className="min-h-[100px] max-h-[300px] overflow-y-auto bg-background">
        <EditorContent 
          editor={editor}
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:p-3 [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror_strong]:font-bold [&_.ProseMirror_em]:italic [&_.ProseMirror_p]:mb-2 [&_.ProseMirror_p:last-child]:mb-0"
        />
      </div>
    </div>
  )
}

// Função para traduzir tipos de campo para português
const translateFieldType = (type: FieldType): string => {
  const translations: Record<FieldType, string> = {
    text: 'Texto',
    textarea: 'Área de Texto',
    number: 'Número',
    select: 'Seleção',
    radio: 'Radio Button',
    checkbox: 'Checkbox',
    yesno: 'Sim/Não',
    scale: 'Escala',
    image: 'Upload de Imagem',
    cep: 'CEP',
  }
  return translations[type] || type
}

export default function AdminQuestionsClient() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogSection, setDialogSection] = useState<string | null>(null) // Seção selecionada para nova pergunta
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingSectionName, setEditingSectionName] = useState('')
  const [formData, setFormData] = useState({
    text: '',
    field_type: 'text' as FieldType,
    required: false,
    order: 0,
    section: '',
    options: [] as string[],
    min_value: 1,
    max_value: 5,
    placeholder: '',
    active: true,
  })

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions')
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      toast.error('Erro ao carregar perguntas')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = '/api/admin/questions'
      const method = editingQuestion ? 'PUT' : 'POST'
      const body = editingQuestion 
        ? { id: editingQuestion.id, ...formData }
        : { ...formData, section: dialogSection || formData.section }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar')
      }

      toast.success(editingQuestion ? 'Pergunta atualizada!' : 'Pergunta criada!')
      setDialogOpen(false)
      setDialogSection(null)
      setEditingQuestion(null)
      loadQuestions()
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao salvar pergunta'
      toast.error(errorMessage)
      console.error('Erro ao salvar:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta pergunta?')) return

    try {
      const response = await fetch(`/api/admin/questions?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao deletar')

      toast.success('Pergunta deletada!')
      loadQuestions()
    } catch (error) {
      toast.error('Erro ao deletar pergunta')
    }
  }

  const handleEdit = (question: Question) => {
    setEditingQuestion(question)
    setDialogSection(null) // Resetar seção ao editar
    setFormData({
      text: question.text,
      field_type: question.field_type,
      required: question.required,
      order: question.order,
      section: question.section || '',
      options: question.options || [],
      min_value: question.min_value || 1,
      max_value: question.max_value || 5,
      placeholder: question.placeholder || '',
      active: question.active,
    })
    setDialogOpen(true)
  }

  const handleEditSection = (sectionName: string) => {
    setEditingSection(sectionName)
    setEditingSectionName(sectionName)
  }

  const handleSaveSection = async (oldSectionName: string, newSectionName: string) => {
    if (!newSectionName.trim() || newSectionName.trim() === oldSectionName) {
      setEditingSection(null)
      return
    }

    try {
      // Buscar todas as perguntas desta seção
      const sectionQuestions = questions.filter(q => q.section === oldSectionName)
      
      // Atualizar todas as perguntas desta seção
      const updatePromises = sectionQuestions.map(question =>
        fetch('/api/admin/questions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: question.id,
            text: question.text,
            field_type: question.field_type,
            required: question.required,
            order: question.order,
            section: newSectionName.trim(),
            options: question.options || [],
            min_value: question.min_value || null,
            max_value: question.max_value || null,
            placeholder: question.placeholder || null,
            active: question.active,
          }),
        })
      )

      await Promise.all(updatePromises)
      toast.success('Nome do bloco atualizado!')
      setEditingSection(null)
      loadQuestions()
    } catch (error) {
      toast.error('Erro ao atualizar nome do bloco')
      console.error(error)
    }
  }

  const handleCancelEditSection = () => {
    setEditingSection(null)
    setEditingSectionName('')
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent, sectionQuestions: Question[], section: string) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = sectionQuestions.findIndex((q) => q.id === active.id)
    const newIndex = sectionQuestions.findIndex((q) => q.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Reordenar localmente
    const reorderedQuestions = arrayMove(sectionQuestions, oldIndex, newIndex)

    // Calcular a ordem baseada na ordem mínima da seção
    const minOrder = Math.min(...sectionQuestions.map(q => q.order))
    
    // Atualizar a ordem no banco de dados
    try {
      const updatePromises = reorderedQuestions.map((question, index) => {
        const newOrder = minOrder + index
        return fetch('/api/admin/questions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: question.id,
            text: question.text,
            field_type: question.field_type,
            required: question.required,
            order: newOrder,
            section: question.section || null,
            options: question.options || [],
            min_value: question.min_value || null,
            max_value: question.max_value || null,
            placeholder: question.placeholder || null,
            active: question.active,
          }),
        })
      })

      await Promise.all(updatePromises)
      toast.success('Ordem das perguntas atualizada!')
      loadQuestions()
    } catch (error) {
      toast.error('Erro ao atualizar ordem das perguntas')
      console.error(error)
    }
  }

  const resetForm = () => {
    setEditingQuestion(null)
    setDialogSection(null)
    const nextOrder = questions.length > 0 ? questions.length + 1 : 1
    setFormData({
      text: '',
      field_type: 'text',
      required: false,
      order: nextOrder,
      options: [],
      min_value: 1,
      max_value: 5,
      placeholder: '',
      section: '',
      active: true,
    })
  }

  const openNewQuestionDialog = (sectionName: string | null) => {
    setDialogSection(sectionName)
    setEditingQuestion(null)
    const nextOrder = questions.length > 0 ? questions.length + 1 : 1
    setFormData({
      text: '',
      field_type: 'text',
      required: false,
      order: nextOrder,
      options: [],
      min_value: 1,
      max_value: 5,
      placeholder: '',
      section: sectionName || '',
      active: true,
    })
    setDialogOpen(true)
  }

  const handleCreateSection = () => {
    if (!newSectionName.trim()) {
      toast.error('Nome do bloco é obrigatório')
      return
    }
    // Apenas fecha o dialog - o bloco será criado quando a primeira pergunta for adicionada
    setNewSectionDialogOpen(false)
    openNewQuestionDialog(newSectionName.trim())
    setNewSectionName('')
  }

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ''],
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const removeOption = (index: number) => {
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    })
  }

  if (loading) {
    return <div className="container mx-auto px-6 py-8">Carregando...</div>
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Gerenciar Perguntas</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={newSectionDialogOpen} onOpenChange={setNewSectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto min-h-[44px] touch-manipulation">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Bloco
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Novo Bloco/Seção</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Nome do Bloco *</Label>
                  <Input
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="Ex: Dados Pessoais, Endereço, etc."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCreateSection()
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewSectionDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateSection}>
                    Criar Bloco
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open)
        if (!open) {
          setDialogSection(null)
          setEditingQuestion(null)
        }
      }}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[95vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl">
              {editingQuestion ? 'Editar Pergunta' : dialogSection ? `Nova Pergunta - ${dialogSection}` : 'Nova Pergunta'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="px-6 py-4">
            {/* Seção: Bloco/Organização */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border"></div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Organização</span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

              {dialogSection && !editingQuestion && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <Label className="text-xs text-muted-foreground mb-1 block">Bloco/Seção</Label>
                  <p className="text-base font-medium text-primary">
                    {dialogSection}
                  </p>
                </div>
              )}
              
              {!dialogSection && !editingQuestion && (
                <div>
                  <Label>Bloco/Seção (opcional)</Label>
                  <Input
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="Ex: Dados Pessoais, Endereço, etc."
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Agrupe perguntas relacionadas em blocos. Deixe em branco para não agrupar.
                  </p>
                </div>
              )}
              
              {editingQuestion && (
                <div>
                  <Label>Bloco/Seção</Label>
                  <Input
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="Ex: Dados Pessoais, Endereço, etc."
                    className="mt-1.5"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    O bloco/seção não pode ser alterado durante a edição. Para alterar, mova a pergunta para outro bloco.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Ordem *</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.order === 0 ? '' : formData.order}
                    onChange={(e) => {
                      const value = e.target.value
                      setFormData({ ...formData, order: value === '' ? 0 : parseInt(value, 10) || 0 })
                    }}
                    placeholder="1, 2, 3..."
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Posição da pergunta no formulário
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Configurações</Label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Switch
                        checked={formData.required}
                        onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                        className="h-[20px] w-[36px] [&>span]:size-[14px] [&>span]:data-[state=checked]:translate-x-[18px]"
                      />
                      <span className="text-sm font-normal text-foreground group-hover:text-primary transition-colors">
                        Obrigatório
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <Switch
                        checked={formData.active}
                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                        className="h-[20px] w-[36px] [&>span]:size-[14px] [&>span]:data-[state=checked]:translate-x-[18px]"
                      />
                      <span className="text-sm font-normal text-foreground group-hover:text-primary transition-colors">
                        Ativa
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Seção: Conteúdo da Pergunta */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-border"></div>
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Conteúdo</span>
                <div className="h-px flex-1 bg-border"></div>
              </div>

              <div>
                <Label>Texto da Pergunta *</Label>
                <div className="mt-1.5">
                  <RichTextEditor
                    value={formData.text}
                    onChange={(html) => setFormData({ ...formData, text: html })}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Use os botões acima para formatar o texto (negrito, itálico)
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label>Tipo de Campo *</Label>
                  <Select
                    value={formData.field_type}
                    onValueChange={(value: FieldType) => setFormData({ ...formData, field_type: value })}
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Texto</SelectItem>
                      <SelectItem value="textarea">Área de Texto</SelectItem>
                      <SelectItem value="number">Número</SelectItem>
                      <SelectItem value="select">Seleção (Select)</SelectItem>
                      <SelectItem value="radio">Radio Button</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                      <SelectItem value="yesno">Sim/Não</SelectItem>
                      <SelectItem value="scale">Escala (1-5)</SelectItem>
                      <SelectItem value="image">Upload de Imagem</SelectItem>
                      <SelectItem value="cep">CEP (com busca automática)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col">
                  <Label>Placeholder (opcional)</Label>
                  <Input
                    value={formData.placeholder}
                    onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                    placeholder="Texto de exemplo..."
                    className="mt-1.5 w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Texto de ajuda dentro do campo
                  </p>
                </div>
              </div>
            </div>

            {/* Seção: Opções Condicionais */}
            {(formData.field_type === 'select' || formData.field_type === 'radio') && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Opções de Resposta</span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                        {index + 1}
                      </div>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Opção ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {formData.options.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                      Nenhuma opção adicionada. Clique no botão abaixo para adicionar.
                    </p>
                  )}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addOption}
                    className="w-full min-h-[44px] touch-manipulation"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Opção
                  </Button>
                </div>
              </div>
            )}

            {formData.field_type === 'scale' && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Configuração da Escala</span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor Mínimo</Label>
                    <Input
                      type="number"
                      value={formData.min_value}
                      onChange={(e) => setFormData({ ...formData, min_value: Number(e.target.value) })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Valor Máximo</Label>
                    <Input
                      type="number"
                      value={formData.max_value}
                      onChange={(e) => setFormData({ ...formData, max_value: Number(e.target.value) })}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
                className="w-full sm:w-auto min-h-[48px] touch-manipulation"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto min-h-[48px] touch-manipulation"
              >
                {editingQuestion ? 'Atualizar Pergunta' : 'Criar Pergunta'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {(() => {
          // Agrupar perguntas por seção
          const grouped = questions.reduce((acc, question) => {
            const section = question.section || 'Sem seção'
            if (!acc[section]) {
              acc[section] = []
            }
            acc[section].push(question)
            return acc
          }, {} as Record<string, Question[]>)

          // Ordenar seções (Sem seção por último)
          const sortedSections = Object.keys(grouped).sort((a, b) => {
            if (a === 'Sem seção') return 1
            if (b === 'Sem seção') return -1
            return a.localeCompare(b)
          })

          if (sortedSections.length === 0) {
            return (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    Nenhum bloco criado ainda. Comece criando um bloco/seção.
                  </p>
                  <Button onClick={() => setNewSectionDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Bloco
                  </Button>
                </CardContent>
              </Card>
            )
          }

          return sortedSections.map((section) => {
            const sectionQuestions = grouped[section].sort((a, b) => a.order - b.order)
            
            return (
              <Card key={section} className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      {editingSection === section ? (
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={editingSectionName}
                            onChange={(e) => setEditingSectionName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSaveSection(section, editingSectionName)
                              } else if (e.key === 'Escape') {
                                handleCancelEditSection()
                              }
                            }}
                            className="text-xl sm:text-2xl font-bold text-primary"
                            autoFocus
                            placeholder="Nome do bloco"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleSaveSection(section, editingSectionName)}
                            className="min-h-[44px] min-w-[44px]"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCancelEditSection}
                            className="min-h-[44px] min-w-[44px]"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl sm:text-2xl font-bold text-primary">
                            {section}
                          </h3>
                          {section !== 'Sem seção' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditSection(section)}
                              className="h-8 w-8 min-h-[32px] min-w-[32px] opacity-60 hover:opacity-100"
                              title="Editar nome do bloco"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {sectionQuestions.length} {sectionQuestions.length === 1 ? 'pergunta' : 'perguntas'}
                      </p>
                    </div>
                    {section !== 'Sem seção' && !editingSection && (
                      <Button
                        onClick={() => openNewQuestionDialog(section)}
                        size="sm"
                        className="min-h-[44px] touch-manipulation shrink-0"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Pergunta
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(event) => handleDragEnd(event, sectionQuestions, section)}
                  >
                    <SortableContext
                      items={sectionQuestions.map(q => q.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {sectionQuestions.map((question) => (
                          <SortableQuestionItem
                            key={question.id}
                            question={question}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  {section === 'Sem seção' && (
                    <Button
                      variant="outline"
                      onClick={() => openNewQuestionDialog(null)}
                      className="w-full min-h-[48px] touch-manipulation border-dashed mt-3"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Pergunta sem Seção
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })
        })()}
      </div>
    </div>
  )
}

