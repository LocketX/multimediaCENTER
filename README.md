# multimediaCENTER

Um centro multimídia em tela cheia, com cara de TV, para dar nova vida a laptops antigos com Windows. Ele abre serviços de streaming como Netflix, Max (HBO), Crunchyroll, Prime Video e Disney+ e é controlado pelas setas, Enter e Voltar.

O app roda dentro do **Google Chrome**, que já traz o Widevine, o DRM que esses serviços exigem. Ele usa um perfil do Chrome só dele, então não mexe no seu Chrome do dia a dia, e os logins nos serviços ficam salvos nesse perfil.

![Tela inicial](docs/tela-inicial.png)

## O que ele faz

- **Tela inicial estilo TV**, com uma fileira de apps (Netflix, HBO Max, Crunchyroll, Prime Video, Disney+, YouTube, Spotify e Twitch), cada um com a sua logo, e uma fileira de sistema.
- O app em foco aparece em destaque, e o fundo ganha a cor dele. A tela lembra o último app usado.
- **Gerenciar apps**: mostre ou esconda cada app e adicione qualquer site (por exemplo, Globoplay), com nome, endereço e cor.
- **Modo leve**: tira animações e efeitos. Liga sozinho em máquinas com até 4 GB de memória ou 2 núcleos, e pode ser trocado na fileira de sistema.
- Ao abrir um app, aparece por alguns segundos uma dica de como voltar ao início.
- **Diagnóstico**: confere se está no Google Chrome e se o Widevine está disponível.

Atalhos: as setas navegam e **Enter** abre. **Home** ou **F1** voltam para a tela inicial de dentro de qualquer app, e **Backspace** volta uma página (da primeira página do app, volta ao início). **Esc** sai das telas de sistema, e **F11** liga e desliga a tela cheia.

## Como instalar no Windows

Você só precisa ter o [Google Chrome](https://www.google.com/chrome/) instalado.

1. Baixe o projeto (botão **Code → Download ZIP** no GitHub) e extraia em qualquer pasta.
2. Dê dois cliques em **`Instalar.bat`**. Ele:
   - copia o app para `%LocalAppData%\multimediaCENTER\app`;
   - cria atalhos com ícone na Área de Trabalho e no Menu Iniciar;
   - pergunta se o app deve **abrir junto com o Windows**;
   - na primeira vez, abre a página de extensões do Chrome para você carregar a pasta `extensao` com "Carregar sem compactação". O caminho já fica copiado, é só colar.
3. Abra o **multimediaCENTER** pelo atalho. A pasta que você baixou pode ser apagada.

Para atualizar, baixe a versão nova e rode o `Instalar.bat` de novo. Seus logins e escolhas ficam guardados. Para mudar a opção de abrir com o Windows, rode o instalador de novo.

Para remover, rode o `Desinstalar.bat`. Ele pergunta se você quer apagar também os logins.

### Sem instalar (modo portátil)

Também dá para usar direto da pasta baixada: rode o `Configurar.bat` uma vez para carregar a extensão e depois abra o `MultimediaCenter.bat`. Se mudar a pasta de lugar, rode o `Configurar.bat` de novo.

## Como funciona

- `extensao/`: uma extensão do Chrome com a tela inicial (`inicio.html`), a lista de apps (`servicos.js`), o diagnóstico (`diagnostico.html`), a tela de gerenciar apps (`apps.html`) e o atalho que volta para o início (`atalhos.js` e `fundo.js`). A chave fixa no `manifest.json` garante que o endereço da extensão seja sempre o mesmo.
- `Instalar.bat` e `Desinstalar.bat`, com os scripts em `instalador/`, instalam e removem o app. O atalho criado abre o Chrome direto no perfil do multimediaCENTER, em tela cheia e sem barra de endereço.
- `MultimediaCenter.bat` e `Configurar.bat` servem para o modo portátil.

## Logos

As logos em `extensao/logos/` vêm do [Simple Icons](https://simpleicons.org/) (versão 16.36.0, licença CC0) e são marcas registradas dos seus donos, usadas só para identificar cada serviço. O Simple Icons não tem logos do Prime Video e do Disney+, então esses dois cartões mostram o nome. Para trocar ou adicionar uma logo, coloque um arquivo SVG ou PNG branco em `extensao/logos/` e aponte o campo `logo` do serviço em `extensao/servicos.js` para ele.

## Limitações conhecidas

- A qualidade máxima depende de cada serviço. A Netflix, por exemplo, costuma limitar o Chrome a 1080p.
- O Chrome mostra um aviso sobre extensões no modo do desenvolvedor de vez em quando. É só fechar.

## Plano

1. ✅ Base no Google Chrome com tela de diagnóstico
2. ✅ Tela inicial estilo TV com navegação por setas
3. ✅ Dentro dos apps: tecla Voltar, dica de como voltar ao início e tela para gerenciar apps
4. ✅ Modo leve, iniciar junto com o Windows e instalador
