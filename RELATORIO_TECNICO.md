# Relatório Técnico - Visibilidade em Foco

## 📋 Sumário Executivo

O projeto **Visibilidade em Foco** é uma plataforma web desenvolvida para realizar o **1º Mapeamento Cultural de Artistas LGBTQIAPN+** do município de São Roque. O sistema permite coleta de dados através de formulários dinâmicos, moderação de conteúdo, publicação automática no Instagram e geração de relatórios estatísticos.

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**

#### Framework e Bibliotecas Principais
- **Next.js 16.0.7** - Framework React para produção
  - Server-Side Rendering (SSR)
  - Static Site Generation (SSG)
  - API Routes
  - App Router (arquitetura moderna)

- **React 18.3.1** - Biblioteca para construção de interfaces
  - Hooks (useState, useEffect, useRef)
  - Componentes funcionais
  - Context API

- **TypeScript 5** - Tipagem estática para JavaScript
  - Reduz erros em tempo de desenvolvimento
  - Melhora autocompletar e documentação

#### UI e Estilização
- **Tailwind CSS 4.1.9** - Framework CSS utility-first
  - Design responsivo (mobile-first)
  - Customização via configuração
  - Classes utilitárias para layout rápido

- **Radix UI** - Componentes acessíveis e sem estilo
  - Dialog, AlertDialog, Select, RadioGroup, Checkbox
  - Acessibilidade (ARIA) integrada
  - Customizável via Tailwind

- **Shadcn/ui** - Componentes React baseados em Radix UI
  - Design system consistente
  - Fácil customização

- **Framer Motion 12.23.25** - Biblioteca de animações
  - Animações suaves e performáticas
  - Transições de página
  - Animações de scroll

#### Formulários e Validação
- **React Hook Form 7.60.0** - Gerenciamento de formulários
  - Performance otimizada
  - Validação integrada
  - Menos re-renders

- **Zod 3.25.76** - Validação de schemas TypeScript-first
  - Validação type-safe
  - Mensagens de erro customizáveis
  - Integração com React Hook Form

#### Outras Bibliotecas Frontend
- **Lucide React** - Ícones SVG
- **Sonner** - Sistema de notificações (toast)
- **html2canvas** - Captura de tela para preview
- **react-easy-crop** - Editor de corte de imagens
- **TipTap** - Editor de texto rico (WYSIWYG)

### **Backend**

#### API e Servidor
- **Next.js API Routes** - Endpoints serverless
  - `/api/questions` - Buscar perguntas ativas
  - `/api/submissions` - Criar submissões
  - `/api/admin/*` - Endpoints administrativos
  - `/api/instagram/*` - Integração com Instagram

#### Banco de Dados
- **Supabase** - Backend-as-a-Service (BaaS)
  - PostgreSQL (banco de dados relacional)
  - Row Level Security (RLS)
  - Storage para imagens
  - Real-time subscriptions (não utilizado atualmente)

#### Integrações Externas
- **Instagram Graph API** - Publicação automática de posts
  - Publicação de posts únicos
  - Publicação de carrosséis (múltiplas imagens)
  - Obtenção de permalink
  - Tratamento de rate limits (25 posts/dia)

- **Gmail SMTP (Nodemailer)** - Envio de e-mails
  - Notificações de publicação
  - Templates HTML customizados
  - Fallback para texto simples

#### Geração de Imagens e Documentos
- **Puppeteer Core** - Geração de imagens server-side
  - Geração de previews de posts Instagram
  - Renderização HTML para PNG
  - Suporte serverless (@sparticuz/chromium)

- **Chart.js Node Canvas** - Geração de gráficos
  - Gráficos para relatórios estatísticos
  - Exportação de imagens

- **docx** - Geração de documentos Word
  - Relatórios em formato .docx
  - Formatação profissional

### **DevOps e Deploy**

- **Vercel** - Plataforma de deploy
  - Deploy automático via Git
  - Preview deployments
  - Edge Functions
  - Analytics integrado

- **Git/GitHub** - Controle de versão
  - Versionamento de código
  - Colaboração
  - CI/CD via Vercel

### **Ferramentas de Desenvolvimento**

- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Compatibilidade de CSS

---

## 🗄️ Banco de Dados

### **Sistema de Gerenciamento**
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** habilitado
- **Triggers** para atualização automática de timestamps

### **Tabelas do Banco de Dados**

#### 1. **questions**
Armazena as perguntas do formulário dinâmico.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `text` (TEXT) - Texto da pergunta
- `field_type` (TEXT) - Tipo de campo:
  - `text`, `textarea`, `number`, `select`, `radio`, `checkbox`
  - `yesno`, `scale`, `image`, `cep`, `social_media`
