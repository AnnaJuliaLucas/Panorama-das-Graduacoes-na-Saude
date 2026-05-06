import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function TabCruzamento({ data }: { data: any }) {
  const { generoInstituicao, racaInstituicao, ofertaInstTipo } = data;

  const RACA_COLORS: Record<string, string> = {
    Branca: '#60a5fa', Parda: '#f59e0b', Preta: '#8b5cf6', Amarela: '#f43f5e', Indígena: '#10b981'
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-1">Gênero × Tipo de Instituição</h4>
          <p className="text-sm text-slate-500 mb-4">Distribuição de gênero em instituições públicas e privadas</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generoInstituicao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Bar dataKey="feminino" name="Feminino" fill="#ec4899" radius={[4,4,0,0]} />
              <Bar dataKey="masculino" name="Masculino" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-1">Raça/Cor × Tipo de Instituição</h4>
          <p className="text-sm text-slate-500 mb-4">Composição racial em públicas vs privadas</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={racaInstituicao}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="tipo" tick={{ fontSize: 12 }} />
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
          <h4 className="font-semibold text-slate-900 mb-1">Vagas: Pública vs Privada por Curso</h4>
          <p className="text-sm text-slate-500 mb-4">Total de vagas oferecidas por tipo de instituição</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ofertaInstTipo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="curso" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Bar dataKey="publica_vagas" name="Pública" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="privada_vagas" name="Privada" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-sm text-slate-700">
            <strong>Insight:</strong> Instituições privadas dominam a oferta de vagas em Enfermagem e Fisioterapia, enquanto Medicina tem participação pública mais significativa.
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-8 text-center">
          <h4 className="text-2xl font-bold mb-4">Principais Conclusões</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
              <p className="font-semibold mb-2">👩‍⚕️ Feminização</p>
              <p className="text-sm opacity-90">Enfermagem e Fisioterapia são predominantemente femininos. Medicina caminha para equilíbrio de gênero.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
              <p className="font-semibold mb-2">🏫 Privatização</p>
              <p className="text-sm opacity-90">Setor privado concentra a maioria das matrículas, especialmente em Enfermagem e Fisioterapia.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur">
              <p className="font-semibold mb-2">🎯 Inclusão</p>
              <p className="text-sm opacity-90">Crescimento de alunos pardos e pretos ao longo do período, reflexo de políticas afirmativas.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
