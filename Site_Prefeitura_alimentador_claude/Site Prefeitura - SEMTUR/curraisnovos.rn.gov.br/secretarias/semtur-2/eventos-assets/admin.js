/* Painel de administração (protótipo front-end). Dados salvos no navegador via armazenamento.js */
(function () {
  const SENHA = '123'; // TESTE. Em produção: autenticação no servidor.
  const MAX = 6;
  const CAT = { cultura: 'Cultura', turismo: 'Turismo', esporte: 'Esporte', prefeitura: 'Prefeitura', gastronomia: 'Gastronomia' };
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let D = Dados.carregar(), sec = 'eventos', modo = 'criar';

  const toast = (m, ok = true) => { const t = $('#toast'); t.textContent = m; t.className = 'toast ' + (ok ? 'ok' : 'err') + ' show'; clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 4000); };
  const gravar = () => Dados.salvar(D) || (toast('Não foi possível salvar: o espaço do navegador está cheio. Remova imagens ou itens.', false), false);
  const btn = (t, fn, cls) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.className = 'b ' + (cls || ''); b.onclick = fn; return b; };
  const novoId = () => 'u' + Date.now().toString(36);
  const nome = (o) => sec === 'eventos' ? o.title : o.titulo;
  const dataBR = (s) => s ? new Date(s + (s.includes('T') ? '' : 'T00:00')).toLocaleDateString('pt-BR') : '';
  const sub = (o) => sec === 'eventos' ? (CAT[o.categoria] || '') + ' · ' + dataBR(o.start) : o.duracao;
  const fld = (l, h) => '<label class="fld"><span class="lbl">' + l + '</span>' + h + '</label>';

  /* ---------- Login ---------- */
  function entrar(ok) { $('#login').hidden = ok; $('#painel').hidden = !ok; if (ok) render(); }
  $('#form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    if ($('#senha').value === SENHA) { sessionStorage.setItem('semtur_admin', '1'); entrar(true); }
    else { $('#erro-login').textContent = 'Senha incorreta. Tente novamente.'; }
  });
  $('#sair').onclick = () => { sessionStorage.removeItem('semtur_admin'); location.reload(); };
  $$('[data-sec]').forEach(b => b.onclick = () => { sec = b.dataset.sec; modo = 'criar'; render(); });
  $$('[data-modo]').forEach(b => b.onclick = () => { modo = b.dataset.modo; render(); });

  function render() {
    $$('[data-sec]').forEach(b => b.classList.toggle('on', b.dataset.sec === sec));
    $$('[data-modo]').forEach(b => b.classList.toggle('on', b.dataset.modo === modo));
    $('#titulo-sec').textContent = sec === 'eventos' ? 'Eventos' : 'Roteiros turísticos';
    const a = $('#area'); a.innerHTML = '';
    modo === 'criar' ? form(a, null) : lista(a);
  }

  /* ---------- Lista (alterar / excluir) ---------- */
  function lista(a) {
    a.innerHTML = '<input type="search" id="busca" placeholder="Buscar pelo título..." aria-label="Buscar pelo título"><ul class="itens"></ul>';
    const ul = $('.itens', a);
    const pintar = () => {
      const q = $('#busca', a).value.toLowerCase(), f = D[sec].filter(o => nome(o).toLowerCase().includes(q));
      ul.innerHTML = f.length ? '' : '<li class="vazio">Nenhum item encontrado.</li>';
      f.forEach(o => {
        const li = document.createElement('li');
        li.innerHTML = '<img src="' + esc((sec === 'eventos' ? o.imagens[0] : o.capa) || '') + '" alt=""><div><strong>' + esc(nome(o)) + '</strong><span>' + esc(sub(o)) + '</span></div><div class="acoes"></div>';
        const ac = $('.acoes', li);
        if (modo === 'alterar') ac.append(btn('Editar', () => form(a, o)), btn('Duplicar', () => duplicar(o)));
        else ac.append(btn('Excluir', () => confirmar(a, o), 'perigo'));
        ul.append(li);
      });
    };
    $('#busca', a).oninput = pintar; pintar();
  }
  function duplicar(o) {
    const c = JSON.parse(JSON.stringify(o)); c.id = novoId(); c[sec === 'eventos' ? 'title' : 'titulo'] += ' (cópia)';
    D[sec].push(c); if (gravar()) { toast('Item duplicado. Use "Editar" para ajustar a cópia.'); render(); }
  }
  function confirmar(a, o) {
    a.innerHTML = '<div class="conf"><h3>Excluir "' + esc(nome(o)) + '"?</h3><p>Esta ação não pode ser desfeita. Para confirmar, digite <b>Excluir</b> na caixa abaixo.</p><input id="cx" autocomplete="off" aria-label="Digite Excluir para confirmar"><div class="acoes"></div></div>';
    const ok = btn('Excluir definitivamente', () => { D[sec] = D[sec].filter(x => x.id !== o.id); if (gravar()) { toast('Item excluído.'); render(); } }, 'perigo');
    ok.disabled = true;
    $('#cx', a).oninput = (e) => { ok.disabled = e.target.value.trim().toLowerCase() !== 'excluir'; };
    $('.acoes', a).append(btn('Cancelar', render), ok);
  }

  /* ---------- Imagens ---------- */
  function comprimir(f) {
    return new Promise((res, rej) => {
      const r = new FileReader(); r.onerror = rej;
      r.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => {
        const k = Math.min(1, 800 / (im.width || 800)), c = document.createElement('canvas');
        c.width = Math.round((im.width || 800) * k); c.height = Math.round((im.height || 500) * k);
        const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.6)); }; im.src = r.result; };
      r.readAsDataURL(f);
    });
  }

  /* ---------- Formulário (criar / editar) ---------- */
  function form(a, o) {
    const ev = sec === 'eventos', novo = !o;
    const v = o ? JSON.parse(JSON.stringify(o)) : (ev ? { id: '', title: '', categoria: 'cultura', start: '', end: '', local: '', valor: '', descricao: '', programacao: [], imagens: [] }
      : { id: '', titulo: '', duracao: '', descricao: '', capa: '', imagens: [], roteiro: [], dicas: '' });
    const rows = ev ? v.programacao : v.roteiro; let imgs = v.imagens.slice(), capa = v.capa || '';
    const [sd, st] = (v.start || '').split('T'), [ed, et] = (v.end || '').split('T'), hh = (s) => (s || '').slice(0, 5);
    const val = (n, x) => '<input name="' + n + '" value="' + esc(x) + '">';
    let h = (novo ? '' : '<button type="button" class="b" id="volta">← Voltar à lista</button>') + '<form id="f" novalidate><h3>' + (novo ? 'Criar ' : 'Alterar ') + (ev ? 'evento' : 'roteiro turístico') + '</h3><div id="erros" class="erros" role="alert"></div>';
    if (ev) {
      h += fld('Título *', val('title', v.title)) +
        fld('Categoria *', '<select name="categoria">' + Object.entries(CAT).map(([k, t]) => '<option value="' + k + '"' + (k === v.categoria ? ' selected' : '') + '>' + t + '</option>').join('') + '</select>') +
        '<div class="par">' + fld('Data de início *', '<input type="date" name="sd" value="' + (sd || '') + '">') + fld('Horário de início (opcional)', '<input type="time" name="st" value="' + hh(st) + '">') + '</div>' +
        '<div class="par">' + fld('Data de fim (opcional)', '<input type="date" name="ed" value="' + (ed || '') + '">') + fld('Horário de fim (opcional)', '<input type="time" name="et" value="' + hh(et) + '">') + '</div>' +
        fld('Local *', val('local', v.local)) + fld('Valor / entrada (opcional)', '<input name="valor" placeholder="Ex.: Gratuito" value="' + esc(v.valor) + '">') +
        fld('Descrição *', '<textarea name="descricao" rows="3">' + esc(v.descricao) + '</textarea>');
    } else {
      h += fld('Título *', val('titulo', v.titulo)) + fld('Duração *', '<input name="duracao" placeholder="Ex.: 3 horas" value="' + esc(v.duracao) + '">') +
        fld('Descrição do banner *', '<textarea name="descricao" rows="2">' + esc(v.descricao) + '</textarea>') +
        '<div class="fld"><span class="lbl">Imagem de banner * (aparece na caixa do roteiro)</span><div id="banner"></div><input type="file" id="arqb" accept="image/*" aria-label="Escolher imagem de banner"></div>';
    }
    h += '<div class="fld"><span class="lbl">' + (ev ? 'Imagens * (até ' + MAX + '; a primeira é a capa)' : 'Imagens do portfólio * (até ' + MAX + ')') + '</span><div class="thumbs" id="th"></div><input type="file" id="arq" accept="image/*" multiple aria-label="Adicionar imagens"></div>' +
      '<div class="fld"><span class="lbl">' + (ev ? 'Programação' : 'Roteiro (passo a passo)') + '</span><div id="rows"></div><button type="button" class="b" id="addrow">＋ Adicionar horário</button></div>' +
      (ev ? '' : fld('Dicas', '<textarea name="dicas" rows="2">' + esc(v.dicas) + '</textarea>')) +
      '<div class="acoes"><button type="submit" class="b pri">Salvar</button><button type="button" class="b" id="cancel">Cancelar</button></div></form>';
    a.innerHTML = h;

    const th = () => { const t = $('#th', a); t.innerHTML = '';
      imgs.forEach((s, i) => { const d = document.createElement('div'); d.className = 'th'; d.innerHTML = '<img src="' + esc(s) + '" alt="Imagem ' + (i + 1) + '">' + (ev && i === 0 ? '<em>Capa</em>' : '');
        const rm = btn('×', () => { imgs.splice(i, 1); th(); }, 'x'); rm.setAttribute('aria-label', 'Remover imagem'); d.append(rm);
        if (i > 0) { const mv = btn('◀', () => { imgs.splice(i - 1, 0, imgs.splice(i, 1)[0]); th(); }, 'x l'); mv.setAttribute('aria-label', 'Mover para antes'); d.append(mv); }
        t.append(d); }); };
    const bn = () => { const b = $('#banner', a); if (b) b.innerHTML = capa ? '<div class="th big"><img src="' + esc(capa) + '" alt="Banner"></div>' : '<p class="dica">Nenhuma imagem escolhida.</p>'; };
    const rr = () => { const R = $('#rows', a); R.innerHTML = '';
      rows.forEach((r, i) => { const d = document.createElement('div'); d.className = 'row';
        d.innerHTML = '<input class="h" placeholder="Hora (ex.: 19:00)" value="' + esc(r.hora) + '" aria-label="Hora"><input class="t" placeholder="Atividade" value="' + esc(r.atividade) + '" aria-label="Atividade">';
        $('.h', d).oninput = (e) => { r.hora = e.target.value; }; $('.t', d).oninput = (e) => { r.atividade = e.target.value; };
        const x = btn('×', () => { rows.splice(i, 1); rr(); }, 'x'); x.setAttribute('aria-label', 'Remover linha'); d.append(x); R.append(d); }); };
    th(); bn(); rr();

    $('#arq', a).onchange = async (e) => { const fs = [...e.target.files]; e.target.value = '';
      for (const f of fs) { if (imgs.length >= MAX) { toast('Limite de ' + MAX + ' imagens atingido.', false); break; }
        try { imgs.push(await comprimir(f)); } catch (x) { toast('Não foi possível ler: ' + f.name, false); } } th(); };
    if (!ev) $('#arqb', a).onchange = async (e) => { const f = e.target.files[0]; e.target.value = ''; if (f) { try { capa = await comprimir(f); bn(); } catch (x) { toast('Não foi possível ler a imagem.', false); } } };
    $('#addrow', a).onclick = () => { rows.push({ hora: '', atividade: '' }); rr(); };
    $('#cancel', a).onclick = render; if (!novo) $('#volta', a).onclick = render;

    $('#f', a).onsubmit = (e) => {
      e.preventDefault();
      const g = (k) => { const el = $('[name=' + k + ']', a); return el ? el.value.trim() : ''; }, er = [];
      if (!g(ev ? 'title' : 'titulo')) er.push('Informe o título.');
      if (ev) {
        if (!g('sd')) er.push('Informe a data de início.');
        if (g('ed') && g('sd') && g('ed') < g('sd')) er.push('A data de fim não pode ser anterior à data de início.');
        if (g('sd') && (!g('ed') || g('ed') === g('sd')) && g('st') && g('et') && g('et') < g('st')) er.push('O horário de fim não pode ser anterior ao de início.');
        if (!g('local')) er.push('Informe o local.');
      } else { if (!g('duracao')) er.push('Informe a duração.'); if (!capa) er.push('Escolha a imagem de banner.'); }
      if (!g('descricao')) er.push(ev ? 'Informe a descrição.' : 'Informe a descrição do banner.');
      if (!imgs.length) er.push(ev ? 'Adicione pelo menos uma imagem.' : 'Adicione pelo menos uma imagem ao portfólio.');
      if (er.length) { $('#erros', a).innerHTML = er.map(m => '• ' + esc(m)).join('<br>'); $('#erros', a).scrollIntoView({ block: 'center' }); return; }
      const lim = rows.filter(r => r.hora.trim() || r.atividade.trim()).map(r => ({ hora: r.hora.trim(), atividade: r.atividade.trim() }));
      if (ev) {
        const fim = g('ed') ? g('ed') + (g('et') ? 'T' + g('et') : '') : (g('et') ? g('sd') + 'T' + g('et') : '');
        Object.assign(v, { title: g('title'), categoria: g('categoria'), start: g('sd') + (g('st') ? 'T' + g('st') : ''), end: fim, local: g('local'), valor: g('valor'), descricao: g('descricao'), programacao: lim, imagens: imgs });
        if (!v.end) delete v.end;
      } else Object.assign(v, { titulo: g('titulo'), duracao: g('duracao'), descricao: g('descricao'), capa, dicas: g('dicas'), imagens: imgs, roteiro: lim });
      const antes = JSON.stringify(D);
      if (!v.id) { v.id = novoId(); D[sec].push(v); } else D[sec] = D[sec].map(x => x.id === v.id ? v : x);
      if (gravar()) { toast('Salvo! Já aparece na página de eventos.'); render(); } else D = JSON.parse(antes);
    };
  }

  /* ---------- Backup ---------- */
  $('#exp').onclick = () => { const l = document.createElement('a'); l.href = URL.createObjectURL(new Blob([JSON.stringify(D)], { type: 'application/json' })); l.download = 'backup-eventos-' + new Date().toISOString().slice(0, 10) + '.json'; l.click(); };
  $('#imp').onchange = (e) => { const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    f.text().then(t => { const j = JSON.parse(t); if (!Array.isArray(j.eventos) || !Array.isArray(j.roteiros)) throw 0; D = j; if (gravar()) { toast('Backup importado.'); render(); } }).catch(() => toast('Arquivo de backup inválido.', false)); };
  $('#rest').onclick = () => { if (confirm('Voltar aos dados de exemplo? Tudo o que foi criado ou alterado será perdido.')) { Dados.restaurar(); D = Dados.carregar(); render(); toast('Dados de exemplo restaurados.'); } };

  entrar(sessionStorage.getItem('semtur_admin') === '1');
})();
