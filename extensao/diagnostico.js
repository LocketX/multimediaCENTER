// Tela de diagnóstico: confirma o Widevine e permite abrir cada serviço.
const SERVICOS = [
  { nome: 'Netflix', url: 'https://www.netflix.com/browse' },
  { nome: 'HBO Max', url: 'https://play.hbomax.com/' },
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

async function verificar() {
  document.getElementById('checagens').innerHTML = '';

  const marcas = (navigator.userAgentData?.brands || []).map((b) => b.brand);
  const ehChrome = marcas.includes('Google Chrome');
  adicionarChecagem(
    ehChrome ? 'Rodando no Google Chrome' : `Navegador não é o Google Chrome (${marcas.join(', ') || navigator.userAgent})`,
    ehChrome,
  );

  const config = [{
    initDataTypes: ['cenc'],
    audioCapabilities: [{ contentType: 'audio/mp4; codecs="mp4a.40.2"' }],
    videoCapabilities: [{ contentType: 'video/mp4; codecs="avc1.42E01E"' }],
  }];
  try {
    await navigator.requestMediaKeySystemAccess('com.widevine.alpha', config);
    adicionarChecagem('Widevine disponível (DRM da Netflix, Max, Crunchyroll...)', true);
  } catch (erro) {
    adicionarChecagem(`Widevine indisponível: ${erro.message}`, false);
  }

  adicionarChecagem(
    document.fullscreenElement || window.innerHeight === screen.height
      ? 'Em tela cheia' : 'Fora da tela cheia (aperte F11)',
    document.fullscreenElement || window.innerHeight === screen.height,
  );
}

function montarServicos() {
  const grade = document.getElementById('servicos');
  for (const s of SERVICOS) {
    const botao = document.createElement('button');
    botao.textContent = s.nome;
    botao.addEventListener('click', () => { location.href = s.url; });
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
verificar();

// Esc ou Backspace voltam para a tela inicial.
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Backspace') location.href = 'inicio.html';
});
