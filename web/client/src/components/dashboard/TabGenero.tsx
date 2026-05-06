import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const GEN_COLORS = { feminino: '#ec4899', masculino: '#3b82f6' };

export function TabGenero({ data }: { data: any }) {
  const { generoPorCurso, generoTemporal, generoCursoTemporal } = data;

  const totalFem = generoTemporal.reduce((s: number, r: any) => s + r.feminino, 0);
  const totalMasc = generoTemporal.reduce((s: number, r: any) => s + r.masculino, 0);
  const pieData = [
    { name: 'Feminino', value: totalFem },
    { name: 'Masculino', value: totalMasc }
  ];
  const pctFem = Math.round((totalFem / (totalFem + totalMasc)) * 1000) / 10;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-pink-600 font-medium">Feminino</p>
            <p className="text-3xl font-bold text-pink-700">{pctFem}%</p>
            <p className="text-xs text-pink-500">{totalFem.toLocaleString('pt-BR')} matrículas</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-5 text-center">
            <p className="text-sm text-blue-600 font-medium">Masculino</p>
            <p className="text-3xl font-bold text-blue-700">{(100 - pctFem).toFixed(1)}%</p>
            <p className="text-xs text-blue-500">{totalMasc.toLocaleString('pt-BR')} matrículas</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={100}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={40} innerRadius={25}>
                  <Cell fill={GEN_COLORS.feminino} /><Cell fill={GEN_COLORS.masculino} />
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Gênero por Curso de Graduação</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generoPorCurso}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="curso" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Bar dataKey="feminino" name="Feminino" fill={GEN_COLORS.feminino} radius={[4,4,0,0]} />
              <Bar dataKey="masculino" name="Masculino" fill={GEN_COLORS.masculino} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Evolução Temporal por Gênero</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generoTemporal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Line type="monotone" dataKey="feminino" name="Feminino" stroke={GEN_COLORS.feminino} strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="masculino" name="Masculino" stroke={GEN_COLORS.masculino} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">% Feminino por Curso ao Longo do Tempo</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generoCursoTemporal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend />
              <Line type="monotone" dataKey="Enfermagem_pctFem" name="Enfermagem" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Medicina_pctFem" name="Medicina" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Odontologia_pctFem" name="Odontologia" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Fisioterapia_pctFem" name="Fisioterapia" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-pink-50 rounded-lg text-sm text-slate-700">
            <strong>Destaque:</strong> Enfermagem e Fisioterapia são cursos predominantemente femininos (&gt;70%), enquanto Medicina apresenta equilíbrio de gênero mais próximo.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
