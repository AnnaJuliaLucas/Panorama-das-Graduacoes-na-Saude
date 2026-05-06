import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

export function TabMercado({ data }: { data: any }) {
  const { mercadoTrabalho, evolucaoTemporal } = data;

  // Cruzando concluintes totais com profissionais totais
  const comparativo = mercadoTrabalho.map((m: any) => {
    const anoEduc = evolucaoTemporal.find((e: any) => e.ano === m.ano);
    return {
      ano: m.ano,
      enfermeiros_mercado: m.total_enf,
      odontologistas_mercado: m.total_od,
      fisioterapeutas_mercado: m.total_fis,
      novos_profissionais: anoEduc ? (anoEduc.Enfermagem_conc + anoEduc.Odontologia_conc + anoEduc.Fisioterapia_conc) : 0
    };
  });

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-1">Evolução de Profissionais em Atividade</h4>
          <p className="text-sm text-slate-500 mb-4">Número total de profissionais registrados no SUS (Base Saúde)</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mercadoTrabalho}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" />
              <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Line type="monotone" dataKey="total_enf" name="Enfermeiros" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="total_od" name="Odontologistas" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="total_fis" name="Fisioterapeutas" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <h4 className="font-semibold text-slate-900 mb-1">Formação vs. Mercado (Base Integrada)</h4>
          <p className="text-sm text-slate-500 mb-4">Novos concluintes anuais vs. Profissionais ativos no mercado</p>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={comparativo}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="ano" />
              <YAxis yAxisId="left" tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v: number) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => v.toLocaleString('pt-BR')} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="enfermeiros_mercado" name="Enfermeiros em Atividade" fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" />
              <Area yAxisId="right" type="monotone" dataKey="novos_profissionais" name="Novos Concluintes (Total)" fill="#f59e0b" fillOpacity={0.3} stroke="#f59e0b" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-slate-700">
            <strong>Análise Integrada:</strong> O gráfico cruza a <strong>Base Aluno</strong> (concluintes) com a <strong>Base Saude</strong> (mercado). Note como o volume de novos formandos impacta a curva de profissionais ativos ao longo dos anos.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Concentração Regional de Profissionais</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mercadoTrabalho.slice(-1)} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" hide />
                <Tooltip />
                <Legend />
                <Bar dataKey="REGIAO SUDESTE_enf" name="Sudeste (Enfermeiros)" fill="#3b82f6" />
                <Bar dataKey="REGIAO NORDESTE_enf" name="Nordeste (Enfermeiros)" fill="#f59e0b" />
                <Bar dataKey="REGIAO SUL_enf" name="Sul (Enfermeiros)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-900 mb-4">Média de Idade das Instituições (Senioridade)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.idadeIES}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="ano" />
                <YAxis domain={['auto', 'auto']} tickFormatter={(v: number) => `${v} anos`} />
                <Tooltip formatter={(v: number) => `${v} anos`} />
                <Line type="monotone" dataKey="idadeMedia" name="Idade Média das IES" stroke="#purple" strokeWidth={3} dot={{r: 5}} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-slate-500 mt-2 text-center">Calculado a partir do ano de funcionamento registrado em cada curso.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
