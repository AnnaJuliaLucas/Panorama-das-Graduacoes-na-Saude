import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e'];

export function TabGeografico({ data }: { data: any }) {
  const { porRegiao, porUF } = data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Matrículas por Região</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={porRegiao} dataKey="matriculas" nameKey="regiao" cx="50%" cy="50%" outerRadius={80} label={({regiao, percent}: any) => `${regiao} ${(percent*100).toFixed(1)}%`}>
                  {porRegiao.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Top 10 UFs (Matrículas)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={porUF} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="uf" tick={{ fontSize: 12 }} width={40} />
                <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
                <Bar dataKey="matriculas" name="Matrículas" fill="#3b82f6" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Eficiência de Formação por Região (Concluintes/Matrículas)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={porRegiao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="regiao" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Bar dataKey="matriculas" name="Matrículas" fill="#94a3b8" radius={[4,4,0,0]} />
              <Bar dataKey="concluintes" name="Concluintes" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
