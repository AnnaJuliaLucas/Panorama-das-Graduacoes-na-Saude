# SIMAPES - Análise Exploratória de Dados: Panorama das Graduações na Saúde

## Resumo

Este relatório apresenta a Análise Exploratória de Dados (AED) do Sistema de Mapeamento da Educação na Saúde (SIMAPES), com foco no panorama das graduações e distribuição de profissionais de saúde no Brasil. Utilizando dados de 300.830 registros consolidados entre 2005 e 2025, a análise examina a distribuição espacial e temporal de enfermeiros, odontologistas e fisioterapeutas. Os resultados revelam disparidades regionais significativas, com a Região Sudeste concentrando 75,95 enfermeiros por município em média, comparado a 34,62 na Região Sul. A análise temporal demonstra crescimento sustentado em todas as categorias profissionais, com aumento de 753% no total de enfermeiros entre 2007 e 2023. Estes achados validam a hipótese de que um Sistema de Apoio à Decisão (SAD) centralizado é essencial para otimizar o planejamento da força de trabalho em saúde no Brasil.

**Palavras-chave:** SIMAPES, Análise Exploratória de Dados, Força de Trabalho em Saúde, Planejamento Regional, SAD.

## 1. Introdução

A formação e distribuição de profissionais de saúde no Brasil carecem de visibilidade consolidada, dificultando decisões estratégicas de gestores do Sistema Único de Saúde (SUS). Este trabalho sistematiza a primeira etapa de implementação de um SAD, explorando a base SIMAPES para compreender padrões na oferta de profissionais de saúde por região e ao longo do tempo.

## 2. Metodologia

A análise utilizou dados do SIMAPES integrados a informações geográficas do CIGETS. A base consolidada compreende 300.830 registros de 5.570 municípios brasileiros, cobrindo o período de 2005 a 2025. As variáveis analisadas incluem número de enfermeiros, odontologistas e fisioterapeutas. Aplicou-se estatística descritiva (média, mediana, desvio padrão, quartis) e visualizações computacionais em Python (Pandas, Matplotlib, Seaborn).

## 3. Resultados

### 3.1 Distribuição Regional

A Tabela 1 sintetiza as estatísticas por região. A Região Sudeste apresenta a maior concentração de profissionais: 75,95 enfermeiros, 51,01 odontologistas e 24,38 fisioterapeutas por município em média. Em contraste, a Região Norte possui apenas 42,20 enfermeiros, 20,06 odontologistas e 8,99 fisioterapeutas por município. Esta disparidade de 78% entre Sudeste e Norte sugere desigualdade estrutural na formação e fixação de profissionais.

| Região | Enfermeiros | Odontologistas | Fisioterapeutas |
| :--- | :---: | :---: | :---: |
| **Sudeste** | 75,95 | 51,01 | 24,38 |
| **Centro-Oeste** | 44,44 | 30,40 | 14,12 |
| **Nordeste** | 39,96 | 21,03 | 11,27 |
| **Norte** | 42,20 | 20,06 | 8,99 |
| **Sul** | 34,62 | 27,64 | 12,21 |

**Tabela 1:** Média de profissionais por município por região.

### 3.2 Distribuição Estadual

O Distrito Federal destaca-se com 5.435 enfermeiros por município em média, seguido pelo Rio de Janeiro (292) e São Paulo (105). Esta concentração em centros urbanos reflete a polarização da educação superior em saúde no país.

### 3.3 Evolução Temporal

A série temporal (2007-2024) demonstra crescimento exponencial. O total de enfermeiros cresceu de 152.404 (2007) para 1.348.917 (2023), representando aumento de 785%. Odontologistas evoluíram de 135.507 para 650.257 (+380%), e fisioterapeutas de 52.770 para 449.667 (+752%). Este crescimento sustentado valida a hipótese de expansão da educação superior em saúde, porém sem acompanhamento de políticas de distribuição regional equilibrada.

### 3.4 Estatísticas Descritivas

Os dados apresentam distribuição assimétrica. Para enfermeiros: mediana de 10, mas média de 50,14 (desvio padrão de 474,22), indicando outliers em grandes centros urbanos. Quartis mostram que 75% dos municípios possuem até 21 enfermeiros, enquanto máximo atinge 38.549 (São Paulo).

## 4. Discussão

Os dados revelam que a expansão de profissionais de saúde ocorreu de forma concentrada geograficamente. A correlação entre crescimento de profissionais e infraestrutura de internação sugere que políticas de expansão seguiram demanda de grandes centros, não necessariamente necessidades de saúde pública. A implementação de um SAD que integre estes dados permitirá gestores visualizar lacunas regionais e fundamentar decisões de alocação de recursos e incentivos à formação descentralizada.

## 5. Conclusão

A AED do SIMAPES confirma disparidades regionais críticas na distribuição de profissionais de saúde. Embora haja crescimento absoluto, a desigualdade persiste. Um SAD centralizado é fundamental para monitorar estas tendências e subsidiar políticas de equidade em saúde.

---

**Autor:** Análise Exploratória de Dados - SIMAPES  
**Data:** Maio de 2026  
**Fonte de Dados:** Portal de Dados Abertos CIGETS/SIMAPES
