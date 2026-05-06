import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const RACA_COLORS: Record<string, string> = {
  Branca: '#60a5fa', Parda: '#f59e0b', Preta: '#8b5cf6', Amarela: '#f43f5e', Indígena: '#10b981', 'Não Declarada': '#94a3b8'
};

export function TabRaca({ data }: { data: any }) {
  const { racaPorCurso, racaTemporal } = data;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-1">Distribuição Racial por Curso</h4>
          <p className="text-sm text-slate-500 mb-4">Matrículas por raça/cor em cada curso de graduação (2010-2016)</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={racaPorCurso}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="curso" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              {Object.entries(RACA_COLORS).map(([raca, color]) => (
                <Bar key={raca} dataKey={raca} name={raca} fill={color} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Evolução da Diversidade Racial (2010-2016)</h4>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={racaTemporal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              {Object.entries(RACA_COLORS).filter(([r]) => r !== 'Não Declarada').map(([raca, color]) => (
                <Line key={raca} type="monotone" dataKey={raca} name={raca} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-slate-700">
            <strong>Observação:</strong> A proporção de alunos pardos e pretos tem crescido ao longo dos anos, refletindo políticas de inclusão e ações afirmativas nas universidades brasileiras.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {racaPorCurso.map((c: any, i: number) => (
          <Card key={i} className="border-0 shadow-md">
            <CardContent className="p-4">
              <h5 className="font-semibold text-sm mb-3">{c.curso}</h5>
              <div className="space-y-2">
                {Object.entries(RACA_COLORS).filter(([r]) => r !== 'Não Declarada').map(([raca, color]) => {
                  const total = Object.entries(RACA_COLORS).reduce((s, [r]) => s + (c[r] || 0), 0);
                  const pct = total > 0 ? ((c[raca] || 0) / total * 100).toFixed(1) : '0';
                  return (
                    <div key={raca}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">{raca}</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
