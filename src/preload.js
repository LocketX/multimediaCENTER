// Ponte segura entre a tela inicial e o processo principal.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mmc', {
  statusComponentes: () => ipcRenderer.invoke('mmc:status-componentes'),
  abrirServico: (url) => ipcRenderer.send('mmc:abrir-servico', url),
});
