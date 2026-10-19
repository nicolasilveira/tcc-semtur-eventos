/* Utilidades compartilhadas: modal, acessibilidade, tema */
const $=id=>document.getElementById(id);
const MS=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
$('hoje').textContent='Segunda-Feira, 19 de Outubro de 2026';
const art=(g,e,x='')=>`background:linear-gradient(135deg,${g[0]},${g[1]})`;
const op=()=>{$('ov').classList.add('on');document.body.style.overflow='hidden'},cl=()=>{$('ov').classList.remove('on');document.body.style.overflow=''};
addEventListener('keydown',e=>e.key==='Escape'&&cl());
let fs=16;const fz=d=>{fs=d?Math.min(20,Math.max(13,fs+d)):16;document.documentElement.style.setProperty('--fs',fs+'px')};
const tm=()=>{const r=document.documentElement;r.dataset.theme=r.dataset.theme==='dark'?'light':'dark'};