- `required` (BOOLEAN) - Se a pergunta é obrigatória
- `order` (INTEGER) - Ordem de exibição
- `section` (TEXT) - Seção/bloco da pergunta (ex: "Dados Pessoais")
- `options` (JSONB) - Opções para select/radio/checkbox
- `min_value` (INTEGER) - Valor mínimo para escala
- `max_value` (INTEGER) - Valor máximo para escala
- `placeholder` (TEXT) - Texto placeholder
- `active` (BOOLEAN) - Se a pergunta está ativa
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Índices:**
- `idx_questions_order` - Ordenação
- `idx_questions_active` - Filtro por ativas
- `idx_questions_section` - Agrupamento por seção

**Políticas RLS:**
- Público pode visualizar perguntas ativas

---

#### 2. **submissions**
Armazena as submissões/respostas dos artistas.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `photo_crop` (JSONB) - Dados de crop da foto
- `cropped_photo_url` (TEXT) - URL da foto cropada
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Políticas RLS:**
- Público pode criar submissões

**Relacionamentos:**
- `answers` → `submission_id` (ON DELETE CASCADE)
- `moderation_queue` → `submission_id` (ON DELETE CASCADE)

---

#### 3. **answers**
Armazena as respostas individuais de cada pergunta.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `question_id` (UUID, FK) - Referência à pergunta
- `submission_id` (UUID, FK) - Referência à submissão
- `value` (TEXT) - Valor da resposta (texto, número, JSON)
- `file_url` (TEXT) - URL do arquivo (para uploads de imagem)
- `created_at` (TIMESTAMP) - Data de criação

**Índices:**
- `idx_answers_question_id` - Busca por pergunta
- `idx_answers_submission_id` - Busca por submissão

**Constraints:**
- `UNIQUE(question_id, submission_id)` - Uma resposta por pergunta por submissão
- `ON DELETE CASCADE` - Respostas são deletadas quando a submissão é deletada

**Políticas RLS:**
- Público pode criar respostas

---

#### 4. **moderation_queue**
Fila de moderação para artistas que desejam participar da rede social.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `submission_id` (UUID, FK) - Referência à submissão
- `status` (TEXT) - Status da moderação:
  - `pending` - Aguardando moderação
  - `approved` - Aprovado
  - `rejected` - Rejeitado
  - `published` - Publicado no Instagram
- `edited_bio` (TEXT) - Biografia editada pelo moderador
- `edited_instagram` (TEXT) - Instagram editado
- `edited_facebook` (TEXT) - Facebook editado
- `edited_linkedin` (TEXT) - LinkedIn editado
- `edited_caption` (TEXT) - Legenda do Instagram editada
- `moderator_notes` (TEXT) - Notas do moderador
- `instagram_post_id` (TEXT) - ID do post no Instagram
- `instagram_permalink` (TEXT) - Link permanente do post
- `moderated_by` (UUID, FK) - Referência ao admin que moderou
- `moderated_at` (TIMESTAMP) - Data da moderação
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Índices:**
- `idx_moderation_queue_submission_id`
- `idx_moderation_queue_status`
- `idx_moderation_queue_created_at`

**Triggers:**
- Atualização automática de `updated_at`

**Relacionamentos:**
- `submissions` → `submission_id` (ON DELETE CASCADE)
- `admin_users` → `moderated_by` (opcional)

---

#### 5. **sections**
Armazena a ordem customizada das seções/blocos do formulário.

**Campos:**
- `name` (TEXT, PK) - Nome da seção
- `order` (INTEGER) - Ordem de exibição
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Índices:**
- `idx_sections_order` - Ordenação

**Políticas RLS:**
- Acesso via service_role (admin)

---

#### 6. **admin_users**
Lista de usuários administradores.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `email` (TEXT, UNIQUE) - E-mail do admin
- `created_at` (TIMESTAMP) - Data de criação

**Uso:**
- Controle de acesso administrativo
- Referência em `moderation_queue.moderated_by`

---

#### 7. **instagram_posts**
Armazena posts criados para publicação no Instagram.

**Campos:**
- `id` (UUID, PK) - Identificador único
- `template_type` (TEXT) - Tipo de template:
  - `chamamento`, `artista`, `evento`, `citacao`, `livre`
- `title` (TEXT) - Título do post
- `subtitle` (TEXT) - Subtítulo
- `description` (TEXT) - Descrição
- `cta_text` (TEXT) - Texto do call-to-action
- `cta_link` (TEXT) - Link do CTA
- `period_text` (TEXT) - Texto do período
- `content` (JSONB) - Configurações específicas do template
- `image_url` (TEXT/JSONB) - URL da imagem ou array de URLs (carrossel)
- `caption` (TEXT) - Legenda do Instagram
- `hashtags` (TEXT[]) - Array de hashtags
- `status` (TEXT) - Status:
  - `draft` - Rascunho
  - `published` - Publicado
