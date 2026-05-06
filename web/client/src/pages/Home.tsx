import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, MapPin, Users, Activity, Zap, Download } from "lucide-react";

export default function Home() {
  const handleDownloadReport = () => {
    const link = document.createElement('a');
    link.href = '/relatorio_aed_intermediario.txt';
    link.download = 'relatorio_aed_intermediario.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadResumo = () => {
    const link = document.createElement('a');
    link.href = '/resumo_tecnico_aed_wdcc.md';
    link.download = 'resumo_tecnico_aed_wdcc.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = [
    {
      icon: Users,
      label: "Profissionais Mapeados",
      value: "2.8M+",
      description: "Enfermeiros, Odontologistas e Fisioterapeutas"
    },
    {
      icon: MapPin,
      label: "Municípios Analisados",
      value: "5.570",
      description: "Cobertura Nacional"
    },
    {
      icon: TrendingUp,
      label: "Crescimento (2007-2023)",
      value: "+785%",
      description: "Enfermeiros"
    },
    {
      icon: BarChart3,
      label: "Período de Análise",
      value: "2005-2025",
      description: "20 anos de dados"
    }
  ];

  const regions = [
    { name: "Sudeste", enfermeiros: 75.95, odontologistas: 51.01, fisioterapeutas: 24.38, color: "from-blue-600 to-blue-400" },
    { name: "Centro-Oeste", enfermeiros: 44.44, odontologistas: 30.40, fisioterapeutas: 14.12, color: "from-purple-600 to-purple-400" },
    { name: "Nordeste", enfermeiros: 39.96, odontologistas: 21.03, fisioterapeutas: 11.27, color: "from-pink-600 to-pink-400" },
    { name: "Norte", enfermeiros: 42.20, odontologistas: 20.06, fisioterapeutas: 8.99, color: "from-orange-600 to-orange-400" },
    { name: "Sul", enfermeiros: 34.62, odontologistas: 27.64, fisioterapeutas: 12.21, color: "from-green-600 to-green-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SIMAPES</h1>
              <p className="text-xs text-slate-500">Panorama das Graduações na Saúde</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#dados" className="text-slate-600 hover:text-slate-900 transition">Dados</a>
            <a href="#analise" className="text-slate-600 hover:text-slate-900 transition">Análise</a>
            <a href="#conclusoes" className="text-slate-600 hover:text-slate-900 transition">Conclusões</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Mapeamento da Educação em Saúde no Brasil
          </h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Análise exploratória dos dados do SIMAPES revelando a distribuição espacial e temporal de profissionais de saúde em 5.570 municípios brasileiros, com foco em enfermeiros, odontologistas e fisioterapeutas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => document.getElementById('analise')?.scrollIntoView({ behavior: 'smooth' })}>
              Explorar Resultados
            </Button>
            <Button size="lg" variant="outline" onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório
            </Button>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Main Analysis Section */}
      <section id="analise" className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-3">Análise Exploratória de Dados</h3>
          <p className="text-slate-600">Visualizações interativas dos principais achados da pesquisa</p>
        </div>

        <Tabs defaultValue="basico" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="basico">Análise Básica</TabsTrigger>
            <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
            <TabsTrigger value="correlacao">Correlação</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>

          {/* TAB 1: ANÁLISE BÁSICA */}
          <TabsContent value="basico" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Distribuição Regional</CardTitle>
                  <CardDescription>Média de profissionais por município</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/01_profissionais_por_regiao.png" alt="Distribuição por Região" className="w-full rounded-lg" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Evolução Temporal</CardTitle>
                  <CardDescription>2005-2025 (20 anos de dados)</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/02_evolucao_temporal.png" alt="Evolução Temporal" className="w-full rounded-lg" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Top 10 Estados</CardTitle>
                  <CardDescription>Maior concentração de profissionais</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/03_top_ufs.png" alt="Top Estados" className="w-full rounded-lg" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Distribuição Geral</CardTitle>
                  <CardDescription>Boxplot por categoria profissional</CardDescription>
                </CardHeader>
                <CardContent>
                  <img src="/04_distribuicao_boxplot.png" alt="Distribuição" className="w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regions.map((region, idx) => (
                <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-slate-900 mb-4">{region.name}</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-600">Enfermeiros</span>
                          <span className="font-semibold text-slate-900">{region.enfermeiros.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(region.enfermeiros / 75.95) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-600">Odontologistas</span>
                          <span className="font-semibold text-slate-900">{region.odontologistas.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${(region.odontologistas / 51.01) * 100}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-slate-600">Fisioterapeutas</span>
                          <span className="font-semibold text-slate-900">{region.fisioterapeutas.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(region.fisioterapeutas / 24.38) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 2: ANÁLISE DE DISTRIBUIÇÃO (INTERMEDIÁRIA) */}
          <TabsContent value="distribuicao" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Histogramas com Kernel Density Estimation
                </CardTitle>
                <CardDescription>
                  Distribuição de frequência para cada categoria profissional com curva de densidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/05_histogramas_distribuicao.png" alt="Histogramas" className="w-full rounded-lg" />
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Interpretação:</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Distribuições altamente assimétricas (Skewness: 38-43)</li>
                    <li>• Concentração em valores baixos com cauda longa (outliers)</li>
                    <li>• Indica polarização entre municípios pequenos e grandes centros</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Boxplots com Detecção de Outliers
                </CardTitle>
                <CardDescription>
                  Identificação de valores extremos pelo método IQR (Interquartile Range)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/06_boxplots_outliers.png" alt="Boxplots" className="w-full rounded-lg" />
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Achados Principais:</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Enfermeiros: 141.827 outliers (10.80%)</li>
                    <li>• Odontologistas: 150.268 outliers (11.44%)</li>
                    <li>• Fisioterapeutas: 153.101 outliers (11.65%)</li>
                    <li>• Outliers representam grandes centros urbanos (São Paulo, Rio, DF)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: ANÁLISE DE CORRELAÇÃO (INTERMEDIÁRIA) */}
          <TabsContent value="correlacao" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Matriz de Correlação</CardTitle>
                <CardDescription>
                  Relacionamento entre categorias profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/07_matriz_correlacao.png" alt="Matriz Correlação" className="w-full rounded-lg" />
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 mb-2">ENFERMEIROS ↔ FISIOTERAPEUTAS</p>
                    <p className="text-2xl font-bold text-green-600">0.977</p>
                    <p className="text-xs text-slate-500">Correlação muito forte</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 mb-2">ENFERMEIROS ↔ ODONTOLOGISTAS</p>
                    <p className="text-2xl font-bold text-blue-600">0.913</p>
                    <p className="text-xs text-slate-500">Correlação forte</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-600 mb-2">ODONTOLOGISTAS ↔ FISIOTERAPEUTAS</p>
                    <p className="text-2xl font-bold text-purple-600">0.934</p>
                    <p className="text-xs text-slate-500">Correlação forte</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Scatter Plots Bivariados</CardTitle>
                <CardDescription>
                  Visualização do relacionamento entre pares de variáveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/08_scatter_plots_bivariado.png" alt="Scatter Plots" className="w-full rounded-lg" />
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Interpretação:</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Correlações positivas indicam que profissionais crescem juntos</li>
                    <li>• Padrão linear forte sugere políticas de expansão coordenadas</li>
                    <li>• Outliers representam centros urbanos com infraestrutura especializada</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: ANÁLISE REGIONAL (INTERMEDIÁRIA) */}
          <TabsContent value="regional" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Violin Plots por Região</CardTitle>
                <CardDescription>
                  Distribuição de variância de profissionais em cada região
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src="/09_violinplot_por_regiao.png" alt="Violin Plots" className="w-full rounded-lg" />
                <div className="mt-6 p-4 bg-rose-50 rounded-lg border border-rose-200">
                  <p className="text-sm font-semibold text-slate-900 mb-2">O que os Violin Plots mostram:</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• <strong>Sudeste:</strong> Distribuição bimodal com picos em valores baixos e altos (grande disparidade)</li>
                    <li>• <strong>Nordeste:</strong> Distribuição mais concentrada em valores médios</li>
                    <li>• <strong>Norte:</strong> Distribuição comprimida indicando menor variabilidade</li>
                    <li>• <strong>Sul:</strong> Distribuição moderada com alguns outliers</li>
                    <li>• <strong>Centro-Oeste:</strong> Distribuição similar ao Sul</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Estatísticas Detalhadas por Região</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Região</th>
                        <th className="text-center py-2 px-2">Enfermeiros (Média)</th>
                        <th className="text-center py-2 px-2">Odontologistas (Média)</th>
                        <th className="text-center py-2 px-2">Fisioterapeutas (Média)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-2 px-2 font-semibold">Sudeste</td>
                        <td className="text-center py-2 px-2">74.57</td>
                        <td className="text-center py-2 px-2">50.17</td>
                        <td className="text-center py-2 px-2">24.18</td>
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-2 px-2 font-semibold">Centro-Oeste</td>
                        <td className="text-center py-2 px-2">41.96</td>
                        <td className="text-center py-2 px-2">29.73</td>
                        <td className="text-center py-2 px-2">13.41</td>
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-2 px-2 font-semibold">Nordeste</td>
                        <td className="text-center py-2 px-2">39.83</td>
                        <td className="text-center py-2 px-2">20.87</td>
                        <td className="text-center py-2 px-2">11.24</td>
                      </tr>
                      <tr className="border-b hover:bg-slate-50">
                        <td className="py-2 px-2 font-semibold">Norte</td>
                        <td className="text-center py-2 px-2">43.42</td>
                        <td className="text-center py-2 px-2">20.57</td>
                        <td className="text-center py-2 px-2">9.40</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2 px-2 font-semibold">Sul</td>
                        <td className="text-center py-2 px-2">33.95</td>
                        <td className="text-center py-2 px-2">27.15</td>
                        <td className="text-center py-2 px-2">12.06</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Key Findings */}
      <section id="conclusoes" className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-3">Principais Achados</h3>
          <p className="text-slate-600">O que os dados revelam sobre o panorama da saúde no Brasil</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📍</span> Disparidade Regional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                A Região Sudeste concentra 78% mais enfermeiros por município que a Região Norte. Esta desigualdade estrutural reflete a polarização da educação superior em saúde nos grandes centros urbanos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📈</span> Crescimento Sustentado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Todas as categorias profissionais apresentaram crescimento exponencial entre 2007 e 2023, validando a expansão da educação superior em saúde, porém sem acompanhamento de políticas de distribuição equilibrada.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🏙️</span> Concentração Urbana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                O Distrito Federal, Rio de Janeiro e São Paulo concentram a maioria dos profissionais. Municípios menores enfrentam escassez crítica, especialmente de fisioterapeutas (mediana de 3 profissionais).
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🎯</span> Necessidade de SAD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Um Sistema de Apoio à Decisão centralizado é essencial para monitorar estas tendências e subsidiar políticas de equidade em saúde, permitindo gestores do SUS visualizar lacunas regionais.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔗</span> Correlações Fortes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                Correlações muito fortes (0.91-0.98) entre categorias profissionais indicam que políticas de expansão foram coordenadas. Crescimento de uma categoria acompanha as demais.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span> Outliers Significativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">
                ~11% de outliers em cada categoria representam grandes centros urbanos. Distribuições altamente assimétricas (Skewness: 38-43) indicam que maioria dos municípios tem poucos profissionais.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Próximas Etapas</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Esta análise exploratória é a primeira etapa para a implementação de um painel interativo em Power BI que apoiará a tomada de decisão e o planejamento da força de trabalho em saúde.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100" onClick={handleDownloadReport}>
              <Download className="w-4 h-4 mr-2" />
              Baixar Relatório AED
            </Button>
            <Button size="lg" className="bg-white/20 text-white border border-white/40 hover:bg-white/30" onClick={handleDownloadResumo}>
              <Download className="w-4 h-4 mr-2" />
              Resumo Técnico (WDCC)
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">SIMAPES</h4>
              <p className="text-sm text-slate-600">Sistema de Mapeamento da Educação na Saúde</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Fonte de Dados</h4>
              <p className="text-sm text-slate-600">Portal de Dados Abertos CIGETS/UFG</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Período</h4>
              <p className="text-sm text-slate-600">2005-2025 (1.313.744 registros)</p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600">
            <p>Análise Exploratória de Dados - TVC 1 SIMAPES | Maio de 2026</p>
            <p className="mt-2 text-xs">Análise em Nível Intermediário com 5 Passos Mínimos: Entendimento Inicial, Limpeza, Resumo Estatístico, Distribuição Univariada, Relacionamento Bivariado</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
