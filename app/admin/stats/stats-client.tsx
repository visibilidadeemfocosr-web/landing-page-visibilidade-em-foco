'use client'

import { useState, useEffect } from 'react'
import type React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LabelList } from 'recharts'
import { Download, FileText, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6', '#a855f7', '#f97316', '#06b6d4']

// Componente para renderizar HTML formatado
function FormattedText({ html }: { html: string }) {
  if (!html) return null
  
  const hasHtml = /<[^>]+>/g.test(html)
  
  if (hasHtml) {
    return (
      <span 
        dangerouslySetInnerHTML={{ __html: html }}
        className="[&_p]:mb-0 [&_p]:inline [&_strong]:font-bold [&_em]:italic [&_i]:italic"
      />
    )
  }
  
  return <span>{html}</span>
}

// Função para traduzir tipos de campo para português
const translateFieldType = (type: string): string => {
  const translations: Record<string, string> = {
    text: 'Texto',
    textarea: 'Área de Texto',
    number: 'Número',
    select: 'Seleção',
    radio: 'Radio Button',
    checkbox: 'Checkbox',
    yesno: 'Sim/Não',
    scale: 'Escala',
    image: 'Upload de Imagem',
    cep: 'CEP',
  }
  return translations[type] || type
}

export default function AdminStatsClient() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState<string>('all')

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular percentuais
  const calculatePercentages = (uniqueValues: Record<string, number>, total: number) => {
    const percentages: Record<string, { count: number; percentage: number }> = {}
    Object.entries(uniqueValues).forEach(([key, value]) => {
      percentages[key] = {
        count: value as number,
        percentage: total > 0 ? ((value as number / total) * 100) : 0,
      }
    })
    return percentages
  }

  // Filtrar perguntas
  const filteredQuestions = stats?.answers_by_question?.filter((q: any) => {
    const matchesSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedQuestion === 'all' || q.question_id === selectedQuestion
    return matchesSearch && matchesFilter
  }) || []

  // Exportar para CSV
  const exportToCSV = () => {
    if (!stats || !stats.answers_by_question) return

    const rows: string[] = []
    rows.push('Relatório de Estatísticas - Visibilidade em Foco')
    rows.push(`Data de geração: ${new Date().toLocaleString('pt-BR')}`)
    rows.push('')
    rows.push(`Total de Submissões: ${stats.total_submissions}`)
    rows.push('')
    rows.push('='.repeat(80))
    rows.push('')

    stats.answers_by_question.forEach((question: any) => {
      rows.push(`Pergunta: ${question.question_text}`)
      rows.push(`Tipo: ${translateFieldType(question.field_type)}`)
      rows.push(`Total de Respostas: ${question.total_answers}`)
      rows.push('')
      
      const percentages = calculatePercentages(question.unique_values || {}, question.total_answers)
      rows.push('Opção,Quantidade,Percentual')
      Object.entries(percentages).forEach(([key, data]) => {
        rows.push(`"${key}",${data.count},${data.percentage.toFixed(2)}%`)
      })
      rows.push('')
      rows.push('-'.repeat(80))
      rows.push('')
    })

    const csvContent = rows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `relatorio-estatisticas-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return <div className="container mx-auto px-6 py-8">Carregando estatísticas...</div>
  }

  if (!stats) {
    return <div className="container mx-auto px-6 py-8">Erro ao carregar estatísticas</div>
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Estatísticas e Relatórios</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={exportToCSV} 
            disabled={!stats || stats.answers_by_question?.length === 0}
            className="w-full sm:w-auto min-h-[44px] touch-manipulation"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório CSV
          </Button>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/generate-report')
                if (!response.ok) throw new Error('Erro ao gerar relatório')
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `relatorio-mapeamento-artistas-lgbts-sao-roque-${new Date().toISOString().split('T')[0]}.docx`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                document.body.removeChild(a)
                toast.success('Relatório Word gerado com sucesso!')
              } catch (error: any) {
                toast.error('Erro ao gerar relatório: ' + (error.message || 'Erro desconhecido'))
              }
            }}
            disabled={!stats || stats.answers_by_question?.length === 0}
            variant="default"
            className="w-full sm:w-auto min-h-[44px] touch-manipulation bg-purple-600 hover:bg-purple-700"
          >
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório Word
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Submissões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total_submissions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total_questions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Campo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Object.keys(stats.by_field_type || {}).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar pergunta</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Digite para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Filtrar por pergunta</label>
              <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as perguntas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as perguntas</SelectItem>
                  {stats.answers_by_question?.map((q: any) => {
                    // Remover tags HTML para exibição no select
                    const textWithoutHtml = q.question_text.replace(/<[^>]+>/g, '')
                    const displayText = textWithoutHtml.length > 50 
                      ? textWithoutHtml.substring(0, 50) + '...' 
                      : textWithoutHtml
                    
                    return (
                      <SelectItem key={q.question_id} value={q.question_id}>
                        {displayText}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-8">
        {filteredQuestions.map((question: any) => {
          const percentages = calculatePercentages(question.unique_values || {}, question.total_answers)
          const hasData = question.total_answers > 0 && Object.keys(percentages).length > 0
          
          return (
            <Card key={question.question_id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                <CardTitle className="text-xl sm:text-2xl">
                  <FormattedText html={question.question_text} />
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Tipo: <span className="font-semibold">{translateFieldType(question.field_type)}</span> • 
                  Total de Respostas: <span className="font-semibold text-primary">{question.total_answers}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tabela com Percentuais */}
                {Object.keys(percentages).length > 0 ? (
                  <div className="bg-gradient-to-br from-muted/50 to-muted/30 p-6 rounded-xl border border-border">
                    <h4 className="text-lg font-semibold mb-6 text-center">Distribuição de Respostas</h4>
                    <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
                      <Table>
                        <TableHeader className="bg-primary/5">
                          <TableRow>
                            <TableHead className="font-semibold">
                              {question.field_type === 'cep' ? 'CEP / Bairro' : 'Opção'}
                            </TableHead>
                            <TableHead className="text-right font-semibold">Quantidade</TableHead>
                            <TableHead className="text-right font-semibold">Percentual</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(percentages)
                            .sort(([, a], [, b]) => b.percentage - a.percentage)
                            .map(([key, data], index) => {
                              // Para CEP, separar CEP e bairro se houver
                              let displayText: React.ReactNode = key || '(sem resposta)'
                              if (question.field_type === 'cep') {
                                if (key.includes(' - ')) {
                                  const [cep, bairro] = key.split(' - ')
                                  displayText = (
                                    <div className="space-y-1">
                                      <div className="font-semibold text-base">{cep}</div>
                                      <div className="text-sm text-muted-foreground font-medium">{bairro}</div>
                                    </div>
                                  )
                                } else {
                                  // Apenas CEP, sem bairro
                                  displayText = (
                                    <div className="space-y-1">
                                      <div className="font-semibold text-base">{key}</div>
                                      <div className="text-xs text-muted-foreground italic">Bairro não informado</div>
                                    </div>
                                  )
                                }
                              }
                              
                              return (
                                <TableRow 
                                  key={key}
                                  className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                                >
                                  <TableCell className="font-medium">
                                    {displayText}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold text-primary">
                                    {data.count}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <div className="w-24 bg-muted rounded-full h-2.5 overflow-hidden">
                                        <div 
                                          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                                          style={{ width: `${data.percentage}%` }}
                                        />
                                      </div>
                                      <span className="font-bold text-primary min-w-[60px]">
                                        {data.percentage.toFixed(1)}%
                                      </span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhuma resposta registrada ainda para esta pergunta.</p>
                  </div>
                )}

                {/* Gráfico de Distribuição por Bairro (apenas para CEP) */}
                {question.field_type === 'cep' && hasData && (() => {
                  // Agrupar CEPs por bairro
                  const bairroCounts: Record<string, number> = {}
                  let totalComBairro = 0
                  
                  Object.entries(percentages).forEach(([key, data]) => {
                    if (key.includes(' - ')) {
                      const [, bairro] = key.split(' - ')
                      if (bairro && bairro !== 'Bairro não informado') {
                        bairroCounts[bairro] = (bairroCounts[bairro] || 0) + data.count
                        totalComBairro += data.count
                      }
                    }
                  })
                  
                  const bairroData = Object.entries(bairroCounts)
                    .map(([bairro, count]) => ({
                      bairro,
                      quantidade: count,
                      percentual: totalComBairro > 0 ? (count / totalComBairro) * 100 : 0
                    }))
                    .sort((a, b) => b.quantidade - a.quantidade)
                  
                  const hasBairroData = bairroData.length > 0
                  
                  return hasBairroData ? (
                    <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-6 rounded-xl border border-primary/10">
                      <h4 className="text-lg font-semibold mb-6 text-center">Distribuição por Bairro</h4>
                      <p className="text-sm text-muted-foreground text-center mb-6">
                        Total de respostas com bairro identificado: <span className="font-semibold text-primary">{totalComBairro}</span>
                      </p>
                      <ResponsiveContainer width="100%" height={Math.max(300, bairroData.length * 50)}>
                        <BarChart
                          data={bairroData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                          <XAxis 
                            type="number" 
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            label={{ value: 'Quantidade', position: 'insideBottom', offset: -5, style: { fill: '#6b7280' } }}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="bairro" 
                            width={150}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            style={{ textAnchor: 'end' }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              padding: '12px',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value: any, name: string) => {
                              if (name === 'quantidade') {
                                const item = bairroData.find(d => d.quantidade === value)
                                return [
                                  `${value} resposta${value !== 1 ? 's' : ''} (${item?.percentual.toFixed(1)}%)`,
                                  'Quantidade'
                                ]
                              }
                              return [value, name]
                            }}
                          />
                          <Bar 
                            dataKey="quantidade" 
                            radius={[0, 8, 8, 0]}
                            fill="url(#colorGradientBairro)"
                            animationDuration={800}
                          >
                            <LabelList 
                              dataKey="quantidade" 
                              position="right" 
                              style={{ fill: '#8b5cf6', fontSize: 12, fontWeight: 600 }}
                              formatter={(value: number) => `${value}`}
                            />
                            <defs>
                              <linearGradient id="colorGradientBairro" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                              </linearGradient>
                            </defs>
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null
                })()}

                {/* Gráficos */}
                {question.field_type === 'yesno' && hasData && (
                  <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-6 rounded-xl border border-primary/10">
                    <h4 className="text-lg font-semibold mb-6 text-center">Distribuição Visual</h4>
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={Object.entries(percentages)
                            .map(([key, data]) => ({
                              name: key,
                              value: data.count,
                              percentage: data.percentage,
                            }))
                            .sort((a, b) => b.value - a.value)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}\n${percentage.toFixed(1)}%`}
                          outerRadius={120}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {Object.entries(percentages)
                            .sort(([, a], [, b]) => b.percentage - a.percentage)
                            .map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              stroke={COLORS[index % COLORS.length]}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value: any, name: any, props: any) => [
                            `${value} resposta${value !== 1 ? 's' : ''} (${props.payload.percentage.toFixed(2)}%)`,
                            props.payload.name
                          ]} 
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ paddingTop: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {question.field_type === 'scale' && hasData && (
                  <div className="bg-gradient-to-br from-pink-500/5 to-purple-500/5 p-6 rounded-xl border border-pink-500/10">
                    <h4 className="text-lg font-semibold mb-6 text-center">Distribuição por Escala</h4>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart
                        data={Object.entries(percentages)
                          .map(([key, data]) => ({
                            valor: key,
                            quantidade: data.count,
                            percentual: data.percentage,
                          }))
                          .sort((a, b) => Number(a.valor) - Number(b.valor))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorScale" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                        <XAxis 
                          dataKey="valor" 
                          tick={{ fill: '#6b7280', fontSize: 14 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <YAxis 
                          tick={{ fill: '#6b7280', fontSize: 14 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          }}
                          formatter={(value: any, name: any, props: any) => [
                            name === 'quantidade' 
                              ? `${value} resposta${value !== 1 ? 's' : ''} (${props.payload.percentual.toFixed(2)}%)`
                              : value,
                            name === 'quantidade' ? 'Quantidade' : 'Percentual'
                          ]} 
                        />
                        <Bar 
                          dataKey="quantidade" 
                          fill="url(#colorScale)"
                          radius={[8, 8, 0, 0]}
                          animationDuration={800}
                        >
                          <LabelList 
                            dataKey="quantidade" 
                            position="top" 
                            fill="#6b7280"
                            fontSize={12}
                            fontWeight="bold"
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {(question.field_type === 'select' || question.field_type === 'radio') && hasData && (
                  <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 p-6 rounded-xl border border-purple-500/10">
                    <h4 className="text-lg font-semibold mb-6 text-center">Distribuição por Opção</h4>
                    <div style={{ width: '100%', height: Math.min(600, Math.max(300, Object.keys(percentages).length * 60)) }}>
                      <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(percentages)
                          .map(([key, data]) => ({
                            opcao: key.length > 50 ? key.substring(0, 50) + '...' : key,
                            opcaoCompleta: key,
                            quantidade: data.count,
                            percentual: data.percentage,
                          }))
                          .sort((a, b) => b.quantidade - a.quantidade)
                          .slice(0, 20)}
                        layout="vertical"
                        margin={{ top: 20, right: 80, left: 0, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient id={`colorHorizontal-${question.question_id}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                        <XAxis 
                          type="number" 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          label={{ value: 'Quantidade', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis 
                          dataKey="opcao" 
                          type="category" 
                          width={250}
                          tick={{ fill: '#374151', fontSize: 13, fontWeight: 500 }}
                          axisLine={{ stroke: '#e5e7eb' }}
                          tickLine={{ stroke: '#e5e7eb' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            maxWidth: '350px',
                            padding: '12px',
                          }}
                          formatter={(value: any, name: any, props: any) => [
                            name === 'quantidade'
                              ? `${value} resposta${value !== 1 ? 's' : ''} (${props.payload.percentual.toFixed(2)}%)`
                              : value,
                            name === 'quantidade' ? 'Quantidade' : 'Percentual'
                          ]}
                          labelFormatter={(label) => `Opção: ${label}`}
                        />
                        <Bar 
                          dataKey="quantidade" 
                          fill={`url(#colorHorizontal-${question.question_id})`}
                          radius={[0, 8, 8, 0]}
                          animationDuration={800}
                          animationBegin={0}
                        >
                          <LabelList 
                            dataKey="quantidade" 
                            position="right" 
                            fill="#374151"
                            fontSize={13}
                            fontWeight="bold"
                            offset={10}
                          />
                        </Bar>
                      </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredQuestions.length === 0 && stats.answers_by_question && stats.answers_by_question.length > 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma pergunta encontrada com os filtros aplicados.
          </CardContent>
        </Card>
      )}

      {(!stats.answers_by_question || stats.answers_by_question.length === 0) && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma estatística disponível ainda. As estatísticas aparecerão quando houver submissões.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

