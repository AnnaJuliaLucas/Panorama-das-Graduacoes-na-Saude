import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Palette, Building2, TrendingUp, GitBranch, GraduationCap, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "@/hooks/useDashboardData";
import { TabVisaoGeral } from "@/components/dashboard/TabVisaoGeral";
import { TabPorCurso } from "@/components/dashboard/TabPorCurso";
import { TabGenero } from "@/components/dashboard/TabGenero";
import { TabRaca } from "@/components/dashboard/TabRaca";
import { TabInstituicao } from "@/components/dashboard/TabInstituicao";
import { TabOfertaDemanda } from "@/components/dashboard/TabOfertaDemanda";
import { TabCruzamento } from "@/components/dashboard/TabCruzamento";
import { TabGeografico } from "@/components/dashboard/TabGeografico";
import { TabMercado } from "@/components/dashboard/TabMercado";

const STATIC_TABS = [
  { value: "basica", label: "Básica", imgs: ["01_profissionais_por_regiao.png","02_evolucao_temporal.png","03_top_ufs.png","04_distribuicao_boxplot.png"] },
  { value: "distrib", label: "Distribuição", imgs: ["05_histogramas_distribuicao.png","06_boxplots_outliers.png"] },
  { value: "correl", label: "Correlação", imgs: ["07_matriz_correlacao.png","08_scatter_plots_bivariado.png"] },
  { value: "regional", label: "Regional", imgs: ["09_violinplot_por_regiao.png"] },
];

export default function Home() {
  const { data, loading, error } = useDashboardData();
  const [activeTab, setActiveTab] = useState("visao-geral");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">SIMAPES</h1>
              <p className="text-[10px] text-blue-200">Sistema de Mapeamento da Educação na Saúde</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadReport}
              className="border-white/30 text-white hover:bg-white/10 text-xs h-8">
              <Download className="w-3 h-3 mr-1" /> Relatório
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadResumo}
              className="border-white/30 text-white hover:bg-white/10 text-xs h-8">
              <Download className="w-3 h-3 mr-1" /> Resumo WDCC
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white pb-12 pt-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Panorama das Graduações na Saúde</h2>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto mb-2">
            Análise exploratória integrada de <strong className="text-white">96.124 registros</strong> sobre
            Medicina, Enfermagem, Odontologia e Fisioterapia no Brasil
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-200 mt-4">
            <span className="bg-white/10 px-3 py-1 rounded-full">📊 73K registros de alunos (2010-2016)</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🎓 23K registros de cursos (1995-2016)</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🏫 855 IES</span>
          </div>
        </div>
      </section>

      {/* MAIN DASHBOARD */}
      <main className="max-w-7xl mx-auto px-4 -mt-6">
        {loading ? (
          <Card className="border-0 shadow-xl p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-slate-500">Carregando dados do dashboard...</p>
          </Card>
        ) : error ? (
          <Card className="border-0 shadow-xl p-12 text-center">
            <p className="text-red-500">Erro ao carregar dados: {error}</p>
          </Card>
        ) : data ? (
          <Card className="border-0 shadow-xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b bg-slate-50/50 overflow-x-auto">
                <TabsList className="h-auto p-1 bg-transparent flex-wrap justify-start">
                  {[
                    { value: "visao-geral", icon: BarChart3, label: "Visão Geral" },
                    { value: "por-curso", icon: GraduationCap, label: "Por Curso" },
                    { value: "geografico", icon: MapPin, label: "Geográfico" },
                    { value: "mercado", icon: Activity, label: "Mercado vs. Formação" },
                    { value: "genero", icon: Users, label: "Gênero" },
                    { value: "raca", icon: Palette, label: "Raça/Cor" },
                    { value: "instituicao", icon: Building2, label: "Público vs Privado" },
                    { value: "oferta", icon: TrendingUp, label: "Oferta & Demanda" },
                    { value: "cruzamento", icon: GitBranch, label: "Análise Cruzada" },
                  ].map(tab => (
                    <TabsTrigger key={tab.value} value={tab.value}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs px-3 py-2 gap-1.5">
                      <tab.icon className="w-3.5 h-3.5" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="visao-geral"><TabVisaoGeral data={data} /></TabsContent>
                <TabsContent value="por-curso"><TabPorCurso data={data} /></TabsContent>
                <TabsContent value="geografico"><TabGeografico data={data} /></TabsContent>
                <TabsContent value="mercado"><TabMercado data={data} /></TabsContent>
                <TabsContent value="genero"><TabGenero data={data} /></TabsContent>
                <TabsContent value="raca"><TabRaca data={data} /></TabsContent>
                <TabsContent value="instituicao"><TabInstituicao data={data} /></TabsContent>
                <TabsContent value="oferta"><TabOfertaDemanda data={data} /></TabsContent>
                <TabsContent value="cruzamento"><TabCruzamento data={data} /></TabsContent>
              </div>
            </Tabs>
          </Card>
        ) : null}

        {/* ANÁLISE ESTATÍSTICA (gráficos estáticos originais) */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">📈 Análise Estatística (Gráficos Estáticos)</h3>
          <Card className="border-0 shadow-lg">
            <Tabs defaultValue="basica">
              <div className="border-b">
                <TabsList className="p-1 bg-transparent">
                  {STATIC_TABS.map(t => (
                    <TabsTrigger key={t.value} value={t.value} className="text-xs">{t.label}</TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {STATIC_TABS.map(t => (
                <TabsContent key={t.value} value={t.value} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {t.imgs.map(img => (
                      <img key={img} src={`/${img}`} alt={img} className="w-full rounded-lg shadow-sm border" />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold">SIMAPES — Panorama das Graduações na Saúde</p>
          <p className="text-xs text-slate-400 mt-1">Universidade Federal de Juiz de Fora (UFJF) • Dados: CIGETS/UFG</p>
          <p className="text-xs text-slate-500 mt-3">
            Fontes: panorama_aluno.csv (73K registros) • panorama_curso.csv (23K registros) • 1995-2016
          </p>
        </div>
      </footer>
    </div>
  );
}
