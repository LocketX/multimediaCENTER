// Roda dentro dos sites dos apps, como um controle remoto:
//  - Home ou F1: volta para a tela inicial
//  - Backspace: volta para a página anterior (da primeira página do app,
//    volta para a tela inicial)
// As teclas Home e Backspace são ignoradas em campos de texto.
function emCampoDeTexto(el) {
  return el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const digitando = emCampoDeTexto(document.activeElement);
  if (e.key === 'F1' || (e.key === 'Home' && !digitando)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    chrome.runtime.sendMessage('mmc:voltar-inicio');
  } else if (e.key === 'Backspace' && !digitando) {
    e.preventDefault();
    e.stopImmediatePropagation();
    history.back();
  }
}, true);

// Dica mostrada uma vez, logo depois de abrir um app pela tela inicial.
function mostrarDica() {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;top:24px;right:24px;z-index:2147483647;pointer-events:none;';
  const sombra = host.attachShadow({ mode: 'closed' });
  sombra.innerHTML = `
    <style>
      .dica { font: 600 18px/1.4 "Segoe UI", system-ui, sans-serif; color: #f4f6fb;
        background: rgba(10, 12, 18, .92); border: 1px solid #2c3242; border-radius: 12px;
        padding: 12px 18px; box-shadow: 0 8px 24px rgba(0,0,0,.5);
        opacity: 0; transform: translateY(-8px); transition: opacity .25s, transform .25s; }
      .dica.visivel { opacity: 1; transform: none; }
      kbd { font: inherit; border: 1px solid #4a5268; border-radius: 6px; padding: 0 6px; }
    </style>
    <div class="dica"><kbd>Home</kbd> volta ao início · <kbd>Backspace</kbd> volta uma página</div>`;
  document.documentElement.appendChild(host);
  const caixa = sombra.querySelector('.dica');
  requestAnimationFrame(() => requestAnimationFrame(() => caixa.classList.add('visivel')));
  setTimeout(() => caixa.classList.remove('visivel'), 4500);
  setTimeout(() => host.remove(), 5000);
}

if (window.top === window) {
  chrome.runtime.sendMessage('mmc:mostrar-dica?').then((mostrar) => {
    if (!mostrar) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mostrarDica, { once: true });
    } else {
      mostrarDica();
    }
  }).catch(() => {});
}
