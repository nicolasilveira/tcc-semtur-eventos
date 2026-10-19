/* Carrossel, calendário e detalhes dos eventos */
let cur={y:2026,m:10},cat='Todos';
const dd=s=>{const[a,b,c]=s.split('-');return{d:+c,m:+b-1,y:+a}};
$('trk').innerHTML=EV.map(v=>{const x=dd(v.d);return`<div class="ev" onclick="ev(${v.id})"><div class="pst" style="${art(v.g)}">${v.e}<i>${v.c}</i></div><h4>${v.t}</h4><p>${v.l.split(' e ')[0]} – Currais Novos, RN</p><p class="dt">${String(x.d).padStart(2,'0')} de ${MS[x.m].slice(0,3)} de ${x.y} · ${v.h.split(' ')[0]}</p></div>`}).join('');
const sc=d=>$('trk').scrollBy({left:d*460,behavior:'smooth'});
function chips(){$('chips').innerHTML=['Todos',...Object.keys(CAT)].map(c=>`<button class="${c===cat?'on':''}" onclick="cat='${c}';draw()">${c}</button>`).join('')}
function draw(){chips();const f=EV.filter(v=>cat==='Todos'||v.c===cat);$('mt').textContent=MS[cur.m]+' de '+cur.y;
const first=new Date(cur.y,cur.m,1).getDay(),n=new Date(cur.y,cur.m+1,0).getDate();let h='DSTQQSS'.split('').map(x=>`<b>${x}</b>`).join('');
for(let i=0;i<first;i++)h+='<span></span>';
for(let d=1;d<=n;d++){const es=f.filter(v=>{const x=dd(v.d);return x.d===d&&x.m===cur.m&&x.y===cur.y});const t=cur.m===9&&d===19&&cur.y===2026;
h+=`<div class="dy${es.length?' h':''}${t?' t':''}" ${es.length?`onclick="ev(${es[0].id})"`:''}>${d}<span class="dt2">${es.map(v=>`<s style="background:${CAT[v.c]}"></s>`).join('')}</span></div>`}
$('gd').innerHTML=h;
const cs=cat==='Todos'?Object.keys(CAT):[cat];$('ls').innerHTML=cs.map(c=>{const l=f.filter(v=>v.c===c);return l.length?`<div style="margin-top:14px"><span class="tag" style="background:${CAT[c]}">${c}</span>${l.map(v=>{const x=dd(v.d);return`<div class="li" onclick="ev(${v.id})"><div class="d">${x.d}<small>${MS[x.m].slice(0,3)}</small></div><div><h4>${v.t}</h4><p>${v.h} · ${v.l.split(' e ')[0]}</p></div></div>`}).join('')}</div>`:''}).join('')||'<p>Nenhum evento nesta categoria.</p>'}
const mv=d=>{cur.m+=d;if(cur.m>11){cur.m=0;cur.y++}if(cur.m<0){cur.m=11;cur.y--}draw()};
function ev(id){const v=EV.find(x=>x.id===id),x=dd(v.d);const wd=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'][new Date(x.y,x.m,x.d).getDay()];
$('md').innerHTML=`<button class="x" onclick="cl()">✕</button><div class="bn" style="${art(v.g)}">${v.e}</div><div class="bd"><span class="tag" style="background:${CAT[v.c]}">${v.c}</span><h2>${v.t}</h2><div class="inf"><div><b>📅 Data</b>${wd}, ${x.d} de ${MS[x.m]} de ${x.y}</div><div><b>🕐 Horário</b>${v.h}</div><div><b>📍 Local</b>${v.l}<br><small>${v.end}</small></div><div><b>🎟️ Ingresso</b>${v.p}</div></div><h3 style="font-size:1rem;color:var(--navy)">Sobre o evento</h3><p>${v.desc}</p><h3 style="font-size:1rem;color:var(--navy)">Programação</h3><ul class="pg">${v.prog.map(p=>`<li><b>${p[0]}</b><span>${p[1]}</span></li>`).join('')}</ul><p class="nt">Organização: Secretaria de Desenvolvimento Econômico, Turismo e Inovação · (84) 98762-9337</p></div>`;op()}
draw();
