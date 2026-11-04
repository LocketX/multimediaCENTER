// Tela de diagnóstico: confirma o Widevine e permite abrir cada serviço.
const SERVICOS = [
  { nome: 'Netflix', url: 'https://www.netflix.com/browse' },
  { nome: 'Max (HBO)', url: 'https://play.max.com/' },
  { nome: 'Crunchyroll', url: 'https://www.crunchyroll.com/' },
  { nome: 'Prime Video', url: 'https://www.primevideo.com/' },
  { nome: 'Disney+', url: 'https://www.disneyplus.com/' },
  { nome: 'YouTube', url: 'https://www.youtube.com/' },
  { nome: 'Teste DRM (Bitmovin)', url: 'https://bitmovin.com/demos/drm' },
];

function adicionarChecagem(texto, ok) {
  const li = document.createElement('li');
  li.textContent = texto;
  li.className = ok ? 'ok' : 'erro';
  document.getElementById('checagens').appendChild(li);
}

async function verificarWidevine() {
  document.getElementById('checagens').innerHTML = '';

  const status = await window.mmc.statusComponentes();
  const widevine = Object.values(status || {}).find((c) => /widevine/i.test(c.name || c.title || ''));
  if (widevine) {
    adicionarChecagem(`Componente instalado: ${widevine.name || widevine.title} ${widevine.version || ''}`, true);
  } else {
    adicionarChecagem(`Componente não encontrado. Status: ${JSON.stringify(status)}`, false);
  }

  const config = [{
    initDataTypes: ['cenc'],
    audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
    videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
  }];
  try {
    await navigator.requestMediaKeySystemAccess('com.widevine.alpha', config);
    adicionarChecagem('O navegador aceita o Widevine (EME)', true);
  } catch (erro) {
    adicionarChecagem(`O navegador recusou o Widevine: ${erro.message}`, false);
  }
}

function montarServicos() {
  const grade = document.getElementById('servicos');
  for (const s of SERVICOS) {
    const botao = document.createElement('button');
    botao.textContent = s.nome;
    botao.addEventListener('click', () => window.mmc.abrirServico(s.url));
    grade.appendChild(botao);
  }
  grade.querySelector('button').focus();
}

// Navegação com as setas, como um controle remoto.
document.addEventListener('keydown', (e) => {
  const botoes = [...document.querySelectorAll('#servicos button')];
  const atual = botoes.indexOf(document.activeElement);
  if (atual < 0) return;
  const colunas = getComputedStyle(document.getElementById('servicos'))
    .gridTemplateColumns.split(' ').length;
  const passos = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: colunas, ArrowUp: -colunas };
  if (e.key in passos) {
    e.preventDefault();
    const proximo = Math.min(botoes.length - 1, Math.max(0, atual + passos[e.key]));
    botoes[proximo].focus();
  }
});

montarServicos();
verificarWidevine();
