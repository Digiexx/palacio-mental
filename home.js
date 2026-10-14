document.addEventListener('DOMContentLoaded', () => {
  const region = document.querySelector('.home-coverflow');
  if (!region) return;
  const cards = [...region.querySelectorAll('.home-path-card')];
  const dots = [...document.querySelectorAll('.home-carousel-dots button')];
  const status = document.getElementById('homeStatus');
  let current = 0, start = null, suppressUntil = 0;
  function select(index) {
    current = Math.max(0, Math.min(cards.length - 1, index));
    cards.forEach((card, i) => {
      const d = i - current;
      card.style.setProperty('--card-x', `${d * 122}px`);
      card.style.setProperty('--card-rotate', `${d === 0 ? 0 : d > 0 ? -32 : 32}deg`);
      card.style.setProperty('--card-scale', String(Math.max(.64, 1 - Math.abs(d) * .16)));
      card.style.setProperty('--card-z', String(10 - Math.abs(d)));
      card.style.setProperty('--card-opacity', Math.abs(d) > 2 ? '0' : d === 0 ? '1' : '.72');
      card.classList.toggle('is-current', d === 0);
      card.tabIndex = d === 0 ? 0 : -1;
      card.style.pointerEvents = Math.abs(d) > 2 ? 'none' : '';
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
    document.getElementById('homeCarouselStatus').textContent = `${current + 1} de ${cards.length}: ${cards[current].dataset.title}`;
  }
  region.addEventListener('pointerdown', e => { if (e.isPrimary) start = {x:e.clientX, y:e.clientY, id:e.pointerId}; });
  window.addEventListener('pointerup', e => {
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x, dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      select(current + (dx < 0 ? 1 : -1));
      suppressUntil = Date.now() + 350;
    }
  });
  region.addEventListener('pointercancel', () => { start = null; });
  region.addEventListener('click', e => {
    const card = e.target.closest('.home-path-card');
    if (!card) return;
    const index = cards.indexOf(card);
    if (Date.now() < suppressUntil || index !== current) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (Date.now() >= suppressUntil) select(index);
    }
  }, true);
  region.addEventListener('keydown', e => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault();
    select(e.key === 'Home' ? 0 : e.key === 'End' ? cards.length - 1 : current + (e.key === 'ArrowRight' ? 1 : -1));
    cards[current].focus({preventScroll:true});
  });
  dots.forEach((dot, i) => dot.addEventListener('click', () => select(i)));
  ['btnPalacioBiblico','btnDominio'].forEach(id => document.getElementById(id)?.addEventListener('click', () => {
    status.textContent = 'Este módulo ainda está em desenvolvimento.';
  }));
  const home = document.querySelector('.home-palacio');
  const nav = document.querySelector('.home-nav button');
  const navArea = nav.closest('.home-nav');
  const handle = document.createElement('button');
  handle.type = 'button';
  handle.className = 'home-nav-handle';
  handle.setAttribute('aria-label', 'Mostrar botão Início');
  handle.setAttribute('aria-controls', nav.id);
  handle.setAttribute('aria-expanded', 'false');
  handle.innerHTML = '<span aria-hidden="true"></span>';
  navArea.append(handle);
  let navOpen = false, navGesture = null, navIgnoreClick = 0;
  function setNavOpen(open, focusHandle = false) {
    navOpen = open;
    nav.hidden = !open;
    navArea.classList.toggle('is-open', open);
    handle.setAttribute('aria-expanded', String(open));
    handle.setAttribute('aria-label', open ? 'Recolher botão Início' : 'Mostrar botão Início');
    if (focusHandle) handle.focus({preventScroll:true});
  }
  handle.addEventListener('click', () => {
    if (Date.now() >= navIgnoreClick) setNavOpen(!navOpen);
  });
  navArea.addEventListener('pointerdown', e => {
    if (!e.isPrimary) return;
    navGesture = {id:e.pointerId,x:e.clientX,y:e.clientY};
  });
  window.addEventListener('pointerup', e => {
    if (!navGesture || navGesture.id !== e.pointerId) return;
    const dy = e.clientY - navGesture.y, dx = e.clientX - navGesture.x;
    navGesture = null;
    if (Math.abs(dy) > 22 && Math.abs(dy) > Math.abs(dx)) {
      setNavOpen(dy < 0);
      navIgnoreClick = Date.now() + 400;
    }
  });
  navArea.addEventListener('pointercancel', () => { navGesture = null; });
  nav.addEventListener('click', e => {
    if (Date.now() < navIgnoreClick) {
      e.preventDefault(); e.stopImmediatePropagation(); return;
    }
    setNavOpen(false, true);
  }, true);
  document.addEventListener('pointerdown', e => {
    if (navOpen && !navArea.contains(e.target)) setNavOpen(false);
  });
  navArea.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navOpen) { e.preventDefault(); setNavOpen(false,true); }
  });
  navArea.addEventListener('focusout', e => {
    if (!navArea.contains(e.relatedTarget)) setNavOpen(false);
  });
  function sync() {
    document.body.classList.toggle('home-aberta', !home.hidden);
    nav.classList.toggle('active', !home.hidden);
    if (!home.hidden) nav.setAttribute('aria-current','page'); else nav.removeAttribute('aria-current');
    setNavOpen(false);
  }
  new MutationObserver(sync).observe(home, {attributes:true, attributeFilter:['hidden']});
  // Preferência do brilho do botão Início.
  const chaveBrilhoInicio = 'palacioMentalBrilhoInicio';
  let brilhoInicioLigado = true;

  try {
    brilhoInicioLigado =
      localStorage.getItem(chaveBrilhoInicio) !== 'desligado';
  } catch {}

  const painelAparencia = document.getElementById('dialogTemasApp');
  const notaAparencia = painelAparencia?.querySelector('.app-theme-note');

  const linhaBrilho = document.createElement('div');
  linhaBrilho.className = 'tema-brilho-linha';

  const textoBrilho = document.createElement('div');
  textoBrilho.className = 'tema-brilho-texto';

  const tituloBrilho = document.createElement('strong');
  tituloBrilho.id = 'tituloBrilhoInicio';
  tituloBrilho.textContent = 'Brilho do botão Início';

  const descricaoBrilho = document.createElement('small');
  descricaoBrilho.id = 'descricaoBrilhoInicio';
  descricaoBrilho.textContent = 'Luz suave no canto';

  textoBrilho.append(tituloBrilho, descricaoBrilho);

  const interruptorBrilho = document.createElement('button');
  interruptorBrilho.type = 'button';
  interruptorBrilho.className = 'tema-interruptor';
  interruptorBrilho.id = 'btnBrilhoInicio';
  interruptorBrilho.setAttribute('role', 'switch');
  interruptorBrilho.setAttribute('aria-labelledby', tituloBrilho.id);
  interruptorBrilho.setAttribute('aria-describedby', descricaoBrilho.id);

  linhaBrilho.append(textoBrilho, interruptorBrilho);

  if (notaAparencia) {
    notaAparencia.before(linhaBrilho);
    notaAparencia.textContent = 'Preferências salvas automaticamente.';
  } else {
    painelAparencia?.append(linhaBrilho);
  }

  function aplicarBrilhoInicio() {
    document.documentElement.dataset.brilhoInicio =
      brilhoInicioLigado ? 'ligado' : 'desligado';

    interruptorBrilho.setAttribute(
      'aria-checked',
      String(brilhoInicioLigado)
    );

    const luzInicio = handle.querySelector('span');

    if (luzInicio) {
      luzInicio.style.display = brilhoInicioLigado ? '' : 'none';
    }
  }

  interruptorBrilho.addEventListener('click', () => {
    brilhoInicioLigado = !brilhoInicioLigado;
    aplicarBrilhoInicio();

    try {
      localStorage.setItem(
        chaveBrilhoInicio,
        brilhoInicioLigado ? 'ligado' : 'desligado'
      );
    } catch {}
  });

  aplicarBrilhoInicio();

  const portrait = document.querySelector('.home-portrait');
  const selector = document.getElementById('selectFundoHome');
  const backgrounds = {dourado:'natan-fuentes.webp',cinza:'natan-fuentes-cinza.webp',roxo:'natan-fuentes-roxo.webp'};
  let saved = 'dourado';
  try { saved = localStorage.getItem('palacioMentalFundoHome') || saved; } catch {}
  if (!backgrounds[saved]) saved = 'dourado';
  selector.value = saved; portrait.src = `assets/imagens/perfil/${backgrounds[saved]}`;

  // Fundo da Home — botões de escolha.
  const grupoFundos = document.createElement('div');
  grupoFundos.className = 'temas-opcoes';
  grupoFundos.setAttribute('role', 'group');
  grupoFundos.setAttribute('aria-label', 'Fundo da Home');

  const botoesFundos = [];

  function atualizarBotoesFundos() {
    botoesFundos.forEach(botao => {
      botao.setAttribute(
        'aria-pressed',
        String(botao.dataset.fundo === selector.value)
      );
    });
  }

  [
    ['dourado', 'Dourado'],
    ['cinza', 'Prateado'],
    ['roxo', 'Roxo']
  ].forEach(([valor, nome]) => {
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'tema-opcao';
    botao.dataset.fundo = valor;
    botao.textContent = nome;

    botao.addEventListener('click', () => {
      selector.value = valor;
      selector.dispatchEvent(
        new Event('change', { bubbles: true })
      );
    });

    botoesFundos.push(botao);
    grupoFundos.append(botao);
  });

  selector.after(grupoFundos);
  selector.style.display = 'none';
  selector.addEventListener('change', atualizarBotoesFundos);

  document.getElementById('dialogTemasApp')?.addEventListener(
    'toggle',
    atualizarBotoesFundos
  );

  // Atualiza também se houver falha ao carregar a fotografia.
  if (status) {
    new MutationObserver(atualizarBotoesFundos).observe(
      status,
      { childList: true, characterData: true, subtree: true }
    );
  }

  atualizarBotoesFundos();
  const fadingPortrait = portrait.cloneNode(false);
  fadingPortrait.removeAttribute('fetchpriority');
  fadingPortrait.classList.add('home-portrait-transition');
  fadingPortrait.setAttribute('aria-hidden','true');
  portrait.after(fadingPortrait);
  let portraitRequest = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  selector.addEventListener('change', async () => {
    const request = ++portraitRequest;
    const choice = selector.value;
    const src = `assets/imagens/perfil/${backgrounds[choice]}`;
    const next = new Image(); next.src = src;
    try { await next.decode(); } catch {
      if (request === portraitRequest) {
        status.textContent = 'Não foi possível carregar esse fundo.';
        selector.value = saved;
      }
      return;
    }
    if (request !== portraitRequest) return;
    fadingPortrait.classList.remove('is-visible');
    fadingPortrait.src = src;
    if (!reducedMotion.matches) {
      void fadingPortrait.offsetWidth;
      fadingPortrait.classList.add('is-visible');
      await new Promise(resolve => setTimeout(resolve,400));
    }
    if (request !== portraitRequest) return;
    portrait.src = src;
    fadingPortrait.classList.remove('is-visible');
    saved = choice;
    try { localStorage.setItem('palacioMentalFundoHome',choice); } catch {}
  });
  select(cards.findIndex(card => card.id === 'btnPalacioBiblico')); sync();
});


