// Tela inicial: monta os cartões, navega pelas setas como num controle
// remoto e mostra o app em foco no destaque.
const CHAVE_FOCO = 'mmc:ultimo-foco';

const SISTEMA = [
  { id: 'tela-cheia', nome: 'Tela cheia', icone: '⛶', descricao: 'Liga e desliga a tela cheia', acao: alternarTelaCheia },
  { id: 'diagnostico', nome: 'Diagnóstico', icone: '✓', descricao: 'Confere se o Chrome está pronto para os apps', acao: () => { location.href = 'diagnostico.html'; } },
  { id: 'sair', nome: 'Sair', icone: '⏻', descricao: 'Fecha o multimediaCENTER', acao: sair },
];

function lerFoco() { try { return localStorage.getItem(CHAVE_FOCO); } catch { return null; } }
function salvarFoco(id) { try { localStorage.setItem(CHAVE_FOCO, id); } catch { /* sem armazenamento: tudo bem */ } }

function criarCartao(item, classe) {
  const b = document.createElement('button');
  b.className = `cartao ${classe}`;
  b.dataset.id = item.id;
  if (item.cor) b.style.setProperty('--cor', item.cor);
  if (item.icone) {
    const i = document.createElement('span');
    i.className = 'cartao-icone';
    i.textContent = item.icone;
    b.appendChild(i);
  } else if (item.logo) {
    const img = document.createElement('img');
    img.className = 'cartao-logo';
    img.src = item.logo;
    img.alt = '';
    b.appendChild(img);
    b.classList.add('com-logo');
  } else {
    const marca = document.createElement('span');
    marca.className = 'cartao-marca';
    marca.textContent = item.nome;
    b.appendChild(marca);
    b.classList.add('com-logo');
    return finalizarCartao(b, item, classe);
  }
  const nome = document.createElement('span');
  nome.className = 'cartao-nome';
  nome.textContent = item.nome;
  b.appendChild(nome);
  return finalizarCartao(b, item, classe);
}

function finalizarCartao(b, item, classe) {
  b.addEventListener('focus', () => mostrarDestaque(item, classe));
  b.addEventListener('mouseenter', () => b.focus({ preventScroll: true }));
  b.addEventListener('click', () => (item.acao ? item.acao() : abrir(item)));
  return b;
}

function mostrarDestaque(item, classe) {
  salvarFoco(item.id);
  document.getElementById('destaque-tipo').textContent = classe === 'app' ? 'App' : 'Sistema';
  document.getElementById('destaque-nome').textContent = item.nome;
  document.getElementById('destaque-descricao').textContent = item.descricao;
  document.documentElement.style.setProperty('--destaque', item.cor || '#3a4a7a');
}

function abrir(item) {
  document.body.classList.add('trocando');
  location.href = item.url;
}

async function janelaAtual() { return chrome.windows.getCurrent(); }

async function alternarTelaCheia() {
  const j = await janelaAtual();
  chrome.windows.update(j.id, { state: j.state === 'fullscreen' ? 'maximized' : 'fullscreen' });
}

async function sair() {
  const j = await janelaAtual();
  chrome.windows.remove(j.id);
}

// Navegação como num controle remoto: ← → andam dentro da fileira,
// ↑ ↓ trocam de fileira e caem no cartão mais próximo na horizontal.
function focar(cartao) {
  cartao.focus({ preventScroll: true });
  cartao.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

function mover(direcao) {
  const atual = document.activeElement;
  const trilhos = [...document.querySelectorAll('.trilho')];
  const trilho = atual.closest && atual.closest('.trilho');
  if (!trilho) { focar(document.querySelector('.cartao')); return; }

  if (direcao === 'ArrowLeft' || direcao === 'ArrowRight') {
    const vizinho = direcao === 'ArrowRight' ? atual.nextElementSibling : atual.previousElementSibling;
    if (vizinho) focar(vizinho);
    return;
  }

  const destino = trilhos[trilhos.indexOf(trilho) + (direcao === 'ArrowDown' ? 1 : -1)];
  if (!destino) return;
  const x = atual.getBoundingClientRect().left + atual.offsetWidth / 2;
  let melhor = null, menor = Infinity;
  for (const c of destino.children) {
    const r = c.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - x);
    if (d < menor) { menor = d; melhor = c; }
  }
  if (melhor) focar(melhor);
}

document.addEventListener('keydown', (e) => {
  if (e.key.startsWith('Arrow')) { e.preventDefault(); mover(e.key); }
});

function atualizarRelogio() {
  const agora = new Date();
  document.getElementById('hora').textContent =
    agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const data = agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('data').textContent = data[0].toUpperCase() + data.slice(1);
}

function iniciar() {
  const apps = document.getElementById('apps');
  SERVICOS.forEach((s) => apps.appendChild(criarCartao(s, 'app')));
  const sistema = document.getElementById('sistema');
  SISTEMA.forEach((s) => sistema.appendChild(criarCartao(s, 'sistema')));

  const salvo = lerFoco();
  const alvo = (salvo && document.querySelector(`.cartao[data-id="${CSS.escape(salvo)}"]`))
    || document.querySelector('.cartao');
  focar(alvo);

  atualizarRelogio();
  setInterval(atualizarRelogio, 15000);
}

// Ao voltar com o botão "voltar" do navegador, a página pode vir do cache.
window.addEventListener('pageshow', () => document.body.classList.remove('trocando'));

iniciar();
