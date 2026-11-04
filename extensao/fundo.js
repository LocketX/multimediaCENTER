// Service worker da extensão.
//  - Leva a aba de volta para a tela inicial quando Home ou F1 são
//    apertados dentro de um app.
//  - Lembra quais abas acabaram de abrir um app, para o app mostrar
//    uma única vez a dica de como voltar ao início.
const PAGINA_INICIAL = chrome.runtime.getURL('inicio.html');

async function abasComDica() {
  const { dica = [] } = await chrome.storage.session.get('dica');
  return dica;
}

chrome.runtime.onMessage.addListener((mensagem, remetente, responder) => {
  const aba = remetente.tab && remetente.tab.id;
  if (aba === undefined) return false;

  if (mensagem === 'mmc:voltar-inicio') {
    chrome.tabs.update(aba, { url: PAGINA_INICIAL });
    return false;
  }
  if (mensagem === 'mmc:abrindo-app') {
    abasComDica()
      .then((dica) => chrome.storage.session.set({ dica: [...new Set([...dica, aba])] }))
      .then(() => responder(true));
    return true;
  }
  if (mensagem === 'mmc:mostrar-dica?') {
    abasComDica().then(async (dica) => {
      const mostrar = dica.includes(aba);
      if (mostrar) await chrome.storage.session.set({ dica: dica.filter((d) => d !== aba) });
      responder(mostrar);
    });
    return true;
  }
  return false;
});
