// Lista de serviços da tela inicial. A cor é usada no cartão e no fundo.
// "logo" aponta para um arquivo em logos/; sem logo, o nome aparece em destaque.
const SERVICOS = [
  { id: 'netflix', logo: 'logos/netflix.svg', nome: 'Netflix', descricao: 'Séries, filmes e documentários', cor: '#e50914', url: 'https://www.netflix.com/browse' },
  { id: 'hbomax', logo: 'logos/hbomax.svg', nome: 'HBO Max', descricao: 'Séries da HBO, filmes e esportes', cor: '#2a4dff', url: 'https://play.hbomax.com/' },
  { id: 'crunchyroll', logo: 'logos/crunchyroll.svg', nome: 'Crunchyroll', descricao: 'Animes legendados e dublados', cor: '#f47521', url: 'https://www.crunchyroll.com/' },
  { id: 'prime', nome: 'Prime Video', descricao: 'Filmes, séries e esportes', cor: '#1a98ff', url: 'https://www.primevideo.com/' },
  { id: 'disney', nome: 'Disney+', descricao: 'Disney, Pixar, Marvel e Star Wars', cor: '#1f3fbf', url: 'https://www.disneyplus.com/' },
  { id: 'youtube', logo: 'logos/youtube.svg', nome: 'YouTube', descricao: 'Vídeos, música e canais', cor: '#ff0033', url: 'https://www.youtube.com/' },
  { id: 'spotify', logo: 'logos/spotify.svg', nome: 'Spotify', descricao: 'Música e podcasts', cor: '#1db954', url: 'https://open.spotify.com/' },
  { id: 'twitch', logo: 'logos/twitch.svg', nome: 'Twitch', descricao: 'Transmissões ao vivo', cor: '#9146ff', url: 'https://www.twitch.tv/' },
];

// Preferências do usuário, guardadas no Chrome:
//  - ocultos: ids dos apps que não aparecem na tela inicial
//  - extras: apps adicionados pelo usuário ({ id, nome, url, cor })
async function lerPreferencias() {
  const { ocultos = [], extras = [] } = await chrome.storage.local.get(['ocultos', 'extras']);
  return { ocultos, extras };
}

async function salvarPreferencias(prefs) {
  await chrome.storage.local.set(prefs);
}

function descricaoExtra(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
}

async function carregarServicos() {
  const { ocultos, extras } = await lerPreferencias();
  const todos = [
    ...SERVICOS,
    ...extras.map((e) => ({ ...e, descricao: descricaoExtra(e.url), extra: true })),
  ];
  return { todos, visiveis: todos.filter((s) => !ocultos.includes(s.id)), ocultos, extras };
}
