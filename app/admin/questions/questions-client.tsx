'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, GripVertical, Check, X, Bold as BoldIcon, Italic as ItalicIcon, Eye } from 'lucide-react'
import { toast } from 'sonner'
import type { Question, FieldType } from '@/lib/supabase/types'
import { DynamicForm } from '@/components/dynamic-form'
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
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        className="[&_strong]:font-bold [&_em]:italic [&_i]:italic [&_p]:block [&_p]:mb-2 [&_p]:last:mb-0 [&_p_strong]:font-bold [&_p_em]:italic [&_br]:block"
      />
    )
  }
  
  // Para texto sem HTML, preservar quebras de linha
  return <div className="whitespace-pre-line">{html}</div>
}


// Componente SortableItem para cada pergunta
function SortableQuestionItem({ question, onEdit, onDelete, sequentialNumber }: { question: Question; onEdit: (q: Question) => void; onDelete: (id: string) => void; sequentialNumber: number }) {
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
          <span className="text-sm text-muted-foreground">#{sequentialNumber}</span>
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
        <div className="font-medium text-base">
          <FormattedQuestionText html={question.text} />
        </div>
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
  const [isBoldActive, setIsBoldActive] = useState(false)
  const [isItalicActive, setIsItalicActive] = useState(false)

  // Função helper para remover tags <strong> do HTML
  const removeStrongTags = (html: string): string => {
    return html.replace(/<strong[^>]*>/gi, '').replace(/<\/strong>/gi, '')
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      let html = editor.getHTML()
      const isBold = editor.isActive('bold')
      
      // SEMPRE limpar tags strong se o editor não detecta bold
      // Isso garante que o HTML esteja sempre sincronizado com as marks do ProseMirror
      if (!isBold && html.includes('<strong>')) {
        html = removeStrongTags(html)
        // Não atualizar o conteúdo aqui para evitar loops infinitos
        // O onChange será chamado com o HTML limpo
      }
      
      // SEMPRE chamar onChange com HTML (limpo se necessário)
      onChange(html)
      
      // Atualizar estado dos botões
      setIsBoldActive(isBold)
      setIsItalicActive(editor.isActive('italic'))
    },
    onSelectionUpdate: ({ editor }) => {
      // Atualizar estado dos botões quando a seleção muda
      setIsBoldActive(editor.isActive('bold'))
      setIsItalicActive(editor.isActive('italic'))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[100px] p-3',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      // Carregar o conteúdo como está (sem limpar automaticamente)
      editor.commands.setContent(value || '')
      // Atualizar estado após carregar conteúdo
      setIsBoldActive(editor.isActive('bold'))
      setIsItalicActive(editor.isActive('italic'))
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
          variant={isBoldActive ? 'default' : 'ghost'}
          size="sm"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            
            const wasBold = editor.isActive('bold')
            
            if (wasBold) {
              // Usar a API do ProseMirror para remover marks de bold
              // Primeiro, remover a mark de bold usando unsetMark
              editor.chain().focus().unsetMark('bold').run()
              
              // Aguardar um frame para o ProseMirror processar
              requestAnimationFrame(() => {
                // Obter HTML após remover a mark
                let html = editor.getHTML()
                
                // Se ainda há tags <strong>, remover manualmente
                if (html.includes('<strong>')) {
                  html = removeStrongTags(html)
                  const { from, to } = editor.state.selection
                  editor.commands.setContent(html, { emitUpdate: false })
                  setTimeout(() => {
                    editor.commands.setTextSelection({ from, to })
                    editor.commands.focus()
                  }, 0)
                }
                
                // Chamar onChange com HTML limpo
                onChange(html)
                
                // Atualizar estado
                setIsBoldActive(false)
              })
            } else {
              // Aplicar negrito usando a API do ProseMirror
              editor.chain().focus().setMark('bold').run()
              setIsBoldActive(true)
            }
          }}
          className="h-8 w-8 p-0"
          title="Negrito (Ctrl+B) - Selecione o texto e clique para aplicar/remover"
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={isItalicActive ? 'default' : 'ghost'}
          size="sm"
          onMouseDown={(e) => {
            // Prevenir que o botão remova o foco do editor
            e.preventDefault()
            // Verificar estado atual
            const wasItalic = editor.isActive('italic')
            // Se está em itálico, remover explicitamente
            if (wasItalic) {
              // Remover itálico mantendo outras formatações
              editor.chain().focus().unsetMark('italic', { extendEmptyMarkRange: false }).run()
            } else {
              // Aplicar itálico
              editor.chain().focus().setMark('italic').run()
            }
          }}
          className="h-8 w-8 p-0"
          title="Itálico (Ctrl+I) - Selecione o texto e clique para aplicar/remover"
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
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)
  const dialogOpeningRef = useRef(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogSection, setDialogSection] = useState<string | null>(null) // Seção selecionada para nova pergunta
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [newSectionDialogOpen, setNewSectionDialogOpen] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingSectionName, setEditingSectionName] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
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
    has_other_option: false,
    other_option_label: 'Qual?',
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
    e.stopPropagation() // Prevenir propagação do evento
    
    // Prevenir duplo clique com useRef (mais confiável que state)
    if (submittingRef.current) {
      console.log('Submit já em andamento, ignorando...')
      return
    }
    
    submittingRef.current = true
    setSubmitting(true)
    try {
      const url = '/api/admin/questions'
      const method = editingQuestion ? 'PUT' : 'POST'
      
      // Normalizar seção (vazio vira undefined)
      const newSection = formData.section?.trim() || undefined
      const normalizedSection = newSection === '' ? undefined : newSection
      
      // Verificar se o bloco mudou ao editar
      const oldSection = editingQuestion ? (editingQuestion.section || undefined) : undefined
      const sectionChanged = editingQuestion && oldSection !== normalizedSection
      
      if (sectionChanged && editingQuestion) {
        // Se o bloco mudou, precisamos recalcular as ordens
        const sourceSection = oldSection || 'Sem seção'
        const targetSection = normalizedSection || 'Sem seção'
        
        // Perguntas da seção de origem (sem a que está sendo movida)
        const sourceQuestions = questions
          .filter(q => {
            const qSection = q.section || 'Sem seção'
            return qSection === sourceSection && q.id !== editingQuestion.id
          })
          .sort((a, b) => a.order - b.order)
        
        // Perguntas da seção de destino (incluindo a que está sendo movida)
        const targetQuestions = questions
          .filter(q => {
            const qSection = q.section || 'Sem seção'
            return qSection === targetSection && q.id !== editingQuestion.id
          })
          .sort((a, b) => a.order - b.order)
        
        // Adicionar a pergunta sendo editada no final do bloco de destino
        targetQuestions.push({ ...editingQuestion, section: normalizedSection || undefined })
        
        try {
          // Recalcular ordens da seção de origem
          if (sourceQuestions.length > 0) {
            const sourceMinOrder = Math.min(...sourceQuestions.map(q => q.order))
            const sourceUpdatePromises = sourceQuestions.map((question, index) => {
              const newOrder = sourceMinOrder + index
              return fetch('/api/admin/questions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: question.id,
                  text: question.text,
                  field_type: question.field_type,
                  required: question.required,
                  order: newOrder,
                  section: question.section || undefined,
                  options: question.options || [],
                  min_value: question.min_value || null,
                  max_value: question.max_value || null,
                  placeholder: question.placeholder || null,
                  has_other_option: question.has_other_option || false,
                  other_option_label: question.other_option_label || null,
                  active: question.active,
                }),
              })
            })
            await Promise.all(sourceUpdatePromises)
          }
          
          // Recalcular ordens da seção de destino
          if (targetQuestions.length > 0) {
            const targetMinOrder = targetQuestions.length > 1
              ? Math.min(...targetQuestions.filter(q => q.id !== editingQuestion.id).map(q => q.order))
              : 0
            
            const targetUpdatePromises = targetQuestions.map((question, index) => {
              const newOrder = targetMinOrder + index
              const isEditedQuestion = question.id === editingQuestion.id
              
              return fetch('/api/admin/questions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: question.id,
                  text: isEditedQuestion ? formData.text : question.text,
                  field_type: isEditedQuestion ? formData.field_type : question.field_type,
                  required: isEditedQuestion ? formData.required : question.required,
                  order: newOrder,
                  section: normalizedSection || undefined,
                  options: isEditedQuestion ? formData.options : question.options || [],
                  min_value: isEditedQuestion ? formData.min_value : question.min_value || null,
                  max_value: isEditedQuestion ? formData.max_value : question.max_value || null,
                  placeholder: isEditedQuestion ? formData.placeholder : question.placeholder || null,
                  has_other_option: isEditedQuestion ? formData.has_other_option : question.has_other_option || false,
                  other_option_label: isEditedQuestion ? formData.other_option_label : question.other_option_label || null,
                  active: isEditedQuestion ? formData.active : question.active,
                }),
              })
            })
            await Promise.all(targetUpdatePromises)
          }
          
          toast.success('Pergunta movida para outro bloco e atualizada!')
          setDialogOpen(false)
          setDialogSection(null)
          setEditingQuestion(null)
          loadQuestions()
          return
        } catch (error: any) {
          throw new Error('Erro ao mover pergunta entre blocos: ' + (error.message || 'Erro desconhecido'))
        }
      }
      
      // Caso normal: sem mudança de bloco
      const body = editingQuestion 
        ? { id: editingQuestion.id, ...formData, section: normalizedSection || undefined }
        : { ...formData, section: dialogSection || normalizedSection || undefined }

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
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (id: string) => {
    setQuestionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return

    try {
      const response = await fetch(`/api/admin/questions?id=${questionToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao deletar')

      toast.success('Pergunta deletada!')
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
      loadQuestions()
    } catch (error) {
      toast.error('Erro ao deletar pergunta')
      setDeleteDialogOpen(false)
      setQuestionToDelete(null)
    }
  }

  const handleEdit = (question: Question) => {
    // Prevenir múltiplos cliques
    if (dialogOpeningRef.current || dialogOpen) {
      return
    }
    
    dialogOpeningRef.current = true
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
      has_other_option: question.has_other_option || false,
      other_option_label: question.other_option_label || 'Qual?',
      active: question.active,
    })
    setDialogOpen(true)
    
    // Resetar após um pequeno delay
    setTimeout(() => {
      dialogOpeningRef.current = false
    }, 300)
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
            has_other_option: question.has_other_option || false,
            other_option_label: question.other_option_label || null,
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    // Encontrar a pergunta que está sendo arrastada
    const draggedQuestion = questions.find(q => q.id === active.id)
    if (!draggedQuestion) {
      return
    }

    // Determinar a seção de origem
    const sourceSection = draggedQuestion.section || 'Sem seção'

    // Verificar se está tentando arrastar para outra seção
    let targetSection: string | null = null
    
    // Verificar se o over é uma seção ou uma pergunta
    if (typeof over.id === 'string' && over.id.startsWith('section-')) {
      // Arrastou para uma área de seção
      const sectionId = over.id.replace('section-', '').replace('-end', '')
      targetSection = sectionId
    } else {
      // Arrastou para outra pergunta
      const targetQuestion = questions.find(q => q.id === over.id)
      if (targetQuestion) {
        targetSection = targetQuestion.section || 'Sem seção'
      }
    }

    // Se está tentando arrastar para outro bloco, bloquear e mostrar mensagem
    if (targetSection !== null && targetSection !== sourceSection) {
      toast.info('Para mover perguntas entre blocos, edite a pergunta e altere o bloco no campo "Bloco/Seção"')
      return
    }

    // Apenas permitir reordenar dentro do mesmo bloco
    const sourceQuestions = questions
      .filter(q => (q.section || 'Sem seção') === sourceSection)
      .sort((a, b) => a.order - b.order)

    // Determinar a posição de destino
    let targetIndex: number
    
    if (typeof over.id === 'string' && over.id.startsWith('section-')) {
      // Se arrastou para uma área de seção, colocar no final
      targetIndex = sourceQuestions.length
    } else {
      // Arrastou para outra pergunta no mesmo bloco
      targetIndex = sourceQuestions.findIndex(q => q.id === over.id)
      if (targetIndex === -1) {
        return
      }
    }

    // Reordenar dentro do mesmo bloco
    const oldIndex = sourceQuestions.findIndex(q => q.id === active.id)
    if (oldIndex === -1 || oldIndex === targetIndex) {
      return
    }

    const reorderedQuestions = arrayMove(sourceQuestions, oldIndex, targetIndex)
    const minOrder = Math.min(...sourceQuestions.map(q => q.order))

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
            has_other_option: question.has_other_option || false,
            other_option_label: question.other_option_label || null,
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
      has_other_option: false,
      other_option_label: 'Qual?',
      active: true,
    })
  }

  const openNewQuestionDialog = (sectionName: string | null) => {
    // Prevenir múltiplos cliques
    if (dialogOpeningRef.current || dialogOpen) {
      return
    }
    
    dialogOpeningRef.current = true
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
      has_other_option: false,
      other_option_label: 'Qual?',
      active: true,
    })
    setDialogOpen(true)
    
    // Resetar após um pequeno delay para permitir novo clique depois
    setTimeout(() => {
      dialogOpeningRef.current = false
    }, 500)
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
        // Só permitir fechar se não estiver submetendo
        // O fechamento por clique fora será prevenido pelo onInteractOutside
        if (open === false && !submittingRef.current) {
          setDialogOpen(false)
          // Resetar estado de submissão quando o diálogo fecha
          submittingRef.current = false
          setSubmitting(false)
          dialogOpeningRef.current = false
          setDialogSection(null)
          setEditingQuestion(null)
        } else if (open === true) {
          // Permitir abrir normalmente
          setDialogOpen(true)
        }
      }}>
        <DialogContent 
          className="max-w-[95vw] sm:max-w-3xl max-h-[95vh] overflow-y-auto p-0"
          onInteractOutside={(e) => {
            // Prevenir fechamento ao clicar fora da modal
            e.preventDefault()
          }}
        >
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
                <div className="w-full">
                  <Label>Bloco/Seção</Label>
                  <Select
                    value={formData.section || 'Sem seção'}
                    onValueChange={(value) => setFormData({ ...formData, section: value === 'Sem seção' ? '' : value })}
                  >
                    <SelectTrigger className="mt-1.5 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sem seção">Sem seção</SelectItem>
                      {(() => {
                        // Obter todas as seções únicas das perguntas
                        const sections = new Set<string>()
                        questions.forEach(q => {
                          if (q.section) {
                            sections.add(q.section)
                          }
                        })
                        return Array.from(sections).sort().map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))
                      })()}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Selecione o bloco/seção para esta pergunta. Ao alterar, a ordem será ajustada automaticamente.
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
                    onChange={(html) => {
                      // Garantir que o HTML esteja limpo antes de salvar
                      let cleanHtml = html
                      // Se o editor não está em modo bold, remover todas as tags <strong>
                      if (cleanHtml.includes('<strong>')) {
                        // Verificar se realmente deve ter negrito (isso será verificado pelo editor)
                        // Por enquanto, vamos confiar no editor, mas podemos adicionar lógica aqui se necessário
                      }
                      setFormData({ ...formData, text: cleanHtml })
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Selecione o texto e use os botões acima para aplicar ou remover formatação (negrito, itálico)
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
            {(formData.field_type === 'select' || formData.field_type === 'radio' || formData.field_type === 'checkbox') && (
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
                
                {/* Opção "Outros" */}
                <div className="mt-4 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-3">
                    <Label htmlFor="has_other_option" className="text-sm font-medium cursor-pointer">
                      Permitir opção "Outros"
                    </Label>
                    <Switch
                      id="has_other_option"
                      checked={formData.has_other_option}
                      onCheckedChange={(checked) => setFormData({ ...formData, has_other_option: checked })}
                    />
                  </div>
                  {formData.has_other_option && (
                    <div className="space-y-2">
                      <Label htmlFor="other_option_label" className="text-sm">
                        Texto do campo "Outros"
                      </Label>
                      <Input
                        id="other_option_label"
                        value={formData.other_option_label}
                        onChange={(e) => setFormData({ ...formData, other_option_label: e.target.value })}
                        placeholder="Qual?"
                        className="min-h-[44px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        Quando o respondente selecionar uma opção contendo "outros", será exibido um campo de texto com este label.
                      </p>
                    </div>
                  )}
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
                disabled={submitting}
                className="w-full sm:w-auto min-h-[48px] touch-manipulation"
              >
                {submitting ? 'Salvando...' : editingQuestion ? 'Atualizar Pergunta' : 'Criar Pergunta'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta pergunta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setQuestionToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Botão de Preview */}
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => setPreviewOpen(true)}
          variant="outline"
          className="min-h-[48px] touch-manipulation"
        >
          <Eye className="mr-2 h-4 w-4" />
          Visualizar Formulário
        </Button>
      </div>

      {/* Dialog de Preview */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="!max-w-[100vw] !w-[100vw] !max-h-[100vh] !h-[100vh] !top-0 !left-0 !translate-x-0 !translate-y-0 rounded-none p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-background z-10 flex-shrink-0">
            <DialogTitle className="text-2xl font-bold">Preview do Formulário</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Esta é a visualização exata de como o formulário aparece para os usuários
            </p>
          </DialogHeader>
          <div className="px-6 py-6 overflow-y-auto flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Carregando formulário...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Nenhuma pergunta cadastrada ainda.</p>
              </div>
            ) : (
              <DynamicForm questions={questions.filter(q => q.active)} previewMode={true} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {(() => {
          // Ordenar todas as perguntas por ordem para calcular numeração sequencial global
          const sortedQuestions = [...questions].sort((a, b) => a.order - b.order)
          
          // Criar mapa de ID da pergunta para número sequencial
          const questionSequentialMap = new Map<string, number>()
          sortedQuestions.forEach((question, index) => {
            questionSequentialMap.set(question.id, index + 1)
          })
          
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
              <DndContext
                key={section}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Card className="border-2">
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
                          disabled={dialogOpeningRef.current || dialogOpen}
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
                            onDelete={handleDeleteClick}
                            sequentialNumber={questionSequentialMap.get(question.id) || question.order}
                          />
                        ))}
                      </div>
                    </SortableContext>
                    
                    {section === 'Sem seção' && (
                      <Button
                        variant="outline"
                        onClick={() => openNewQuestionDialog(null)}
                        disabled={dialogOpeningRef.current || dialogOpen}
                        className="w-full min-h-[48px] touch-manipulation border-dashed mt-3"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Pergunta sem Seção
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </DndContext>
            )
          })
        })()}
      </div>
    </div>
  )
}

