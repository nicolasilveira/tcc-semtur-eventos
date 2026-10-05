/* Calendário de eventos + roteiros turísticos (dados em eventos.json e roteiros.json) */
(function () {
  const CAT = {
    cultura: { nome: 'Cultura', cor: '#8e44ad' }, turismo: { nome: 'Turismo', cor: '#00a86b' },
    esporte: { nome: 'Esporte', cor: '#d35400' }, prefeitura: { nome: 'Prefeitura', cor: '#0b3d91' },
    gastronomia: { nome: 'Gastronomia', cor: '#c0392b' }
  };
  let eventos = [], roteiros = [], ativas = new Set(Object.keys(CAT)), calendar;
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const temHora = (iso) => String(iso).includes('T');
  const fmt = (iso) => new Date(iso + (temHora(iso) ? '' : 'T00:00')).toLocaleString('pt-BR', temHora(iso) ? { dateStyle: 'long', timeStyle: 'short' } : { dateStyle: 'long' });
  const periodo = (e) => fmt(e.start) + (e.end ? ' a ' + fmt(e.end) : '');

  function galeria(imgs, titulo) {
    return '<div class="gal"><img class="gal-main" id="gal-main" src="' + esc(imgs[0]) + '" alt="' + esc(titulo) + '">' +
      '<div class="gal-thumbs">' + imgs.map((s, i) => '<button type="button" data-src="' + esc(s) + '" aria-label="Imagem ' + (i + 1) + '"><img src="' + esc(s) + '" alt=""></button>').join('') + '</div>' +
      '<p class="gal-nota">Imagens ilustrativas</p></div>';
  }
  function lista(itens) {
    return '<ol class="prog">' + itens.map(i => '<li><b>' + esc(i.hora) + '</b><span>' + esc(i.atividade) + '</span></li>').join('') + '</ol>';
  }
  function abrir(html) {
    const m = $('ev-modal'); $('ev-modal-body').innerHTML = html;
    m.querySelectorAll('.gal-thumbs button').forEach(b => b.addEventListener('click', () => { $('gal-main').src = b.dataset.src; }));
    m.showModal();
  }
  function abrirEvento(id) {
    const e = eventos.find(x => x.id === id); if (!e) return;
    const c = CAT[e.categoria] || {};
    abrir('<span class="tag" style="--dot:' + c.cor + '">' + esc(c.nome) + '</span><h2>' + esc(e.title) + '</h2>' +
      galeria(e.imagens, e.title) +
      '<p>' + esc(e.descricao) + '</p><dl class="meta"><dt>Quando</dt><dd>' + esc(periodo(e)) + '</dd><dt>Onde</dt><dd>' + esc(e.local) + '</dd></dl>' +
      '<h3>Programação</h3>' + lista(e.programacao));
  }
  function abrirRoteiro(id) {
    const r = roteiros.find(x => x.id === id); if (!r) return;
    abrir('<span class="tag" style="--dot:#00a86b">Roteiro turístico</span><h2>' + esc(r.titulo) + '</h2>' + galeria(r.imagens, r.titulo) +
      '<p>' + esc(r.descricao) + '</p><dl class="meta"><dt>Duração</dt><dd>' + esc(r.duracao) + '</dd></dl>' +
      '<h3>Roteiro</h3>' + lista(r.roteiro) + '<h3>Dicas</h3><p>' + esc(r.dicas) + '</p>');
  }

  function montarFiltros() {
    Object.entries(CAT).forEach(([k, c]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ev-chip'; b.setAttribute('aria-pressed', 'true'); b.style.setProperty('--dot', c.cor);
      b.innerHTML = '<i></i>' + c.nome;
      b.addEventListener('click', () => { ativas.has(k) ? ativas.delete(k) : ativas.add(k); b.setAttribute('aria-pressed', ativas.has(k)); atualizar(); });
      $('ev-filters').appendChild(b);
    });
  }
  function listarProximos() {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const prox = eventos.filter(e => ativas.has(e.categoria) && new Date(e.end || e.start) >= hoje)
      .sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 5);
    const ul = $('ev-list'); ul.innerHTML = prox.length ? '' : '<li><p class="ev-empty">Nenhum evento próximo.</p></li>';
    prox.forEach(e => {
      const li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button'; b.style.setProperty('--dot', CAT[e.categoria].cor);
      b.innerHTML = '<strong>' + esc(e.title) + '</strong><span>' + esc(fmt(e.start)) + '</span>';
      b.addEventListener('click', () => abrirEvento(e.id));
      li.appendChild(b); ul.appendChild(li);
    });
  }
  function atualizar() {
    calendar.removeAllEvents();
    eventos.filter(e => ativas.has(e.categoria)).forEach(e => calendar.addEvent({ id: e.id, title: e.title, start: e.start, end: e.end, color: CAT[e.categoria].cor }));
    listarProximos();
  }
  function montarRoteiros() {
    const box = $('rot-grid');
    roteiros.forEach(r => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'rot-card';
      b.innerHTML = '<img src="' + esc(r.capa) + '" alt=""><span class="rot-body"><strong>' + esc(r.titulo) + '</strong><span>' + esc(r.descricao) + '</span><em>' + esc(r.duracao) + ' · Ver roteiro</em></span>';
      b.addEventListener('click', () => abrirRoteiro(r.id));
      box.appendChild(b);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    calendar = new FullCalendar.Calendar($('calendario'), {
      locale: 'pt-br', initialView: 'dayGridMonth', height: 'auto',
      eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' },
      buttonText: { today: 'Hoje', month: 'Mês', list: 'Lista' },
      eventClick: (info) => abrirEvento(info.event.id)
    });
    calendar.render(); montarFiltros();
    $('ev-close').addEventListener('click', () => $('ev-modal').close());
    $('ev-modal').addEventListener('click', (ev) => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });
    eventos = window.EVENTOS || []; roteiros = window.ROTEIROS || [];
    atualizar(); montarRoteiros();
  });
})();
