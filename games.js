const games = [
  {id:'stars',name:'Cazador de estrellas',category:'Habilidad',icon:'🌟',desc:'Recoge estrellas moviendo tu nave.',run:starGame},
  {id:'colors',name:'Camino de colores',category:'Puzzle',icon:'🟦',desc:'Memoriza y repite secuencias de colores.',run:colorGame},
  {id:'bubbles',name:'Burbuja veloz',category:'Arcade',icon:'🫧',desc:'Atrapa todas las burbujas en 20 segundos.',run:bubbleGame},
  {id:'reaction',name:'Reto relámpago',category:'Habilidad',icon:'⚡',desc:'Pon a prueba tus reflejos cuando cambie la señal.',run:reactionGame},
  {id:'target',name:'Clic de precisión',category:'Arcade',icon:'🎯',desc:'Consigue tantos aciertos como puedas.',run:targetGame},
  {id:'guess',name:'Adivina el número',category:'Puzzle',icon:'🔢',desc:'Encuentra el número secreto con pistas.',run:guessGame},
  {id:'memory',name:'Parejas mágicas',category:'Puzzle',icon:'🧠',desc:'Encuentra las parejas de dibujos iguales.',run:memoryGame},
  {id:'tictactoe',name:'Tres en raya',category:'Puzzle',icon:'⭕',desc:'Juega contra otra persona por turnos.',run:ticTacToeGame},
  {id:'rps',name:'Piedra, papel o tijera',category:'Arcade',icon:'✊',desc:'Elige tu jugada y reta al ordenador.',run:rpsGame},
  {id:'math',name:'Mente matemática',category:'Habilidad',icon:'➕',desc:'Resuelve operaciones antes de que termine el tiempo.',run:mathGame},
  {id:'words',name:'Palabra revuelta',category:'Puzzle',icon:'🔤',desc:'Ordena las letras y descubre la palabra.',run:wordGame},
  {id:'speed',name:'Toques turbo',category:'Arcade',icon:'👆',desc:'Haz tantos toques como puedas en 10 segundos.',run:speedGame}
];
const grid=document.querySelector('#games-grid'),search=document.querySelector('#search'),empty=document.querySelector('#empty'),modal=document.querySelector('#modal'),area=document.querySelector('#game-area');
let filter='Todos',cleanup=()=>{};
const $=(selector)=>area.querySelector(selector);
function render(){
  const q=search.value.toLocaleLowerCase('es');
  const shown=games.filter(g=>(filter==='Todos'||g.category===filter)&&(g.name+' '+g.desc+' '+g.category).toLocaleLowerCase('es').includes(q));
  grid.innerHTML=shown.map(g=>`<article class="game-card"><div class="game-art">${g.icon}</div><div class="game-meta"><span>${g.category}</span><span>Gratis</span></div><h3>${g.name}</h3><p>${g.desc}</p><button class="play" data-game="${g.id}">Jugar ahora →</button></article>`).join('');
  empty.hidden=shown.length>0;
  const count=document.querySelector('#game-count'); if(count)count.textContent=shown.length+' juegos';
}
document.querySelectorAll('.category').forEach(b=>b.addEventListener('click',()=>{
  document.querySelector('.category.active')?.classList.remove('active');b.classList.add('active');filter=b.dataset.filter;render();
}));
search.addEventListener('input',render);
grid.addEventListener('click',e=>{
  const b=e.target.closest('[data-game]');if(!b)return;
  const g=games.find(x=>x.id===b.dataset.game);if(!g)return;
  cleanup();cleanup=()=>{};document.querySelector('#game-title').textContent=g.name;
  document.querySelector('#game-category').textContent=g.category;modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');g.run();
});
function closeGame(){cleanup();cleanup=()=>{};modal.classList.remove('open');modal.setAttribute('aria-hidden','true');area.innerHTML='';}
document.querySelector('#close').addEventListener('click',closeGame);
modal.addEventListener('click',e=>{if(e.target===modal)closeGame();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeGame();});
document.querySelector('#year').textContent=new Date().getFullYear();
function shell(html){area.innerHTML=html;}
function button(text,id='action'){return `<button class="game-btn" id="${id}">${text}</button>`;}
function status(text){const el=$('#status');if(el)el.textContent=text;}
function starGame(){
  shell(`<p>Mueve la nave con ← → o los botones. Recoge las estrellas.</p><div class="game-status" id="score">Puntos: 0</div><div id="starfield" style="height:190px;background:linear-gradient(#101d39,#18294a);border-radius:12px;position:relative;overflow:hidden;font-size:25px"><span id="ship" style="position:absolute;bottom:8px;left:48%;font-size:30px">🚀</span><span id="star" style="position:absolute;top:10px;left:20%">⭐</span></div><div class="touch-controls"><button id="left">←</button><button id="right">→</button></div>${button('Reiniciar','restart')}`);
  let x=48,score=0,y=10,sx=20,keys={};const ship=$('#ship'),star=$('#star');
  const tick=()=>{if(keys.l)x-=2.8;if(keys.r)x+=2.8;x=Math.max(0,Math.min(92,x));y+=2.1;if(y>165){y=0;sx=Math.random()*90;}if(y>145&&Math.abs(x-sx)<11){score++;$('#score').textContent='Puntos: '+score;y=0;sx=Math.random()*90;}ship.style.left=x+'%';star.style.left=sx+'%';star.style.top=y+'px';};
  const timer=setInterval(tick,30),kd=e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.l=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.r=true;},ku=e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.l=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.r=false;};
  document.addEventListener('keydown',kd);document.addEventListener('keyup',ku);
  const bind=(id,key)=>{const el=$('#'+id);el.addEventListener('pointerdown',()=>keys[key]=true);['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,()=>keys[key]=false));};bind('left','l');bind('right','r');
  $('#restart').onclick=()=>{score=0;x=48;y=10;$('#score').textContent='Puntos: 0';};
  cleanup=()=>{clearInterval(timer);document.removeEventListener('keydown',kd);document.removeEventListener('keyup',ku);};
}
function colorGame(){
  shell(`<p>Observa el orden y repítelo tocando los cuatro colores.</p><div class="game-status" id="status">Pulsa empezar</div><div class="color-pad">${[0,1,2,3].map(i=>`<button data-color="${i}" aria-label="Color ${i+1}"></button>`).join('')}</div>${button('Empezar','start')}`);
  let seq=[],pos=0,busy=false,flashTimers=[];const pads=[...area.querySelectorAll('[data-color]')];
  const flash=i=>{pads[i].style.filter='brightness(2)';const t=setTimeout(()=>pads[i].style.filter='',280);flashTimers.push(t);};
  function next(){seq.push(Math.floor(Math.random()*4));pos=0;busy=true;status('Observa la secuencia…');seq.forEach((v,i)=>{const t=setTimeout(()=>{flash(v);if(i===seq.length-1){const t2=setTimeout(()=>{busy=false;status('Tu turno · Nivel '+seq.length);},350);flashTimers.push(t2);}},550*i+450);flashTimers.push(t);});}
  $('#start').onclick=()=>{flashTimers.forEach(clearTimeout);seq=[];next();};
  pads.forEach(p=>p.onclick=()=>{if(busy||!seq.length)return;const v=+p.dataset.color;flash(v);if(v!==seq[pos]){status('Fin de la partida · Nivel alcanzado: '+seq.length);seq=[];return;}if(++pos===seq.length){busy=true;status('¡Muy bien!');const t=setTimeout(next,650);flashTimers.push(t);}});
  cleanup=()=>flashTimers.forEach(clearTimeout);
}
function bubbleGame(){
  shell(`<p>Toca las burbujas antes de que se acabe el tiempo.</p><div class="game-status" id="status">Puntos: 0 · Tiempo: 20</div><div class="bubble-field" id="field"></div>${button('Empezar','start')}`);
  let score=0,time=20,timer=null,spawn=null;const field=$('#field');
  const update=()=>status('Puntos: '+score+' · Tiempo: '+time);
  function make(){const b=document.createElement('button');b.className='bubble';b.style.left=Math.random()*88+'%';b.style.top=Math.random()*72+'%';b.setAttribute('aria-label','Atrapar burbuja');b.onclick=()=>{score++;b.remove();update();};field.append(b);setTimeout(()=>b.remove(),1400);}
  $('#start').onclick=()=>{clearInterval(timer);clearInterval(spawn);score=0;time=20;field.innerHTML='';update();make();spawn=setInterval(make,650);timer=setInterval(()=>{time--;update();if(time<=0){clearInterval(timer);clearInterval(spawn);field.innerHTML='<p>¡Partida terminada! Puntuación: '+score+'</p>'; }},1000);};
  cleanup=()=>{clearInterval(timer);clearInterval(spawn);};
}
function reactionGame(){
  shell(`<p>Pulsa el botón solo cuando se ponga verde. ¡No te adelantes!</p><div class="game-status" id="status">Pulsa empezar y espera…</div><div id="reaction-box" style="padding:38px 10px;border-radius:14px;background:#27334c;font-size:22px;font-weight:800">¿Preparado?</div>${button('Empezar','start')}`);
  let timer=null,start=0,ready=false,done=false;const box=$('#reaction-box');
  $('#start').onclick=()=>{clearTimeout(timer);ready=false;done=false;box.style.background='#27334c';box.textContent='Espera al verde…';status('No pulses todavía');timer=setTimeout(()=>{ready=true;start=Date.now();box.style.background='#167b58';box.textContent='¡AHORA!';},1200+Math.random()*2500);};
  box.onclick=()=>{if(done)return;if(!ready){status('¡Demasiado pronto! Vuelve a empezar.');clearTimeout(timer);done=true;return;}done=true;status('Tu tiempo: '+(Date.now()-start)+' ms');};
  cleanup=()=>clearTimeout(timer);
}
function targetGame(){
  shell(`<p>Haz clic en el círculo tantas veces como puedas en 15 segundos.</p><div class="game-status" id="status">Aciertos: 0 · Tiempo: 15</div><div id="target-field" style="height:210px;position:relative;background:#111d35;border-radius:12px;overflow:hidden"></div>${button('Comenzar','start')}`);
  let score=0,time=15,timer=null;const field=$('#target-field');
  function place(){field.innerHTML='<button id="dot" aria-label="Objetivo" style="position:absolute;left:'+Math.random()*82+'%;top:'+Math.random()*72+'%;width:48px;height:48px;border:0;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,#55e5dc 45%,#756aff);cursor:pointer"></button>';$('#dot').onclick=()=>{score++;status('Aciertos: '+score+' · Tiempo: '+time);place();};}
  $('#start').onclick=()=>{clearInterval(timer);score=0;time=15;place();status('Aciertos: 0 · Tiempo: 15');timer=setInterval(()=>{time--;status('Aciertos: '+score+' · Tiempo: '+time);if(time<=0){clearInterval(timer);field.innerHTML='<p style="padding-top:75px">¡Has conseguido '+score+' aciertos!</p>'; }},1000);};
  cleanup=()=>clearInterval(timer);
}
function guessGame(){
  shell(`<p>He pensado un número del 1 al 50. Escribe tu intento.</p><div class="game-status" id="status">Tienes 7 intentos.</div><input id="guess-input" type="number" min="1" max="50" style="padding:12px;border-radius:9px;width:130px"><br><br>${button('Comprobar','check')}${button('Nueva partida','new')}`);
  let secret=Math.floor(Math.random()*50)+1,left=7,over=false;const input=$('#guess-input');
  function reset(){secret=Math.floor(Math.random()*50)+1;left=7;over=false;input.value='';input.disabled=false;status('Tienes 7 intentos.');}
  $('#check').onclick=()=>{const n=Number(input.value);if(over)return;if(!Number.isInteger(n)||n<1||n>50){status('Escribe un número entre 1 y 50.');return;}left--;if(n===secret){status('¡Correcto! Has encontrado el número.');over=true;}else if(left===0){status('Se acabaron los intentos. Era el '+secret+'.');over=true;}else status((n<secret?'Prueba con uno más alto. ':'Prueba con uno más bajo. ')+'Te quedan '+left+' intentos.');input.value='';};
  $('#new').onclick=reset;
}
function memoryGame(){
  const icons=['🐼','🍉','🚀','🎈','🐸','⭐'];let deck=[...icons,...icons].sort(()=>Math.random()-.5),first=null,lock=false,moves=0,matched=0;
  shell(`<p>Encuentra las seis parejas. Toca dos cartas para descubrirlas.</p><div class="game-status" id="status">Parejas: 0/6 · Intentos: 0</div><div id="memory-grid" style="display:grid;grid-template-columns:repeat(4,minmax(48px,1fr));gap:9px;max-width:430px;margin:15px auto">${deck.map((v,i)=>`<button data-i="${i}" style="height:65px;border:1px solid #435575;border-radius:10px;background:#202d49;color:white;font-size:25px;cursor:pointer">?</button>`).join('')}</div>${button('Reiniciar','restart')}`);
  function reset(){deck=[...icons,...icons].sort(()=>Math.random()-.5);first=null;lock=false;moves=0;matched=0;area.querySelectorAll('[data-i]').forEach((b,i)=>{b.textContent='?';b.disabled=false;b.dataset.value=deck[i];});status('Parejas: 0/6 · Intentos: 0');}
  area.querySelectorAll('[data-i]').forEach((b,i)=>{b.dataset.value=deck[i];b.onclick=()=>{if(lock||b.disabled||b.textContent!=='?')return;b.textContent=deck[i];if(!first){first=b;return;}moves++;if(first.dataset.value===b.dataset.value){first.disabled=true;b.disabled=true;matched++;first=null;status('Parejas: '+matched+'/6 · Intentos: '+moves);if(matched===6)status('¡Has encontrado todas las parejas en '+moves+' intentos!');}else{lock=true;const a=first;first=null;setTimeout(()=>{a.textContent='?';b.textContent='?';lock=false;},650);status('Parejas: '+matched+'/6 · Intentos: '+moves);}};});
  $('#restart').onclick=reset;
}
function ticTacToeGame(){
  shell(`<p>Dos personas en el mismo dispositivo. Gana quien consiga tres en línea.</p><div class="game-status" id="status">Turno de X</div><div id="board" style="display:grid;grid-template-columns:repeat(3,82px);gap:8px;justify-content:center;margin:16px auto">${Array.from({length:9},(_,i)=>`<button data-cell="${i}" style="height:82px;border:1px solid #435575;border-radius:12px;background:#202d49;color:#5ce5dc;font-size:34px;font-weight:800;cursor:pointer"></button>`).join('')}</div>${button('Nueva partida','restart')}`);
  let cells=Array(9).fill(''),turn='X',over=false;const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function reset(){cells.fill('');turn='X';over=false;area.querySelectorAll('[data-cell]').forEach(b=>b.textContent='');status('Turno de X');}
  area.querySelectorAll('[data-cell]').forEach(b=>b.onclick=()=>{const i=+b.dataset.cell;if(over||cells[i])return;cells[i]=turn;b.textContent=turn;b.style.color=turn==='X'?'#5ce5dc':'#b69aff';if(wins.some(line=>line.every(n=>cells[n]===turn))){status('¡Gana '+turn+'!');over=true;}else if(cells.every(Boolean)){status('¡Empate!');over=true;}else{turn=turn==='X'?'O':'X';status('Turno de '+turn);}});
  $('#restart').onclick=reset;
}
function rpsGame(){
  shell(`<p>Elige una opción para jugar contra el ordenador.</p><div class="game-status" id="status">Marcador: 0 - 0</div><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">${['Piedra','Papel','Tijera'].map((v,i)=>`<button class="game-btn" data-choice="${v}">${['✊','✋','✌️'][i]} ${v}</button>`).join('')}</div><p id="result">¡Que empiece el juego!</p>${button('Reiniciar marcador','restart')}`);
  let me=0,pc=0;const choices=['Piedra','Papel','Tijera'];
  area.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>{const a=b.dataset.choice,c=choices[Math.floor(Math.random()*3)];let msg='Empate: '+a+' contra '+c+'.';if((a==='Piedra'&&c==='Tijera')||(a==='Papel'&&c==='Piedra')||(a==='Tijera'&&c==='Papel')){me++;msg='¡Punto para ti! '+a+' gana a '+c+'.';}else if(a!==c){pc++;msg='Punto para el ordenador: '+c+' gana a '+a+'.';}$('#result').textContent=msg;status('Marcador: '+me+' - '+pc);});
  $('#restart').onclick=()=>{me=0;pc=0;status('Marcador: 0 - 0');$('#result').textContent='¡Que empiece el juego!';};
}
function mathGame(){
  shell(`<p>Resuelve tantas operaciones como puedas en 30 segundos.</p><div class="game-status" id="status">Puntos: 0 · Tiempo: 30</div><div id="question" style="font-size:34px;font-weight:800;margin:20px"></div><input id="answer" type="number" inputmode="numeric" style="padding:12px;border-radius:9px;width:130px" aria-label="Respuesta"><br><br>${button('Responder','check')}`);
  let score=0,time=30,a,b,op,answer,timer;const input=$('#answer');
  function question(){a=1+Math.floor(Math.random()*12);b=1+Math.floor(Math.random()*12);op=Math.random()<.5?'+':'−';if(op==='−'&&b>a)[a,b]=[b,a];answer=op==='+'?a+b:a-b;$('#question').textContent=a+' '+op+' '+b+' = ?';input.value='';input.focus();}
  $('#check').onclick=()=>{if(time<=0)return;if(Number(input.value)===answer){score++;status('¡Correcto! Puntos: '+score+' · Tiempo: '+time);}else status('Prueba otra vez · Puntos: '+score+' · Tiempo: '+time);question();};
  question();timer=setInterval(()=>{time--;if(time<=0){clearInterval(timer);status('¡Tiempo! Puntuación final: '+score);$('#question').textContent='¡Buen trabajo!';}else if(time%5===0)status('Puntos: '+score+' · Tiempo: '+time);},1000);
  cleanup=()=>clearInterval(timer);
}
function wordGame(){
  const words=['PLANETA','MARIPOSA','GUITARRA','VENTANA','ELEFANTE','BICICLETA','ESTRELLA','CHOCOLATE'];let word='',scrambled='',score=0;
  shell(`<p>Ordena las letras para descubrir la palabra.</p><div class="game-status" id="status">Puntos: 0</div><div id="scramble" style="font-size:30px;letter-spacing:6px;font-weight:800;margin:20px"></div><input id="word-input" type="text" maxlength="12" style="padding:12px;border-radius:9px;text-transform:uppercase" aria-label="Tu respuesta"><br><br>${button('Comprobar','check')}${button('Otra palabra','next')}`);
  function next(){word=words[Math.floor(Math.random()*words.length)];do{scrambled=word.split('').sort(()=>Math.random()-.5).join('');}while(scrambled===word);$('#scramble').textContent=scrambled;$('#word-input').value='';}
  $('#check').onclick=()=>{if($('#word-input').value.trim().toUpperCase()===word){score++;status('¡Correcto! Puntos: '+score);next();}else status('No es esa. ¡Vuelve a probar!');};
  $('#next').onclick=next;next();
}
function speedGame(){
  shell(`<p>Cuando empiece, pulsa el botón tan rápido como puedas durante 10 segundos.</p><div class="game-status" id="status">Toques: 0 · Tiempo: 10</div><button id="tap" disabled style="width:170px;height:120px;border:0;border-radius:20px;background:#263c60;color:white;font-size:23px;font-weight:800;cursor:pointer">¡TOCA!</button><br><br>${button('Empezar','start')}`);
  let score=0,time=10,timer=null;const tap=$('#tap');
  $('#start').onclick=()=>{clearInterval(timer);score=0;time=10;tap.disabled=false;status('Toques: 0 · Tiempo: 10');timer=setInterval(()=>{time--;status('Toques: '+score+' · Tiempo: '+time);if(time<=0){clearInterval(timer);tap.disabled=true;status('¡Fin! Has conseguido '+score+' toques.');}},1000);};
  tap.onclick=()=>{if(!tap.disabled){score++;status('Toques: '+score+' · Tiempo: '+time);}};
  cleanup=()=>clearInterval(timer);
}
render();
