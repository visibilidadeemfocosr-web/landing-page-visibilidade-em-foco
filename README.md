# Visibilidade em Foco - Sistema de Mapeamento de Artistas LGBTS

Projeto de mapeamento e visibilidade de artistas LGBTS da cidade de São Roque, com sistema completo de formulários dinâmicos, área administrativa e geração de relatórios.

## 🚀 Funcionalidades

- ✅ **Formulário Dinâmico**: Sistema de perguntas configurável via área admin
- ✅ **Tipos de Campo Suportados**:
  - Texto
  - Área de texto
  - Número
  - Seleção (Select)
  - Radio Button
  - Checkbox
  - Sim/Não
  - Escala (1-5 ou personalizada)
  - Upload de imagem
- ✅ **Área Admin**: Interface completa para gerenciar perguntas
- ✅ **Dashboard de Estatísticas**: Visualização de dados e gráficos
- ✅ **Exportação CSV**: Download das submissões em formato CSV
- ✅ **Validação Robusta**: Usando Zod e react-hook-form
- ✅ **Banco de Dados**: Integração com Supabase

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou pnpm
- Conta no Supabase (gratuita)

## 🛠️ Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd landing-page-for-project
```

2. **Instale as dependências**
```bash
npm install
# ou
pnpm install
```

3. **Configure o Supabase**

   a. Crie um projeto no [Supabase](https://supabase.com)
   
   b. Vá em SQL Editor e execute o script em `supabase/schema.sql`
   
   c. Crie um bucket de storage chamado `artist-images`:
      - Vá em Storage
      - Crie um novo bucket com o nome `artist-images`
      - Marque como público (public)

4. **Configure as variáveis de ambiente**

   Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
ADMIN_EMAIL=seu-email@exemplo.com
```

   Você encontra essas chaves em: Supabase Dashboard > Settings > API

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
pnpm dev
```

   Acesse [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
├── app/
│   ├── admin/              # Área administrativa
│   │   ├── questions/      # Gerenciar perguntas
│   │   ├── stats/          # Estatísticas e relatórios
│   │   └── submissions/    # Visualizar submissões
│   ├── api/                # API Routes
│   │   ├── questions/      # Endpoint público de perguntas
│   │   ├── admin/          # Endpoints admin
│   │   ├── submissions/    # Criar submissões
│   │   └── upload/         # Upload de imagens
│   └── page.tsx            # Página principal
├── components/
│   ├── dynamic-form.tsx    # Formulário dinâmico
│   ├── registration-form-loader.tsx
│   └── ui/                 # Componentes UI
├── lib/
│   └── supabase/           # Clientes Supabase
├── supabase/
│   └── schema.sql          # Schema do banco de dados
└── README.md
```

## 🎯 Como Usar

### 1. Configurar Perguntas (Admin)

1. Acesse `/admin/questions`
2. Clique em "Nova Pergunta"
3. Configure:
   - Texto da pergunta
   - Tipo de campo
   - Se é obrigatória
   - Ordem de exibição
   - Para campos select/radio: adicione as opções
   - Para escala: defina min e max
4. Salve

### 2. Visualizar Submissões (Admin)

1. Acesse `/admin/submissions`
2. Clique em uma submissão para ver detalhes
3. Use "Exportar CSV" para baixar todas as respostas

### 3. Estatísticas (Admin)

1. Acesse `/admin/stats`
2. Visualize gráficos e estatísticas das respostas
3. Filtre por tipo de pergunta

## 🔒 Segurança

- As rotas admin estão protegidas (atualmente por verificação de email)
- Recomendado: implementar autenticação completa com Supabase Auth
- Row Level Security (RLS) configurado no Supabase
- Validação de dados no frontend e backend

## 📊 Estrutura do Banco de Dados

### Tabelas

- **questions**: Armazena as perguntas do formulário
- **submissions**: Armazena as submissões dos usuários
- **answers**: Armazena as respostas (relacionada com questions e submissions)
- **admin_users**: Lista de usuários admin (opcional)

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros provedores

O projeto é compatível com qualquer provedor que suporte Next.js:
- Netlify
- Railway
- Render
- etc.

## 🛠️ Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa ESLint

## 📝 Próximos Passos

- [ ] Implementar autenticação completa com Supabase Auth
- [ ] Adicionar filtros avançados nas estatísticas
- [ ] Melhorar validação de upload de imagens
- [ ] Adicionar testes automatizados
- [ ] Implementar sistema de notificações

## 📄 Licença

Este projeto é privado.

## 🤝 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

Desenvolvido com ❤️ para o projeto Visibilidade em Foco

