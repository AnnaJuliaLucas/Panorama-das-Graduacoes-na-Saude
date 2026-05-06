import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS: Record<string, string> = { Enfermagem: '#3b82f6', Fisioterapia: '#8b5cf6', Medicina: '#f59e0b', Odontologia: '#10b981' };

export function TabPorCurso({ data }: { data: any }) {
  const { porCurso, evolucaoTemporal } = data;

  const comparativo = porCurso.map((c: any) => ({
    curso: c.curso,
    Matrículas: c.matriculas,
    Concluintes: c.concluintes,
    Ingressantes: c.ingressos,
  }));

  const taxaConclusao = porCurso.map((c: any) => ({
    curso: c.curso,
    taxa: c.matriculas > 0 ? Math.round((c.concluintes / c.matriculas) * 1000) / 10 : 0
  }));

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-1">Comparativo entre Cursos</h4>
          <p className="text-sm text-slate-500 mb-4">Matrículas, concluintes e ingressantes por curso de graduação</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparativo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="curso" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Bar dataKey="Matrículas" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="Concluintes" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="Ingressantes" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Taxa de Conclusão por Curso (%)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taxaConclusao} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 25]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="curso" tick={{ fontSize: 12 }} width={100} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="taxa" name="Taxa de Conclusão" radius={[0,4,4,0]}>
                  {taxaConclusao.map((_: any, i: number) => (
                    <rect key={i} fill={Object.values(COLORS)[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Detalhes por Curso</h4>
            <div className="space-y-4">
              {porCurso.map((c: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: Object.values(COLORS)[i] }} />
                    <span className="font-semibold text-sm">{c.curso}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-slate-500">Matrículas</span><br/><strong>{c.matriculas.toLocaleString('pt-BR')}</strong></div>
                    <div><span className="text-slate-500">Concluintes</span><br/><strong>{c.concluintes.toLocaleString('pt-BR')}</strong></div>
                    <div><span className="text-slate-500">Ingressos</span><br/><strong>{c.ingressos.toLocaleString('pt-BR')}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Evolução de Concluintes por Curso</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={evolucaoTemporal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              {Object.entries(COLORS).map(([curso, color]) => (
                <Bar key={curso} dataKey={`${curso}_conc`} name={curso} fill={color} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
