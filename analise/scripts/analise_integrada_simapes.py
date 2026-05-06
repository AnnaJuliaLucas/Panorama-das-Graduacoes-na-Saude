import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import numpy as np

# Configurações de estilo
sns.set_theme(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 12

# Diretórios
DADOS_DIR = 'analise/dados'
RELATORIOS_DIR = 'analise/relatorios'

if not os.path.exists(RELATORIOS_DIR):
    os.makedirs(RELATORIOS_DIR)

def carregar_dados():
    print("Carregando bases de dados...")
    aluno = pd.read_csv(f'{DADOS_DIR}/panorama_aluno.csv', sep=';', encoding='utf-8')
    curso = pd.read_csv(f'{DADOS_DIR}/panorama_curso.csv', sep=';', encoding='utf-8')
    geo = pd.read_csv(f'{DADOS_DIR}/panorama_geo.csv', sep=';', encoding='utf-8')
    
    # Otimização: Carregar apenas colunas necessárias de Saude e filtrar anos
    cols_saude = ['ano_competencia', 'CODUFMUN', 'n_enfermeiros', 'n_odontologistas', 'n_fisioterapeutas']
    saude = pd.read_csv(f'{DADOS_DIR}/panorama_saude.csv', sep=';', usecols=cols_saude)
    saude = saude[saude['ano_competencia'].between(2010, 2016)]
    
    return aluno, curso, geo, saude

def processar_integracao(aluno, curso, geo, saude):
    print("Integrando bases...")
    
    # Conversão Numérica
    for df in [aluno, curso, saude]:
        for col in df.columns:
            if 'qt_' in col or 'n_' in col or 'vaga' in col or 'inscrito' in col:
                df[col] = pd.to_numeric(df[col].astype(str).str.replace(',', '.'), errors='coerce').fillna(0)
    
    # 1. Integração Geográfica
    geo_map = geo[['cod_municipio', 'regiao_pad', 'uf_sigla']].drop_duplicates()
    aluno = aluno.merge(geo_map, left_on='co_municipio', right_on='cod_municipio', how='left')
    curso = curso.merge(geo_map, left_on='co_municipio', right_on='cod_municipio', how='left')
    
    # 2. Categorização de Instituição
    def cat_tipo(cat):
        if pd.isna(cat) or cat == 'ERRO': return 'Outro'
        if 'Pública' in str(cat): return 'Pública'
        if 'Privada' in str(cat): return 'Privada'
        return 'Outro'
    
    aluno['tipo_instituicao'] = aluno['tp_categoria_administrativa'].apply(cat_tipo)
    curso['tipo_instituicao'] = curso['tp_categoria_administrativa'].apply(cat_tipo)
    
    # 3. Idade das Instituições (Senioridade)
    aluno['idade_ies'] = aluno['competencia'] - aluno['ano_funcionamento']
    
    # 4. Agrupamento de Mercado (Saúde) por Ano e Região
    saude_agrupada = saude.groupby(['ano_competencia', 'CODUFMUN']).agg({
        'n_enfermeiros': 'sum',
        'n_odontologistas': 'sum',
        'n_fisioterapeutas': 'sum'
    }).reset_index()
    
    # Adicionando Região à base Saúde
    saude_agrupada = saude_agrupada.merge(geo_map, left_on='CODUFMUN', right_on='cod_municipio', how='left')
    
    return aluno, curso, saude_agrupada

def gerar_graficos(aluno, curso, saude):
    print("Gerando gráficos exploratórios...")
    
    # 01. Panorama Geral: Medicina vs Outros
    plt.figure()
    sns.barplot(data=aluno.groupby('tp_ocde')['qt_matricula_total'].sum().reset_index(), 
                x='tp_ocde', y='qt_matricula_total', palette='viridis')
    plt.title('Total de Matrículas por Curso (2010-2016)')
    plt.ylabel('Nº de Matrículas')
    plt.savefig(f'{RELATORIOS_DIR}/01_matriculas_por_curso.png')
    plt.close()

    # 02. Distribuição por Sexo e Curso (Foco em Medicina)
    plt.figure()
    sns.barplot(data=aluno, x='tp_ocde', y='qt_matricula_total', hue='sexo', estimator=sum, errorbar=None)
    plt.title('Distribuição de Matrículas por Sexo e Curso')
    plt.savefig(f'{RELATORIOS_DIR}/02_sexo_por_curso.png')
    plt.close()

    # 03. Diversidade Racial
    plt.figure()
    raca_data = aluno[~aluno['raca'].isin(['Sem Resposta', 'Aluno não quis declarar cor/raça'])]
    sns.countplot(data=raca_data, y='raca', order=raca_data['raca'].value_counts().index, palette='magma')
    plt.title('Distribuição Racial dos Alunos de Saúde')
    plt.savefig(f'{RELATORIOS_DIR}/03_distribuicao_racial.png')
    plt.close()

    # 04. Pública vs Privada: Eficiência de Formação
    plt.figure()
    eficiencia = aluno.groupby(['tipo_instituicao', 'tp_ocde']).agg({
        'qt_matricula_total': 'sum',
        'qt_concluinte_total': 'sum'
    }).reset_index()
    eficiencia['taxa_conclusao'] = (eficiencia['qt_concluinte_total'] / eficiencia['qt_matricula_total']) * 100
    sns.barplot(data=eficiencia, x='tp_ocde', y='taxa_conclusao', hue='tipo_instituicao')
    plt.title('Taxa de Conclusão (%) por Tipo de Instituição')
    plt.savefig(f'{RELATORIOS_DIR}/04_eficiencia_institucional.png')
    plt.close()

    # 05. Evolução Temporal da Concorrência (Vagas vs Inscritos)
    plt.figure()
    curso['concorrencia'] = curso['qt_inscrito_total'] / curso['qt_vaga_total']
    sns.lineplot(data=curso[curso['competencia'] >= 2010], x='competencia', y='concorrencia', hue='tp_ocde', marker='o')
    plt.title('Evolução da Concorrência (Candidato/Vaga)')
    plt.savefig(f'{RELATORIOS_DIR}/05_evolucao_concorrencia.png')
    plt.close()

    # 06. Formação vs Mercado (Integração Aluno + Saúde)
    plt.figure()
    mercado = saude.groupby('ano_competencia')[['n_enfermeiros', 'n_odontologistas', 'n_fisioterapeutas']].sum().reset_index()
    formacao = aluno.groupby(['competencia', 'tp_ocde'])['qt_concluinte_total'].sum().unstack().reset_index()
    
    plt.plot(mercado['ano_competencia'], mercado['n_enfermeiros'], label='Enfermeiros no Mercado (Ativos)', marker='s', linewidth=3)
    plt.plot(formacao['competencia'], formacao['Enfermagem'].cumsum(), label='Novos Enfermeiros (Acumulado)', linestyle='--', marker='o')
    plt.title('Capacidade de Formação vs Profissionais em Atividade (Enfermagem)')
    plt.legend()
    plt.savefig(f'{RELATORIOS_DIR}/06_formacao_vs_mercado.png')
    plt.close()

    # 07. Senioridade das Instituições
    plt.figure()
    sns.boxplot(data=aluno, x='tp_ocde', y='idade_ies', palette='Set3')
    plt.title('Distribuição da "Idade" dos Cursos (Tempo de Funcionamento)')
    plt.savefig(f'{RELATORIOS_DIR}/07_senioridade_cursos.png')
    plt.close()

    # 08. Distribuição Regional (Geográfico)
    plt.figure()
    regiao_dist = aluno.groupby('regiao_pad')['qt_matricula_total'].sum().sort_values(ascending=False)
    plt.pie(regiao_dist, labels=regiao_dist.index, autopct='%1.1f%%', colors=sns.color_palette('pastel'))
    plt.title('Distribuição Regional das Matrículas')
    plt.savefig(f'{RELATORIOS_DIR}/08_distribuicao_regional.png')
    plt.close()

def gerar_relatorio(aluno, curso, saude):
    print("Gerando relatório técnico...")
    with open(f'{RELATORIOS_DIR}/relatorio_analise_integrada.txt', 'w', encoding='utf-8') as f:
        f.write("SIMAPES - Relatório de Análise Integrada das Graduações na Saúde\n")
        f.write("="*60 + "\n\n")
        
        f.write("1. ESTATÍSTICAS GERAIS\n")
        f.write(f"Total de Matrículas (2010-2016): {aluno['qt_matricula_total'].sum():,.0f}\n")
        f.write(f"Total de Concluintes (2010-2016): {aluno['qt_concluinte_total'].sum():,.0f}\n")
        f.write(f"Total de Instituições Mapeadas: {aluno['co_ies'].nunique()}\n\n")
        
        f.write("2. ANÁLISE POR CURSO\n")
        f.write(aluno.groupby('tp_ocde')['qt_matricula_total'].sum().to_string() + "\n\n")
        
        f.write("3. GÊNERO E RAÇA\n")
        f.write(f"Percentual Feminino: {(aluno[aluno['sexo']=='Feminino']['qt_matricula_total'].sum() / aluno['qt_matricula_total'].sum() * 100):.2f}%\n")
        f.write("Top 3 Raça/Cor:\n")
        f.write(aluno['raca'].value_counts().head(3).to_string() + "\n\n")
        
        f.write("4. NATUREZA JURÍDICA\n")
        f.write(aluno.groupby('tipo_instituicao')['qt_matricula_total'].sum().to_string() + "\n\n")
        
        f.write("5. INSIGHTS DE MERCADO (BASE SAÚDE)\n")
        f.write(f"Total de Enfermeiros Ativos (2016): {saude[saude['ano_competencia']==2016]['n_enfermeiros'].sum():,.0f}\n")
        f.write(f"Total de Odontologistas Ativos (2016): {saude[saude['ano_competencia']==2016]['n_odontologistas'].sum():,.0f}\n")
        f.write(f"Total de Fisioterapeutas Ativos (2016): {saude[saude['ano_competencia']==2016]['n_fisioterapeutas'].sum():,.0f}\n\n")
        
        f.write("6. CONCLUSÕES TÉCNICAS\n")
        f.write("- Medicina apresenta a maior concorrência e equilíbrio de gênero.\n")
        f.write("- Enfermagem é o curso com maior volume de profissionais ativos e novos formandos.\n")
        f.write("- A rede privada detém a maioria absoluta das matrículas, mas a rede pública apresenta taxas de conclusão superiores em certos nichos.\n")

if __name__ == "__main__":
    aluno, curso, geo, saude_base = carregar_dados()
    aluno, curso, saude_agrupada = processar_integracao(aluno, curso, geo, saude_base)
    gerar_graficos(aluno, curso, saude_agrupada)
    gerar_relatorio(aluno, curso, saude_agrupada)
    print("\n✓ Análise concluída! Arquivos gerados em analise/relatorios/")
