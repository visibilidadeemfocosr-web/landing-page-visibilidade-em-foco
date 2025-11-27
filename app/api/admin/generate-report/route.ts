import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, TableProperties, ImageRun, Media } from 'docx'
import { format } from 'date-fns'
// chartjs-node-canvas será importado dinamicamente

// GET - Gerar relatório completo em Word (admin)
export async function GET() {
  try {
    console.log('Iniciando geração de relatório...')
    
    // Verificar autenticação
    const supabase = await createClient()
    const { data: { user } = {} } = await supabase.auth.getUser()

    if (!user) {
      console.log('Erro: Usuário não autenticado')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é admin
    const adminEmail = process.env.ADMIN_EMAIL || 'visibilidade.emfocosr@gmail.com'
    if (user.email !== adminEmail) {
      console.log('Erro: Usuário não é admin')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    console.log('Autenticação OK, buscando dados...')

    // Usar admin client para bypass RLS
    const adminClient = createAdminClient()

    // Buscar estatísticas
    console.log('Buscando submissions...')
    const { count: totalSubmissions } = await adminClient
      .from('submissions')
      .select('*', { count: 'exact', head: true })
    console.log(`Total de submissions: ${totalSubmissions}`)

    console.log('Buscando questions...')
    const { data: questions } = await adminClient
      .from('questions')
      .select('id, field_type, text')
      .eq('active', true)
      .order('order', { ascending: true })
    console.log(`Total de questions: ${questions?.length || 0}`)

    console.log('Buscando answers...')
    const { data: allAnswers } = await adminClient
      .from('answers')
      .select('value, question_id, submission_id')
    console.log(`Total de answers: ${allAnswers?.length || 0}`)

    // Função para processar valores únicos por tipo de campo
    const processUniqueValues = (answers: any[], fieldType: string) => {
      const uniqueValues: Record<string, number> = {}
      
      answers.forEach(a => {
        let val = String(a.value || '').trim()
        
        if (!val) return
        
        // Processar diferentes tipos de campo
        if (fieldType === 'yesno') {
          const lowerVal = val.toLowerCase()
          if (lowerVal === 'true' || lowerVal === 'sim' || lowerVal === 'yes') {
            val = 'Sim'
          } else if (lowerVal === 'false' || lowerVal === 'nao' || lowerVal === 'não' || lowerVal === 'no') {
            val = 'Não'
          } else if (lowerVal.includes('prefiro')) {
            val = 'Prefiro não responder'
          }
        }
        
        // Para CEP, processar formato "CEP|BAIRRO"
        if (fieldType === 'cep' && val.includes('|')) {
          const [cep, bairro] = val.split('|')
          val = bairro ? `${cep} - ${bairro}` : cep
        }
        
        uniqueValues[val] = (uniqueValues[val] || 0) + 1
      })
      
      return uniqueValues
    }

    // Processar estatísticas por pergunta
    const statsByQuestion = questions?.map(q => {
      const questionAnswers = (allAnswers || []).filter(a => a.question_id === q.id)
      const uniqueValues = processUniqueValues(questionAnswers, q.field_type)

      return {
        question: q,
        total_answers: questionAnswers.length,
        unique_values: uniqueValues,
      }
    }) || []

    // Função para gerar gráfico como imagem - REPLICAR EXATAMENTE O ESTILO DO RECHARTS
    const generateChartImage = async (
      data: Array<{ label: string; value: number }>,
      chartType: 'pie' | 'bar' = 'pie',
      title?: string
    ): Promise<Buffer> => {
      try {
        console.log(`[generateChartImage] Iniciando geração de gráfico: tipo=${chartType}, dados=${data.length} itens`)
        console.log(`[generateChartImage] Carregando módulo chartjs-node-canvas...`)
        
        // Usar import dinâmico com string literal estática para evitar problemas com webpack
        const chartjsNodeCanvasModule = await import('chartjs-node-canvas')
        const { ChartJSNodeCanvas } = chartjsNodeCanvasModule
        console.log(`[generateChartImage] Módulo carregado com sucesso`)
      
      // Dimensões otimizadas - alta resolução para qualidade
      const chartJSNodeCanvas = new ChartJSNodeCanvas({
        width: 1400,
        height: 800,
        backgroundColour: 'white',
      })
      
      // Obter contexto do canvas para criar gradientes
      const canvas = chartJSNodeCanvas as any
      const ctx = canvas._chart?.ctx || null
      
      // Paleta de cores vibrantes e profissionais
      const vibrantColors = [
        '#EC4899', // Rosa principal - identidade visual
        '#8B5CF6', // Roxo
        '#A855F7', // Roxo claro
        '#F59E0B', // Laranja
        '#10B981', // Verde
        '#3B82F6', // Azul
        '#14B8A6', // Turquesa
        '#F97316', // Laranja escuro
        '#06B6D4', // Ciano
        '#EF4444', // Vermelho
      ]
      
      // Para barras horizontais, usar gradiente roxo-azul como na imagem
      // Vamos criar uma função que retorna cores que simulam o gradiente
      const getBarColor = (index: number) => {
        // Usar roxo como cor base para todas as barras (como na imagem)
        return '#8B5CF6' // Roxo principal
      }
      
      const total = data.reduce((sum, item) => sum + item.value, 0)
      
      const configuration: any = {
        type: chartType,
        data: {
          labels: data.map(d => {
            // Truncar labels muito longos
            const label = d.label || '(sem resposta)'
            return label.length > 30 ? label.substring(0, 27) + '...' : label
          }),
          datasets: [{
            label: title || 'Distribuição',
            data: data.map(d => d.value),
            backgroundColor: chartType === 'bar'
              ? data.map(() => '#5b7dd6') // Cor intermediária que simula gradiente roxo→azul do Recharts
              : data.map((_, i) => vibrantColors[i % vibrantColors.length]),
            borderColor: chartType === 'pie' ? '#FFFFFF' : 'transparent',
            borderWidth: chartType === 'pie' ? 2 : 0,
            borderRadius: chartType === 'bar' ? [0, 8, 8, 0] : 0,
            borderSkipped: false,
            barThickness: chartType === 'bar' ? 35 : undefined,
            maxBarThickness: chartType === 'bar' ? 45 : undefined,
            categoryPercentage: chartType === 'bar' ? 0.8 : 1,
            barPercentage: chartType === 'bar' ? 0.85 : 1,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 5,
              bottom: 5,
              left: 0,
              right: 80, // Espaço para valores nas barras (igual ao Recharts: margin right 30)
            },
          },
          plugins: {
            legend: {
              display: chartType === 'pie',
              position: 'right',
              labels: {
                font: {
                  size: 20,
                  family: 'Arial',
                  weight: 'bold',
                },
                padding: 25,
                usePointStyle: true,
                pointStyle: 'circle',
                pointStyleWidth: 20,
                color: '#1F2937',
                generateLabels: function(chart: any) {
                  const data = chart.data
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label: string, i: number) => {
                      const value = data.datasets[0].data[i]
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
                      return {
                        text: `${label}: ${value} (${percentage}%)`,
                        fillStyle: data.datasets[0].backgroundColor[i],
                        strokeStyle: '#FFFFFF',
                        lineWidth: 2,
                        hidden: false,
                        index: i,
                      }
                    })
                  }
                  return []
                },
              },
            },
            title: {
              display: false, // Não mostrar título - será adicionado no Word
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: 18,
              titleFont: {
                size: 18,
                family: 'Arial',
                weight: 'bold',
              },
              bodyFont: {
                size: 16,
                family: 'Arial',
                weight: '600',
              },
              borderColor: '#EC4899',
              borderWidth: 3,
              displayColors: true,
              cornerRadius: 8,
              callbacks: {
                label: function(context: any) {
                  const label = context.label || ''
                  const value = context.parsed || context.raw
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
                  return `${label}: ${value} (${percentage}%)`
                },
              },
            },
            // datalabels será configurado separadamente se necessário
          },
        },
      }

      if (chartType === 'pie') {
        // Configurações específicas para gráfico de pizza - visual profissional
        configuration.options.plugins.legend.position = 'right'
        configuration.options.plugins.legend.labels.boxWidth = 30
        configuration.options.plugins.legend.labels.boxHeight = 30
        configuration.options.plugins.legend.labels.padding = 25
        configuration.options.plugins.legend.labels.font.size = 20
        configuration.options.plugins.legend.labels.font.weight = 'bold'
        // Espaçamento adequado
        configuration.options.layout.padding.right = 100
      }

      if (chartType === 'bar') {
        configuration.options.indexAxis = 'y'
        configuration.options.plugins.legend.display = false
        configuration.options.animation = false
        
        // Configuração EXATA do Recharts da página /admin/stats
        configuration.options.scales = {
          x: {
            beginAtZero: true,
            ticks: {
              font: {
                size: 12,
                family: 'Arial',
                weight: 'normal',
              },
              color: '#6b7280', // fill: '#6b7280' do Recharts
              stepSize: 1,
              precision: 0,
              padding: 0,
            },
            grid: {
              color: '#e5e7eb', // stroke="#e5e7eb" do Recharts
              lineWidth: 1,
              drawBorder: false,
              borderDash: [3, 3], // strokeDasharray="3 3"
              opacity: 0.3, // opacity={0.3}
            },
            title: {
              display: true,
              text: 'Quantidade',
              font: {
                size: 12,
                family: 'Arial',
                weight: 'normal',
              },
              color: '#6b7280', // fill: '#6b7280'
              padding: { top: -5, bottom: 5 }, // position: 'insideBottom', offset: -5
            },
          },
          y: {
            ticks: {
              font: {
                size: 13, // fontSize: 13 do Recharts
                family: 'Arial',
                weight: 500, // fontWeight: 500
              },
              color: '#374151', // fill: '#374151' (não #6b7280)
              padding: 0,
            },
            grid: {
              display: false,
            },
            // width: 250 no Recharts - ajustar via layout padding
          },
        }
        
        // Margens EXATAS do Recharts: margin={{ top: 20, right: 80, left: 0, bottom: 20 }}
        configuration.options.layout.padding.left = 0
        configuration.options.layout.padding.right = 80
        configuration.options.layout.padding.top = 20
        configuration.options.layout.padding.bottom = 20
        
        // Adicionar valores nas barras - usar onAnimationComplete ou afterDraw
        const originalOnComplete = configuration.options.onAnimationComplete
        configuration.options.onAnimationComplete = () => {
          if (originalOnComplete) originalOnComplete()
        }
        
        // Usar afterDatasetsDraw para desenhar valores
        configuration.options.plugins.afterDatasetsDraw = (chart: any) => {
          try {
            const ctx = chart.ctx
            const dataset = chart.data.datasets[0]
            const meta = chart.getDatasetMeta(0)
            
            if (!meta || !meta.data) return
            
            meta.data.forEach((bar: any, index: number) => {
              if (!bar) return
              
              const value = dataset.data[index]
              if (value === undefined || value === null) return
              
              // Para barras horizontais (indexAxis: 'y')
              // bar.x é a posição final da barra, bar.y é a posição vertical
              const x = bar.x
              const y = bar.y
              
              ctx.save()
              ctx.fillStyle = '#374151' // Cor EXATA do Recharts: fill: '#374151' (não #8b5cf6)
              ctx.font = 'bold 13px Arial' // fontSize: 13, fontWeight: 'bold' (do Recharts)
              ctx.textAlign = 'left'
              ctx.textBaseline = 'middle'
              ctx.fillText(String(value), x + 10, y) // offset={10} no Recharts
              ctx.restore()
            })
          } catch (error) {
            console.error('Erro ao desenhar valores nas barras:', error)
          }
        }
      }

        console.log(`[generateChartImage] Renderizando gráfico para buffer...`)
        const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration)
        console.log(`[generateChartImage] Gráfico renderizado com sucesso! Tamanho: ${imageBuffer.length} bytes`)
        
        // Garantir que o retorno seja um Buffer válido do Node.js
        if (Buffer.isBuffer(imageBuffer)) {
          return imageBuffer
        } else {
          // Converter para Buffer se necessário (pode ser Uint8Array ou outro tipo)
          return Buffer.from(imageBuffer as ArrayLike<number>)
        }
      } catch (error) {
        console.error('[generateChartImage] ERRO:', error)
        console.error('[generateChartImage] Stack:', (error as Error).stack)
        throw error
      }
    }

    // Função para criar tabela de resultados com design melhorado
    const createResultsTable = (title: string, data: Array<{ option: string; count: number; percentage: number }>) => {
      const headerRow = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ 
                text: 'Opção', 
                bold: true,
                color: 'FFFFFF',
                size: 22,
              })],
            })],
            width: { size: 60, type: WidthType.PERCENTAGE },
            shading: {
              type: ShadingType.SOLID,
              color: 'EC4899', // Rosa primário
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ 
                text: 'Quantidade', 
                bold: true,
                color: 'FFFFFF',
                size: 22,
              })],
              alignment: AlignmentType.CENTER,
            })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: {
              type: ShadingType.SOLID,
              color: 'EC4899', // Rosa primário
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ 
                text: 'Percentual (%)', 
                bold: true,
                color: 'FFFFFF',
                size: 22,
              })],
              alignment: AlignmentType.CENTER,
            })],
            width: { size: 20, type: WidthType.PERCENTAGE },
            shading: {
              type: ShadingType.SOLID,
              color: 'EC4899', // Rosa primário
            },
            margins: {
              top: 100,
              bottom: 100,
              left: 100,
              right: 100,
            },
          }),
        ],
        height: { value: 400, rule: 'atLeast' },
      })

      const dataRows = data.map((item, index) => {
        const isEven = index % 2 === 0
        return new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ 
                  text: item.option || '(sem resposta)',
                  size: 20,
                })],
              })],
              shading: isEven ? {
                type: ShadingType.SOLID,
                color: 'FDF2F8', // Rosa muito claro
              } : undefined,
              margins: {
                top: 80,
                bottom: 80,
                left: 100,
                right: 100,
              },
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ 
                  text: String(item.count),
                  bold: true,
                  color: '8B5CF6', // Roxo
                  size: 20,
                })],
                alignment: AlignmentType.CENTER,
              })],
              shading: isEven ? {
                type: ShadingType.SOLID,
                color: 'FDF2F8',
              } : undefined,
              margins: {
                top: 80,
                bottom: 80,
                left: 100,
                right: 100,
              },
            }),
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({ 
                  text: `${item.percentage.toFixed(1)}%`,
                  bold: true,
                  color: '8B5CF6', // Roxo
                  size: 20,
                })],
                alignment: AlignmentType.CENTER,
              })],
              shading: isEven ? {
                type: ShadingType.SOLID,
                color: 'FDF2F8',
              } : undefined,
              margins: {
                top: 80,
                bottom: 80,
                left: 100,
                right: 100,
              },
            }),
          ],
          height: { value: 300, rule: 'atLeast' },
        })
      })

      return new Table({
        rows: [headerRow, ...dataRows],
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 400, color: 'EC4899' },
          bottom: { style: BorderStyle.SINGLE, size: 400, color: 'EC4899' },
          left: { style: BorderStyle.SINGLE, size: 400, color: 'EC4899' },
          right: { style: BorderStyle.SINGLE, size: 400, color: 'EC4899' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 200, color: 'E5E7EB' },
          insideVertical: { style: BorderStyle.SINGLE, size: 200, color: 'E5E7EB' },
        },
        properties: new TableProperties({
          alignment: AlignmentType.CENTER,
        }),
      })
    }

    // Criar documento
    const children: (Paragraph | Table)[] = []

    // CAPA
    children.push(
      new Paragraph({
        text: '',
        spacing: { after: 400 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'MAPEAMENTO DE ARTISTAS LGBTS',
            bold: true,
            size: 48,
            color: 'EC4899',
            font: 'Arial',
          }),
        ],
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'DA CIDADE DE SÃO ROQUE',
            bold: true,
            size: 36,
            color: 'EC4899',
            font: 'Arial',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Visibilidade em Foco',
            size: 32,
            color: '8B5CF6',
            font: 'Arial',
            italics: true,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `São Roque - SP`,
            size: 20,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
            size: 18,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
      }),
    )

    // SUMÁRIO
    children.push(
      new Paragraph({
        text: 'SUMÁRIO',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: '1. RESUMO EXECUTIVO',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: '2. INTRODUÇÃO',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: '3. METODOLOGIA',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: '4. RESULTADOS E DISCUSSÃO',
        spacing: { after: 100 },
      }),
      new Paragraph({
        text: '5. CONSIDERAÇÕES FINAIS',
        spacing: { after: 400 },
      }),
    )

    // 1. RESUMO EXECUTIVO
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '1. RESUMO EXECUTIVO',
            bold: true,
            size: 32,
            color: 'EC4899',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Este relatório apresenta os resultados do mapeamento de artistas LGBTS da cidade de São Roque, realizado pelo projeto Visibilidade em Foco. A pesquisa teve como objetivo principal identificar, mapear e dar visibilidade aos artistas da comunidade LGBTS residentes no município, contribuindo para o reconhecimento de sua produção cultural e artística.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `O levantamento foi realizado através de formulário online desenvolvido especificamente para esta pesquisa, totalizando ${totalSubmissions || 0} submissões válidas. Os dados coletados permitem uma análise detalhada e abrangente do perfil demográfico, identitário, artístico e geográfico dos respondentes, fornecendo um panorama inédito da comunidade artística LGBTS em São Roque.`,
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Os principais resultados indicam a diversidade e representatividade da comunidade artística LGBTS no município, revelando aspectos importantes sobre identidade, orientação sexual, produção artística e distribuição geográfica. Estes dados fornecem subsídios fundamentais para o desenvolvimento de políticas públicas de cultura e diversidade, bem como para ações de visibilidade e reconhecimento desta comunidade.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 400 },
      }),
    )

    // 2. INTRODUÇÃO
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '2. INTRODUÇÃO',
            bold: true,
            size: 32,
            color: 'EC4899',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'A arte é uma forma fundamental de expressão e identidade, especialmente para comunidades historicamente marginalizadas e sub-representadas. No contexto brasileiro, a comunidade LGBTS enfrenta desafios significativos em relação à visibilidade, reconhecimento e acesso a oportunidades no campo artístico e cultural.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'O projeto Visibilidade em Foco surge com o objetivo de mapear e dar visibilidade aos artistas LGBTS da cidade de São Roque, reconhecendo a importância de sua produção cultural e artística para a diversidade e riqueza cultural do município. Este mapeamento representa um esforço pioneiro de identificação e caracterização desta comunidade no contexto local.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Este mapeamento busca não apenas quantificar, mas também qualificar a presença e atuação de artistas LGBTS no município, fornecendo dados que podem subsidiar políticas públicas, ações culturais e iniciativas de visibilidade. A pesquisa contribui para o preenchimento de uma lacuna importante no conhecimento sobre a comunidade artística LGBTS em São Roque.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'A pesquisa foi desenvolvida com base em metodologia quantitativa, utilizando formulário online como instrumento de coleta de dados, garantindo anonimato e privacidade dos participantes, em conformidade com a Lei Geral de Proteção de Dados (LGPD). O caráter online da pesquisa permitiu maior alcance e acessibilidade aos potenciais participantes.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 400 },
      }),
    )

    // 3. METODOLOGIA
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '3. METODOLOGIA',
            bold: true,
            size: 32,
            color: 'EC4899',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '3.1 Tipo de Pesquisa',
            bold: true,
            size: 26,
            color: '8B5CF6',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Trata-se de uma pesquisa quantitativa, descritiva e exploratória, que visa mapear e caracterizar os artistas LGBTS da cidade de São Roque.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '3.2 Instrumento de Coleta',
            bold: true,
            size: 26,
            color: '8B5CF6',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Foi utilizado formulário online desenvolvido especificamente para esta pesquisa, contendo questões sobre perfil demográfico, identidade, orientação sexual, localização geográfica e produção artística.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '3.3 População e Amostra',
            bold: true,
            size: 26,
            color: '8B5CF6',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `A população-alvo compreende artistas LGBTS residentes na cidade de São Roque. A amostra foi constituída por ${totalSubmissions || 0} respondentes que preencheram o formulário de forma completa e válida.`,
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '3.4 Considerações Éticas',
            bold: true,
            size: 26,
            color: '8B5CF6',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'A pesquisa foi conduzida em conformidade com a Lei Geral de Proteção de Dados (LGPD), garantindo anonimato, privacidade e consentimento informado dos participantes. Os dados coletados são utilizados exclusivamente para fins de pesquisa e não serão compartilhados com terceiros sem autorização.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 400 },
      }),
    )

    // 4. RESULTADOS E DISCUSSÃO
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '4. RESULTADOS E DISCUSSÃO',
            bold: true,
            size: 32,
            color: 'EC4899',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      }),
    )

    // Processar CEP separadamente para agrupar por bairro
    const cepQuestion = statsByQuestion.find(s => s.question.field_type === 'cep')
    const otherQuestions = statsByQuestion.filter(s => s.question.field_type !== 'cep')

    // Adicionar resultados de cada pergunta (exceto CEP, que será tratado separadamente)
    let tableNumber = 1
    let sectionNumber = 1
    
    // Usar for...of ao invés de forEach para permitir await
    for (const stat of otherQuestions) {
      if (stat.total_answers === 0) continue

      const questionText = stat.question.text.replace(/<[^>]+>/g, '').trim()
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `4.${sectionNumber} ${questionText}`,
              bold: true,
              size: 28,
              color: '8B5CF6',
              font: 'Arial',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `A Tabela ${tableNumber} apresenta a distribuição de respostas para a questão "${questionText}".`,
              size: 22,
              font: 'Arial',
            }),
          ],
          spacing: { after: 200 },
        }),
      )

      // Calcular percentuais
      const total = stat.total_answers
      const tableData = Object.entries(stat.unique_values)
        .map(([option, count]) => ({
          option,
          count: count as number,
          percentage: total > 0 ? ((count as number / total) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)

      // Gerar análise textual baseada nos dados
      const topOption = tableData[0]
      const secondOption = tableData[1]
      const totalOptions = tableData.length
      
      let analysisText = `Os dados apresentados na Tabela ${tableNumber} revelam que `
      
      if (topOption) {
        analysisText += `${topOption.option} representa ${topOption.percentage.toFixed(1)}% das respostas (${topOption.count} respondente${topOption.count !== 1 ? 's' : ''})`
        
        if (secondOption && secondOption.percentage > 10) {
          analysisText += `, seguido por ${secondOption.option} com ${secondOption.percentage.toFixed(1)}% (${secondOption.count} respondente${secondOption.count !== 1 ? 's' : ''})`
        }
        
        if (totalOptions > 2) {
          analysisText += `. As demais opções apresentam distribuições menores, conforme detalhado na tabela acima`
        }
        
        analysisText += '.'
      }
      
      // Adicionar análise contextual baseada no tipo de pergunta
      if (stat.question.field_type === 'yesno') {
        analysisText += ' A análise desta questão binária fornece insights importantes sobre as características e experiências dos respondentes.'
      } else if (stat.question.field_type === 'scale') {
        analysisText += ' A distribuição das respostas em escala permite avaliar tendências e percepções dos respondentes sobre o tema abordado.'
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Tabela ${tableNumber}. ${questionText}`,
              bold: true,
              size: 24,
              color: '8B5CF6',
              font: 'Arial',
            }),
          ],
          spacing: { before: 200, after: 150 },
        }),
        createResultsTable(questionText, tableData),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Fonte: Resultados originais da pesquisa.',
              italics: true,
              size: 20,
              color: '6B7280',
              font: 'Arial',
            }),
          ],
          spacing: { before: 150, after: 200 },
        }),
      )

      // Adicionar gráfico se houver dados
      if (tableData.length > 0 && tableData.length <= 15) {
        try {
          console.log(`Gerando gráfico para pergunta: ${questionText.substring(0, 50)}...`)
          const chartData = tableData.map(item => ({
            label: item.option || '(sem resposta)',
            value: item.count,
          }))

          const chartType: 'pie' | 'bar' = tableData.length <= 6 ? 'pie' : 'bar'
          console.log(`Tipo de gráfico: ${chartType}, Dados:`, chartData)
          
          const chartTitle = questionText.length > 60 
            ? questionText.substring(0, 57) + '...' 
            : questionText
          
          console.log('Chamando generateChartImage...')
          const chartImage = await generateChartImage(
            chartData,
            chartType,
            chartTitle
          )
          console.log(`Gráfico gerado com sucesso! Tamanho do buffer: ${chartImage.length} bytes`)

          // Armazenar o buffer da imagem para adicionar depois que o doc for criado
          children.push({
            type: 'image',
            buffer: chartImage,
            width: 600,
            height: 400,
          })
          console.log('Referência de imagem adicionada aos children (será processada depois)')
        } catch (error) {
          console.error('Erro ao gerar gráfico:', error)
          console.error('Stack:', (error as Error).stack)
          // Continuar sem gráfico se houver erro
        }
      } else {
        console.log(`Pulando gráfico: tableData.length=${tableData.length} (limite: 15)`)
      }

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: analysisText,
              size: 22,
              font: 'Arial',
            }),
          ],
          spacing: { after: 300 },
        }),
      )
      
      tableNumber++
      sectionNumber++
    }

    // Adicionar seção especial para CEP com agrupamento por bairro
    if (cepQuestion && cepQuestion.total_answers > 0) {
      const questionText = cepQuestion.question.text.replace(/<[^>]+>/g, '').trim()
      
      // Agrupar CEPs por bairro
      const bairroCounts: Record<string, { count: number; ceps: string[] }> = {}
      const cepDetails: Array<{ cep: string; bairro: string; count: number }> = []
      
      Object.entries(cepQuestion.unique_values).forEach(([key, count]) => {
        if (key.includes(' - ')) {
          const [cep, bairro] = key.split(' - ')
          if (!bairroCounts[bairro]) {
            bairroCounts[bairro] = { count: 0, ceps: [] }
          }
          bairroCounts[bairro].count += count as number
          bairroCounts[bairro].ceps.push(cep)
          cepDetails.push({ cep, bairro, count: count as number })
        } else {
          cepDetails.push({ cep: key, bairro: 'Não informado', count: count as number })
        }
      })
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `4.${sectionNumber} ${questionText}`,
              bold: true,
              size: 28,
              color: '8B5CF6',
              font: 'Arial',
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `A Tabela ${tableNumber} apresenta a distribuição detalhada de CEPs e bairros dos respondentes.`,
              size: 22,
              font: 'Arial',
            }),
          ],
          spacing: { after: 200 },
        }),
      )

      // Tabela detalhada de CEPs
      const totalCeps = cepQuestion.total_answers
      const cepTableData = cepDetails
        .map(item => ({
          option: item.bairro !== 'Não informado' ? `${item.cep} - ${item.bairro}` : item.cep,
          count: item.count,
          percentage: totalCeps > 0 ? (item.count / totalCeps) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Tabela ${tableNumber}. ${questionText}`,
              bold: true,
              size: 24,
              color: '8B5CF6',
              font: 'Arial',
            }),
          ],
          spacing: { before: 200, after: 150 },
        }),
        createResultsTable(questionText, cepTableData),
        new Paragraph({
          children: [
            new TextRun({
              text: 'Fonte: Resultados originais da pesquisa.',
              italics: true,
              size: 20,
              color: '6B7280',
              font: 'Arial',
            }),
          ],
          spacing: { before: 150, after: 200 },
        }),
      )

      // Tabela de distribuição por bairro
      if (Object.keys(bairroCounts).length > 0) {
        tableNumber++
        const bairroTableData = Object.entries(bairroCounts)
          .map(([bairro, data]) => {
            const totalComBairro = Object.values(bairroCounts).reduce((sum, d) => sum + d.count, 0)
            return {
              option: bairro,
              count: data.count,
              percentage: totalComBairro > 0 ? (data.count / totalComBairro) * 100 : 0,
            }
          })
          .sort((a, b) => b.count - a.count)

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `A Tabela ${tableNumber} apresenta a distribuição dos respondentes agrupados por bairro, permitindo identificar as áreas do município com maior concentração de artistas LGBTS.`,
                size: 22,
                font: 'Arial',
              }),
            ],
            spacing: { before: 200, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Tabela ${tableNumber}. Distribuição por Bairro`,
                bold: true,
                size: 24,
                color: '8B5CF6',
                font: 'Arial',
              }),
            ],
            spacing: { before: 200, after: 150 },
          }),
          createResultsTable('Distribuição por Bairro', bairroTableData),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Fonte: Resultados originais da pesquisa.',
                italics: true,
                size: 20,
                color: '6B7280',
                font: 'Arial',
              }),
            ],
            spacing: { before: 150, after: 200 },
          }),
        )

        // Adicionar gráfico de distribuição por bairro
        if (bairroTableData.length > 0 && bairroTableData.length <= 15) {
          try {
            const chartData = bairroTableData.map(item => ({
              label: item.option || '(sem resposta)',
              value: item.count,
            }))

            const chartType: 'pie' | 'bar' = bairroTableData.length <= 6 ? 'pie' : 'bar'
            
            const chartImage = await generateChartImage(
              chartData,
              chartType,
              'Distribuição de Artistas por Bairro'
            )

            // Armazenar o buffer da imagem para adicionar depois que o doc for criado
            children.push({
              type: 'image',
              buffer: chartImage,
              width: 600,
              height: 400,
            })
          } catch (error) {
            console.error('Erro ao gerar gráfico de bairro:', error)
          }
        }

        // Adicionar análise textual
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `A análise da distribuição geográfica revela que ${bairroTableData[0]?.option || 'N/A'} concentra ${bairroTableData[0]?.percentage.toFixed(1) || '0'}% dos respondentes (${bairroTableData[0]?.count || 0} respondente${bairroTableData[0]?.count !== 1 ? 's' : ''}), demonstrando a distribuição espacial dos artistas LGBTS no município. Esta informação é relevante para o planejamento de políticas públicas e ações culturais que considerem a localização geográfica dos artistas.`,
                size: 22,
                font: 'Arial',
              }),
            ],
            spacing: { after: 300 },
          }),
        )
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Os dados apresentados na Tabela ${tableNumber} mostram a distribuição de CEPs dos respondentes. A análise geográfica permite identificar a localização dos artistas LGBTS no município, informação relevante para o planejamento de políticas públicas e ações culturais locais.`,
                size: 22,
                font: 'Arial',
              }),
            ],
            spacing: { after: 300 },
          }),
        )
      }
      
      tableNumber++
      sectionNumber++
    }

    // 5. CONSIDERAÇÕES FINAIS
    children.push(
      new Paragraph({
        text: '5. CONSIDERAÇÕES FINAIS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `O mapeamento realizado pelo projeto Visibilidade em Foco identificou ${totalSubmissions || 0} artistas LGBTS na cidade de São Roque, demonstrando a presença significativa e ativa desta comunidade no município. Os dados coletados revelam a diversidade e riqueza da produção artística LGBTS local, contribuindo para o reconhecimento e valorização desta comunidade.`,
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Os resultados apresentados neste relatório fornecem uma base sólida e fundamentada para o desenvolvimento de políticas públicas, ações culturais e iniciativas de visibilidade voltadas à comunidade LGBTS de São Roque. A pesquisa representa um importante passo no sentido de dar voz e visibilidade a uma comunidade historicamente sub-representada.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 240 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Com base nos resultados obtidos, recomenda-se que os dados aqui apresentados sejam utilizados como subsídio para:',
            size: 22,
            font: 'Arial',
            bold: true,
          }),
        ],
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '• ',
            size: 22,
            font: 'Arial',
            color: 'EC4899',
          }),
          new TextRun({
            text: 'Desenvolvimento de políticas públicas de cultura e diversidade que contemplem as necessidades e especificidades da comunidade LGBTS;',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '• ',
            size: 22,
            font: 'Arial',
            color: 'EC4899',
          }),
          new TextRun({
            text: 'Criação de espaços e eventos culturais inclusivos que promovam a visibilidade dos artistas mapeados;',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '• ',
            size: 22,
            font: 'Arial',
            color: 'EC4899',
          }),
          new TextRun({
            text: 'Fomento à produção artística da comunidade LGBTS através de editais, programas e iniciativas específicas;',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '• ',
            size: 22,
            font: 'Arial',
            color: 'EC4899',
          }),
          new TextRun({
            text: 'Promoção da visibilidade e reconhecimento dos artistas mapeados em espaços culturais, mídia e eventos do município;',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: '• ',
            size: 22,
            font: 'Arial',
            color: 'EC4899',
          }),
          new TextRun({
            text: 'Continuidade e ampliação do mapeamento, visando alcançar um número ainda maior de artistas LGBTS do município.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 400 },
      }),
    )

    // REFERÊNCIAS
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'REFERÊNCIAS',
            bold: true,
            size: 32,
            color: 'EC4899',
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Diário Oficial da União, Brasília, DF, 15 ago. 2018.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). Pesquisa Nacional por Amostra de Domicílios Contínua (PNAD Contínua). Disponível em: <https://www.ibge.gov.br/estatisticas/sociais/populacao/9173-pesquisa-nacional-por-amostra-de-domicilios-continua-mensal.html>. Acesso em: ' + format(new Date(), 'dd/MM/yyyy') + '.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 150 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'VISIBILIDADE EM FOCO. Mapeamento de Artistas LGBTS da Cidade de São Roque. São Roque, 2025.',
            size: 22,
            font: 'Arial',
          }),
        ],
        spacing: { after: 400 },
      }),
    )

    // Criar documento
    console.log(`Criando documento com ${children.length} elementos...`)
    
    // Verificar se há children antes de criar o documento
    if (!children || children.length === 0) {
      throw new Error('Nenhum conteúdo para gerar o relatório')
    }
    
    // Verificar tipos dos elementos
    const childTypes = children.map((child, idx) => {
      if (child instanceof Paragraph) return `Paragraph[${idx}]`
      if (child instanceof Table) return `Table[${idx}]`
      if (child && typeof child === 'object' && 'type' in child && child.type === 'image') return `Image[${idx}]`
      return `Unknown[${idx}]: ${child?.constructor?.name || typeof child}`
    })
    console.log('Tipos dos primeiros 10 elementos:', childTypes.slice(0, 10))
    
    // Criar documento - não precisa ser vazio, podemos criar diretamente com children processados
    // Mas primeiro vamos processar os children
    
    // Processar children e substituir referências de imagem
    const processedChildren: any[] = []
    
    for (const child of children) {
      // Se for uma referência de imagem, processar corretamente
      if (child && typeof child === 'object' && 'type' in child && child.type === 'image') {
        try {
          console.log(`Processando imagem: tamanho=${child.buffer?.length || 0} bytes`)
          
          // Garantir que o buffer seja um Buffer válido do Node.js
          let imageBuffer: Buffer
          if (Buffer.isBuffer(child.buffer)) {
            imageBuffer = child.buffer
          } else if (child.buffer instanceof Uint8Array) {
            imageBuffer = Buffer.from(child.buffer)
          } else {
            // Converter ArrayBuffer ou outros formatos para Buffer
            imageBuffer = Buffer.from(child.buffer as ArrayBuffer)
          }
          
          // Verificar se o buffer tem conteúdo válido (PNG deve começar com PNG signature)
          if (imageBuffer.length < 8) {
            throw new Error('Buffer de imagem muito pequeno')
          }
          
          const isPng = imageBuffer[0] === 0x89 && 
                       imageBuffer[1] === 0x50 && 
                       imageBuffer[2] === 0x4E && 
                       imageBuffer[3] === 0x47 &&
                       imageBuffer[4] === 0x0D &&
                       imageBuffer[5] === 0x0A &&
                       imageBuffer[6] === 0x1A &&
                       imageBuffer[7] === 0x0A
          
          if (!isPng) {
            console.warn('Buffer não parece ser um PNG válido - tentando mesmo assim')
          }
          
          // Converter dimensões de pixels para EMU (English Metric Units)
          // 1 pixel = 9525 EMU (fator de conversão padrão do Office)
          const widthEmu = Math.round(child.width * 9525)
          const heightEmu = Math.round(child.height * 9525)
          
          console.log(`Criando ImageRun: ${widthEmu}x${heightEmu} EMU (${child.width}x${child.height}px)`)
          
          // Criar ImageRun com sintaxe correta da biblioteca docx
          const imageRun = new ImageRun({
            data: imageBuffer,
            transformation: {
              width: widthEmu,
              height: heightEmu,
            },
          })
          
          processedChildren.push(
            new Paragraph({
              children: [imageRun],
              alignment: AlignmentType.CENTER,
              spacing: { before: 300, after: 300 },
            }),
          )
          console.log('Imagem processada e adicionada ao documento com sucesso')
        } catch (error) {
          console.error('Erro ao processar imagem:', error)
          console.error('Stack:', (error as Error).stack)
          // Em caso de erro, adicionar texto informativo mas não quebrar o documento
          processedChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[Gráfico não pôde ser incluído: ${(error as Error).message}]`,
                  italics: true,
                  color: '666666',
                  size: 18,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 300, after: 300 },
            }),
          )
        }
      } else if (child instanceof Paragraph || child instanceof Table) {
        // Elemento válido, adicionar diretamente
        processedChildren.push(child)
      } else {
        console.warn(`Ignorando elemento desconhecido: ${child?.constructor?.name || typeof child}`)
      }
    }
    
    console.log(`Elementos válidos processados: ${processedChildren.length} de ${children.length}`)
    
    if (processedChildren.length === 0) {
      throw new Error('Nenhum elemento válido encontrado para o documento')
    }
    
    // Criar documento com children processados
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440, // 2.5cm
              right: 1440, // 2.5cm
              bottom: 1440, // 2.5cm
              left: 1440, // 2.5cm
            },
          },
        },
        children: processedChildren,
      }],
    })

    console.log('Documento criado, gerando buffer...')
    
    // Verificar se o documento foi criado corretamente
    if (!doc) {
      throw new Error('Erro ao criar documento')
    }
    
    // Não precisamos verificar sections, apenas gerar o buffer
    // A biblioteca docx gerencia isso internamente
    console.log('Documento criado com sucesso, gerando buffer...')

    // Gerar buffer do documento
    const buffer = await Packer.toBuffer(doc)
    console.log(`Buffer gerado com sucesso (${buffer.length} bytes)`)

    // Retornar como download
    return new NextResponse(buffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="relatorio-mapeamento-artistas-lgbts-sao-roque-${format(new Date(), 'yyyy-MM-dd')}.docx"`,
      },
    })
  } catch (error: any) {
    console.error('Erro ao gerar relatório:', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao gerar relatório',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

