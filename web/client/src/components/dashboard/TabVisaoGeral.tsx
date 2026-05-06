import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, TrendingUp, Building2, BarChart3, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'];
const CURSO_COLORS: Record<string, string> = { Enfermagem: '#3b82f6', Fisioterapia: '#8b5cf6', Medicina: '#f59e0b', Odontologia: '#10b981' };

export function TabVisaoGeral({ data }: { data: any }) {
  const { kpis, porCurso, evolucaoTemporal } = data;
  const stats = [
    { icon: Users, label: "Matrículas", value: kpis.totalMatriculas.toLocaleString('pt-BR'), desc: `Período ${kpis.periodoAluno}`, color: "from-blue-500 to-blue-600" },
    { icon: GraduationCap, label: "Concluintes", value: kpis.totalConcluintes.toLocaleString('pt-BR'), desc: "Total de formados", color: "from-purple-500 to-purple-600" },
    { icon: TrendingUp, label: "Ingressantes", value: kpis.totalIngressos.toLocaleString('pt-BR'), desc: "Novos alunos", color: "from-amber-500 to-amber-600" },
    { icon: Building2, label: "IES", value: kpis.iesUnicas.toLocaleString('pt-BR'), desc: "Instituições únicas", color: "from-emerald-500 to-emerald-600" },
    { icon: BarChart3, label: "Vagas", value: kpis.totalVagas.toLocaleString('pt-BR'), desc: `Período ${kpis.periodoCurso}`, color: "from-rose-500 to-rose-600" },
    { icon: BookOpen, label: "Registros", value: (kpis.totalRegistrosAluno + kpis.totalRegistrosCurso).toLocaleString('pt-BR'), desc: "Alunos + Cursos", color: "from-cyan-500 to-cyan-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-500">{s.label}</p>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-[10px] text-slate-400 mt-1">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Matrículas por Curso</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={porCurso}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="curso" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
                <Bar dataKey="matriculas" name="Matrículas" radius={[6,6,0,0]}>
                  {porCurso.map((_: any, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Distribuição por Curso</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={porCurso} dataKey="matriculas" nameKey="curso" cx="50%" cy="50%" outerRadius={100} label={({curso, percent}: any) => `${curso} ${(percent*100).toFixed(1)}%`} labelLine={false}>
                  {porCurso.map((_: any, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Evolução Temporal de Matrículas por Curso (2010-2016)</h4>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={evolucaoTemporal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              {Object.entries(CURSO_COLORS).map(([curso, color]) => (
                <Line key={curso} type="monotone" dataKey={`${curso}_mat`} name={curso} stroke={color} strokeWidth={2.5} dot={{ r: 4 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
