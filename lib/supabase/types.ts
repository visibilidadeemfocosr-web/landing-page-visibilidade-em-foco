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

export type InstagramPostTemplateType = 'chamamento' | 'artista' | 'evento' | 'citacao' | 'livre'
export type InstagramPostStatus = 'draft' | 'published'
export type LogoPosition = 
  | 'topo-esquerda' | 'topo-centro' | 'topo-direita'
  | 'centro-esquerda' | 'centro' | 'centro-direita'
  | 'rodape-esquerda' | 'rodape-centro' | 'rodape-direita'
export type LogoSize = 'pequena' | 'media' | 'grande'
export type LogoVariant = 'black' | 'color' | 'gradient' | 'white'
export type DecorativeEffect = 'none' | 'blobs' | 'grid' | 'gradient' | 'geometric' | 'geometric-left' | 'geometric-right'

export type DecorativeElement = 
  | 'none' 
  | 'pride-flag-3d' 
  | 'raised-fist' 
  | 'geometric-heart' 
  | 'pride-stripes' 
  | 'concentric-circles' 
  | 'organic-blob' 
  | 'pink-triangle' 
  | 'ink-splash'
  | 'custom'

export type ElementPosition = 
  | 'topo-esquerda' 
  | 'topo-centro' 
  | 'topo-direita' 
  | 'centro-esquerda' 
  | 'centro' 
  | 'centro-direita' 
  | 'base-esquerda' 
  | 'base-centro' 
  | 'base-direita'

export type ElementSize = 'pequeno' | 'medio' | 'grande'
export type ElementLayer = 'background' | 'foreground'

export interface InstagramPostSlide {
  order: number
  title?: string
  subtitle?: string
  description?: string
  ctaText?: string
  ctaLink?: string
  periodText?: string
  tagText?: string
  // Elementos decorativos
  decorativeElement?: DecorativeElement
  elementPosition?: ElementPosition
  elementSize?: ElementSize
  elementOpacity?: number
  elementLayer?: ElementLayer
  customElementUrl?: string
}

export interface InstagramPostContent {
  // Configurações de design
  backgroundColor?: string
  textColor?: string
  titleColor?: string
  subtitleColor?: string
  descriptionColor?: string
  logoPosition?: LogoPosition
  logoSize?: LogoSize
  logoVariant?: LogoVariant
  decorativeEffect?: DecorativeEffect
  
  // Configurações específicas por template
  [key: string]: any
}

export interface InstagramPost {
  id: string
  template_type: InstagramPostTemplateType
  title?: string
  subtitle?: string
  description?: string
  cta_text?: string // Call to Action
  cta_link?: string
  period_text?: string
  tag_text?: string
  is_carousel?: boolean
  slides?: InstagramPostSlide[]
  content?: InstagramPostContent
  image_url?: string | string[] // String para post único, array para carrossel
  caption?: string
  hashtags?: string[]
  status: InstagramPostStatus
  instagram_post_id?: string
  published_at?: string
  created_at: string
  updated_at: string
}

