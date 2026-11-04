# multimediaCENTER

Um centro multimídia em tela cheia, com cara de TV, para dar nova vida a laptops antigos com Windows. Ele abre serviços de streaming como Netflix, Max (HBO), Crunchyroll, Prime Video e Disney+ e é controlado pelas setas, Enter e Voltar.

O app é feito em [Electron da castlabs](https://github.com/castlabs/electron-releases), uma versão do Chromium que já inclui o **Widevine**, o DRM que esses serviços exigem.

## Situação atual (passo 1 de 4)

Por enquanto o app abre uma **tela de diagnóstico** que:

- mostra se o componente Widevine foi instalado;
- confere se o navegador aceita o Widevine;
- traz um botão para abrir cada serviço e testar se o vídeo toca.

Atalhos: **Home** ou **F1** volta para a tela inicial, e **F11** liga e desliga a tela cheia.

## Como rodar no Windows

1. Instale o [Node.js](https://nodejs.org/) (versão 20 ou mais nova) e o [Python 3](https://www.python.org/).
2. No terminal, dentro da pasta do projeto:
   ```
   npm install
   ```
3. **Assine o Electron para o Widevine (VMP).** No Windows, Netflix, Max e outros só tocam vídeo se o executável estiver assinado pela castlabs. A assinatura para desenvolvimento é gratuita:
   ```
   pip install --upgrade castlabs-evs
   python -m castlabs_evs.account signup
   python -m castlabs_evs.vmp sign-pkg node_modules\electron\dist
   ```
   O `signup` só é preciso na primeira vez. Repita o `sign-pkg` sempre que reinstalar o Electron.
4. Inicie o app:
   ```
   npm start
   ```

## Limitações conhecidas

- A qualidade máxima depende de cada serviço. A Netflix, por exemplo, costuma limitar navegadores baseados em Chromium a 720p ou 1080p.
- Na primeira execução, o Widevine é baixado em segundo plano, então pode levar alguns segundos até o diagnóstico ficar verde.

## Plano

1. ✅ Base em Electron (castlabs) com Widevine e tela de diagnóstico
2. Tela inicial estilo TV com navegação por setas
3. Abrir os serviços em tela cheia e voltar ao início
4. Modo leve, iniciar junto com o Windows e instalador
