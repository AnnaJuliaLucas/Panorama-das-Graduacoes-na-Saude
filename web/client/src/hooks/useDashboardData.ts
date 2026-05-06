import { useState, useEffect } from 'react';

export interface DashboardData {
  kpis: any;
  porCurso: any[];
  evolucaoTemporal: any[];
  generoPorCurso: any[];
  generoTemporal: any[];
  generoCursoTemporal: any[];
  racaPorCurso: any[];
  racaTemporal: any[];
  instPorCurso: any[];
  instDetalhada: Record<string, any[]>;
  instTemporal: any[];
  ofertaDemanda: any[];
  concorrenciaTemporal: any[];
  expansaoCursos: any[];
  vagasTemporal: any[];
  generoInstituicao: any[];
  racaInstituicao: any[];
  ofertaInstTipo: any[];
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/dashboard-data.json')
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar dados');
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
