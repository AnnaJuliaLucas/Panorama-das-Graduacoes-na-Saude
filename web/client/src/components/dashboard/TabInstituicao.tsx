import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const INST_COLORS = { publica: '#3b82f6', privada: '#f59e0b' };

export function TabInstituicao({ data }: { data: any }) {
  const { instPorCurso, instTemporal, instDetalhada } = data;

  const totalPub = instPorCurso.reduce((s: number, r: any) => s + r.publica, 0);
  const totalPriv = instPorCurso.reduce((s: number, r: any) => s + r.privada, 0);
  const pieData = [{ name: 'Pública', value: totalPub }, { name: 'Privada', value: totalPriv }];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-blue-600 font-medium">Pública</p>
            <p className="text-3xl font-bold text-blue-700">{Math.round(totalPub / (totalPub + totalPriv) * 1000) / 10}%</p>
            <p className="text-xs text-blue-500">{totalPub.toLocaleString('pt-BR')} matrículas</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-amber-600 font-medium">Privada</p>
            <p className="text-3xl font-bold text-amber-700">{Math.round(totalPriv / (totalPub + totalPriv) * 1000) / 10}%</p>
            <p className="text-xs text-amber-500">{totalPriv.toLocaleString('pt-BR')} matrículas</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={25}>
                  <Cell fill={INST_COLORS.publica} /><Cell fill={INST_COLORS.privada} />
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Pública vs Privada por Curso</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={instPorCurso}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="curso" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Bar dataKey="publica" name="Pública" fill={INST_COLORS.publica} radius={[4,4,0,0]} />
              <Bar dataKey="privada" name="Privada" fill={INST_COLORS.privada} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Evolução Temporal: Pública vs Privada</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={instTemporal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Line type="monotone" dataKey="publica" name="Pública" stroke={INST_COLORS.publica} strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="privada" name="Privada" stroke={INST_COLORS.privada} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Detalhamento por Categoria Administrativa</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(instDetalhada).map(([curso, cats]: [string, any]) => (
              <div key={curso} className="p-4 bg-slate-50 rounded-lg">
                <h5 className="font-semibold text-sm mb-3">{curso}</h5>
                {(cats as any[]).filter((c: any) => c.matriculas > 0).map((c: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                    <span className="text-slate-600">{c.categoria}</span>
                    <span className="font-medium">{c.matriculas.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
