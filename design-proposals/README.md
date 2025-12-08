# Propostas de Design

Esta pasta contém propostas de design para a home principal.

## Como usar:

### 1. Adicionar sua proposta:
- Crie uma subpasta (ex: `proposal-1/`, `proposal-2/`)
- Coloque seus arquivos de design:
  - Imagens (PNG, JPG, SVG)
  - PDFs com mockups
  - Arquivos de design (Figma, Sketch, etc.)
  - Assets (fontes, cores, ícones)

### 2. Documentar a proposta:
- Crie um `README.md` na subpasta descrevendo:
  - Conceito do design
  - Principais mudanças
  - Paleta de cores
  - Tipografia
  - Elementos visuais

### 3. Avaliação:
- O design será avaliado
- Se aprovado, será implementado como uma nova rota de preview
- Comparação lado a lado com o design atual

## Estrutura sugerida:
```
design-proposals/
├── proposal-1/
│   ├── README.md          # Descrição da proposta
│   ├── mockups/           # Imagens dos mockups
│   │   ├── desktop.png
│   │   ├── mobile.png
│   │   └── tablet.png
│   ├── assets/            # Assets adicionais
│   │   ├── colors.json
│   │   └── fonts.txt
│   └── design-files/     # Arquivos originais (Figma, etc.)
└── README.md             # Este arquivo
```

## Preview do Design:
Se quiser ver o novo design implementado como uma página separada:
- Acesse: `/preview-new-design` (será criado se necessário)
- Compare com a home atual: `/`