- `instagram_post_id` (TEXT) - ID do post no Instagram
- `published_at` (TIMESTAMP) - Data de publicação
- `is_carousel` (BOOLEAN) - Se é carrossel
- `slides` (JSONB) - Slides do carrossel
- `tag_text` (TEXT) - Texto da tag/assinatura
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

**Índices:**
- `idx_instagram_posts_status`
- `idx_instagram_posts_template_type`
- `idx_instagram_posts_created_at`

**Triggers:**
- Atualização automática de `updated_at`

---

#### 8. **home_content**
Armazena conteúdo editável da home page.

**Campos:**
- `id` (TEXT, PK) - Identificador (geralmente 'main')
- `content` (JSONB) - Estrutura completa de conteúdo:
  - `logoPath`, `mainTitle`, `highlightedWord`
  - `subtitle`, `description`, `period`
  - `aboutTag`, `aboutSections`, `objectives`
  - `impactTag`, `impactTitle`, `impactDescription`
  - `impacts`, `quote`, `quoteAuthor`
- `updated_at` (TIMESTAMP) - Data de atualização

**Índices:**
- `idx_home_content_updated_at`

**Uso:**
- Permite edição de conteúdo sem alterar código
- Mantém identidade visual intacta

---

### **Storage (Supabase Storage)**

#### Bucket: `artist-images`
- Armazena fotos dos artistas
- Política: Público pode visualizar
- Upload via API com autenticação

---

## 🏗️ Arquitetura do Sistema

### **Estrutura de Pastas**

```
landing-page-visibilidade-em-foco/
├── app/                          # Next.js App Router
│   ├── admin/                    # Área administrativa
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── questions/           # Gerenciar perguntas
│   │   ├── submissions/         # Visualizar submissões
│   │   ├── moderate/            # Moderação de artistas
│   │   ├── moderate-preview/   # Preview e publicação
│   │   ├── stats/               # Estatísticas e relatórios
│   │   ├── posts/               # Gerenciar posts Instagram
│   │   └── home-preview/        # Preview e edição da home
│   ├── api/                      # API Routes
│   │   ├── questions/           # GET: Buscar perguntas ativas
│   │   ├── submissions/         # POST: Criar submissão
│   │   ├── admin/               # Endpoints administrativos
│   │   │   ├── moderate/        # PATCH: Atualizar moderação
│   │   │   ├── generate-post-image/  # POST: Gerar imagem do post
│   │   │   ├── upload-instagram-images/  # POST: Upload para Supabase
│   │   │   ├── generate-report/  # POST: Gerar relatório
│   │   │   └── stats/            # GET: Estatísticas
│   │   └── instagram/           # Integração Instagram
│   │       ├── publish/        # POST: Publicar no Instagram
│   │       └── callback/       # OAuth callback
│   └── page.tsx                 # Página principal (landing)
│
├── components/                    # Componentes React
│   ├── dynamic-form.tsx         # Formulário dinâmico principal
│   ├── registration-form-loader.tsx  # Loader do formulário
│   ├── new-design/              # Componentes do novo design
│   │   ├── Hero.tsx            # Seção hero
│   │   ├── About.tsx           # Seção sobre
│   │   ├── Importance.tsx      # Seção importância
│   │   ├── Impact.tsx          # Seção impacto
│   │   ├── CTA.tsx             # Call-to-action
│   │   └── Footer.tsx          # Rodapé
│   ├── ui/                      # Componentes UI (Shadcn)
│   └── accessibility/           # Componentes de acessibilidade
│
├── lib/                          # Bibliotecas e utilitários
│   ├── supabase/                # Clientes Supabase
│   │   ├── server.ts           # Cliente servidor
│   │   └── admin.ts            # Cliente admin (service_role)
│   ├── instagram.ts             # Funções Instagram API
│   ├── email.ts                 # Funções de e-mail
│   ├── storage.ts               # Funções de storage
│   └── utils.ts                 # Utilitários gerais
│
├── supabase/                     # Scripts SQL
│   ├── schema.sql               # Schema principal
│   ├── migrations/              # Migrações
│   └── *.sql                    # Scripts específicos
│
└── public/                       # Arquivos estáticos
    ├── logoN.png                # Logo principal
    └── [outros assets]
```

---

## 🔄 Fluxos Principais

### **1. Fluxo de Coleta de Dados**

