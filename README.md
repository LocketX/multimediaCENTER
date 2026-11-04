# multimediaCENTER

Um centro multimídia em tela cheia, com cara de TV, para dar nova vida a laptops antigos com Windows. Ele abre serviços de streaming como Netflix, Max (HBO), Crunchyroll, Prime Video e Disney+ e é controlado pelas setas, Enter e Voltar.

O app roda dentro do **Google Chrome**, que já traz o Widevine, o DRM que esses serviços exigem. Ele usa um perfil do Chrome só dele, então não mexe no seu Chrome do dia a dia, e os logins nos serviços ficam salvos nesse perfil.

## Situação atual (passo 1 de 4)

Por enquanto o app abre uma **tela de diagnóstico** que:

- confere se está rodando no Google Chrome;
- confere se o Widevine está disponível;
- traz um botão para abrir cada serviço e testar se o vídeo toca.

Atalhos: **Home** ou **F1** volta para a tela inicial de dentro de qualquer serviço, e **F11** liga e desliga a tela cheia.

## Como usar no Windows

Você só precisa ter o [Google Chrome](https://www.google.com/chrome/) instalado.

1. Baixe o projeto (botão **Code → Download ZIP** no GitHub) e extraia numa pasta fixa, por exemplo `C:\multimediaCENTER`.
2. **Só na primeira vez:** dê dois cliques em `Configurar.bat` e siga as instruções da tela. Elas pedem para ativar o "Modo do desenvolvedor" e carregar a pasta `extensao` com "Carregar sem compactação".
3. Depois, é só abrir o `MultimediaCenter.bat`. Dá para criar um atalho dele na área de trabalho.

Se você mudar a pasta do projeto de lugar, rode o `Configurar.bat` de novo.

## Como funciona

- `extensao/`: uma extensão do Chrome com a tela inicial (`inicio.html`) e o atalho que volta para ela (`atalhos.js` e `fundo.js`). A chave fixa no `manifest.json` garante que o endereço da extensão seja sempre o mesmo.
- `MultimediaCenter.bat`: acha o Chrome, abre o perfil do multimediaCENTER e mostra a tela inicial em tela cheia, sem barra de endereço.
- `Configurar.bat`: abre a página de extensões nesse perfil para carregar a extensão.

## Limitações conhecidas

- A qualidade máxima depende de cada serviço. A Netflix, por exemplo, costuma limitar o Chrome a 1080p.
- O Chrome mostra um aviso sobre extensões no modo do desenvolvedor de vez em quando. É só fechar.

## Plano

1. ✅ Base no Google Chrome com tela de diagnóstico
2. Tela inicial estilo TV com navegação por setas
3. Abrir os serviços em tela cheia e voltar ao início
4. Modo leve, iniciar junto com o Windows e instalador
