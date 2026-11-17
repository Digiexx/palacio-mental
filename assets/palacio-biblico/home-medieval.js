// Estrutura compartilhada da Home integrada e da previa isolada.
(() => {
    'use strict';
    const base = new URL('../imagens/palacio-biblico/home-palacio-biblico/', document.currentScript.src);
    const PB = globalThis.PalacioBiblico ||= {};
    PB.conteudoHomeMedieval =`
    <img class="cenario" id="cenarioHome"
      src="__IMAGENS_HOME__home-background.webp"
      width="941" height="1671" alt="" fetchpriority="high" draggable="false">

    <header class="titulos">
      <svg class="coroa" viewBox="0 0 64 44" aria-hidden="true">
        <path d="m8 14 13 9L32 6l11 17 13-9-6 22H14L8 14Z"/>
        <path d="M15 40h34M32 1v10m-5-5h10"/>
        <circle cx="8" cy="13" r="2"/><circle cx="56" cy="13" r="2"/>
      </svg>
      <h1 id="tituloPalacio">Palácio Bíblico</h1>
      <div class="ornamento" aria-hidden="true"><span>◇</span></div>
      <h2>Biblioteca Bíblica</h2>
      <p>Memorize versículos com<br>cenários e associações visuais.</p>
    </header>

    <button class="medalhao" id="medalhaoBiblia" type="button" data-demo="medalhao"
      aria-label="Explorar a Biblioteca Bíblica — demonstrativo" aria-describedby="estadoDemo"
      title="Medalhão demonstrativo; o tour ainda não está disponível">
      <img id="imagemMedalhao" src="__IMAGENS_HOME__biblia-medalhao.webp"
        width="768" height="768" alt="" draggable="false">
      <svg class="anel" viewBox="0 0 768 768" aria-hidden="true">
        <ellipse class="anel-base" cx="384" cy="374" rx="250" ry="225"/>
        <ellipse class="anel-rastro" cx="384" cy="374" rx="250" ry="225" pathLength="100"/>
        <ellipse class="anel-luz" cx="384" cy="374" rx="250" ry="225" pathLength="100"/>
      </svg>
    </button>

    <div class="controles">
      <p class="estado-demo" id="estadoDemo" role="status" aria-live="polite">Prévia local · controles demonstrativos</p>
      <nav class="menu" aria-label="Menu demonstrativo do Palácio Bíblico" aria-describedby="estadoDemo">
        <button type="button" data-demo="explorar" aria-label="Explorar — demonstrativo" title="Explorar — demonstrativo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/><path d="M12 3v2m0 14v2M3 12h2m14 0h2"/></svg>
          <span>Explorar</span>
        </button>
        <button type="button" data-demo="livros" aria-label="Livros — demonstrativo" title="Livros — demonstrativo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/></svg>
          <span>Livros</span>
        </button>
        <button type="button" data-demo="progresso" aria-label="Progresso — demonstrativo" title="Progresso — demonstrativo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 14h4v7H3zM10 9h4v12h-4zM17 3h4v18h-4z"/></svg>
          <span>Progresso</span>
        </button>
        <button type="button" data-demo="configuracoes" aria-label="Configurações — demonstrativo" title="Configurações — demonstrativo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 3-.5 2.1-2 .9-1.9-.8L3 9.5 4.6 11v2L3 14.5l2.6 4.3 1.9-.8 2 .9.5 2.1h4l.5-2.1 2-.9 1.9.8 2.6-4.3-1.6-1.5v-2L21 9.5l-2.6-4.3-1.9.8-2-.9L14 3h-4Z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Configurações</span>
        </button>
        <button type="button" data-demo="home" aria-label="Home — página atual do protótipo, demonstrativo" aria-current="page" title="Home — demonstrativo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 9-8 9 8M5 10v11h5v-7h4v7h5V10"/></svg>
          <span>Home</span>
        </button>
      </nav>
    </div>
`.replaceAll('__IMAGENS_HOME__', base.href);
    PB.iniciarHomeMedieval = ({elemento, navegar}) => {
        if (!elemento) return null;
        const integrada = typeof navegar === 'function';
        elemento.classList.add('pb-home');
        elemento.setAttribute('aria-labelledby', 'tituloPalacio');
        elemento.innerHTML = PB.conteudoHomeMedieval;
        const estado = elemento.querySelector('#estadoDemo');
        const mensagemInicial = integrada
            ? 'Acesse a Biblioteca pelo medalhão ou por Livros.'
            : 'Prévia local · controles demonstrativos';
        const mensagens = {
            medalhao: 'Medalhão demonstrativo · a exploração ainda não está disponível.',
            explorar: 'Explorar é demonstrativo · o tour ainda não foi implementado.',
            livros: 'Livros é demonstrativo · o painel de livros ficará para outra etapa.',
            progresso: 'Progresso é demonstrativo · nenhum dado de estudo é consultado.',
            configuracoes: 'Configurações é demonstrativo · sem alterações nas preferências.',
            home: 'Você está na Home experimental · sem navegação para o aplicativo.'
        };
        const destinos = {medalhao: 'bibliotecaBiblica', livros: 'bibliotecaBiblica', home: 'home'};
        const rotulos = {
            medalhao: 'Abrir Biblioteca Bíblica',
            livros: 'Livros — abrir Biblioteca Bíblica',
            home: 'Home — retornar ao início do Palácio Mental'
        };
        if (integrada) elemento.querySelector('.menu').setAttribute('aria-label', 'Menu do Palácio Bíblico');
        elemento.querySelectorAll('[data-demo]').forEach(botao => {
            const acao = botao.dataset.demo;
            if (integrada && destinos[acao]) {
                botao.setAttribute('aria-label', rotulos[acao]);
                botao.title = rotulos[acao];
                botao.removeAttribute('aria-current');
            }
            botao.addEventListener('click', () => {
                if (integrada && destinos[acao]) navegar(destinos[acao]);
                else estado.textContent = mensagens[acao];
            });
        });
        function atualizarMovimento() {
            elemento.dataset.pausado = String(document.hidden || elemento.hidden);
        }
        document.addEventListener('visibilitychange', atualizarMovimento);
        estado.textContent = mensagemInicial;
        atualizarMovimento();
        return {
            abrir() { estado.textContent = mensagemInicial; atualizarMovimento(); },
            suspender() { elemento.dataset.pausado = 'true'; }
        };
    };
})();
