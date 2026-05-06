import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
import os
warnings.filterwarnings('ignore')

# Diretórios
DADOS_DIR = 'analise/dados'
RELATORIOS_DIR = 'analise/relatorios'
WEB_PUBLIC_DIR = 'web/client/public'

for d in [RELATORIOS_DIR, WEB_PUBLIC_DIR]:
    if not os.path.exists(d):
        os.makedirs(d)

# Configurações de estilo
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = [14, 8]
plt.rcParams['font.size'] = 10

def save_plot(filename, dpi=150):
    # Adicionando sufixo para evitar cache do navegador
    base, ext = os.path.splitext(filename)
    filename_v = f"{base}_v2{ext}"
    plt.savefig(f'{RELATORIOS_DIR}/{filename_v}', dpi=dpi)
    plt.savefig(f'{WEB_PUBLIC_DIR}/{filename_v}', dpi=dpi)
    print(f"[OK] Gráfico salvo: {filename_v}")

def perform_comprehensive_aed():
    print("Iniciando Análise Exploratória de Dados...")
    
    # 1. Carregamento dos dados
    print("Carregando dados...")
    df_saude = pd.read_csv(f'{DADOS_DIR}/panorama_saude.csv', sep=';', decimal=',', low_memory=False)
    df_geo = pd.read_csv(f'{DADOS_DIR}/panorama_geo.csv', sep=';')
    
    print(f"Base de saúde: {df_saude.shape}")
    print(f"Base geográfica: {df_geo.shape}")
    
    # 2. Limpeza e Preparação
    df_saude['CODUFMUN'] = pd.to_numeric(df_saude['CODUFMUN'], errors='coerce')
    df_geo['cod_municipio'] = df_geo['cod_municipio'].astype(int)
    
    # Merge
    df = pd.merge(df_saude, df_geo, left_on='CODUFMUN', right_on='cod_municipio', how='inner')
    print(f"Base consolidada: {df.shape}")
    
    # 3. Análise Descritiva Detalhada
    profissionais = ['n_enfermeiros', 'n_odontologistas', 'n_fisioterapeutas', 'quantidade_esf']
    prof_labels = {'n_enfermeiros': 'Enfermeiros', 'n_odontologistas': 'Odontologistas', 
                   'n_fisioterapeutas': 'Fisioterapeutas', 'quantidade_esf': 'Médicos (ESF)'}
    
    # Estatísticas gerais
    stats = {}
    for prof in profissionais:
        df[prof] = pd.to_numeric(df[prof], errors='coerce')
        stats[prof] = {
            'media': df[prof].mean(),
            'mediana': df[prof].median(),
            'std': df[prof].std(),
            'min': df[prof].min(),
            'max': df[prof].max(),
            'q25': df[prof].quantile(0.25),
            'q75': df[prof].quantile(0.75)
        }
    
    # 4. Análises por Região
    agg_regiao = df.groupby('regiao')[profissionais].agg(['mean', 'median', 'sum', 'count']).reset_index()
    
    # 5. Evolução Temporal
    agg_ano = df.groupby('ano_competencia')[profissionais].sum().reset_index()
    
    # 6. Distribuição por UF
    agg_uf = df.groupby('uf_sigla')[profissionais].mean().reset_index()
    
    # 7. Visualizações
    # Gráfico 1: Distribuição de profissionais por região
    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(len(agg_regiao))
    width = 0.25
    ax.bar(x - width*1.5, agg_regiao[('n_enfermeiros', 'mean')], width, label='Enfermeiros', color='#2E86AB')
    ax.bar(x - width/2, agg_regiao[('n_odontologistas', 'mean')], width, label='Odontologistas', color='#A23B72')
    ax.bar(x + width/2, agg_regiao[('n_fisioterapeutas', 'mean')], width, label='Fisioterapeutas', color='#F18F01')
    ax.bar(x + width*1.5, agg_regiao[('quantidade_esf', 'mean')], width, label='Médicos (ESF)', color='#C73E1D')
    ax.set_xlabel('Região')
    ax.set_ylabel('Média de Profissionais por Município')
    ax.set_title('Distribuição Média de Profissionais de Saúde por Região')
    ax.set_xticks(x)
    ax.set_xticklabels(agg_regiao['regiao'], rotation=45, ha='right')
    ax.legend()
    plt.tight_layout()
    save_plot('01_profissionais_por_regiao.png')
    plt.close()
    
    # Gráfico 2: Evolução temporal
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.plot(agg_ano['ano_competencia'], agg_ano['n_enfermeiros'], marker='o', label='Enfermeiros', linewidth=2, color='#2E86AB')
    ax.plot(agg_ano['ano_competencia'], agg_ano['n_odontologistas'], marker='s', label='Odontologistas', linewidth=2, color='#A23B72')
    ax.plot(agg_ano['ano_competencia'], agg_ano['n_fisioterapeutas'], marker='^', label='Fisioterapeutas', linewidth=2, color='#F18F01')
    ax.plot(agg_ano['ano_competencia'], agg_ano['quantidade_esf'], marker='D', label='Médicos (ESF)', linewidth=2, color='#C73E1D')
    ax.set_xlabel('Ano')
    ax.set_ylabel('Total de Profissionais')
    ax.set_title('Evolução Temporal do Número Total de Profissionais (2005-2025)')
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    save_plot('02_evolucao_temporal.png')
    plt.close()
    
    # Gráfico 3: Distribuição por UF (Top 10)
    top_ufs = agg_uf.nlargest(10, 'n_enfermeiros')
    fig, ax = plt.subplots(figsize=(12, 6))
    x = np.arange(len(top_ufs))
    width = 0.25
    ax.bar(x - width*1.5, top_ufs['n_enfermeiros'], width, label='Enfermeiros', color='#2E86AB')
    ax.bar(x - width/2, top_ufs['n_odontologistas'], width, label='Odontologistas', color='#A23B72')
    ax.bar(x + width/2, top_ufs['n_fisioterapeutas'], width, label='Fisioterapeutas', color='#F18F01')
    ax.bar(x + width*1.5, top_ufs['quantidade_esf'], width, label='Médicos (ESF)', color='#C73E1D')
    ax.set_xlabel('Unidade Federativa')
    ax.set_ylabel('Média de Profissionais por Município')
    ax.set_title('Top 10 Estados com Maior Média de Profissionais de Saúde')
    ax.set_xticks(x)
    ax.set_xticklabels(top_ufs['uf_sigla'], rotation=0)
    ax.legend()
    plt.tight_layout()
    save_plot('03_top_ufs.png')
    plt.close()
    
    # Gráfico 4: Distribuição (Boxplot)
    fig, ax = plt.subplots(figsize=(12, 6))
    data_to_plot = [df['n_enfermeiros'].dropna(), df['n_odontologistas'].dropna(), 
                    df['n_fisioterapeutas'].dropna(), df['quantidade_esf'].dropna()]
    bp = ax.boxplot(data_to_plot, labels=['Enfermeiros', 'Odontologistas', 'Fisioterapeutas', 'Médicos (ESF)'], patch_artist=True)
    for patch, color in zip(bp['boxes'], ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D']):
        patch.set_facecolor(color)
    ax.set_ylabel('Número de Profissionais')
    ax.set_title('Distribuição do Número de Profissionais por Categoria')
    ax.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    save_plot('04_distribuicao_boxplot.png')
    plt.close()
    
    # 8. Salvar resultados em arquivo
    with open(f'{RELATORIOS_DIR}/resultados_aed.txt', 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("ANÁLISE EXPLORATÓRIA DE DADOS - SIMAPES\n")
        f.write("Panorama das Graduações na Saúde no Brasil\n")
        f.write("=" * 80 + "\n\n")
        
        f.write("1. ESTATÍSTICAS DESCRITIVAS\n")
        f.write("-" * 80 + "\n")
        for prof, vals in stats.items():
            f.write(f"\n{prof}:\n")
            f.write(f"  Média: {vals['media']:.2f}\n")
            f.write(f"  Mediana: {vals['mediana']:.2f}\n")
            f.write(f"  Desvio Padrão: {vals['std']:.2f}\n")
            f.write(f"  Mínimo: {vals['min']:.2f}\n")
            f.write(f"  Máximo: {vals['max']:.2f}\n")
            f.write(f"  Q1 (25%): {vals['q25']:.2f}\n")
            f.write(f"  Q3 (75%): {vals['q75']:.2f}\n")
        
        f.write("\n\n2. ANÁLISE POR REGIÃO\n")
        f.write("-" * 80 + "\n")
        f.write(agg_regiao.to_string())
        
        f.write("\n\n3. ANÁLISE POR UNIDADE FEDERATIVA (TOP 10)\n")
        f.write("-" * 80 + "\n")
        f.write(top_ufs.to_string())
        
        f.write("\n\n4. EVOLUÇÃO TEMPORAL (2005-2025)\n")
        f.write("-" * 80 + "\n")
        f.write(agg_ano.to_string())
    
    print("Análise concluída com sucesso!")
    print("Arquivos gerados:")
    print("  - 01_profissionais_por_regiao.png")
    print("  - 02_evolucao_temporal.png")
    print("  - 03_top_ufs.png")
    print("  - 04_distribuicao_boxplot.png")
    print("  - resultados_aed.txt")

if __name__ == "__main__":
    perform_comprehensive_aed()
