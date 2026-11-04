// Service worker da extensão: leva a aba de volta para a tela inicial
// quando o atalho (Home ou F1) é apertado dentro de um serviço.
const PAGINA_INICIAL = chrome.runtime.getURL('inicio.html');

chrome.runtime.onMessage.addListener((mensagem, remetente) => {
  if (mensagem === 'mmc:voltar-inicio' && remetente.tab) {
    chrome.tabs.update(remetente.tab.id, { url: PAGINA_INICIAL });
  }
});