```
Usuário acessa site
    ↓
Clica em "PARTICIPAR AGORA"
    ↓
Formulário dinâmico carrega perguntas de /api/questions
    ↓
Usuário preenche formulário
    ↓
Validação com Zod + React Hook Form
    ↓
Upload de imagens para Supabase Storage
    ↓
POST /api/submissions
    ↓
Cria registro em submissions
    ↓
Cria registros em answers (uma por pergunta)
    ↓
Se respondeu "Sim" à pergunta de rede social:
    ↓
Cria registro em moderation_queue (status: pending)
    ↓
Mensagem de sucesso exibida
```

### **2. Fluxo de Moderação**

```
Admin acessa /admin/moderate
    ↓
Lista de artistas com status "pending"
    ↓
Admin clica em "Preview"
    ↓
Carrega dados do artista (nome, bio, foto, redes sociais)
    ↓
Admin pode editar:
    - Biografia
    - Redes sociais
    - Legenda do Instagram
    ↓
Admin gera preview dos posts (Post 1 e Post 2)
    ↓
Admin clica em "Publicar no Instagram"
    ↓
1. Gera imagens dos posts (via Puppeteer)
2. Faz upload para Supabase Storage
3. Publica no Instagram via Graph API
4. Atualiza moderation_queue:
   - status: published
   - instagram_post_id
   - instagram_permalink
5. Envia e-mail ao artista (via Nodemailer)
```

### **3. Fluxo de Publicação no Instagram**

```
Admin solicita publicação
    ↓
POST /api/admin/generate-post-image
    ↓
Gera imagem Post 1 (apresentação)
    ↓
Gera imagem Post 2 (biografia + redes)
    ↓
POST /api/admin/upload-instagram-images
    ↓
Upload para Supabase Storage
    ↓
Retorna URLs públicas
    ↓
POST /api/instagram/publish
    ↓
1. Cria Media Container (Post 1)
2. Aguarda processamento (5s)
3. Cria Media Container (Post 2)
4. Aguarda processamento (5s)
5. Publica Carousel (ambos os posts)
6. Obtém permalink
    ↓
Retorna { id, permalink }
    ↓
Atualiza moderation_queue
    ↓
Envia e-mail ao artista
```

---

## 📊 Funcionalidades Implementadas

### **Frontend (Landing Page)**

✅ **Design Responsivo**
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly (áreas de toque mínimas de 44px)

✅ **Seções da Landing**
- **Hero**: Título, CTA, elementos geométricos animados
- **Sobre**: Informações sobre o projeto
- **Importância**: Cards explicativos + citação destacada
- **Impacto**: 4 cards (RESISTIR, RECONHECER, FORTALECER, CONECTAR)
- **CTA**: Formulário de participação
- **Footer**: Links, contatos, logos de realização

✅ **Formulário Dinâmico**
- Carregamento de perguntas do banco
- Suporte a 12 tipos de campo diferentes
- Validação em tempo real
- Upload de imagens com preview
- Editor de crop de foto
- Mensagem de sucesso personalizada
- Links para redes sociais na mensagem final

✅ **Acessibilidade**
- Botão de áudio (SpeechSynthesis) para leitura de textos
- ARIA labels em elementos interativos
- Navegação por teclado
- Contraste adequado

### **Backend (API)**

✅ **Endpoints Públicos**
- `GET /api/questions` - Lista perguntas ativas (ordenadas)
- `POST /api/submissions` - Cria submissão
- `POST /api/upload` - Upload de imagens

✅ **Endpoints Admin**
- `GET /api/admin/moderate` - Lista artistas para moderação
- `PATCH /api/admin/moderate` - Atualiza status de moderação
- `POST /api/admin/generate-post-image` - Gera imagem do post
- `POST /api/admin/upload-instagram-images` - Upload para Supabase
- `GET /api/admin/stats` - Estatísticas gerais
- `POST /api/admin/generate-report` - Gera relatório em Word

✅ **Integração Instagram**
- `POST /api/instagram/publish` - Publica post/carrossel
- Tratamento de rate limits (25 posts/dia)
- Recuperação de ID mesmo com erro
- Diálogo customizado para confirmação manual

### **Área Administrativa**

✅ **Dashboard**
- Estatísticas gerais (artistas, submissões, posts)
- Cards informativos
- Gráficos de distribuição

✅ **Gerenciamento de Perguntas**
- CRUD completo
- Drag & drop para reordenar
- Agrupamento por seções
- Editor de texto rico (TipTap)
- Preview em tempo real

✅ **Moderação**
- Lista de artistas pendentes
- Preview completo do artista
- Edição de biografia e redes sociais
- Geração de preview dos posts Instagram
- Publicação automática no Instagram
- Envio de e-mail ao artista

✅ **Estatísticas**
- Gráficos de distribuição
- Filtros por tipo de pergunta
- Exportação de relatórios

✅ **Gerenciamento de Posts**
- Criação de posts Instagram
- Templates pré-definidos
- Editor visual
- Publicação direta

### **Integrações**

