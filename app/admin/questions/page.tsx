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
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import type { Question, FieldType } from '@/lib/supabase/types'

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [formData, setFormData] = useState({
    text: '',
    field_type: 'text' as FieldType,
    required: false,
    order: 0,
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
      const url = editingQuestion 
        ? '/api/admin/questions' 
        : '/api/admin/questions'
      
      const method = editingQuestion ? 'PUT' : 'POST'
      const body = editingQuestion 
        ? { id: editingQuestion.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) throw new Error('Erro ao salvar')

      toast.success(editingQuestion ? 'Pergunta atualizada!' : 'Pergunta criada!')
      setDialogOpen(false)
      resetForm()
      loadQuestions()
    } catch (error) {
      toast.error('Erro ao salvar pergunta')
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
    setFormData({
      text: question.text,
      field_type: question.field_type,
      required: question.required,
      order: question.order,
      options: question.options || [],
      min_value: question.min_value || 1,
      max_value: question.max_value || 5,
      placeholder: question.placeholder || '',
      active: question.active,
    })
    setDialogOpen(true)
  }

  const resetForm = () => {
    setEditingQuestion(null)
    setFormData({
      text: '',
      field_type: 'text',
      required: false,
      order: questions.length,
      options: [],
      min_value: 1,
      max_value: 5,
      placeholder: '',
      active: true,
    })
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full sm:w-auto min-h-[44px] touch-manipulation">
              <Plus className="mr-2 h-4 w-4" />
              Nova Pergunta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>
                {editingQuestion ? 'Editar Pergunta' : 'Nova Pergunta'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Texto da Pergunta *</Label>
                <Textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  required
                  placeholder="Digite a pergunta..."
                />
              </div>

              <div>
                <Label>Tipo de Campo *</Label>
                <Select
                  value={formData.field_type}
                  onValueChange={(value: FieldType) => setFormData({ ...formData, field_type: value })}
                >
                  <SelectTrigger>
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
                  </SelectContent>
                </Select>
              </div>

              {(formData.field_type === 'select' || formData.field_type === 'radio') && (
                <div>
                  <Label>Opções *</Label>
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Opção ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addOption}
                    className="min-h-[44px] touch-manipulation"
                  >
                    Adicionar Opção
                  </Button>
                </div>
              )}

              {formData.field_type === 'scale' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor Mínimo</Label>
                    <Input
                      type="number"
                      value={formData.min_value}
                      onChange={(e) => setFormData({ ...formData, min_value: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Valor Máximo</Label>
                    <Input
                      type="number"
                      value={formData.max_value}
                      onChange={(e) => setFormData({ ...formData, max_value: Number(e.target.value) })}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Placeholder (opcional)</Label>
                <Input
                  value={formData.placeholder}
                  onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                  placeholder="Texto de exemplo..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <Switch
                    checked={formData.required}
                    onCheckedChange={(checked) => setFormData({ ...formData, required: checked })}
                  />
                  <Label>Obrigatório</Label>
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label>Ativa</Label>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
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
                  {editingQuestion ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">#{question.order}</span>
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                      {question.field_type}
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
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(question)}
                    className="min-h-[44px] min-w-[44px] touch-manipulation"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(question.id)}
                    className="min-h-[44px] min-w-[44px] touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
        {questions.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma pergunta cadastrada. Clique em "Nova Pergunta" para começar.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

