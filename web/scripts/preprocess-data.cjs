/**
 * SIMAPES - Pré-processamento de Dados para Dashboard
 * Lê panorama_aluno.csv e panorama_curso.csv e gera dashboard-data.json
 */

const fs = require('fs');
const path = require('path');

const DADOS_DIR = path.join(__dirname, '..', '..', 'analise', 'dados');
const OUTPUT = path.join(__dirname, '..', 'client', 'public', 'dashboard-data.json');

function parseCSV(filepath, sep = ';') {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  const header = lines[0].split(sep);
  return lines.slice(1).map(line => {
    const vals = line.split(sep);
    const obj = {};
    header.forEach((h, i) => { obj[h.trim()] = vals[i]?.trim() || ''; });
    return obj;
  });
}

function toNum(val) {
  if (!val) return 0;
  return parseFloat(val.replace(',', '.')) || 0;
}

console.log('Carregando dados...');
const alunos = parseCSV(path.join(DADOS_DIR, 'panorama_aluno.csv'));
const cursos = parseCSV(path.join(DADOS_DIR, 'panorama_curso.csv'));
const geo = parseCSV(path.join(DADOS_DIR, 'panorama_geo.csv'));
const saude = parseCSV(path.join(DADOS_DIR, 'panorama_saude.csv'));

console.log(`  Alunos: ${alunos.length} registros`);
console.log(`  Cursos: ${cursos.length} registros`);
console.log(`  Geo: ${geo.length} registros`);
console.log(`  Saude: ${saude.length} registros`);

// ======== Mapa Geográfico ========
const geoMap = {};
geo.forEach(r => {
  geoMap[r.cod_municipio] = {
    regiao: r.regiao_pad || 'Não Informado',
    uf: r.uf_sigla || '??',
    municipio: r.municipio_pad || 'Desconhecido'
  };
});

function getGeo(cod) {
  return geoMap[cod] || { regiao: 'Não Informado', uf: '??', municipio: 'Desconhecido' };
}

// ======== Enriquecer dados com Geo ========
alunos.forEach(r => {
  const g = getGeo(r.co_municipio);
  r.regiao = g.regiao;
  r.uf = g.uf;
});

cursos.forEach(r => {
  const g = getGeo(r.co_municipio);
  r.regiao = g.regiao;
  r.uf = g.uf;
});

// ======== KPIs ========
const anosAluno = [...new Set(alunos.map(r => r.competencia))].filter(Boolean).sort();
const anosCurso = [...new Set(cursos.map(r => r.competencia))].filter(Boolean).sort();

const totalMatriculasAluno = alunos.reduce((s, r) => s + toNum(r.qt_matricula_total), 0);
const totalConcluintesAluno = alunos.reduce((s, r) => s + toNum(r.qt_concluinte_total), 0);
const totalIngressosAluno = alunos.reduce((s, r) => s + toNum(r.qt_ingresso_total), 0);
const totalVagasCurso = cursos.reduce((s, r) => s + toNum(r.qt_vaga_total), 0);
const totalInscritosCurso = cursos.reduce((s, r) => s + toNum(r.qt_inscrito_total), 0);

const iesUnicas = new Set(alunos.map(r => r.co_ies)).size;
const cursosUnicos = new Set(alunos.map(r => r.co_curso)).size;

const kpis = {
  totalRegistrosAluno: alunos.length,
  totalRegistrosCurso: cursos.length,
  periodoAluno: `${anosAluno[0]}-${anosAluno[anosAluno.length - 1]}`,
  periodoCurso: `${anosCurso[0]}-${anosCurso[anosCurso.length - 1]}`,
  totalMatriculas: Math.round(totalMatriculasAluno),
  totalConcluintes: Math.round(totalConcluintesAluno),
  totalIngressos: Math.round(totalIngressosAluno),
  totalVagas: Math.round(totalVagasCurso),
  totalInscritos: Math.round(totalInscritosCurso),
  iesUnicas,
  cursosUnicos,
  cursosDisponiveis: ['Enfermagem', 'Fisioterapia', 'Medicina', 'Odontologia']
};

