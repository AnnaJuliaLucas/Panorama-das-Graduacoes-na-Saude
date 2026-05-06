import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const CURSO_COLORS: Record<string, string> = { Enfermagem: '#3b82f6', Fisioterapia: '#8b5cf6', Medicina: '#f59e0b', Odontologia: '#10b981' };

export function TabOfertaDemanda({ data }: { data: any }) {
  const { ofertaDemanda, concorrenciaTemporal, expansaoCursos } = data;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-1">Oferta vs Demanda por Curso</h4>
          <p className="text-sm text-slate-500 mb-4">Vagas oferecidas, inscritos e matrículas (dados acumulados 1998-2016)</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ofertaDemanda}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="curso" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Bar dataKey="vagas" name="Vagas" fill="#94a3b8" radius={[4,4,0,0]} />
              <Bar dataKey="inscritos" name="Inscritos" fill="#f59e0b" radius={[4,4,0,0]} />
              <Bar dataKey="matriculas" name="Matrículas" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ofertaDemanda.map((c: any, i: number) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{ backgroundColor: Object.values(CURSO_COLORS)[i] }} />
              <p className="text-sm font-semibold">{c.curso}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{c.concorrencia}x</p>
              <p className="text-xs text-slate-500">candidato/vaga</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Evolução da Concorrência (candidato/vaga)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={concorrenciaTemporal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => `${v}x`} />
              <Legend />
              {Object.entries(CURSO_COLORS).map(([curso, color]) => (
                <Line key={curso} type="monotone" dataKey={`${curso}_conc`} name={curso} stroke={color} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-slate-700">
            <strong>Destaque:</strong> Medicina apresenta a maior concorrência entre os cursos de saúde, seguida por Odontologia. Enfermagem e Fisioterapia têm concorrência mais baixa.
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-4">Expansão: Número de Cursos Oferecidos por Ano</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expansaoCursos}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              {Object.entries(CURSO_COLORS).map(([curso, color]) => (
                <Bar key={curso} dataKey={curso} name={curso} fill={color} stackId="a" />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
