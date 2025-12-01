export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'yesno' | 'scale' | 'image' | 'cep' | 'social_media'

export interface Question {
  id: string
  text: string
  field_type: FieldType
  required: boolean
  order: number
  section?: string // Bloco/Seção da pergunta
  options?: string[] // Para select, radio
  min_value?: number // Para scale
  max_value?: number // Para scale
  placeholder?: string
  has_other_option?: boolean // Se permite opção "outros"
  other_option_label?: string // Label do campo "outros" (ex: "Qual?")
  max_length?: number // Limite máximo de caracteres para campos text e textarea
  created_at: string
  updated_at: string
  active: boolean
}

export interface Answer {
  id: string
  question_id: string
  submission_id: string
  value: string | number | boolean
  file_url?: string
  created_at: string
}

export interface Submission {
  id: string
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}

