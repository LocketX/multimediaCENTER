// Roda dentro dos sites dos serviços: Home ou F1 voltam para a tela inicial.
// A tecla Home é ignorada em campos de texto, onde ela move o cursor.
function emCampoDeTexto(el) {
  return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

window.addEventListener('keydown', (e) => {
  const voltar = e.key === 'F1' || (e.key === 'Home' && !emCampoDeTexto(document.activeElement));
  if (!voltar) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  chrome.runtime.sendMessage('mmc:voltar-inicio');
}, true);