✅ **Instagram Graph API**
- Autenticação OAuth
- Publicação de posts únicos
- Publicação de carrosséis
- Obtenção de permalink
- Tratamento robusto de erros

✅ **E-mail (Gmail SMTP)**
- Templates HTML customizados
- Design responsivo
- Fallback para texto simples
- Notificações de publicação

---

## 🚀 Próximos Passos para Expansão

### **1. Melhorias de Performance**

#### **Otimizações Frontend**
- [ ] **Code Splitting**: Separar componentes pesados em chunks
- [ ] **Lazy Loading**: Carregar imagens sob demanda
- [ ] **Service Worker**: Cache de assets estáticos
- [ ] **Image Optimization**: Usar Next.js Image com otimização automática
- [ ] **Prefetch de Rotas**: Pré-carregar rotas prováveis

#### **Otimizações Backend**
- [ ] **Cache de Perguntas**: Redis ou cache em memória
- [ ] **CDN para Imagens**: Cloudflare ou Vercel Blob
- [ ] **Database Indexing**: Revisar e otimizar índices
- [ ] **Query Optimization**: Analisar queries lentas

### **2. Funcionalidades de Moderação**

#### **Sistema de Aprovação em Etapas**
- [ ] **Workflow Multi-etapas**: 
  - Etapa 1: Revisão inicial
  - Etapa 2: Edição de conteúdo
  - Etapa 3: Aprovação final
  - Etapa 4: Publicação

- [ ] **Histórico de Moderação**: Log de todas as ações
- [ ] **Comentários Internos**: Sistema de notas entre moderadores
- [ ] **Notificações**: Alertas quando há novos artistas para moderar

#### **Filtros Avançados**
- [ ] **Filtro por Data**: Artistas por período
- [ ] **Filtro por Status**: Pendentes, aprovados, publicados
- [ ] **Busca**: Buscar por nome, e-mail, Instagram
- [ ] **Ordenação**: Por data, nome, status

### **3. Sistema de Notificações**

#### **E-mail**
- [ ] **Templates Adicionais**:
  - E-mail de boas-vindas ao preencher formulário
  - E-mail de aprovação (antes da publicação)
  - E-mail de rejeição (com feedback)
  - Lembrete para completar formulário

- [ ] **Preferências de Notificação**: Usuário escolhe o que receber

#### **Push Notifications** (Futuro)
- [ ] **Service Worker**: Notificações no navegador
- [ ] **PWA**: Transformar em Progressive Web App

### **4. Analytics e Relatórios**

#### **Dashboard Avançado**
- [ ] **Gráficos Interativos**: Recharts com filtros
- [ ] **Exportação de Dados**:
  - CSV completo
  - Excel (.xlsx)
  - PDF de relatórios
  - JSON para integração

- [ ] **Relatórios Customizados**: 
  - Selecionar campos específicos
  - Filtros personalizados
  - Agrupamentos

#### **Métricas de Engajamento**
- [ ] **Tracking de Visualizações**: Quantas vezes cada post foi visto
- [ ] **Métricas do Instagram**: Likes, comentários, compartilhamentos
- [ ] **Conversão**: Taxa de preenchimento do formulário

### **5. Expansão de Integrações**

#### **Redes Sociais**
- [ ] **Facebook**: Publicação automática no Facebook
- [ ] **Twitter/X**: Publicação automática
- [ ] **LinkedIn**: Publicação profissional
- [ ] **TikTok**: Publicação de vídeos (futuro)

#### **APIs Externas**
- [ ] **Google Maps**: Mapa de localização dos artistas
- [ ] **Eventbrite**: Integração com eventos culturais
- [ ] **Calendário**: Sistema de eventos e datas importantes

### **6. Sistema de Usuários**

#### **Autenticação Completa**
- [ ] **Supabase Auth**: Login seguro
- [ ] **Perfis de Usuário**: Artistas podem editar seus dados
- [ ] **Recuperação de Senha**: Fluxo completo
- [ ] **Verificação de E-mail**: Confirmação de conta

#### **Painel do Artista**
- [ ] **Dashboard do Artista**: Ver status da moderação
- [ ] **Edição de Perfil**: Atualizar informações
- [ ] **Histórico**: Ver posts publicados
- [ ] **Estatísticas Pessoais**: Visualizações, engajamento

### **7. Funcionalidades de Comunidade**

#### **Rede Social Interna**
- [ ] **Perfis Públicos**: Página de cada artista
- [ ] **Busca de Artistas**: Encontrar outros artistas
- [ ] **Conexões**: Sistema de seguir/curtir
- [ ] **Mensagens**: Comunicação entre artistas

#### **Eventos e Oportunidades**
- [ ] **Calendário de Eventos**: Eventos culturais
- [ ] **Oportunidades**: Editais, chamadas, concursos
- [ ] **Notificações de Oportunidades**: Alertas personalizados