// ======== Funções auxiliares ========
function groupBy(data, keyFn) {
  const groups = {};
  data.forEach(r => {
    const key = keyFn(r);
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  return groups;
}

function sumField(rows, field) {
  return Math.round(rows.reduce((s, r) => s + toNum(r[field]), 0));
}

// ======== Por Curso (alunos) ========
const cursosNomes = ['Enfermagem', 'Fisioterapia', 'Medicina', 'Odontologia'];
const porCurso = cursosNomes.map(curso => {
  const rows = alunos.filter(r => r.tp_ocde === curso);
  return {
    curso,
    matriculas: sumField(rows, 'qt_matricula_total'),
    concluintes: sumField(rows, 'qt_concluinte_total'),
    ingressos: sumField(rows, 'qt_ingresso_total'),
    registros: rows.length
  };
});

// ======== Evolução Temporal por Curso (alunos) ========
const evolucaoTemporal = anosAluno.map(ano => {
  const entry = { ano: parseInt(ano) };
  cursosNomes.forEach(curso => {
    const rows = alunos.filter(r => r.competencia === ano && r.tp_ocde === curso);
    entry[`${curso}_mat`] = sumField(rows, 'qt_matricula_total');
    entry[`${curso}_conc`] = sumField(rows, 'qt_concluinte_total');
    entry[`${curso}_ing`] = sumField(rows, 'qt_ingresso_total');
  });
  entry.total_mat = cursosNomes.reduce((s, c) => s + entry[`${c}_mat`], 0);
  return entry;
});

// ======== Gênero por Curso ========
const generoPorCurso = cursosNomes.map(curso => {
  const fem = alunos.filter(r => r.tp_ocde === curso && r.sexo === 'Feminino');
  const masc = alunos.filter(r => r.tp_ocde === curso && r.sexo === 'Masculino');
  return {
    curso,
    feminino: sumField(fem, 'qt_matricula_total'),
    masculino: sumField(masc, 'qt_matricula_total')
  };
});

// ======== Gênero Temporal ========
const generoTemporal = anosAluno.map(ano => {
  const fem = alunos.filter(r => r.competencia === ano && r.sexo === 'Feminino');
  const masc = alunos.filter(r => r.competencia === ano && r.sexo === 'Masculino');
  return {
    ano: parseInt(ano),
    feminino: sumField(fem, 'qt_matricula_total'),
    masculino: sumField(masc, 'qt_matricula_total')
  };
});

// ======== Gênero por Curso Temporal (para ver tendências por curso) ========
const generoCursoTemporal = anosAluno.map(ano => {
  const entry = { ano: parseInt(ano) };
  cursosNomes.forEach(curso => {
    const fem = alunos.filter(r => r.competencia === ano && r.tp_ocde === curso && r.sexo === 'Feminino');
    const masc = alunos.filter(r => r.competencia === ano && r.tp_ocde === curso && r.sexo === 'Masculino');
    const totalFem = sumField(fem, 'qt_matricula_total');
    const totalMasc = sumField(masc, 'qt_matricula_total');
    entry[`${curso}_fem`] = totalFem;
    entry[`${curso}_masc`] = totalMasc;
    entry[`${curso}_pctFem`] = totalFem + totalMasc > 0 ? Math.round((totalFem / (totalFem + totalMasc)) * 1000) / 10 : 0;
  });
  return entry;
});

// ======== Raça/Cor por Curso ========
const racas = ['Branca', 'Parda', 'Preta', 'Amarela', 'Indígena'];
const racaPorCurso = cursosNomes.map(curso => {
  const entry = { curso };
  racas.forEach(raca => {
    const rows = alunos.filter(r => r.tp_ocde === curso && r.raca === raca);
    entry[raca] = sumField(rows, 'qt_matricula_total');
  });
  // Não declarada
  const nd = alunos.filter(r => r.tp_ocde === curso && (r.raca === 'Sem Resposta' || r.raca === 'Aluno não quis declarar cor/raça' || !r.raca));
  entry['Não Declarada'] = sumField(nd, 'qt_matricula_total');
  return entry;
});

// ======== Raça Temporal ========
const racaTemporal = anosAluno.map(ano => {
  const entry = { ano: parseInt(ano) };
  racas.forEach(raca => {
    const rows = alunos.filter(r => r.competencia === ano && r.raca === raca);
    entry[raca] = sumField(rows, 'qt_matricula_total');
  });
  return entry;
});

// ======== Pública vs Privada ========
function categoriaTipo(cat) {
  if (!cat || cat === 'ERRO') return 'Outro';
  if (cat.startsWith('Pública')) return 'Pública';
  if (cat.startsWith('Privada')) return 'Privada';
  return 'Outro';
}

function categoriaDetalhada(cat) {
  if (!cat || cat === 'ERRO' || cat === 'Especial') return 'Outro';
  return cat;
}

const instPorCurso = cursosNomes.map(curso => {
  const pub = alunos.filter(r => r.tp_ocde === curso && categoriaTipo(r.tp_categoria_administrativa) === 'Pública');
  const priv = alunos.filter(r => r.tp_ocde === curso && categoriaTipo(r.tp_categoria_administrativa) === 'Privada');
  return {
    curso,
    publica: sumField(pub, 'qt_matricula_total'),
    privada: sumField(priv, 'qt_matricula_total')
  };
});

const instDetalhada = {};
const categoriasDetalhadas = [
  'Pública Federal', 'Pública Estadual', 'Pública Municipal',
  'Privada com fins lucrativos', 'Privada sem fins lucrativos'
];
cursosNomes.forEach(curso => {
  instDetalhada[curso] = categoriasDetalhadas.map(cat => ({
    categoria: cat,
    matriculas: sumField(alunos.filter(r => r.tp_ocde === curso && r.tp_categoria_administrativa === cat), 'qt_matricula_total'),
    concluintes: sumField(alunos.filter(r => r.tp_ocde === curso && r.tp_categoria_administrativa === cat), 'qt_concluinte_total')
  }));
});

// ======== Inst Temporal ========
const instTemporal = anosAluno.map(ano => {
  const pub = alunos.filter(r => r.competencia === ano && categoriaTipo(r.tp_categoria_administrativa) === 'Pública');
  const priv = alunos.filter(r => r.competencia === ano && categoriaTipo(r.tp_categoria_administrativa) === 'Privada');
  return {
    ano: parseInt(ano),
    publica: sumField(pub, 'qt_matricula_total'),
    privada: sumField(priv, 'qt_matricula_total')
  };
});

// ======== Oferta & Demanda (cursos, período maior) ========
const ofertaDemanda = cursosNomes.map(curso => {
  const rows = cursos.filter(r => r.tp_ocde === curso && r.tp_categoria_administrativa !== 'ERRO');
  return {
    curso,
    vagas: sumField(rows, 'qt_vaga_total'),
    inscritos: sumField(rows, 'qt_inscrito_total'),
    matriculas: sumField(rows, 'qt_matricula_total'),
    concluintes: sumField(rows, 'qt_concluinte_total'),
    concorrencia: sumField(rows, 'qt_vaga_total') > 0
      ? Math.round((sumField(rows, 'qt_inscrito_total') / sumField(rows, 'qt_vaga_total')) * 100) / 100
      : 0
  };
});

// ======== Concorrência Temporal ========
const concorrenciaTemporal = anosCurso.filter(a => a !== '1995').map(ano => {
  const entry = { ano: parseInt(ano) };
  cursosNomes.forEach(curso => {
    const rows = cursos.filter(r => r.competencia === ano && r.tp_ocde === curso && r.tp_categoria_administrativa !== 'ERRO');
    const vagas = sumField(rows, 'qt_vaga_total');
    const inscritos = sumField(rows, 'qt_inscrito_total');
    entry[`${curso}_conc`] = vagas > 0 ? Math.round((inscritos / vagas) * 100) / 100 : 0;
    entry[`${curso}_vagas`] = vagas;
    entry[`${curso}_insc`] = inscritos;
  });
  return entry;
});

// ======== Expansão de cursos ao longo do tempo ========
const expansaoCursos = anosCurso.map(ano => {
  const entry = { ano: parseInt(ano) };
  cursosNomes.forEach(curso => {
    const rows = cursos.filter(r => r.competencia === ano && r.tp_ocde === curso);
    entry[curso] = rows.length; // número de cursos oferecidos
  });
  entry.total = cursosNomes.reduce((s, c) => s + entry[c], 0);
  return entry;
});

// ======== Vagas temporais por curso ========
const vagasTemporal = anosCurso.filter(a => a !== '1995').map(ano => {
  const entry = { ano: parseInt(ano) };
  cursosNomes.forEach(curso => {
    const rows = cursos.filter(r => r.competencia === ano && r.tp_ocde === curso && r.tp_categoria_administrativa !== 'ERRO');
    entry[`${curso}_vagas`] = sumField(rows, 'qt_vaga_total');
    entry[`${curso}_mat`] = sumField(rows, 'qt_matricula_total');
  });
  return entry;
});

// ======== Cruzamento: Gênero x Tipo de Instituição ========
const generoInstituicao = ['Pública', 'Privada'].map(tipo => {
  const fem = alunos.filter(r => categoriaTipo(r.tp_categoria_administrativa) === tipo && r.sexo === 'Feminino');
  const masc = alunos.filter(r => categoriaTipo(r.tp_categoria_administrativa) === tipo && r.sexo === 'Masculino');
  return {
    tipo,
    feminino: sumField(fem, 'qt_matricula_total'),
    masculino: sumField(masc, 'qt_matricula_total')
  };
});

// ======== Cruzamento: Raça x Tipo de Instituição ========
const racaInstituicao = ['Pública', 'Privada'].map(tipo => {
  const entry = { tipo };
  racas.forEach(raca => {
    const rows = alunos.filter(r => categoriaTipo(r.tp_categoria_administrativa) === tipo && r.raca === raca);
    entry[raca] = sumField(rows, 'qt_matricula_total');
  });
  return entry;
});

// ======== Oferta pública vs privada (cursos) ========
const ofertaInstTipo = cursosNomes.map(curso => {
  const pub = cursos.filter(r => r.tp_ocde === curso && categoriaTipo(r.tp_categoria_administrativa) === 'Pública');
  const priv = cursos.filter(r => r.tp_ocde === curso && categoriaTipo(r.tp_categoria_administrativa) === 'Privada');
  return {
    curso,
    publica_vagas: sumField(pub, 'qt_vaga_total'),
    privada_vagas: sumField(priv, 'qt_vaga_total'),
    publica_cursos: pub.length,
    privada_cursos: priv.length
  };
});

// ======== Geográfico (Alunos por Região) ========
const regioes = ['REGIAO NORTE', 'REGIAO NORDESTE', 'REGIAO SUDESTE', 'REGIAO SUL', 'REGIAO CENTRO-OESTE'];
const regioesMap = {
  'REGIAO NORTE': 'Norte', 'REGIAO NORDESTE': 'Nordeste', 'REGIAO SUDESTE': 'Sudeste', 'REGIAO SUL': 'Sul', 'REGIAO CENTRO-OESTE': 'Centro-Oeste'
};

const porRegiao = regioes.map(reg => {
  const rows = alunos.filter(r => r.regiao === reg);
  return {
    regiao: regioesMap[reg] || reg,
    matriculas: sumField(rows, 'qt_matricula_total'),
    concluintes: sumField(rows, 'qt_concluinte_total')
  };
});

const porUF = [...new Set(alunos.map(r => r.uf))].filter(uf => uf !== '??').map(uf => {
  const rows = alunos.filter(r => r.uf === uf);
  return {
    uf,
    matriculas: sumField(rows, 'qt_matricula_total'),
    concluintes: sumField(rows, 'qt_concluinte_total')
  };
}).sort((a, b) => b.matriculas - a.matriculas).slice(0, 10);

// ======== Mercado de Trabalho (Base Saude) ========
// Mapear CODUFMUN da base saude para regiao
const mercadoTrabalho = anosAluno.map(ano => {
  const entry = { ano: parseInt(ano) };
  const rows = saude.filter(r => r.ano_competencia === ano);
  
  // Agregando por região para este ano
  regioes.forEach(reg => {
    const regRows = rows.filter(r => getGeo(r.CODUFMUN).regiao === reg);
    entry[`${reg}_enf`] = sumField(regRows, 'n_enfermeiros');
    entry[`${reg}_od`] = sumField(regRows, 'n_odontologistas');
    entry[`${reg}_fis`] = sumField(regRows, 'n_fisioterapeutas');
    entry[`${reg}_esf`] = sumField(regRows, 'quantidade_esf');
  });
  
  entry.total_enf = sumField(rows, 'n_enfermeiros');
  entry.total_od = sumField(rows, 'n_odontologistas');
  entry.total_fis = sumField(rows, 'n_fisioterapeutas');
  entry.total_esf = sumField(rows, 'quantidade_esf');
  
  return entry;
});

// ======== Senioridade / Idade das Instituições ========
const idadeIES = anosAluno.map(ano => {
  const rows = alunos.filter(r => r.competencia === ano);
  const ages = rows.map(r => {
    const age = parseInt(ano) - parseInt(r.ano_funcionamento);
    return isNaN(age) ? null : age;
  }).filter(a => a !== null && a >= 0);
  
  const avgAge = ages.length > 0 ? ages.reduce((s, a) => s + a, 0) / ages.length : 0;
  return {
    ano: parseInt(ano),
    idadeMedia: Math.round(avgAge * 10) / 10
  };
});

// ======== Montar JSON final ========
const dashboardData = {
  kpis,
  porCurso,
  evolucaoTemporal,
  generoPorCurso,
  generoTemporal,
  generoCursoTemporal,
  racaPorCurso,
  racaTemporal,
  instPorCurso,
  instDetalhada,
  instTemporal,
  ofertaDemanda,
  concorrenciaTemporal,
  expansaoCursos,
  vagasTemporal,
  generoInstituicao,
  racaInstituicao,
  ofertaInstTipo,
  porRegiao,
  porUF,
  mercadoTrabalho,
  idadeIES
};

fs.writeFileSync(OUTPUT, JSON.stringify(dashboardData, null, 2), 'utf8');
console.log(`\n✓ Dashboard data salvo em: ${OUTPUT}`);
console.log(`  Tamanho: ${(fs.statSync(OUTPUT).size / 1024).toFixed(1)} KB`);
console.log(`\nKPIs:`);
console.log(`  Matrículas: ${kpis.totalMatriculas.toLocaleString()}`);
console.log(`  Concluintes: ${kpis.totalConcluintes.toLocaleString()}`);
console.log(`  Ingressos: ${kpis.totalIngressos.toLocaleString()}`);
console.log(`  Vagas: ${kpis.totalVagas.toLocaleString()}`);
console.log(`  IES únicas: ${kpis.iesUnicas}`);
