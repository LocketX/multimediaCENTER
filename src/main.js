// Processo principal do multimediaCENTER.
// Usa o Electron da castlabs (ECS), que traz o Widevine CDM exigido pelos
// serviços de streaming (Netflix, Max, Crunchyroll, Prime Video...).
const { app, BrowserWindow, components, ipcMain, session } = require('electron');
const path = require('path');

const PAGINA_INICIAL = path.join(__dirname, 'diagnostico', 'index.html');

// Alguns serviços recusam navegadores que se identificam como "Electron".
// Removemos esses trechos para o app se apresentar como um Chrome comum.
function userAgentDeChrome(uaOriginal) {
  return uaOriginal
    .replace(/\s?Electron\/\S+/i, '')
    .replace(new RegExp(`\\s?${app.getName()}\\/\\S+`, 'i'), '');
}

let janela;

function criarJanela() {
  janela = new BrowserWindow({
    fullscreen: true,
    autoHideMenuBar: true,
    backgroundColor: '#0b0d12',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  janela.once('ready-to-show', () => janela.show());

  // Atalhos globais da janela:
  //  - Home ou F1: volta para a tela inicial (a partir de qualquer serviço)
  //  - F11: alterna tela cheia
  janela.webContents.on('before-input-event', (evento, input) => {
    if (input.type !== 'keyDown') return;
    if (input.key === 'Home' || input.key === 'F1') {
      evento.preventDefault();
      janela.loadFile(PAGINA_INICIAL);
    } else if (input.key === 'F11') {
      evento.preventDefault();
      janela.setFullScreen(!janela.isFullScreen());
    }
  });

  // Pop-ups (ex.: login) abrem na própria janela, para não sair da tela cheia.
  janela.webContents.setWindowOpenHandler(({ url }) => {
    janela.loadURL(url);
    return { action: 'deny' };
  });

  janela.loadFile(PAGINA_INICIAL);
}

ipcMain.handle('mmc:status-componentes', () => components.status());

ipcMain.on('mmc:abrir-servico', (_evento, url) => {
  // Só aceitamos endereços https vindos da tela inicial.
  try {
    if (new URL(url).protocol === 'https:') janela.loadURL(url);
  } catch {
    /* endereço inválido: ignorar */
  }
});

app.whenReady().then(async () => {
  app.userAgentFallback = userAgentDeChrome(app.userAgentFallback);
  session.defaultSession.setUserAgent(app.userAgentFallback);

  try {
    // Espera o Widevine ser baixado/atualizado pelo serviço da castlabs.
    await components.whenReady();
  } catch (erro) {
    console.error('Falha ao preparar o Widevine:', erro);
  }
  console.log('Componentes:', components.status());
  criarJanela();
});

app.on('window-all-closed', () => app.quit());