### **8. Internacionalização (i18n)**

- [ ] **Suporte a Múltiplos Idiomas**: Português, Inglês, Espanhol
- [ ] **Tradução de Conteúdo**: Interface e conteúdo
- [ ] **Detecção Automática**: Baseado no navegador

### **9. Acessibilidade Avançada**

- [ ] **Screen Reader**: Melhorias para leitores de tela
- [ ] **Alto Contraste**: Modo de alto contraste
- [ ] **Tamanho de Fonte**: Controle pelo usuário
- [ ] **Navegação por Voz**: Comandos de voz

### **10. Segurança e Compliance**

#### **LGPD (Lei Geral de Proteção de Dados)**
- [ ] **Política de Privacidade**: Página dedicada
- [ ] **Termos de Uso**: Documentação legal
- [ ] **Consentimento Explícito**: Checkbox obrigatório
- [ ] **Direito ao Esquecimento**: Deletar dados do usuário
- [ ] **Exportação de Dados**: Usuário pode baixar seus dados

#### **Segurança**
- [ ] **Rate Limiting**: Limitar requisições por IP
- [ ] **CORS Configurado**: Apenas origens permitidas
- [ ] **Sanitização de Inputs**: Prevenir XSS
- [ ] **Validação Server-Side**: Sempre validar no backend
- [ ] **Audit Log**: Log de todas as ações administrativas

### **11. Testes**

- [ ] **Testes Unitários**: Jest + React Testing Library
- [ ] **Testes de Integração**: Testar fluxos completos
- [ ] **Testes E2E**: Playwright ou Cypress
- [ ] **Testes de Performance**: Lighthouse CI

### **12. Documentação**

- [ ] **API Documentation**: Swagger/OpenAPI
- [ ] **Guia do Usuário**: Para artistas
- [ ] **Guia do Admin**: Para moderadores
- [ ] **Documentação Técnica**: Para desenvolvedores

---

## 📈 Métricas e Monitoramento

### **Implementar**

- [ ] **Error Tracking**: Sentry ou similar
- [ ] **Performance Monitoring**: Vercel Analytics + custom
- [ ] **User Analytics**: Google Analytics ou Plausible
- [ ] **Uptime Monitoring**: UptimeRobot ou similar
- [ ] **Database Monitoring**: Supabase Dashboard + alerts

---

## 🔧 Melhorias Técnicas Sugeridas

### **Arquitetura**

1. **Microserviços** (Futuro)
   - Separar API de moderação
   - Serviço dedicado para Instagram
   - Serviço de e-mail separado

2. **Cache Layer**
   - Redis para cache de perguntas
   - Cache de imagens processadas
   - Cache de relatórios gerados

3. **Queue System**
   - Fila para publicação no Instagram (evitar rate limits)
   - Fila para envio de e-mails
   - Processamento assíncrono

### **Escalabilidade**

1. **Database**
   - Read replicas para consultas
   - Particionamento de tabelas grandes
   - Arquivo de dados antigos

2. **Storage**
   - CDN para assets estáticos
   - Otimização automática de imagens
   - Compressão de imagens

3. **API**
   - Rate limiting por usuário
   - Throttling de requisições
   - Paginação em todas as listas

---

## 📝 Considerações Finais

### **Pontos Fortes do Projeto**

✅ **Arquitetura Moderna**: Next.js 16 com App Router
✅ **Type-Safe**: TypeScript em todo o código
✅ **Escalável**: Supabase permite crescimento
✅ **Acessível**: Componentes com ARIA
✅ **Responsivo**: Funciona bem em todos os dispositivos
✅ **Integrações**: Instagram e e-mail funcionando

### **Desafios Identificados**

⚠️ **Rate Limits do Instagram**: 25 posts/dia (já tratado)
⚠️ **Custo de Storage**: Imagens podem aumentar custos
⚠️ **Performance**: Geração de imagens pode ser lenta
⚠️ **Manutenção**: Muitas dependências externas

### **Recomendações**

1. **Monitorar Custos**: Acompanhar uso do Supabase e Vercel
2. **Backup Regular**: Configurar backups automáticos
3. **Documentação**: Manter documentação atualizada
4. **Testes**: Implementar testes antes de novas features
5. **Code Review**: Revisar código antes de merge

---

## 📚 Referências e Documentação

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Instagram Graph API**: https://developers.facebook.com/docs/instagram-api
- **Radix UI**: https://www.radix-ui.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 💾 Capacidade e Limites do Plano Gratuito (Supabase)

### **Limites do Plano Free**

O projeto utiliza o **plano gratuito do Supabase**, que oferece:

