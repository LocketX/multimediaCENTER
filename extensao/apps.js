// Tela para mostrar, esconder, adicionar e remover apps da tela inicial.
let estado;

function criarSelo(app) {
  const selo = document.createElement('span');
  selo.className = 'selo';
  selo.style.setProperty('--cor', app.cor);
  if (app.logo) {
    const img = document.createElement('img');
    img.src = app.logo;
    img.alt = '';
    selo.appendChild(img);
  } else {
    const t = document.createElement('span');
    t.textContent = app.nome;
    selo.appendChild(t);
  }
  return selo;
}

function botao(texto, classe, acao) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = `botao ${classe}`;
  b.textContent = texto;
  b.addEventListener('click', acao);
  return b;
}

async function alternar(id) {
  const ocultos = estado.ocultos.includes(id)
    ? estado.ocultos.filter((o) => o !== id)
    : [...estado.ocultos, id];
  await salvarPreferencias({ ocultos });
  await desenhar(`[data-id="${CSS.escape(id)}"] .alternar`);
}

async function remover(id) {
  const extras = estado.extras.filter((e) => e.id !== id);
  const ocultos = estado.ocultos.filter((o) => o !== id);
  await salvarPreferencias({ extras, ocultos });
  await desenhar('#lista .botao');
}

async function desenhar(focarSeletor) {
  estado = await carregarServicos();
  const lista = document.getElementById('lista');
  lista.innerHTML = '';
  for (const app of estado.todos) {
    const visivel = !estado.ocultos.includes(app.id);
    const li = document.createElement('li');
    li.className = `app${visivel ? '' : ' oculto'}`;
    li.dataset.id = app.id;
    li.appendChild(criarSelo(app));

    const nome = document.createElement('span');
    nome.className = 'nome';
    nome.textContent = app.nome;
    const url = document.createElement('small');
    url.textContent = app.url;
    nome.appendChild(url);
    li.appendChild(nome);

    li.appendChild(botao(visivel ? 'Na tela inicial' : 'Escondido', `alternar${visivel ? ' ativo' : ''}`, () => alternar(app.id)));
    if (app.extra) li.appendChild(botao('Remover', 'perigo', () => remover(app.id)));
    lista.appendChild(li);
  }
  const alvo = focarSeletor && document.querySelector(focarSeletor);
  if (alvo) alvo.focus();
}

document.getElementById('novo').addEventListener('submit', async (e) => {
  e.preventDefault();
  const erro = document.getElementById('erro');
  const nome = document.getElementById('novo-nome').value.trim();
  let url = document.getElementById('novo-url').value.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  let endereco;
  try { endereco = new URL(url); } catch { endereco = null; }
  if (!nome || !endereco || endereco.protocol !== 'https:' || !endereco.hostname.includes('.')) {
    erro.textContent = 'Confira o nome e o endereço. O endereço precisa começar com https://';
    return;
  }
  erro.textContent = '';
  const id = `extra-${Date.now()}`;
  const extras = [...estado.extras, { id, nome, url: endereco.href, cor: document.getElementById('novo-cor').value }];
  await salvarPreferencias({ extras });
  e.target.reset();
  await desenhar(`[data-id="${id}"] .alternar`);
});

document.getElementById('voltar').addEventListener('click', () => { location.href = 'inicio.html'; });

// Navegação pelo teclado: ↑ ↓ passam pelos controles na ordem da tela.
document.addEventListener('keydown', (e) => {
  const digitando = e.target.matches('input:not([type=color])');
  if (e.key === 'Escape') { location.href = 'inicio.html'; return; }
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const itens = [...document.querySelectorAll('button, input')];
  const i = itens.indexOf(document.activeElement);
  const proximo = itens[Math.max(0, Math.min(itens.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))];
  if (proximo && (i >= 0 || !digitando)) { e.preventDefault(); proximo.focus(); }
});

desenhar('#lista .botao');
