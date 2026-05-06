# Análise Exploratória de Dados (AED) - SIMAPES

Esta pasta contém o núcleo analítico do projeto, focado no **Panorama das Graduações na Saúde no Brasil**.

## Estrutura da Pasta
- `scripts/`: Contém os scripts Python (Pandas/Seaborn) utilizados para a análise.
- `dados/`: Bases de dados originais (CSV).
- `relatorios/`: Gráficos (PNG) e relatórios técnicos (TXT) gerados.

## Script Principal: `analise_integrada_simapes.py`
Este script realiza a integração das 4 bases de dados:
1. **panorama_aluno.csv**: Dados sociodemográficos e acadêmicos.
2. **panorama_curso.csv**: Dados de oferta, vagas e concorrência.
3. **panorama_geo.csv**: Mapeamento regional e por UF.
4. **panorama_saude.csv**: Dados do mercado de trabalho (profissionais ativos no SUS).

### Eixos de Análise Tratados:
- **Medicina vs Outros**: Comparativo de matrículas e taxas de conclusão.
- **Perfil de Gênero e Raça**: Evolução da diversidade nas graduações de saúde.
- **Pública vs Privada**: Análise de eficiência e volume de oferta.
- **Oferta vs Mercado**: Cruzamento entre o número de novos formandos e a demanda real de profissionais no SUS.
- **Geográfico**: Distribuição regional e identificação de polos de formação.

## Como Executar
Certifique-se de ter o Python instalado com as bibliotecas necessárias:
```bash
pip install pandas matplotlib seaborn
python scripts/analise_integrada_simapes.py
```

Os resultados serão atualizados automaticamente na pasta `relatorios/`.
