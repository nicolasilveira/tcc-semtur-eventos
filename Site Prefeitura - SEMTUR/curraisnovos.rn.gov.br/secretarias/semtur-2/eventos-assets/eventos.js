/* Calendário de eventos - carrega eventos.json e monta calendário, filtros e lista */
(function () {
  const CATEGORIAS = {
    cultura:    { nome: 'Cultura',    cor: '#8e44ad' },
    turismo:    { nome: 'Turismo',    cor: '#00a86b' },
    esporte:    { nome: 'Esporte',    cor: '#d35400' },
    prefeitura: { nome: 'Prefeitura', cor: '#0b3d91' }
  };
  let todos = [];
  let ativas = new Set(Object.keys(CATEGORIAS));
  let calendar;

  const $ = (id) => document.getElementById(id);
  const fmt = (iso, comHora) => new Date(iso).toLocaleString('pt-BR',
    comHora ? { dateStyle: 'long', timeStyle: 'short' } : { dateStyle: 'long' });
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const temHora = (iso) => String(iso).includes('T');

  function visiveis() { return todos.filter(e => ativas.has(e.categoria)); }

  function montarFiltros() {
    const box = $('ev-filters');
    Object.entries(CATEGORIAS).forEach(([chave, c]) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ev-chip'; b.setAttribute('aria-pressed', 'true');
      b.style.setProperty('--dot', c.cor);
      b.innerHTML = '<i></i>' + c.nome;
      b.addEventListener('click', () => {
        ativas.has(chave) ? ativas.delete(chave) : ativas.add(chave);
        b.setAttribute('aria-pressed', ativas.has(chave));
        atualizar();
      });
      box.appendChild(b);
    });
  }

  function mostrarDetalhe(e) {
    const c = CATEGORIAS[e.categoria] || {};
    const inicio = e.start || e.startStr;
    const box = $('ev-detail');
    box.innerHTML = '<h3>' + esc(e.title) + '</h3><dl>' +
      '<dt>Quando</dt><dd>' + fmt(inicio, temHora(inicio)) + '</dd>' +
      '<dt>Onde</dt><dd>' + esc(e.local || 'A definir') + '</dd>' +
      '<dt>Categoria</dt><dd>' + (c.nome || '-') + '</dd>' +
      (e.descricao ? '<dt>Sobre</dt><dd>' + esc(e.descricao) + '</dd>' : '') + '</dl>';
  }

  function listarProximos() {
    const ul = $('ev-list');
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const prox = visiveis().filter(e => new Date(e.end || e.start) >= hoje)
      .sort((a, b) => new Date(a.start) - new Date(b.start)).slice(0, 5);
    ul.innerHTML = '';
    if (!prox.length) { ul.innerHTML = '<li><p class="ev-empty">Nenhum evento próximo.</p></li>'; return; }
    prox.forEach(e => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.style.setProperty('--dot', (CATEGORIAS[e.categoria] || {}).cor);
      b.innerHTML = '<strong>' + esc(e.title) + '</strong><span>' + fmt(e.start, temHora(e.start)) + '</span>';
      b.addEventListener('click', () => { mostrarDetalhe(e); calendar.gotoDate(e.start); });
      li.appendChild(b); ul.appendChild(li);
    });
  }

  function atualizar() {
    calendar.removeAllEvents();
    visiveis().forEach(e => calendar.addEvent({
      id: e.id, title: e.title, start: e.start, end: e.end,
      color: (CATEGORIAS[e.categoria] || {}).cor,
      extendedProps: { categoria: e.categoria, local: e.local, descricao: e.descricao }
    }));
    listarProximos();
  }

  document.addEventListener('DOMContentLoaded', function () {
    calendar = new FullCalendar.Calendar($('calendario'), {
      locale: 'pt-br',
      initialView: 'dayGridMonth',
      height: 'auto',
      eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' },
      buttonText: { today: 'Hoje', month: 'Mês', list: 'Lista' },
      eventClick: (info) => {
        const p = info.event.extendedProps;
        mostrarDetalhe({ title: info.event.title, startStr: info.event.startStr, ...p });
      }
    });
    calendar.render();
    montarFiltros();

    fetch('eventos-assets/eventos.json')
      .then(r => r.json())
      .then(dados => { todos = dados; atualizar(); })
      .catch(() => {
        $('ev-list').innerHTML = '<li><p class="ev-empty">Não foi possível carregar os eventos. Abra o site por um servidor local (Live Server).</p></li>';
      });
  });
})();