#### **Banco de Dados**
- **500 MB** de armazenamento de dados
- **2 GB** de transferência de dados por mês
- **500 MB** de backup automático

#### **Storage (Arquivos)**
- **1 GB** de armazenamento de arquivos
- **2 GB** de transferência de dados por mês

#### **API e Requisições**
- **50.000** requisições por mês (API)
- **50.000** requisições por mês (Auth)
- **200.000** requisições por mês (Storage)

#### **Outros Limites**
- **2 projetos** simultâneos
- **500 MB** de logs por mês
- Sem limite de usuários autenticados (mas limitado por requisições)

---

### **Estimativa de Capacidade para o Projeto**

#### **1. Banco de Dados (500 MB)**

**Tamanho estimado por registro:**

- **`questions`**: ~2 KB por pergunta (com JSONB de opções)
- **`submissions`**: ~500 bytes por submissão
- **`answers`**: ~1-5 KB por resposta (dependendo do tipo)
- **`moderation_queue`**: ~2 KB por registro
- **`instagram_posts`**: ~5-10 KB por post (com JSONB)
- **`home_content`**: ~50 KB (único registro)

**Cálculo por artista completo:**

```
1 submission:           0.5 KB
~15 answers:            30 KB (média de 2 KB cada)
1 moderation_queue:    2 KB
2 instagram_posts:      20 KB (Post 1 + Post 2)
─────────────────────────────────
Total por artista:      ~52.5 KB
```

**Capacidade estimada:**
- **~9.500 artistas** completos (500 MB ÷ 52.5 KB)
- Considerando overhead do PostgreSQL (~20%): **~7.600 artistas**

**Cenários práticos:**

| Cenário | Artistas | Uso Estimado | Status |
|---------|----------|--------------|--------|
| **Pequeno** | 100 | ~5 MB | ✅ Confortável |
| **Médio** | 500 | ~25 MB | ✅ Confortável |
| **Grande** | 1.000 | ~50 MB | ✅ Confortável |
| **Muito Grande** | 5.000 | ~250 MB | ✅ Ainda OK |
| **Limite** | 7.600 | ~500 MB | ⚠️ Próximo do limite |

---

#### **2. Storage de Arquivos (1 GB)**

**Tamanho médio por arquivo:**

- **Foto do artista**: ~200-500 KB (após compressão)
- **Imagem gerada Post 1**: ~300-600 KB (PNG gerado pelo Puppeteer)
- **Imagem gerada Post 2**: ~300-600 KB (PNG gerado pelo Puppeteer)
- **Total por artista publicado**: ~1-1.7 MB

**Cálculo:**

```
1 foto artista:        400 KB (média)
2 imagens posts:       900 KB (Post 1 + Post 2)
─────────────────────────────────
Total por artista:     ~1.3 MB
```

**Capacidade estimada:**
- **~770 artistas** com posts publicados (1 GB ÷ 1.3 MB)
- Considerando overhead (~10%): **~700 artistas**

**Cenários práticos:**

| Cenário | Artistas Publicados | Uso Estimado | Status |
|---------|---------------------|--------------|--------|
| **Pequeno** | 50 | ~65 MB | ✅ Confortável |
| **Médio** | 200 | ~260 MB | ✅ Confortável |
| **Grande** | 500 | ~650 MB | ⚠️ Próximo do limite |
| **Limite** | 700 | ~1 GB | ⚠️ Limite atingido |

---

#### **3. Requisições API (50.000/mês)**

**Requisições por ação:**

- **Visualizar perguntas**: 1 requisição
- **Criar submissão**: 2-3 requisições (submission + answers)
- **Upload de imagem**: 1 requisição
- **Moderar artista**: 5-10 requisições (buscar dados, gerar imagem, upload, publicar)
- **Publicar no Instagram**: 3-5 requisições (gerar imagem, upload, publicar)

**Cálculo mensal estimado:**

```
100 artistas preenchendo formulário:
  - Visualizar perguntas:     100 req
  - Criar submissões:         300 req
  - Upload de fotos:          100 req
─────────────────────────────────────
Subtotal:                     500 req

50 artistas sendo moderados:
  - Buscar dados:             50 req
  - Gerar imagens:            100 req
  - Upload imagens:           100 req
  - Publicar Instagram:       200 req
─────────────────────────────────────
Subtotal:                     450 req

Total estimado:               950 req/mês
```

**Capacidade:**
- **~5.200 artistas** preenchendo formulário por mês
- **~2.600 artistas** sendo moderados por mês
- **Margem confortável** para crescimento

---

#### **4. Requisições Storage (200.000/mês)**

**Requisições por ação:**

- **Upload de foto**: 1 requisição
- **Visualizar imagem**: 1 requisição (GET)
- **Download de imagem**: 1 requisição

