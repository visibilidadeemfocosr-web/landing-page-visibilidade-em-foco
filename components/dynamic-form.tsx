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
import { Upload, Loader2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import type { Question } from '@/lib/supabase/types'

interface DynamicFormProps {
  questions: Question[]
  previewMode?: boolean
  onSuccess?: () => void
}

// Componente para renderizar HTML formatado de forma segura
function FormattedText({ html }: { html: string }) {
  if (!html) return null
  
  // Verificar se contém tags HTML (melhor regex para detectar tags)
  const hasHtml = /<[^>]+>/g.test(html)
  
  if (hasHtml) {
    // Limpar e sanitizar o HTML básico (apenas permitir tags seguras)
    const sanitizedHtml = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remover scripts
      .replace(/<style[^>]*>.*?<\/style>/gi, '') // Remover estilos inline
    
    return (
      <span 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        className="inline [&_strong]:font-bold [&_em]:italic [&_i]:italic [&_p]:mb-0 [&_p]:inline [&_p_strong]:font-bold [&_p_em]:italic [&_p]:leading-normal [&_p]:m-0 [&_p]:p-0"
      />
    )
  }
  
  return <span>{html}</span>
}

export function DynamicForm({ questions, previewMode = false, onSuccess }: DynamicFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const [cepCityValid, setCepCityValid] = useState<boolean | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [cepBairro, setCepBairro] = useState<string>('') // Armazenar bairro do CEP
  const [otherOptionValues, setOtherOptionValues] = useState<Record<string, string>>({}) // Armazenar valores de "outros"
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0) // Índice do bloco atual na navegação
  const [redeSocialAnswer, setRedeSocialAnswer] = useState<string | null>(null) // Resposta da pergunta sobre rede social
  const [isFromSaoRoque, setIsFromSaoRoque] = useState<boolean | null>(null) // Resposta inicial: é de São Roque?

  // Criar schema Zod dinamicamente
  const createSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {}
    
    questions.forEach((question) => {
      let fieldSchema: z.ZodTypeAny

      switch (question.field_type) {
        case 'text':
        case 'textarea':
          // Verificar se é um campo de e-mail
          const isEmailField = question.text.toLowerCase().includes('email') || 
                               question.text.toLowerCase().includes('e-mail') ||
                               question.placeholder?.toLowerCase().includes('email') ||
                               question.placeholder?.toLowerCase().includes('e-mail')
          
          if (isEmailField) {
            // Validação de e-mail
            if (question.required) {
              fieldSchema = z.string()
                .min(1, 'Esta pergunta é obrigatória')
                .email('Por favor, informe um e-mail válido')
            } else {
              // Se não for obrigatório, permitir vazio ou e-mail válido
              fieldSchema = z.union([
                z.string().email('Por favor, informe um e-mail válido'),
                z.literal('')
              ]).optional()
            }
          } else {
            fieldSchema = question.required ? z.string().min(1, 'Esta pergunta é obrigatória') : z.string().optional()
          }
          break
        case 'number':
          fieldSchema = question.required 
            ? z.number({ required_error: 'Esta pergunta é obrigatória', invalid_type_error: 'Por favor, informe um número válido' })
            : z.number().optional()
          break
        case 'yesno':
          fieldSchema = question.required
            ? z.enum(['sim', 'nao'], {
                required_error: 'Esta pergunta é obrigatória',
                invalid_type_error: 'Por favor, selecione uma opção'
              })
            : z.enum(['sim', 'nao'], {
                invalid_type_error: 'Por favor, selecione uma opção'
              }).optional()
          break
        case 'checkbox':
          // Se tem opções, é múltipla seleção (array de strings)
          // Se não tem opções, é checkbox simples (boolean)
          if (question.options && question.options.length > 0) {
            fieldSchema = question.required
              ? z.array(z.string()).min(1, 'Esta pergunta é obrigatória')
              : z.array(z.string()).optional()
          } else {
            fieldSchema = z.boolean({
              required_error: 'Esta pergunta é obrigatória',
              invalid_type_error: 'Por favor, selecione uma opção'
            })
          }
          break
        case 'scale':
          fieldSchema = z.number({
            required_error: 'Esta pergunta é obrigatória',
            invalid_type_error: 'Por favor, selecione um valor'
          }).min(question.min_value || 1, 'Valor mínimo não atingido').max(question.max_value || 5, 'Valor máximo excedido')
          break
        case 'image':
          fieldSchema = question.required ? z.string().min(1, 'Esta pergunta é obrigatória') : z.string().optional()
          break
        case 'cep':
          fieldSchema = question.required 
            ? z.string().min(8, 'CEP inválido').max(9, 'CEP inválido')
            : z.string().optional()
          break
        case 'social_media':
          // Para redes sociais, criar um objeto com Instagram, Facebook e LinkedIn
          // Cada campo é opcional, mas se a pergunta for obrigatória, pelo menos um deve ser preenchido
          if (question.required) {
            fieldSchema = z.object({
              instagram: z.string().optional(),
              facebook: z.string().optional(),
              linkedin: z.string().optional()
            }).refine((data) => {
              // Pelo menos um campo deve ser preenchido
              return data.instagram || data.facebook || data.linkedin
            }, {
              message: 'Informe pelo menos uma rede social'
            })
          } else {
            fieldSchema = z.object({
              instagram: z.string().optional(),
              facebook: z.string().optional(),
              linkedin: z.string().optional()
            }).optional()
          }
          break
        case 'select':
        case 'radio':
          fieldSchema = question.required 
            ? z.string({ required_error: 'Esta pergunta é obrigatória', invalid_type_error: 'Por favor, selecione uma opção' }).min(1, 'Esta pergunta é obrigatória')
            : z.string().optional()
          break
        default:
          fieldSchema = question.required ? z.string().min(1, 'Esta pergunta é obrigatória') : z.string().optional()
      }

      schemaFields[question.id] = fieldSchema
      
      // Adicionar campo para "outros" se a pergunta permitir
      if ((question.field_type === 'radio' || question.field_type === 'select') && question.has_other_option) {
        // O campo "outros" será validado dinamicamente - será obrigatório apenas se "outros" estiver selecionado
        schemaFields[`${question.id}_other`] = z.string().optional()
      }
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
    clearErrors,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      consent: false,
      // Inicializar checkboxes com opções como arrays vazios
      ...questions
        .filter(q => q.field_type === 'checkbox' && q.options && q.options.length > 0)
        .reduce((acc, q) => {
          acc[q.id as keyof FormData] = [] as any
          return acc
        }, {} as Partial<FormData>),
      // Inicializar campos de redes sociais como objetos vazios
      ...questions
        .filter(q => q.field_type === 'social_media')
        .reduce((acc, q) => {
          acc[q.id as keyof FormData] = { instagram: '', facebook: '', linkedin: '' } as any
          return acc
        }, {} as Partial<FormData>),
    },
  })

  // Sincronizar estado da pergunta sobre rede social quando o formulário carregar
  useEffect(() => {
    const redeSocialQuestion = questions.find(q => {
      const sectionLower = q.section?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
      const questionTextLower = q.text.toLowerCase()
      return (sectionLower.includes('divulgacao') || sectionLower.includes('divulga')) && 
             questionTextLower.includes('rede social') && 
             questionTextLower.includes('lgbtqia+')
    })
    
    if (redeSocialQuestion) {
      const currentValue = watch(redeSocialQuestion.id as keyof FormData) as string
      if (currentValue) {
        setRedeSocialAnswer(currentValue)
      }
    }
  }, [questions, watch])

  // Função para validar campos "outros" dinamicamente
  const validateOtherFields = (data: FormData): boolean => {
    let isValid = true
    const fieldsToValidate: string[] = []
    
    questions.forEach((question) => {
      if ((question.field_type === 'radio' || question.field_type === 'select') && 
          question.has_other_option) {
        const selectedValue = data[question.id as keyof FormData] as string
        const isOtherOption = selectedValue && question.options?.some(opt => 
          opt.toLowerCase().includes('outro') && opt === selectedValue
        )
        
        if (isOtherOption) {
          const otherValue = data[`${question.id}_other` as keyof FormData] as string
          if (!otherValue || !otherValue.trim()) {
            isValid = false
            fieldsToValidate.push(`${question.id}_other`)
          }
        }
      }
    })
    
    // Trigger validação nos campos que falharam
    if (fieldsToValidate.length > 0) {
      trigger(fieldsToValidate as any)
    }
    
    return isValid
  }

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
    // Em modo preview, não enviar dados
    if (previewMode) {
      toast.info('Este é apenas um preview. O formulário não será enviado.')
      return
    }
    
    // Verificar se a cidade do CEP é válida (São Roque)
    if (cepCityValid === false) {
      toast.error('Este mapeamento é exclusivo para a cidade de São Roque')
      return
    }
    
    // Validar campos "outros" se necessário
    if (!validateOtherFields(data)) {
      toast.error('Por favor, preencha o campo "Qual?" quando selecionar a opção "Outros"')
      return
    }
    
    // Validar pergunta sobre rede social: se resposta for "Não", não permitir finalizar
    const redeSocialQuestion = questions.find(q => {
      const sectionLower = q.section?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
      const questionTextLower = q.text.toLowerCase()
      return (sectionLower.includes('divulgacao') || sectionLower.includes('divulga')) && 
             questionTextLower.includes('rede social') && 
             questionTextLower.includes('lgbtqia+')
    })
    
    if (redeSocialQuestion) {
      const redeSocialValue = data[redeSocialQuestion.id as keyof FormData] as string
      if (redeSocialValue === 'nao') {
        toast.error('Para finalizar o cadastro, é necessário aceitar os termos e Enviar o Cadastro de participação.')
        setLoading(false)
        return
      }
    }
    
    setLoading(true)
    try {
      // Filtrar apenas perguntas que têm resposta válida
      const answers = questions
        .map((question) => {
          const value = data[question.id as keyof FormData]
          const fileUrl = question.field_type === 'image' ? fileUrls[question.id] : null
          
          // Para redes sociais, converter objeto em string formatada
          if (question.field_type === 'social_media') {
            const socialMediaData = value as { instagram?: string; facebook?: string; linkedin?: string } | undefined
            if (!socialMediaData) {
              if (question.required) return null
              return null
            }
            
            const parts: string[] = []
            if (socialMediaData.instagram) parts.push(`Instagram: ${socialMediaData.instagram}`)
            if (socialMediaData.facebook) parts.push(`Facebook: ${socialMediaData.facebook}`)
            if (socialMediaData.linkedin) parts.push(`LinkedIn: ${socialMediaData.linkedin}`)
            
            if (parts.length === 0) {
              if (question.required) return null
              return null
            }
            
            return {
              question_id: question.id,
              value: parts.join(' | '),
              file_url: fileUrl || null,
            }
          }
          
          // Para checkbox com múltiplas opções, converter array em string separada por vírgula
          if (question.field_type === 'checkbox' && question.options && question.options.length > 0) {
            const checkboxValues = value as string[] | undefined
            if (!checkboxValues || checkboxValues.length === 0) {
              if (question.required) return null
              return null
            }
            return {
              question_id: question.id,
              value: checkboxValues.join(', '),
              file_url: fileUrl || null,
            }
          }
          
          // Se não tem valor nem arquivo, não incluir na resposta
          if (value === undefined || value === null || value === '') {
            if (!fileUrl) return null
          }
          
          // Para perguntas de CEP, incluir o bairro no valor se disponível
          if (question.field_type === 'cep' && cepBairro) {
            const cepValue = value !== undefined && value !== null && value !== '' 
              ? String(value) 
              : null
            
            // Verificar se há uma pergunta de bairro separada
            const bairroQuestion = questions.find(q => 
              (q.field_type === 'text' || q.field_type === 'number') && 
              q.text.toLowerCase().includes('bairro')
            )
            
            // Se não há pergunta de bairro separada, salvar bairro junto com CEP no formato "CEP|BAIRRO"
            // Isso permite que a API processe e separe depois
            if (!bairroQuestion && cepValue) {
              return {
                question_id: question.id,
                value: `${cepValue}|${cepBairro}`,
                file_url: fileUrl || null,
              }
            }
          }
          
          // Para perguntas com opção "outros", mesclar o valor
          if ((question.field_type === 'radio' || question.field_type === 'select') && 
              question.has_other_option && 
              value) {
            const selectedOption = String(value)
            const isOtherOption = question.options?.some(opt => 
              opt.toLowerCase().includes('outro') && opt === selectedOption
            )
            
            if (isOtherOption) {
              const otherValue = data[`${question.id}_other` as keyof FormData] as string
              if (otherValue && otherValue.trim()) {
                // Combinar a opção selecionada com o valor especificado
                return {
                  question_id: question.id,
                  value: `${selectedOption}: ${otherValue.trim()}`,
                  file_url: fileUrl || null,
                }
              } else if (question.required) {
                // Se obrigatório e não preenchido, não enviar (a validação do form já deve ter bloqueado)
                return null
              }
            }
          }
          
          return {
            question_id: question.id,
            value: value !== undefined && value !== null && value !== '' 
              ? String(value) 
              : null,
            file_url: fileUrl || null,
          }
        })
        .filter((answer) => answer !== null && (answer.value !== null || answer.file_url !== null))

      if (answers.length === 0) {
        toast.error('Por favor, preencha pelo menos uma pergunta')
        setLoading(false)
        return
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      const responseData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))

      if (!response.ok) {
        console.error('Erro na resposta:', responseData)
        throw new Error(responseData.error || 'Erro ao enviar formulário')
      }

      // Verificar se a resposta indica sucesso
      if (responseData.success !== false) {
        // Mostrar mensagem de agradecimento
        setSubmitted(true)
      } else {
        throw new Error(responseData.error || 'Erro ao enviar formulário')
      }
    } catch (error: any) {
      console.error('Erro ao enviar formulário:', error)
      toast.error(error.message || 'Erro ao enviar formulário. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (question: Question) => {
    const fieldId = question.id
    const error = errors[fieldId as keyof typeof errors]

    switch (question.field_type) {
      case 'text':
        // Verificar se é um campo de e-mail
        const isEmailInput = question.text.toLowerCase().includes('email') || 
                             question.text.toLowerCase().includes('e-mail') ||
                             question.placeholder?.toLowerCase().includes('email') ||
                             question.placeholder?.toLowerCase().includes('e-mail')
        
        return (
          <div key={fieldId} className="space-y-3">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
            </Label>
            <Input
              id={fieldId}
              type={isEmailInput ? 'email' : 'text'}
              {...register(fieldId as keyof FormData)}
              placeholder={question.placeholder || ''}
              className="min-h-[48px] text-base sm:text-sm touch-manipulation"
              autoComplete={isEmailInput ? 'email' : 'off'}
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div key={fieldId} className="space-y-3">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
            </Label>
            <Textarea
              id={fieldId}
              {...register(fieldId as keyof FormData)}
              placeholder={question.placeholder || ''}
              className="min-h-32 text-base sm:text-sm touch-manipulation resize-y"
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={fieldId} className="space-y-3">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
            </Label>
            <Input
              id={fieldId}
              type="number"
              inputMode="numeric"
              {...register(fieldId as keyof FormData, { valueAsNumber: true })}
              placeholder={question.placeholder || ''}
              className="min-h-[48px] text-base sm:text-sm touch-manipulation"
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={fieldId} className="space-y-3">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
            </Label>
            <Select
              onValueChange={(value) => {
                setValue(fieldId as keyof FormData, value as any)
                clearErrors(fieldId as keyof FormData)
                // Verificar se a opção selecionada contém "outros" (case insensitive)
                const hasOtherKeyword = question.has_other_option && 
                  question.options?.some(opt => 
                    opt.toLowerCase().includes('outro') && opt === value
                  )
                // Se não for "outros", limpar o valor
                if (!hasOtherKeyword) {
                  setOtherOptionValues(prev => ({ ...prev, [fieldId]: '' }))
                  setValue(`${fieldId}_other` as keyof FormData, '' as any)
                }
              }}
              value={watch(fieldId as keyof FormData) as string}
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
            {/* Mostrar campo de texto se "outros" estiver selecionado */}
            {question.has_other_option && question.options?.some(opt => 
              opt.toLowerCase().includes('outro') && watch(fieldId as keyof FormData) === opt
            ) && (
              <div className="space-y-2 mt-3">
                <Label htmlFor={`${fieldId}_other`} className="text-sm font-medium">
                  {question.other_option_label || 'Qual?'}
                </Label>
                <Input
                  id={`${fieldId}_other`}
                  value={otherOptionValues[fieldId] || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    setOtherOptionValues(prev => ({ ...prev, [fieldId]: value }))
                    setValue(`${fieldId}_other` as keyof FormData, value as any)
                  }}
                          placeholder={question.other_option_label || 'Especifique...'}
                          className="min-h-[48px] text-base"
                        />
                {errors[`${fieldId}_other`] && (
                  <p className="text-sm text-red-500">
                    {(errors[`${fieldId}_other`] as any)?.message as string}
                  </p>
                )}
              </div>
            )}
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'radio':
        return (
          <div key={fieldId} className="space-y-4">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
            </Label>
            <RadioGroup
              onValueChange={(value) => {
                setValue(fieldId as keyof FormData, value as any)
                clearErrors(fieldId as keyof FormData)
                // Verificar se a opção selecionada contém "outros" (case insensitive)
                const hasOtherKeyword = question.has_other_option && 
                  question.options?.some(opt => 
                    opt.toLowerCase().includes('outro') && opt === value
                  )
                // Se não for "outros", limpar o valor
                if (!hasOtherKeyword) {
                  setOtherOptionValues(prev => ({ ...prev, [fieldId]: '' }))
                  setValue(`${fieldId}_other` as keyof FormData, '' as any)
                }
              }}
              value={watch(fieldId as keyof FormData) as string}
              className="space-y-2"
            >
              {question.options?.map((option, idx) => {
                const isOtherOption = question.has_other_option && 
                  option.toLowerCase().includes('outro')
                return (
                  <div key={idx} className="space-y-2">
                    <label
                      htmlFor={`${fieldId}-${idx}`}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer touch-manipulation min-h-[48px] active:bg-muted"
                    >
                      <RadioGroupItem value={option} id={`${fieldId}-${idx}`} className="h-5 w-5" />
                      <Label htmlFor={`${fieldId}-${idx}`} className="font-normal cursor-pointer text-base sm:text-sm flex-1">
                        {option}
                      </Label>
                    </label>
                    {/* Mostrar campo de texto se "outros" estiver selecionado */}
                    {isOtherOption && watch(fieldId as keyof FormData) === option && (
                      <div className="ml-8 space-y-2">
                        <Label htmlFor={`${fieldId}_other`} className="text-sm font-medium">
                          {question.other_option_label || 'Qual?'}
                        </Label>
                        <Input
                          id={`${fieldId}_other`}
                          value={otherOptionValues[fieldId] || ''}
                          onChange={(e) => {
                            const value = e.target.value
                            setOtherOptionValues(prev => ({ ...prev, [fieldId]: value }))
                            setValue(`${fieldId}_other` as keyof FormData, value as any)
                          }}
                          placeholder={question.other_option_label || 'Especifique...'}
                          className="min-h-[48px] text-base"
                        />
                        {errors[`${fieldId}_other`] && (
                          <p className="text-sm text-red-500">
                            {(errors[`${fieldId}_other`] as any)?.message as string}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </RadioGroup>
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )

      case 'checkbox':
        // Se tem opções, renderizar múltiplos checkboxes
        if (question.options && question.options.length > 0) {
          const selectedValues = (watch(fieldId as keyof FormData) as string[]) || []
          
          return (
            <div key={fieldId} className="space-y-4">
              <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
                <FormattedText html={question.text} />
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </div>
              <Label htmlFor={fieldId} className="sr-only">
                {question.text.replace(/<[^>]+>/g, '')}
              </Label>
              <div className="space-y-2">
                {question.options.map((option, idx) => {
                  const optionId = `${fieldId}-${idx}`
                  const isChecked = selectedValues.includes(option)
                  
                  return (
                    <label
                      key={idx}
                      htmlFor={optionId}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer touch-manipulation min-h-[48px] active:bg-muted"
                    >
                      <Checkbox
                        id={optionId}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const currentValues = selectedValues || []
                          let newValues: string[]
                          
                          if (checked) {
                            newValues = [...currentValues, option]
                          } else {
                            newValues = currentValues.filter(v => v !== option)
                          }
                          
                          setValue(fieldId as keyof FormData, newValues as any)
                          clearErrors(fieldId as keyof FormData)
                        }}
                        className="h-5 w-5"
                      />
                      <Label htmlFor={optionId} className="font-normal cursor-pointer text-base sm:text-sm flex-1">
                        {option}
                      </Label>
                    </label>
                  )
                })}
              </div>
              {error && (
                <p className="text-sm text-red-500">{error.message as string}</p>
              )}
            </div>
          )
        }
        
        // Se não tem opções, renderizar checkbox simples (sim/não)
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
                <FormattedText html={question.text} />
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
            </label>
            {error && (
              <p className="text-sm text-red-500 ml-11">{error.message as string}</p>
            )}
          </div>
        )

      case 'yesno':
        // Verificar se é a pergunta sobre rede social
        const sectionLower = question.section?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
        const questionTextLower = question.text.toLowerCase()
        const isRedeSocialQuestion = (sectionLower.includes('divulgacao') || sectionLower.includes('divulga')) && 
          questionTextLower.includes('rede social') && questionTextLower.includes('lgbtqia+')
        
        return (
          <div key={fieldId} className="space-y-4">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
            </Label>
            <RadioGroup
              onValueChange={(value) => {
                setValue(fieldId as keyof FormData, value as any)
                clearErrors(fieldId as keyof FormData)
                // Se for a pergunta sobre rede social, atualizar o estado
                if (isRedeSocialQuestion) {
                  setRedeSocialAnswer(value)
                }
              }}
              value={watch(fieldId as keyof FormData) as string}
              className="space-y-2"
            >
              {[
                { value: 'sim', label: 'Sim' },
                { value: 'nao', label: 'Não' },
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
          <div key={fieldId} className="space-y-4">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
              <span className="ml-2 text-sm sm:text-base text-muted-foreground font-normal">
                ({question.min_value || 1} a {question.max_value || 5})
              </span>
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
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
          <div key={fieldId} className="space-y-3">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 sm:p-8 text-center hover:border-orange-500/50 transition-colors touch-manipulation">
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

      case 'cep':
        return (
          <CepField
            key={fieldId}
            question={question}
            fieldId={fieldId}
            register={register}
            setValue={setValue}
            watch={watch}
            error={error}
            questions={questions}
            onCityValidationChange={setCepCityValid}
            onBairroChange={setCepBairro}
          />
        )

      case 'social_media':
        const socialMediaValue = watch(fieldId as keyof FormData) as { instagram?: string; facebook?: string; linkedin?: string } | undefined || {}
        
        return (
          <div key={fieldId} className="space-y-4">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
              {question.required && (
                <span className="ml-2 text-sm sm:text-base text-muted-foreground font-normal">
                  (Informe pelo menos uma rede social)
                </span>
              )}
            </div>
            <div className="space-y-4">
              {/* Instagram */}
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}_instagram`} className="text-sm font-medium">
                  Instagram
                </Label>
                <Input
                  id={`${fieldId}_instagram`}
                  type="text"
                  placeholder="@seu_usuario ou link do perfil"
                  value={socialMediaValue.instagram || ''}
                  onChange={(e) => {
                    const newValue = {
                      ...socialMediaValue,
                      instagram: e.target.value
                    }
                    setValue(fieldId as keyof FormData, newValue as any)
                    clearErrors(fieldId as keyof FormData)
                  }}
                  className="min-h-[48px] text-base sm:text-sm touch-manipulation"
                  autoComplete="off"
                />
              </div>

              {/* Facebook */}
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}_facebook`} className="text-sm font-medium">
                  Facebook
                </Label>
                <Input
                  id={`${fieldId}_facebook`}
                  type="text"
                  placeholder="Link do seu perfil do Facebook"
                  value={socialMediaValue.facebook || ''}
                  onChange={(e) => {
                    const newValue = {
                      ...socialMediaValue,
                      facebook: e.target.value
                    }
                    setValue(fieldId as keyof FormData, newValue as any)
                    clearErrors(fieldId as keyof FormData)
                  }}
                  className="min-h-[48px] text-base sm:text-sm touch-manipulation"
                  autoComplete="off"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label htmlFor={`${fieldId}_linkedin`} className="text-sm font-medium">
                  LinkedIn
                </Label>
                <Input
                  id={`${fieldId}_linkedin`}
                  type="text"
                  placeholder="Link do seu perfil do LinkedIn"
                  value={socialMediaValue.linkedin || ''}
                  onChange={(e) => {
                    const newValue = {
                      ...socialMediaValue,
                      linkedin: e.target.value
                    }
                    setValue(fieldId as keyof FormData, newValue as any)
                    clearErrors(fieldId as keyof FormData)
                  }}
                  className="min-h-[48px] text-base sm:text-sm touch-manipulation"
                  autoComplete="off"
                />
              </div>
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

  // Separar pergunta CEP das outras
  const cepQuestion = questions.find(q => q.field_type === 'cep')
  
  // Filtrar a pergunta "Você responde este formulário..." que está duplicada
  const filterQuestion = questions.find(q => {
    const questionText = q.text.toLowerCase()
    return questionText.includes('você responde este formulário') || 
           (questionText.includes('morador') && questionText.includes('são roque') && questionText.includes('lgbtqiapn'))
  })
  
  const otherQuestions = questions.filter(q => 
    q.field_type !== 'cep' && 
    q.id !== filterQuestion?.id
  )

  // Mostrar outras perguntas apenas se CEP for explicitamente válido (true)
  // Inicialmente (null) ou se inválido (false), mostrar apenas CEP
  const showOtherQuestions = cepCityValid === true

  const isCepInvalid = cepCityValid === false

  // Verificar se estamos no último bloco (para mostrar consentimento e envio só no final)
  let isOnLastBlock = true
  if (showOtherQuestions && otherQuestions.length > 0) {
    const sectionOrderFromQuestions: string[] = []
    const seenSections = new Set<string>()

    for (const question of otherQuestions) {
      const section = question.section || 'Sem seção'
      if (!seenSections.has(section)) {
        sectionOrderFromQuestions.push(section)
        seenSections.add(section)
      }
    }

    const semSecaoIndex = sectionOrderFromQuestions.indexOf('Sem seção')
    if (semSecaoIndex !== -1 && semSecaoIndex !== sectionOrderFromQuestions.length - 1) {
      sectionOrderFromQuestions.splice(semSecaoIndex, 1)
      sectionOrderFromQuestions.push('Sem seção')
    }

    const totalBlocks = sectionOrderFromQuestions.length
    isOnLastBlock = currentBlockIndex >= totalBlocks - 1
  }

  // Se o formulário foi enviado com sucesso, mostrar mensagem de agradecimento
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Obrigado pela sua participação! 🎉
        </h2>
        <div className="max-w-md space-y-4">
          <p className="text-base sm:text-lg text-foreground leading-relaxed">
            Seu cadastro foi enviado com sucesso! Sua voz é importante para dar visibilidade à comunidade LGBTS de São Roque.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            Agradecemos por fazer parte deste mapeamento e por contribuir para a construção de uma sociedade mais inclusiva e representativa.
          </p>
        </div>
        <Button
          onClick={() => {
            // Reset form
            questions.forEach((q) => {
              setValue(q.id as keyof FormData, undefined as any)
            })
            setValue('consent', false)
            setFileUrls({})
            setCepCityValid(null)
            setSubmitted(false)
            // Fechar dialog e voltar para home
            if (onSuccess) {
              onSuccess()
            }
          }}
          size="lg"
          className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-h-[56px] touch-manipulation"
        >
          Voltar para o início
        </Button>
      </div>
    )
  }

  // Handler de erros de validação
  const onError = (errors: any) => {
    const firstError = Object.keys(errors)[0]
    const firstQuestion = questions.find(q => q.id === firstError)
    
    if (firstQuestion) {
      const questionText = firstQuestion.text.replace(/<[^>]+>/g, '').substring(0, 100)
      toast.error(`Campo obrigatório não preenchido: "${questionText}..."`)
    } else if (firstError && errors[firstError]?.message) {
      toast.error(errors[firstError].message)
    } else {
      toast.error('Por favor, preencha todos os campos obrigatórios')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate className="space-y-6 pb-12 sm:pb-6 mb-4 sm:mb-0">
      {/* Pergunta inicial - filtro de São Roque */}
      {isFromSaoRoque === null && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed font-heading">
              Você responde este formulário como pessoa artista LGBTQIAPN+ morador(a/e) do município de São Roque?
              <span className="text-red-500 ml-1">*</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                type="button"
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold rounded-full min-h-[56px]"
                onClick={() => setIsFromSaoRoque(true)}
              >
                Sim
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 py-6 text-lg font-semibold rounded-full min-h-[56px]"
                onClick={() => setIsFromSaoRoque(false)}
              >
                Não
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagem se respondeu "Não" */}
      {isFromSaoRoque === false && (
        <Alert variant="default" className="bg-orange-500/5 border-orange-500/20">
          <AlertDescription className="text-base sm:text-lg text-center py-6">
            <p className="font-semibold text-orange-500 mb-2">Obrigado pelo interesse!</p>
            <p className="text-foreground">
              Este mapeamento é exclusivo para artistas da cidade de <strong>São Roque</strong>.
            </p>
            <p className="text-muted-foreground mt-2">
              Se você é de outra cidade, agradecemos sua compreensão.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Formulário completo - só aparece se respondeu "Sim" */}
      {isFromSaoRoque === true && (
        <>
          <Alert className="text-left">
            <AlertDescription className="text-xs sm:text-sm leading-relaxed">
              <strong>Privacidade e Proteção de Dados:</strong> Seus dados serão utilizados exclusivamente para o projeto Visibilidade em Foco e não serão compartilhados com terceiros sem seu consentimento. Você pode solicitar a remoção das suas informações a qualquer momento.
            </AlertDescription>
          </Alert>

          {/* Mostrar a pergunta CEP apenas quando ainda não avançou para os outros blocos */}
          {cepQuestion && !showOtherQuestions && (
            <div className="space-y-6 sm:space-y-8">
              {renderField(cepQuestion)}
            </div>
          )}

          {/* Se CEP não for válido, mostrar apenas mensagem de agradecimento */}
          {cepCityValid === false && (
            <Alert variant="default" className="bg-orange-500/5 border-orange-500/20">
              <AlertDescription className="text-base sm:text-lg text-center py-6">
                <p className="font-semibold text-orange-500 mb-2">Obrigado pelo interesse!</p>
                <p className="text-foreground">
                  Este mapeamento é exclusivo para artistas da cidade de <strong>São Roque</strong>.
                </p>
                <p className="text-muted-foreground mt-2">
                  Se você é de outra cidade, agradecemos sua compreensão.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Mostrar outras perguntas apenas se CEP for explicitamente válido (true) */}
          {showOtherQuestions && otherQuestions.length > 0 && (() => {
        // Agrupar perguntas por seção
        const grouped = otherQuestions.reduce((acc, question) => {
          const section = question.section || 'Sem seção'
          if (!acc[section]) {
            acc[section] = []
          }
          acc[section].push(question)
          return acc
        }, {} as Record<string, Question[]>)

        // Obter a ordem das seções diretamente do array de perguntas (já ordenado pela API)
        // A API já retorna as perguntas ordenadas por seção, então precisamos preservar essa ordem
        // IMPORTANTE: A ordem das seções é determinada pela primeira ocorrência de cada seção no array ordenado
        const sectionOrderFromQuestions: string[] = []
        const seenSections = new Set<string>()
        
        // Iterar sobre as perguntas na ordem que vêm da API (já ordenadas)
        // Isso garante que a ordem das seções seja preservada conforme definido no admin
        for (const question of otherQuestions) {
          const section = question.section || 'Sem seção'
          if (!seenSections.has(section)) {
            sectionOrderFromQuestions.push(section)
            seenSections.add(section)
          }
        }
        
        // Mover "Sem seção" para o final se existir (mas preservar a ordem das outras)
        const semSecaoIndex = sectionOrderFromQuestions.indexOf('Sem seção')
        if (semSecaoIndex !== -1 && semSecaoIndex !== sectionOrderFromQuestions.length - 1) {
          sectionOrderFromQuestions.splice(semSecaoIndex, 1)
          sectionOrderFromQuestions.push('Sem seção')
        }
        
        // Debug: log da ordem das seções no componente
        console.log('🔍 DynamicForm - Seções na ordem extraída:', sectionOrderFromQuestions)
        console.log('🔍 DynamicForm - Todas as seções nas perguntas:', Object.keys(grouped))
        console.log('🔍 DynamicForm - Primeiras 5 perguntas:', otherQuestions.slice(0, 5).map(q => ({ 
          section: q.section, 
          order: q.order 
        })))

        const totalBlocks = sectionOrderFromQuestions.length;
        const currentBlock = sectionOrderFromQuestions[currentBlockIndex];
        const isLastBlock = currentBlockIndex === totalBlocks - 1;

        return (
          <div className="space-y-6 sm:space-y-8">
            {sectionOrderFromQuestions.map((section) => (
              <div
                key={section}
                id={`section-${section.replace(/\s+/g, '-').toLowerCase()}`}
                className={`space-y-6 sm:space-y-8 ${section === currentBlock ? 'block' : 'hidden'}`}
              >
                {section !== 'Sem seção' && (
                  <div className="border-b-2 border-orange-500/30 pb-3 -mx-2 sm:-mx-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-orange-500">{section}</h3>
                  </div>
                )}
                {(() => {
                  // Para o bloco "Divulgação", aplicar lógica condicional
                  const sectionLower = section.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                  const isDivulgacaoSection = sectionLower.includes('divulgacao') || sectionLower.includes('divulga')
                  
                  if (isDivulgacaoSection) {
                    // Encontrar a pergunta sobre rede social
                    const redeSocialQuestion = grouped[section]
                      .sort((a, b) => a.order - b.order)
                      .find(q => {
                        const questionText = q.text.toLowerCase()
                        return questionText.includes('rede social') && questionText.includes('lgbtqia+')
                      })
                    
                    // Separar a pergunta sobre rede social (yesno) das outras
                    // A pergunta do tipo social_media deve aparecer junto com as outras quando a resposta for "sim"
                    const otherDivulgacaoQuestions = grouped[section]
                      .sort((a, b) => a.order - b.order)
                      .filter(q => {
                        const questionText = q.text.toLowerCase()
                        // Excluir APENAS a pergunta yesno sobre rede social
                        // Incluir todas as outras, incluindo a pergunta social_media
                        if (q.field_type === 'yesno' && questionText.includes('rede social') && questionText.includes('lgbtqia+')) {
                          return false // Excluir a pergunta yesno
                        }
                        return true // Incluir todas as outras (incluindo social_media)
                      })
                    
                    // Obter a resposta atual da pergunta sobre rede social usando watch para garantir reatividade
                    const watchedRedeSocialValue = redeSocialQuestion 
                      ? watch(redeSocialQuestion.id as keyof FormData)
                      : undefined
                    const currentRedeSocialAnswer = watchedRedeSocialValue as string | undefined
                    
                    return (
                      <>
                        {/* Sempre mostrar a pergunta sobre rede social */}
                        {redeSocialQuestion && (
                          <div className="pb-2 sm:pb-3">
                            {renderField(redeSocialQuestion)}
                          </div>
                        )}
                        
                        {/* Mostrar outras perguntas APENAS se a resposta for explicitamente "sim" */}
                        {currentRedeSocialAnswer === 'sim' && otherDivulgacaoQuestions.map((question) => (
                          <div key={question.id} className="pb-2 sm:pb-3">
                            {renderField(question)}
                          </div>
                        ))}
                        
                        {/* Mostrar mensagem se a resposta for "Não" ou se não houver resposta ainda */}
                        {(currentRedeSocialAnswer === 'nao' || (!currentRedeSocialAnswer && redeSocialQuestion)) && (
                          <Alert variant="default" className="bg-orange-500/5 border-orange-500/20 mt-4">
                            <AlertDescription className="text-base text-center py-4">
                              <p className="font-semibold text-orange-500 mb-2">Atenção</p>
                              <p className="text-foreground">
                                {currentRedeSocialAnswer === 'nao' 
                                  ? 'Para finalizar o cadastro, é necessário aceitar os termos e Enviar o Cadastro de participação.'
                                  : 'Selecione "Sim" para continuar com o cadastro e preencher os demais campos.'}
                              </p>
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )
                  }
                  
                  // Para outros blocos, renderizar normalmente
                  return grouped[section]
                    .sort((a, b) => a.order - b.order)
                    .map((question) => (
                      <div key={question.id} className="pb-2 sm:pb-3">
                        {renderField(question)}
                      </div>
                    ))
                })()}
              </div>
            ))}
            
            {/* Botão Continuar e Indicador de Progresso */}
            {/* Mostrar apenas se não for o último bloco (no último bloco, mostrar apenas o botão "Enviar Cadastro") */}
            {totalBlocks > 1 && !isLastBlock && (
              <div className="bg-background border-t pt-6 pb-safe sm:pb-4 mt-8">
                <div className="flex flex-col gap-4">
                  {/* Indicador de Progresso */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Bloco {currentBlockIndex + 1} de {totalBlocks}</span>
                    <span>{sectionOrderFromQuestions[currentBlockIndex]}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentBlockIndex + 1) / totalBlocks) * 100}%` }}
                    />
                  </div>
                  
                  {/* Botões de navegação */}
                  <div className="flex gap-3">
                    {/* Botão Voltar - apenas se não for o primeiro bloco */}
                    {currentBlockIndex > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setCurrentBlockIndex(prev => Math.max(prev - 1, 0))
                          // Scroll para o topo
                          setTimeout(() => {
                            const formContainer = document.getElementById('form-scroll-container')
                            if (formContainer) {
                              formContainer.scrollTo({ top: 0, behavior: 'smooth' })
                            }
                          }, 150)
                        }}
                        className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 py-6 text-base sm:text-lg font-semibold min-h-[56px] rounded-full"
                      >
                        Voltar
                      </Button>
                    )}
                    
                    {/* Botão Continuar */}
                    <Button
                    type="button"
                    onClick={() => {
                      // Validar campos do bloco atual antes de continuar
                      const currentBlockQuestions = grouped[currentBlock] || []
                      const fieldsToValidate = currentBlockQuestions
                        .filter(q => q.required)
                        .map(q => q.id)
                      
                      trigger(fieldsToValidate as any).then((isValid) => {
                        if (isValid) {
                          // Avançar para o próximo bloco
                          setCurrentBlockIndex(prev => prev + 1)
                          
                          // Scroll para o topo do formulário após um pequeno delay
                          setTimeout(() => {
                            // Tentar encontrar o container de scroll do formulário
                            const formContainer = document.getElementById('form-scroll-container')
                            if (formContainer) {
                              formContainer.scrollTo({ top: 0, behavior: 'smooth' })
                            } else {
                              // Fallback: procurar por qualquer elemento scrollável próximo
                              const scrollableParent = document.querySelector('[class*="overflow-y-auto"]')
                              if (scrollableParent) {
                                scrollableParent.scrollTo({ top: 0, behavior: 'smooth' })
                              } else {
                                // Último fallback: scroll da window
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }
                            }
                          }, 150)
                        } else {
                          toast.error('Por favor, preencha todos os campos obrigatórios deste bloco')
                        }
                      })
                    }}
                    className={`${currentBlockIndex > 0 ? 'flex-1' : 'w-full'} bg-orange-500 hover:bg-orange-600 text-white py-6 text-base sm:text-lg font-semibold min-h-[56px] touch-manipulation active:scale-[0.98] rounded-full`}
                  >
                    Continuar
                  </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Indicador de Progresso no último bloco */}
            {totalBlocks > 1 && isLastBlock && (
              <div className="bg-background border-t pt-6 pb-safe sm:pb-4 mt-8">
                <div className="flex flex-col gap-4">
                  {/* Indicador de Progresso */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>Bloco {currentBlockIndex + 1} de {totalBlocks}</span>
                    <span>{sectionOrderFromQuestions[currentBlockIndex]}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentBlockIndex + 1) / totalBlocks) * 100}%` }}
                    />
                  </div>
                  
                  {/* Botão Voltar no último bloco */}
                  {currentBlockIndex > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCurrentBlockIndex(prev => Math.max(prev - 1, 0))
                        setTimeout(() => {
                          const formContainer = document.getElementById('form-scroll-container')
                          if (formContainer) {
                            formContainer.scrollTo({ top: 0, behavior: 'smooth' })
                          }
                        }, 150)
                      }}
                      className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 py-6 text-base sm:text-lg font-semibold min-h-[56px] rounded-full"
                    >
                      Voltar
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Mostrar consentimento e botão apenas se CEP for válido E se estiver no último bloco */}
      {showOtherQuestions && isOnLastBlock && (
        <>
          {previewMode && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                📋 Modo Preview: Este é apenas uma visualização. O formulário não será enviado.
              </p>
            </div>
          )}
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
      {errors.consent?.message && (
        <p className="text-sm text-red-500 ml-11">
          {String(errors.consent.message)}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-base sm:text-lg font-semibold min-h-[56px] touch-manipulation active:scale-[0.98] rounded-full"
        disabled={loading || !watch('consent') || isCepInvalid || previewMode}
      >
            {previewMode ? 'Preview - Envio Desabilitado' : loading ? 'Enviando...' : 'Enviar Cadastro'}
          </Button>

          <p className="text-xs text-center text-muted-foreground pb-safe sm:pb-0">
            * Campos obrigatórios
          </p>
        </>
      )}
        </>
      )}
    </form>
  )
}

// Componente CEP com busca automática
interface CepFieldProps {
  question: Question
  fieldId: string
  register: any
  setValue: any
  watch: any
  error: any
  questions: Question[]
  onCityValidationChange?: (isValid: boolean | null) => void
  onBairroChange?: (bairro: string) => void
}

function CepField({ question, fieldId, register, setValue, watch, error, questions, onCityValidationChange, onBairroChange }: CepFieldProps) {
  const [loadingCep, setLoadingCep] = useState(false)
  const [lastSearchedCep, setLastSearchedCep] = useState('')
  const [addressData, setAddressData] = useState<{
    logradouro?: string
    bairro?: string
    cidade?: string
    estado?: string
  }>({})
  const [isValidCity, setIsValidCity] = useState<boolean | null>(null)
  const cepValue = watch(fieldId as any) || ''

  // Buscar CEP quando tiver 8 dígitos
  useEffect(() => {
    const cleanCep = cepValue.replace(/\D/g, '')
    if (cleanCep.length === 8 && cleanCep !== lastSearchedCep) {
      setLastSearchedCep(cleanCep)
      searchCep(cleanCep)
    } else if (cleanCep.length < 8) {
      // Limpar dados se CEP estiver incompleto
      setAddressData({})
      setIsValidCity(null)
      if (onCityValidationChange) {
        onCityValidationChange(null)
      }
      if (onBairroChange) {
        onBairroChange('')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cepValue])

  const searchCep = async (cep: string) => {
    setLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        toast.error('CEP não encontrado')
        setAddressData({}) // Limpar dados anteriores
        setIsValidCity(null)
        if (onCityValidationChange) {
          onCityValidationChange(null)
        }
        if (onBairroChange) {
          onBairroChange('')
        }
        setLoadingCep(false)
        return
      }

      // Preencher o CEP formatado
      const formattedCep = `${cep.slice(0, 5)}-${cep.slice(5)}`
      setValue(fieldId as any, formattedCep)

      // Armazenar dados do endereço para exibir nos campos desabilitados
      const addressInfo = {
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        cidade: data.localidade || '',
        estado: data.uf || '',
      }
      
      // Verificar se a cidade é São Roque
      const cidade = data.localidade?.toLowerCase().trim() || ''
      const isSaoRoque = cidade === 'são roque' || cidade === 'sao roque'
      setIsValidCity(isSaoRoque)
      
      // Notificar o componente pai sobre a validação
      if (onCityValidationChange) {
        onCityValidationChange(isSaoRoque)
      }
      
      if (!isSaoRoque) {
        // Limpar dados se não for São Roque
        setAddressData({})
        // Limpar campos relacionados
        questions.forEach((q) => {
          const questionText = q.text.toLowerCase()
          if (
            questionText.includes('logradouro') || 
            questionText.includes('endereço') || 
            questionText.includes('rua') ||
            questionText.includes('endereco') ||
            questionText.includes('bairro') ||
            questionText.includes('cidade') ||
            questionText.includes('município') ||
            questionText.includes('municipio') ||
            questionText.includes('estado') ||
            questionText.includes('uf')
          ) {
            setValue(q.id as any, '')
          }
        })
        setLoadingCep(false)
        return
      }
      
      // Sempre atualizar o estado, mesmo se alguns campos estiverem vazios
      setAddressData(addressInfo)
      
      // Notificar o componente pai sobre o bairro
      if (onBairroChange && addressInfo.bairro) {
        onBairroChange(addressInfo.bairro)
      }
      
      // Debug
      console.log('CEP encontrado:', addressInfo)
      console.log('Dados da API ViaCEP:', data)

      // Buscar campos relacionados pelo texto da pergunta e preencher
      // Apenas campos de input (text, number) que são realmente campos de formulário
      questions.forEach((q) => {
        const questionText = q.text.toLowerCase()
        const isInputField = q.field_type === 'text' || q.field_type === 'number'
        
        if (!isInputField) return // Ignorar perguntas que não são campos de input
        
        // Logradouro / Endereço / Rua
        if (
          (questionText.includes('logradouro') || 
           questionText.includes('endereço') || 
           questionText.includes('rua') ||
           questionText.includes('endereco')) &&
          !questionText.includes('complemento')
        ) {
          if (addressInfo.logradouro) setValue(q.id as any, addressInfo.logradouro)
        }
        
        // Complemento
        if (questionText.includes('complemento')) {
          // Não preenche automaticamente, deixa o usuário preencher
        }
        
        // Bairro
        if (questionText.includes('bairro')) {
          if (addressInfo.bairro) setValue(q.id as any, addressInfo.bairro)
        }
        
        // Cidade / Município - apenas se for um campo de input específico sobre cidade do endereço
        // Verificar se é realmente uma pergunta sobre a cidade do endereço, não apenas menciona "cidade" ou "município"
        const isCityAddressField = (
          (questionText.includes('cidade') && (questionText.includes('qual') || questionText.includes('sua') || questionText.includes('em qual') || questionText.includes('você mora') || questionText.includes('reside'))) ||
          (questionText.includes('município') && (questionText.includes('qual') || questionText.includes('sua') || questionText.includes('em qual') || questionText.includes('você mora') || questionText.includes('reside'))) ||
          (questionText.includes('municipio') && (questionText.includes('qual') || questionText.includes('sua') || questionText.includes('em qual') || questionText.includes('você mora') || questionText.includes('reside')))
        ) && !questionText.includes('grupo') && !questionText.includes('coletivo') && !questionText.includes('companhia') && !questionText.includes('participa')
        
        if (isCityAddressField) {
          if (addressInfo.cidade) setValue(q.id as any, addressInfo.cidade)
        }
        
        // Estado / UF
        if (questionText.includes('estado') || questionText.includes('uf')) {
          if (addressInfo.estado) setValue(q.id as any, addressInfo.estado)
        }
      })

      toast.success('Endereço preenchido automaticamente!')
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast.error('Erro ao buscar CEP')
      setAddressData({})
      setIsValidCity(null)
      if (onCityValidationChange) {
        onCityValidationChange(null)
      }
      if (onBairroChange) {
        onBairroChange('')
      }
    } finally {
      setLoadingCep(false)
    }
  }

  // Formatar CEP enquanto digita
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 8) value = value.slice(0, 8)
    
    // Formatar com hífen
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`
    }
    
    setValue(fieldId as any, value)
  }

  // Encontrar campos relacionados para exibir
  // Apenas campos de input (text, number) que são realmente campos de formulário
  const logradouroQuestion = questions.find(q => {
    const text = q.text.toLowerCase()
    const isInputField = q.field_type === 'text' || q.field_type === 'number'
    return isInputField && 
           (text.includes('logradouro') || text.includes('endereço') || text.includes('rua') || text.includes('endereco')) && 
           !text.includes('complemento')
  })
  const bairroQuestion = questions.find(q => {
    const isInputField = q.field_type === 'text' || q.field_type === 'number'
    return isInputField && q.text.toLowerCase().includes('bairro')
  })
  const cidadeQuestion = questions.find(q => {
    const text = q.text.toLowerCase()
    const isInputField = q.field_type === 'text' || q.field_type === 'number'
    // Verificar se é um campo de input E se a pergunta é específica sobre cidade (não apenas menciona "município")
    return isInputField && 
           (text.includes('cidade') || 
            (text.includes('município') && (text.includes('qual') || text.includes('sua') || text.includes('em qual'))) ||
            (text.includes('municipio') && (text.includes('qual') || text.includes('sua') || text.includes('em qual'))))
  })
  const estadoQuestion = questions.find(q => {
    const text = q.text.toLowerCase()
    const isInputField = q.field_type === 'text' || q.field_type === 'number'
    return isInputField && (text.includes('estado') || text.includes('uf'))
  })

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label htmlFor={fieldId} className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
          <FormattedText html={question.text} />
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={fieldId}
            {...register(fieldId as keyof FormData)}
            value={cepValue}
            onChange={handleCepChange}
            placeholder={question.placeholder || '00000-000'}
            maxLength={9}
            className="min-h-[48px] text-base sm:text-sm touch-manipulation pl-10"
            autoComplete="postal-code"
          />
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {loadingCep && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500">{error.message as string}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Digite o CEP e o endereço será preenchido automaticamente
        </p>
      </div>

      {/* Exibir campos de endereço desabilitados quando CEP for preenchido */}
      {(addressData.logradouro || addressData.bairro || addressData.cidade || addressData.estado) && (
        <div className="space-y-3 p-4 pb-5 bg-muted/30 rounded-lg border border-border mb-2">
          <p className="text-sm sm:text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço encontrado:
          </p>
          
          <div className="space-y-3">
            {/* Logradouro - sempre mostrar se tiver dados */}
            {addressData.logradouro && (
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {logradouroQuestion ? (
                    <>
                      <FormattedText html={logradouroQuestion.text} />
                      {logradouroQuestion.required && <span className="text-red-500 ml-1">*</span>}
                    </>
                  ) : (
                    'Logradouro'
                  )}
                </Label>
                <Input
                  {...(logradouroQuestion ? register(logradouroQuestion.id as keyof FormData) : {})}
                  value={addressData.logradouro}
                  disabled
                  readOnly
                  className="min-h-[44px] text-base sm:text-sm bg-background/80 cursor-not-allowed opacity-90"
                />
              </div>
            )}

            {/* Bairro - sempre mostrar se tiver dados */}
            {addressData.bairro && (
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {bairroQuestion ? (
                    <>
                      <FormattedText html={bairroQuestion.text} />
                      {bairroQuestion.required && <span className="text-red-500 ml-1">*</span>}
                    </>
                  ) : (
                    'Bairro'
                  )}
                </Label>
                <Input
                  {...(bairroQuestion ? register(bairroQuestion.id as keyof FormData) : {})}
                  value={addressData.bairro}
                  disabled
                  readOnly
                  className="min-h-[44px] text-base sm:text-sm bg-background/80 cursor-not-allowed opacity-90"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cidade - sempre mostrar se tiver dados */}
              {addressData.cidade && (
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Cidade
                  </Label>
                  <Input
                    {...(cidadeQuestion ? register(cidadeQuestion.id as keyof FormData) : {})}
                    value={addressData.cidade}
                    disabled
                    readOnly
                    className="min-h-[44px] text-base sm:text-sm bg-background/80 cursor-not-allowed opacity-90"
                  />
                </div>
              )}

              {/* Estado - sempre mostrar se tiver dados */}
              {addressData.estado && (
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {estadoQuestion ? (
                      <>
                        <FormattedText html={estadoQuestion.text} />
                        {estadoQuestion.required && <span className="text-red-500 ml-1">*</span>}
                      </>
                    ) : (
                      'Estado'
                    )}
                  </Label>
                  <Input
                    {...(estadoQuestion ? register(estadoQuestion.id as keyof FormData) : {})}
                    value={addressData.estado}
                    disabled
                    readOnly
                    className="min-h-[44px] text-base sm:text-sm bg-background/80 cursor-not-allowed opacity-90"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

