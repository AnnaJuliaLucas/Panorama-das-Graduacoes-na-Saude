"""
ANÁLISE EXPLORATÓRIA DE DADOS - SIMAPES
Panorama das Graduações na Saúde no Brasil
Nível: Intermediário

Passos da AED:
1. Entendimento Inicial: Estrutura e tipos de dados
2. Limpeza e Integridade: Valores faltantes, duplicatas, inconsistências
3. Resumo Estatístico: Medidas de tendência central e dispersão
4. Análise de Distribuição (Univariada): Histogramas, boxplots, outliers
5. Análise de Relacionamento (Bivariada): Correlações, scatter plots
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import os
warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURAÇÕES INICIAIS
# ============================================================================

# Diretórios
DADOS_DIR = 'analise/dados'
RELATORIOS_DIR = 'analise/relatorios'

if not os.path.exists(RELATORIOS_DIR):
    os.makedirs(RELATORIOS_DIR)

sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = [14, 8]
plt.rcParams['font.size'] = 10
pd.set_option('display.max_columns', None)
pd.set_option('display.width', None)

# ============================================================================
# PASSO 1: ENTENDIMENTO INICIAL
# ============================================================================

print("=" * 80)
print("PASSO 1: ENTENDIMENTO INICIAL - ESTRUTURA E TIPOS DE DADOS")
print("=" * 80)

# Carregamento dos dados
df_saude = pd.read_csv(f'{DADOS_DIR}/panorama_saude.csv', sep=';', decimal=',', low_memory=False)
df_geo = pd.read_csv(f'{DADOS_DIR}/panorama_geo.csv', sep=';')

print("\n--- Dimensões das Bases ---")
print(f"Base Saúde: {df_saude.shape[0]} linhas × {df_saude.shape[1]} colunas")
print(f"Base Geográfica: {df_geo.shape[0]} linhas × {df_geo.shape[1]} colunas")

print("\n--- Primeiras 5 Linhas (Base Saúde) ---")
print(df_saude.head())

print("\n--- Tipos de Dados (Base Saúde) ---")
print(df_saude.dtypes)

print("\n--- Informações da Base Saúde ---")
print(df_saude.info())

# ============================================================================
# PASSO 2: LIMPEZA E INTEGRIDADE DOS DADOS
# ============================================================================

print("\n" + "=" * 80)
print("PASSO 2: LIMPEZA E INTEGRIDADE DOS DADOS")
print("=" * 80)

# Conversão de tipos
df_saude['CODUFMUN'] = pd.to_numeric(df_saude['CODUFMUN'], errors='coerce')
df_geo['cod_municipio'] = df_geo['cod_municipio'].astype(int)

# Verificar valores faltantes
print("\n--- Valores Faltantes (Base Saúde) ---")
missing_saude = df_saude.isnull().sum()
missing_saude_pct = (missing_saude / len(df_saude)) * 100
missing_df = pd.DataFrame({
    'Coluna': missing_saude.index,
    'Faltantes': missing_saude.values,
    'Percentual': missing_saude_pct.values
})
print(missing_df[missing_df['Faltantes'] > 0].sort_values('Faltantes', ascending=False))

print("\n--- Valores Faltantes (Base Geográfica) ---")
missing_geo = df_geo.isnull().sum()
print(f"Total de valores faltantes: {missing_geo.sum()}")

# Verificar registros duplicados
print(f"\n--- Registros Duplicados ---")
print(f"Base Saúde: {df_saude.duplicated().sum()} duplicatas")
print(f"Base Geográfica: {df_geo.duplicated().sum()} duplicatas")

# Merge dos dados
df = pd.merge(df_saude, df_geo, left_on='CODUFMUN', right_on='cod_municipio', how='inner')
print(f"\n--- Base Consolidada após Merge ---")
print(f"Dimensões: {df.shape[0]} linhas × {df.shape[1]} colunas")
print(f"Municípios únicos: {df['cod_municipio'].nunique()}")
print(f"Anos únicos: {df['ano_competencia'].nunique()}")
print(f"Regiões únicas: {df['regiao'].nunique()}")

# Verificar inconsistências
print("\n--- Verificação de Inconsistências ---")
profissionais = ['n_enfermeiros', 'n_odontologistas', 'n_fisioterapeutas']
for prof in profissionais:
    df[prof] = pd.to_numeric(df[prof], errors='coerce')
    negatives = (df[prof] < 0).sum()
    print(f"{prof}: {negatives} valores negativos")

# ============================================================================
# PASSO 3: RESUMO ESTATÍSTICO
# ============================================================================

print("\n" + "=" * 80)
print("PASSO 3: RESUMO ESTATÍSTICO - MEDIDAS DE TENDÊNCIA CENTRAL E DISPERSÃO")
print("=" * 80)

print("\n--- Estatísticas Descritivas (Profissionais de Saúde) ---")
stats_df = df[profissionais].describe()
print(stats_df)

print("\n--- Estatísticas Adicionais ---")
for prof in profissionais:
    print(f"\n{prof}:")
    print(f"  Moda: {df[prof].mode().values[0] if len(df[prof].mode()) > 0 else 'N/A'}")
    print(f"  Assimetria (Skewness): {df[prof].skew():.4f}")
    print(f"  Curtose (Kurtosis): {df[prof].kurtosis():.4f}")
    print(f"  Amplitude: {df[prof].max() - df[prof].min():.2f}")
    print(f"  IQR (Q3-Q1): {df[prof].quantile(0.75) - df[prof].quantile(0.25):.2f}")

print("\n--- Estatísticas por Região ---")
regiao_stats = df.groupby('regiao')[profissionais].agg(['count', 'mean', 'median', 'std', 'min', 'max'])
print(regiao_stats)

# ============================================================================
# PASSO 4: ANÁLISE DE DISTRIBUIÇÃO (UNIVARIADA)
# ============================================================================

print("\n" + "=" * 80)
print("PASSO 4: ANÁLISE DE DISTRIBUIÇÃO (UNIVARIADA)")
print("=" * 80)

# Histogramas com KDE
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
for idx, prof in enumerate(profissionais):
    sns.histplot(df[prof].dropna(), kde=True, bins=50, ax=axes[idx], color='steelblue')
    axes[idx].set_title(f'Distribuição: {prof}')
    axes[idx].set_xlabel('Quantidade')
    axes[idx].set_ylabel('Frequência')
plt.tight_layout()
plt.savefig(f'{RELATORIOS_DIR}/05_histogramas_distribuicao.png', dpi=150)
plt.close()
print("[OK] Gráfico salvo: 05_histogramas_distribuicao.png")

# Boxplots para identificar outliers
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
for idx, prof in enumerate(profissionais):
    sns.boxplot(y=df[prof].dropna(), ax=axes[idx], color='lightcoral')
    axes[idx].set_title(f'Boxplot: {prof}')
    axes[idx].set_ylabel('Quantidade')
    
    # Calcular outliers usando IQR
    Q1 = df[prof].quantile(0.25)
    Q3 = df[prof].quantile(0.75)
    IQR = Q3 - Q1
    outliers = ((df[prof] < (Q1 - 1.5 * IQR)) | (df[prof] > (Q3 + 1.5 * IQR))).sum()
    axes[idx].text(0.5, 0.95, f'Outliers: {outliers}', transform=axes[idx].transAxes, 
                   verticalalignment='top', horizontalalignment='center', 
                   bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

plt.tight_layout()
plt.savefig(f'{RELATORIOS_DIR}/06_boxplots_outliers.png', dpi=150)
plt.close()
print("[OK] Gráfico salvo: 06_boxplots_outliers.png")

# Análise de outliers
print("\n--- Detecção de Outliers (Método IQR) ---")
for prof in profissionais:
    Q1 = df[prof].quantile(0.25)
    Q3 = df[prof].quantile(0.75)
    IQR = Q3 - Q1
    outliers_count = ((df[prof] < (Q1 - 1.5 * IQR)) | (df[prof] > (Q3 + 1.5 * IQR))).sum()
    outliers_pct = (outliers_count / len(df)) * 100
    print(f"{prof}: {outliers_count} outliers ({outliers_pct:.2f}%)")

# ============================================================================
# PASSO 5: ANÁLISE DE RELACIONAMENTO (BIVARIADA)
# ============================================================================

print("\n" + "=" * 80)
print("PASSO 5: ANÁLISE DE RELACIONAMENTO (BIVARIADA)")
print("=" * 80)

# Matriz de Correlação
print("\n--- Matriz de Correlação (Profissionais) ---")
corr_matrix = df[profissionais].corr()
print(corr_matrix)

# Heatmap de Correlação
plt.figure(figsize=(8, 6))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt=".3f", 
            square=True, linewidths=1, cbar_kws={"shrink": 0.8})
plt.title('Matriz de Correlação: Profissionais de Saúde')
plt.tight_layout()
plt.savefig(f'{RELATORIOS_DIR}/07_matriz_correlacao.png', dpi=150)
plt.close()
print("[OK] Gráfico salvo: 07_matriz_correlacao.png")

# Scatter plots - Relacionamentos Bivariados
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Enfermeiros vs Odontologistas
sns.scatterplot(data=df, x='n_enfermeiros', y='n_odontologistas', ax=axes[0], alpha=0.5)
axes[0].set_title('Enfermeiros vs Odontologistas')
corr_val = df['n_enfermeiros'].corr(df['n_odontologistas'])
axes[0].text(0.05, 0.95, f'r = {corr_val:.3f}', transform=axes[0].transAxes, 
             verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

# Enfermeiros vs Fisioterapeutas
sns.scatterplot(data=df, x='n_enfermeiros', y='n_fisioterapeutas', ax=axes[1], alpha=0.5, color='orange')
axes[1].set_title('Enfermeiros vs Fisioterapeutas')
corr_val = df['n_enfermeiros'].corr(df['n_fisioterapeutas'])
axes[1].text(0.05, 0.95, f'r = {corr_val:.3f}', transform=axes[1].transAxes, 
             verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

# Odontologistas vs Fisioterapeutas
sns.scatterplot(data=df, x='n_odontologistas', y='n_fisioterapeutas', ax=axes[2], alpha=0.5, color='green')
axes[2].set_title('Odontologistas vs Fisioterapeutas')
corr_val = df['n_odontologistas'].corr(df['n_fisioterapeutas'])
axes[2].text(0.05, 0.95, f'r = {corr_val:.3f}', transform=axes[2].transAxes, 
             verticalalignment='top', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))

plt.tight_layout()
plt.savefig(f'{RELATORIOS_DIR}/08_scatter_plots_bivariado.png', dpi=150)
plt.close()
print("[OK] Gráfico salvo: 08_scatter_plots_bivariado.png")

# Análise de Correlação com Infraestrutura
print("\n--- Correlação com Infraestrutura de Saúde ---")
infra_vars = ['quantidade_esf', 'quantidade_ab', 'lt_interna', 'QT_AMBULATORIOS']
available_infra = [var for var in infra_vars if var in df.columns]

if available_infra:
    for var in available_infra:
        df[var] = pd.to_numeric(df[var], errors='coerce')
    
    corr_infra = df[profissionais + available_infra].corr()
    print(corr_infra.loc[profissionais, available_infra])

# ============================================================================
# ANÁLISES ADICIONAIS - NÍVEL INTERMEDIÁRIO
# ============================================================================

print("\n" + "=" * 80)
print("ANÁLISES ADICIONAIS - NÍVEL INTERMEDIÁRIO")
print("=" * 80)

# Análise por Região
print("\n--- Análise de Variância por Região ---")
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

for idx, prof in enumerate(profissionais):
    sns.violinplot(data=df, x='regiao', y=prof, ax=axes[idx], palette='Set2')
    axes[idx].set_title(f'{prof} por Região')
    axes[idx].set_xlabel('Região')
    axes[idx].set_ylabel('Quantidade')
    axes[idx].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.savefig(f'{RELATORIOS_DIR}/09_violinplot_por_regiao.png', dpi=150)
plt.close()
print("[OK] Gráfico salvo: 09_violinplot_por_regiao.png")

# Análise Temporal
print("\n--- Análise Temporal ---")
df_temporal = df.groupby('ano_competencia')[profissionais].sum().reset_index()

fig, ax = plt.subplots(figsize=(12, 6))
for prof in profissionais:
    ax.plot(df_temporal['ano_competencia'], df_temporal[prof], marker='o', label=prof, linewidth=2)

ax.set_xlabel('Ano')
ax.set_ylabel('Total de Profissionais')
ax.set_title('Evolução Temporal de Profissionais de Saúde')
ax.legend()
ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig(f'{RELATORIOS_DIR}/10_evolucao_temporal_detalhada.png', dpi=150)
plt.close()
print("[OK] Gráfico salvo: 10_evolucao_temporal_detalhada.png")

# Análise de Concentração
print("\n--- Análise de Concentração (Curva de Lorenz) ---")
for prof in profissionais:
    sorted_prof = df[prof].dropna().sort_values().reset_index(drop=True)
    cumsum = sorted_prof.cumsum()
    cumsum_pct = (cumsum / cumsum.iloc[-1]) * 100
    index_pct = (np.arange(len(sorted_prof)) / len(sorted_prof)) * 100
    
    print(f"\n{prof}:")
    print(f"  Top 10% de municípios concentram: {100 - cumsum_pct.iloc[int(len(sorted_prof)*0.9)]:.2f}% dos profissionais")
    print(f"  Top 20% de municípios concentram: {100 - cumsum_pct.iloc[int(len(sorted_prof)*0.8)]:.2f}% dos profissionais")

# ============================================================================
# RELATÓRIO FINAL
# ============================================================================

print("\n" + "=" * 80)
print("RELATÓRIO FINAL - RESUMO DA AED")
print("=" * 80)

with open(f'{RELATORIOS_DIR}/relatorio_aed_intermediario.txt', 'w', encoding='utf-8') as f:
    f.write("=" * 80 + "\n")
    f.write("ANÁLISE EXPLORATÓRIA DE DADOS - SIMAPES (NÍVEL INTERMEDIÁRIO)\n")
    f.write("Panorama das Graduações na Saúde no Brasil\n")
    f.write("=" * 80 + "\n\n")
    
    f.write("PASSO 1: ENTENDIMENTO INICIAL\n")
    f.write("-" * 80 + "\n")
    f.write(f"Base Consolidada: {df.shape[0]} registros × {df.shape[1]} variáveis\n")
    f.write(f"Municípios: {df['cod_municipio'].nunique()}\n")
    f.write(f"Anos: {df['ano_competencia'].nunique()}\n")
    f.write(f"Regiões: {df['regiao'].nunique()}\n\n")
    
    f.write("PASSO 2: LIMPEZA E INTEGRIDADE\n")
    f.write("-" * 80 + "\n")
    f.write(f"Valores faltantes totais: {df.isnull().sum().sum()}\n")
    f.write(f"Registros duplicados: {df.duplicated().sum()}\n")
    f.write(f"Taxa de completude: {((1 - (df.isnull().sum().sum() / (df.shape[0] * df.shape[1]))) * 100):.2f}%\n\n")
    
    f.write("PASSO 3: RESUMO ESTATÍSTICO\n")
    f.write("-" * 80 + "\n")
    f.write(str(stats_df) + "\n\n")
    
    f.write("PASSO 4: ANÁLISE DE DISTRIBUIÇÃO\n")
    f.write("-" * 80 + "\n")
    for prof in profissionais:
        Q1 = df[prof].quantile(0.25)
        Q3 = df[prof].quantile(0.75)
        IQR = Q3 - Q1
        outliers = ((df[prof] < (Q1 - 1.5 * IQR)) | (df[prof] > (Q3 + 1.5 * IQR))).sum()
        f.write(f"{prof}: {outliers} outliers detectados\n")
    
    f.write("\nPASSO 5: ANÁLISE DE RELACIONAMENTO\n")
    f.write("-" * 80 + "\n")
    f.write("Matriz de Correlação:\n")
    f.write(str(corr_matrix) + "\n")

print("\n[OK] Relatório salvo: relatorio_aed_intermediario.txt")
print("\n[OK] Análise Exploratória de Dados concluída com sucesso!")
print("\nArquivos gerados:")
print("  - 05_histogramas_distribuicao.png")
print("  - 06_boxplots_outliers.png")
print("  - 07_matriz_correlacao.png")
print("  - 08_scatter_plots_bivariado.png")
print("  - 09_violinplot_por_regiao.png")
print("  - 10_evolucao_temporal_detalhada.png")
print("  - relatorio_aed_intermediario.txt")