**Cálculo mensal:**

```
100 artistas:
  - Upload fotos:             100 req
  - Visualizações (10x cada): 1.000 req
─────────────────────────────────────
Total:                        1.100 req/mês
```

**Capacidade:**
- **~18.000 artistas** com uploads mensais
- **Margem muito confortável**

---

### **Resumo de Capacidade**

| Recurso | Limite Free | Uso Estimado (100 artistas) | Uso Estimado (500 artistas) | Uso Estimado (1.000 artistas) |
|---------|-------------|------------------------------|------------------------------|-------------------------------|
| **Banco de Dados** | 500 MB | ~5 MB (1%) | ~25 MB (5%) | ~50 MB (10%) |
| **Storage** | 1 GB | ~65 MB (6.5%) | ~325 MB (32.5%) | ~650 MB (65%) |
| **API Requests** | 50.000/mês | ~950/mês (1.9%) | ~4.750/mês (9.5%) | ~9.500/mês (19%) |
| **Storage Requests** | 200.000/mês | ~1.100/mês (0.55%) | ~5.500/mês (2.75%) | ~11.000/mês (5.5%) |

---

### **Quando Considerar Upgrade**

#### **Sinais de que precisa migrar para Pro Plan ($25/mês):**

1. **Banco de Dados > 400 MB** (80% do limite)
   - Upgrade oferece: **8 GB** (16x mais)

2. **Storage > 800 MB** (80% do limite)
   - Upgrade oferece: **100 GB** (100x mais)

3. **API Requests > 40.000/mês** (80% do limite)
   - Upgrade oferece: **500.000/mês** (10x mais)

4. **Projeto em produção** com usuários reais
   - Plano Pro oferece melhor performance e suporte

#### **Plano Pro - Benefícios Adicionais:**

- ✅ **8 GB** de banco de dados (vs 500 MB)
- ✅ **100 GB** de storage (vs 1 GB)
- ✅ **500.000** requisições API/mês (vs 50.000)
- ✅ **200 GB** de transferência (vs 2 GB)
- ✅ **Backup diário** (vs semanal)
- ✅ **Suporte prioritário**
- ✅ **Custom domains** para Auth
- ✅ **Daily backups** com retenção de 7 dias

---

### **Otimizações para Maximizar Capacidade**

#### **Banco de Dados:**

1. **Limpar dados antigos**
   - Arquivar submissões antigas (> 1 ano)
   - Manter apenas dados essenciais

2. **Otimizar JSONB**
   - Remover campos não utilizados
   - Compactar estruturas JSON

3. **Índices seletivos**
   - Criar apenas índices necessários
   - Remover índices não utilizados

#### **Storage:**

1. **Compressão de imagens**
   - Reduzir qualidade de fotos (80-85%)
   - Converter PNG para WebP quando possível
   - Limitar tamanho máximo (já configurado: 5 MB)

2. **Limpeza periódica**
   - Remover imagens de posts deletados
   - Limpar imagens temporárias

3. **CDN externo** (futuro)
   - Migrar imagens estáticas para Cloudflare/Vercel Blob
   - Reduzir uso do Supabase Storage

#### **Requisições:**

1. **Cache agressivo**
   - Cache de perguntas (já implementado)
   - Cache de imagens geradas
   - Cache de relatórios

2. **Batch operations**
   - Agrupar múltiplas operações
   - Reduzir requisições individuais

---

### **Recomendações**

#### **Curto Prazo (0-500 artistas):**
✅ **Plano Free é suficiente**
- Monitorar uso mensalmente
- Implementar limpeza automática de dados antigos

#### **Médio Prazo (500-2.000 artistas):**
⚠️ **Considerar upgrade para Pro**
- Banco de dados ainda OK (~100-200 MB)
- Storage pode ficar apertado (~650 MB - 1.3 GB)
- Requisições ainda dentro do limite

#### **Longo Prazo (2.000+ artistas):**
🔴 **Upgrade obrigatório para Pro**
- Banco de dados próximo do limite
- Storage excedido
- Requisições podem exceder limite

---

### **Monitoramento**

#### **Como Monitorar:**

1. **Supabase Dashboard**
   - Acesse: **Settings** → **Usage**
   - Visualize uso em tempo real
   - Configure alertas de limite

2. **Métricas a Acompanhar:**
   - Tamanho do banco de dados
   - Espaço usado no storage
   - Requisições API no mês atual
   - Transferência de dados

3. **Alertas Recomendados:**
   - Alerta em **80%** do limite de banco
   - Alerta em **80%** do limite de storage
   - Alerta em **80%** do limite de requisições

---

**Documento gerado em**: Janeiro 2025
**Versão do Projeto**: 0.1.0
**Última Atualização**: Baseado no estado atual do código


