# 📊 SIMAPES - TVC 1 Completo
## Sistema de Mapeamento da Educação na Saúde - Panorama das Graduações

---

## 🚀 Como Usar

### 1. Instalar e Executar o Site Web

```bash
cd web
pnpm install
pnpm dev
# Acessar: http://localhost:5173
```

**O que você verá:**
- Header com navegação
- Hero section com contexto
- 4 KPIs principais
- **4 Abas Interativas:**
  - Análise Básica (4 gráficos + cards por região)
  - Distribuição (Histogramas + Boxplots com outliers)
  - Correlação (Matriz + Scatter plots)
  - Regional (Violin plots + Tabela de estatísticas)
- Principais achados (6 cards)
- CTA section
- Footer informativo

### 2. Executar a Análise Exploratória de Dados

```bash
cd analise/scripts

# Análise básica (gera 4 gráficos)
python3 aed_completa.py

# Análise intermediária (gera 10 gráficos + relatório)
python3 aed_nivel_intermediario.py
```

**Pré-requisitos Python:**
```bash
pip install pandas numpy matplotlib seaborn
```

---

## 📊 Análise Realizada

### 5 Passos Mínimos Implementados:

✅ **Entendimento Inicial**
- Dimensões: 1.313.744 registros × 46 variáveis
- 5.570 municípios, 21 anos, 5 regiões

✅ **Limpeza e Integridade**
- Valores faltantes: 1.076.130 (taxa de completude: 98.22%)
- Registros duplicados: 0
- Verificação de inconsistências

✅ **Resumo Estatístico**
- Média, mediana, moda
- Desvio padrão, amplitude, IQR
- Assimetria (Skewness: 38-43)
- Curtose (Kurtosis: 2297-2765)

✅ **Análise de Distribuição (Univariada)**
- Histogramas com KDE
- Boxplots com detecção de outliers (~11% por categoria)
- Identificação de outliers pelo método IQR

✅ **Análise de Relacionamento (Bivariada)**
- Matriz de correlação (r = 0.91-0.98)
- Scatter plots bivariados
- Correlações com infraestrutura

### Análises Adicionais (Nível Intermediário):

- Violin plots por região
- Análise temporal detalhada
- Análise de concentração
- Estatísticas por região

---

## 🎯 Principais Achados

| Métrica | Valor |
| :--- | :--- |
| **Registros consolidados** | 1.313.744 |
| **Municípios analisados** | 5.570 |
| **Período** | 2005-2025 |
| **Disparidade Sudeste/Norte** | 78% |
| **Crescimento Enfermeiros (2007-2023)** | +785% |
| **Crescimento Odontologistas** | +380% |
| **Crescimento Fisioterapeutas** | +752% |
| **Correlação Enf. ↔ Fisio.** | 0.977 (muito forte) |
| **Correlação Enf. ↔ Odonto.** | 0.913 (forte) |
| **Outliers detectados** | ~11% por categoria |

---

## 📈 Gráficos Inclusos (9 PNG em alta resolução)

### Análise Básica:
1. **Distribuição Regional** - Média de profissionais por região
2. **Evolução Temporal** - Série 2005-2025
3. **Top 10 Estados** - Ranking de profissionais
4. **Boxplot Geral** - Distribuição geral

### Análise Intermediária:
5. **Histogramas com KDE** - Distribuição univariada
6. **Boxplots com Outliers** - Detecção IQR
7. **Matriz de Correlação** - Heatmap de correlações
8. **Scatter Plots Bivariados** - Relacionamentos entre variáveis
9. **Violin Plots por Região** - Variância regional

---

## 🛠️ Tecnologias Utilizadas

### Frontend:
- React 19
- Tailwind CSS 4
- shadcn/ui (60+ componentes)
- TypeScript
- Vite

### Análise:
- Python 3
- Pandas (manipulação de dados)
- NumPy (cálculos)
- Matplotlib (visualizações)
- Seaborn (gráficos estatísticos)

### Dados:
- SIMAPES (Portal de Dados Abertos)
- CIGETS/UFG (dados geográficos)

---

## 📝 Documentação

### Resumo Técnico-Científico
- **Arquivo:** `documentacao/AEDPanorama das Graduações na Saúde.pdf`
- **Formato:** Conforme normas WDCC
- **Tamanho:** 2 páginas
- **Conteúdo:**
  - Resumo estruturado
  - Introdução
  - Metodologia
  - Resultados (4 seções)
  - Discussão
  - Conclusão (3 parágrafos)
  - 6 referências acadêmicas

---

## 📊 Bases de Dados

### panorama_saude.csv (71 MB)
- **Registros:** 1.316.412
- **Variáveis:** 26
- **Período:** 2005-2025
- **Delimitador:** `;` (ponto e vírgula)
- **Decimais:** `,` (vírgula)
- **Variáveis principais:**
  - n_enfermeiros
  - n_odontologistas
  - n_fisioterapeutas
  - quantidade_esf, quantidade_ab, quantidade_nasf
  - lt_interna, QT_AMBULATORIOS
  - E mais...

### panorama_geo.csv (1.2 MB)
- **Registros:** 5.570 municípios
- **Variáveis:** Geográficas e regionais
- **Delimitador:** `;`
- **Variáveis principais:**
  - cod_municipio
  - regiao
  - uf_sigla
  - macrorregiao
  - E mais...

---

## ✅ Checklist de Entrega

- [x] Análise Exploratória de Dados (nível intermediário)
- [x] 5 passos mínimos implementados
- [x] 9 gráficos em alta resolução
- [x] Resumo técnico-científico (normas WDCC)
- [x] Site web interativo com 4 abas
- [x] Scripts Python documentados
- [x] Bases de dados completas
- [x] Estrutura organizada e clara
- [x] Documentação completa

---

## 🔗 Próximas Etapas

1. **Integração com Power BI** - Criar painel interativo para gestores
2. **API Backend** - Implementar endpoints para dados em tempo real
3. **Filtros Dinâmicos** - Permitir exploração por ano, região, estado
4. **Mapa Geográfico** - Visualizar distribuição de profissionais por município
5. **Exportação de Relatórios** - Gerar PDFs com gráficos e tabelas

---

## 📞 Informações do Projeto

- **Projeto:** SIMAPES - Sistema de Mapeamento da Educação na Saúde
- **Atividade:** TVC 1 - Sistematização e Implementação de um SAD
- **Data:** Maio de 2026
- **Problema de Negócio:** Ausência de plataforma centralizada para monitorar oferta e distribuição dos cursos da saúde no Brasil
- **Hipótese:** Um painel interativo em Power BI apoia a tomada de decisão e o planejamento da força de trabalho em saúde

---

**Status:** ✅ Completo e Pronto para Uso
