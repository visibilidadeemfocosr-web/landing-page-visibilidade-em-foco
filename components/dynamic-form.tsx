'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Question } from '@/lib/supabase/types'

interface DynamicFormProps {
  questions: Question[]
}

export function DynamicForm({ questions }: DynamicFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})

  // Criar schema Zod dinamicamente
  const createSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {}
    
    questions.forEach((question) => {
      let fieldSchema: z.ZodTypeAny

      switch (question.field_type) {
        case 'text':
        case 'textarea':
          fieldSchema = question.required ? z.string().min(1, 'Campo obrigatório') : z.string().optional()
          break
        case 'number':
          fieldSchema = question.required ? z.number() : z.number().optional()
          break
        case 'yesno':
          fieldSchema = z.enum(['sim', 'nao', 'prefiro-nao-responder'])
          break
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'scale':
          fieldSchema = z.number().min(question.min_value || 1).max(question.max_value || 5)
          break
        case 'image':
          fieldSchema = question.required ? z.string().min(1, 'Imagem obrigatória') : z.string().optional()
          break
        default:
          fieldSchema = question.required ? z.string().min(1, 'Campo obrigatório') : z.string().optional()
      }

      schemaFields[question.id] = fieldSchema
    })

    // Adicionar consentimento
    schemaFields['consent'] = z.boolean().refine((val) => val === true, {
      message: 'Você deve concordar com os termos',
    })

    return z.object(schemaFields)
  }

  const schema = createSchema()
  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      consent: false,
    },
  })

  const handleFileUpload = async (questionId: string, file: File) => {
    setUploading({ ...uploading, [questionId]: true })
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Erro no upload')

      const { url } = await response.json()
      setFileUrls({ ...fileUrls, [questionId]: url })
      setValue(questionId as keyof FormData, url as any)
      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem')
    } finally {
      setUploading({ ...uploading, [questionId]: false })
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const answers = questions.map((question) => {
        const value = data[question.id as keyof FormData]
        return {
          question_id: question.id,
          value: value !== undefined ? String(value) : null,
          file_url: question.field_type === 'image' ? fileUrls[question.id] || null : null,
        }
      })

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) throw new Error('Erro ao enviar formulário')

      toast.success('Formulário enviado com sucesso!')
      
      // Reset form
      questions.forEach((q) => {
        setValue(q.id as keyof FormData, undefined as any)
      })
      setValue('consent', false)
      setFileUrls({})
    } catch (error) {
      toast.error('Erro ao enviar formulário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (question: Question) => {
    const fieldId = question.id
    const error = errors[fieldId as keyof typeof errors]

    switch (question.field_type) {
      case 'text':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-base sm:text-sm">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              {...register(fieldId as keyof FormData)}
              placeholder={question.placeholder || ''}
              required={question.required}
              className="min-h-[48px] text-base sm:text-sm touch-manipulation"
              autoComplete="off"
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-base sm:text-sm">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              {...register(fieldId as keyof FormData)}
              placeholder={question.placeholder || ''}
              required={question.required}
              className="min-h-32 text-base sm:text-sm touch-manipulation resize-y"
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={fieldId} className="space-y-2">
            <Label htmlFor={fieldId} className="text-base sm:text-sm">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type="number"
              inputMode="numeric"
              {...register(fieldId as keyof FormData, { valueAsNumber: true })}
              placeholder={question.placeholder || ''}
              required={question.required}
              className="min-h-[48px] text-base sm:text-sm touch-manipulation"
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={fieldId} className="space-y-2">
            <Label className="text-base sm:text-sm">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              onValueChange={(value) => setValue(fieldId as keyof FormData, value as any)}
              required={question.required}
            >
              <SelectTrigger id={fieldId} className="min-h-[48px] text-base sm:text-sm touch-manipulation">
                <SelectValue placeholder={question.placeholder || 'Selecione...'} />
              </SelectTrigger>
              <SelectContent className="max-h-[50vh]">
                {question.options?.map((option, idx) => (
                  <SelectItem key={idx} value={option} className="min-h-[44px] text-base sm:text-sm">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={fieldId} className="space-y-3">
            <Label className="text-base sm:text-sm block">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue(fieldId as keyof FormData, value as any)}
              required={question.required}
              className="space-y-2"
            >
              {question.options?.map((option, idx) => (
                <label
                  key={idx}
                  htmlFor={`${fieldId}-${idx}`}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer touch-manipulation min-h-[48px] active:bg-muted"
                >
                  <RadioGroupItem value={option} id={`${fieldId}-${idx}`} className="h-5 w-5" />
                  <Label htmlFor={`${fieldId}-${idx}`} className="font-normal cursor-pointer text-base sm:text-sm flex-1">
                    {option}
                  </Label>
                </label>
              ))}
            </RadioGroup>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div key={fieldId} className="space-y-2">
            <label
              htmlFor={fieldId}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer touch-manipulation min-h-[48px] active:bg-muted"
            >
              <Checkbox
                id={fieldId}
                {...register(fieldId as keyof FormData)}
                className="h-5 w-5 mt-0.5"
              />
              <Label htmlFor={fieldId} className="font-normal cursor-pointer text-base sm:text-sm flex-1">
                {question.text}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </label>
            {error && (
              <p className="text-sm text-red-500 ml-11">{error.message as string}</p>
            )}
          </div>
        )

      case 'yesno':
        return (
          <div key={fieldId} className="space-y-3">
            <Label className="text-base sm:text-sm block">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue(fieldId as keyof FormData, value as any)}
              required={question.required}
              className="space-y-2"
            >
              {[
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' },
                { value: 'prefiro-nao-responder', label: 'Prefiro não responder' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`${fieldId}-${opt.value}`}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer touch-manipulation min-h-[48px] active:bg-muted"
                >
                  <RadioGroupItem value={opt.value} id={`${fieldId}-${opt.value}`} className="h-5 w-5" />
                  <Label htmlFor={`${fieldId}-${opt.value}`} className="font-normal cursor-pointer text-base sm:text-sm flex-1">
                    {opt.label}
                  </Label>
                </label>
              ))}
            </RadioGroup>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'scale':
        return (
          <div key={fieldId} className="space-y-3">
            <Label className="text-base sm:text-sm block">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
              <span className="ml-2 text-sm text-muted-foreground">
                ({question.min_value || 1} a {question.max_value || 5})
              </span>
            </Label>
            <div className="px-2 py-4 bg-muted/30 rounded-lg">
              <Slider
                min={question.min_value || 1}
                max={question.max_value || 5}
                step={1}
                defaultValue={[question.min_value || 1]}
                onValueChange={(values) => setValue(fieldId as keyof FormData, values[0] as any)}
                className="w-full touch-manipulation"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>{question.min_value || 1}</span>
                <span className="font-semibold text-foreground text-lg">
                  {watch(fieldId as keyof FormData) || question.min_value || 1}
                </span>
                <span>{question.max_value || 5}</span>
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'image':
        return (
          <div key={fieldId} className="space-y-2">
            <Label className="text-base sm:text-sm block">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-primary/50 transition-colors touch-manipulation">
              <input
                type="file"
                id={fieldId}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(fieldId, file)
                }}
                disabled={uploading[fieldId]}
              />
              <label htmlFor={fieldId} className="cursor-pointer flex flex-col items-center gap-3 min-h-[120px] justify-center">
                {uploading[fieldId] ? (
                  <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-muted-foreground" />
                )}
                <span className="text-sm sm:text-base text-muted-foreground">
                  {fileUrls[fieldId] ? 'Imagem enviada! Toque para trocar' : 'Toque para escolher uma imagem'}
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG até 5MB
                </span>
                {fileUrls[fieldId] && (
                  <img
                    src={fileUrls[fieldId]}
                    alt="Preview"
                    className="max-w-full sm:max-w-xs h-auto rounded border mt-2"
                  />
                )}
              </label>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-6">
      <Alert className="text-left">
        <AlertDescription className="text-xs sm:text-sm leading-relaxed">
          <strong>Privacidade e Proteção de Dados:</strong> Seus dados serão utilizados exclusivamente para o projeto Visibilidade em Foco e não serão compartilhados com terceiros sem seu consentimento. Você pode solicitar a remoção das suas informações a qualquer momento.
        </AlertDescription>
      </Alert>

      <div className="space-y-5 sm:space-y-6">
        {questions.map((question) => renderField(question))}
      </div>

      <div className="flex items-start gap-3 py-4 bg-muted/30 p-4 sm:p-6 rounded-lg touch-manipulation">
        <Checkbox
          id="consent"
          checked={watch('consent')}
          onCheckedChange={(checked) => setValue('consent', checked as boolean)}
          className="h-5 w-5 mt-0.5 flex-shrink-0"
        />
        <label htmlFor="consent" className="text-sm sm:text-base leading-relaxed cursor-pointer flex-1">
          Eu concordo com o uso das minhas informações para o projeto Visibilidade em Foco e estou ciente dos meus direitos de privacidade conforme a LGPD. *
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-red-500 ml-11">{errors.consent.message}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base sm:text-lg font-semibold min-h-[56px] touch-manipulation active:scale-[0.98]"
        disabled={loading || !watch('consent')}
      >
        {loading ? 'Enviando...' : 'Enviar Cadastro'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        * Campos obrigatórios
      </p>
    </form>
  )
}

