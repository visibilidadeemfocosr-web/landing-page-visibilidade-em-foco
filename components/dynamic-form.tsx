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

export function DynamicForm({ questions }: DynamicFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({})
  const [cepCityValid, setCepCityValid] = useState<boolean | null>(null)

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
        case 'cep':
          fieldSchema = question.required ? z.string().min(8, 'CEP inválido').max(9, 'CEP inválido') : z.string().optional()
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
    // Verificar se a cidade do CEP é válida (São Roque)
    if (cepCityValid === false) {
      toast.error('Este mapeamento é exclusivo para a cidade de São Roque')
      return
    }
    
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
          <div key={fieldId} className="space-y-3">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
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
          <div key={fieldId} className="space-y-4">
            <div className="text-lg sm:text-base font-semibold text-foreground leading-relaxed block">
              <FormattedText html={question.text} />
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </div>
            <Label htmlFor={fieldId} className="sr-only">
              {question.text.replace(/<[^>]+>/g, '')}
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
          />
        )

      default:
        return null
    }
  }

  // Separar pergunta CEP das outras
  const cepQuestion = questions.find(q => q.field_type === 'cep')
  const otherQuestions = questions.filter(q => q.field_type !== 'cep')

  // Mostrar outras perguntas apenas se CEP for explicitamente válido (true)
  // Inicialmente (null) ou se inválido (false), mostrar apenas CEP
  const showOtherQuestions = cepCityValid === true

  const isCepInvalid = cepCityValid === false

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12 sm:pb-6 mb-4 sm:mb-0">
      <Alert className="text-left">
        <AlertDescription className="text-xs sm:text-sm leading-relaxed">
          <strong>Privacidade e Proteção de Dados:</strong> Seus dados serão utilizados exclusivamente para o projeto Visibilidade em Foco e não serão compartilhados com terceiros sem seu consentimento. Você pode solicitar a remoção das suas informações a qualquer momento.
        </AlertDescription>
      </Alert>

      {/* Sempre mostrar a pergunta CEP primeiro */}
      {cepQuestion && (
        <div className="space-y-6 sm:space-y-8">
          {renderField(cepQuestion)}
        </div>
      )}

      {/* Se CEP não for válido, mostrar apenas mensagem de agradecimento */}
      {cepCityValid === false && (
        <Alert variant="default" className="bg-primary/5 border-primary/20">
          <AlertDescription className="text-base sm:text-lg text-center py-6">
            <p className="font-semibold text-primary mb-2">Obrigado pelo interesse!</p>
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
      {showOtherQuestions && otherQuestions.length > 0 && (
        <div className="space-y-6 sm:space-y-8">
          {(() => {
            // Agrupar perguntas por seção
            const grouped = otherQuestions.reduce((acc, question) => {
              const section = question.section || 'Geral'
              if (!acc[section]) {
                acc[section] = []
              }
              acc[section].push(question)
              return acc
            }, {} as Record<string, Question[]>)

            // Ordenar perguntas dentro de cada seção e ordenar seções
            const sortedSections = Object.keys(grouped).sort((a, b) => {
              if (a === 'Geral') return 1
              if (b === 'Geral') return -1
              return a.localeCompare(b)
            })

            return sortedSections.map((section) => (
              <div key={section} className="space-y-6 sm:space-y-8">
                {section !== 'Geral' && (
                  <div className="border-b-2 border-primary/30 pb-3 -mx-2 sm:-mx-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary">{section}</h3>
                  </div>
                )}
                {grouped[section]
                  .sort((a, b) => a.order - b.order)
                  .map((question) => (
                    <div key={question.id} className="pb-2 sm:pb-3">
                      {renderField(question)}
                    </div>
                  ))}
              </div>
            ))
          })()}
        </div>
      )}

      {/* Mostrar consentimento e botão apenas se CEP for válido */}
      {showOtherQuestions && (
        <>
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
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base sm:text-lg font-semibold min-h-[56px] touch-manipulation active:scale-[0.98]"
        disabled={loading || !watch('consent') || isCepInvalid}
      >
            {loading ? 'Enviando...' : 'Enviar Cadastro'}
          </Button>

          <p className="text-xs text-center text-muted-foreground pb-safe sm:pb-0">
            * Campos obrigatórios
          </p>
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
}

function CepField({ question, fieldId, register, setValue, watch, error, questions, onCityValidationChange }: CepFieldProps) {
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
        
        // Cidade / Município - apenas se for um campo de input específico sobre cidade
        if (questionText.includes('cidade') || 
            (questionText.includes('município') && (questionText.includes('qual') || questionText.includes('sua') || questionText.includes('em qual'))) ||
            (questionText.includes('municipio') && (questionText.includes('qual') || questionText.includes('sua') || questionText.includes('em qual')))) {
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
            required={question.required}
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
                    {cidadeQuestion ? (
                      <>
                        <FormattedText html={cidadeQuestion.text} />
                        {cidadeQuestion.required && <span className="text-red-500 ml-1">*</span>}
                      </>
                    ) : (
                      'Cidade'
                    )}
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

