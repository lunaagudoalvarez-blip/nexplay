const games = [
{id:'speed-race',name:'Speed Race',category:'Carreras',desc:'Esquiva el tráfico y supera tu récord.',art:'SPEED RACE',mode:'race'},
{id:'drift-city',name:'Drift City',category:'Carreras',desc:'Encadena derrapes y evita los conos.',art:'DRIFT CITY',mode:'race'},
{id:'highway-rush',name:'Highway Rush',category:'Carreras',desc:'Cambia de carril para sobrevivir al tráfico.',art:'HIGHWAY',mode:'dodge'},
{id:'stickman-fighter',name:'Stickman Fighter',category:'Acción',desc:'Golpea los objetivos antes de que desaparezcan.',art:'FIGHT ARENA',mode:'targets'},
{id:'zombie-survival',name:'Zombie Survival',category:'Acción',desc:'Defiende tu zona y consigue la máxima puntuación.',art:'SURVIVAL',mode:'targets'},
{id:'laser-dodge',name:'Laser Dodge',category:'Acción',desc:'Esquiva los láseres y aguanta todo lo posible.',art:'LASER DODGE',mode:'dodge'},
{id:'block-puzzle',name:'Block Puzzle',category:'Puzles',desc:'Completa líneas y despeja el tablero.',art:'BLOCK PUZZLE',mode:'blocks'},
{id:'match-3-deluxe',name:'Match 3 Deluxe',category:'Puzles',desc:'Encuentra parejas y combina piezas.',art:'MATCH 3',mode:'memory'},
{id:'gridlock',name:'Gridlock',category:'Puzles',desc:'Resuelve el tablero con movimientos precisos.',art:'GRIDLOCK',mode:'memory'},
{id:'number-merge',name:'Number Merge',category:'Puzles',desc:'Combina números iguales para subir de nivel.',art:'NUMBER MERGE',mode:'merge'},
{id:'penalty-shooters',name:'Penalty Shooters',category:'Deportes',desc:'Elige el lado y supera al portero.',art:'PENALTY',mode:'penalty'},
{id:'goalkeeper-pro',name:'Goalkeeper Pro',category:'Deportes',desc:'Lee el disparo y detén los penaltis.',art:'GOALKEEPER',mode:'penalty'},
{id:'8-ball-pool',name:'8 Ball Pool',category:'Deportes',desc:'Calcula el tiro y consigue puntos.',art:'8 BALL POOL',mode:'pool'},
{id:'nex-platform-100',name:'Nex Platform: 100 niveles',category:'Aventuras',desc:'Una aventura de plataformas 2D original con 100 niveles diferentes, monedas y obstáculos.',art:'NEX 100',mode:'platformer'},
{id:'three-stones',name:'Tres Fichas',category:'Multijugador',desc:'Coloca tres fichas y después muévelas por el tablero para formar una línea.',art:'3 STONES',mode:'morris'},
{id:'jump-adventure',name:'Jump Adventure',category:'Aventuras',desc:'Salta entre plataformas y alcanza la meta.',art:'JUMP QUEST',mode:'jump'},
{id:'maze-runner',name:'Maze Runner',category:'Aventuras',desc:'Encuentra la salida del laberinto.',art:'MAZE RUNNER',mode:'maze'},

{id:'bubble-shooter',name:'Bubble Shooter',category:'Arcade',desc:'Apunta a los objetivos y suma puntos.',art:'BUBBLE',mode:'targets'},
{id:'neon-breaker',name:'Neon Breaker',category:'Arcade',desc:'Rompe todos los bloques con tus lanzamientos.',art:'BREAKER',mode:'breaker'},
{id:'snake-arena',name:'Snake Arena',category:'Arcade',desc:'Guía la serpiente y recoge energía.',art:'SNAKE ARENA',mode:'snake'},
{id:'tower-defense',name:'Tower Defense',category:'Estrategia',desc:'Coloca defensas y detén las oleadas.',art:'DEFENSE',mode:'defense'},
{id:'parking-master',name:'Parking Master',category:'Habilidad',desc:'Aparca con precisión en el menor número de maniobras.',art:'PARKING',mode:'parking'},
{id:'color-reflex',name:'Color Reflex',category:'Habilidad',desc:'Reacciona cuando aparezca el color indicado.',art:'REFLEX',mode:'reaction'},
{id:'math-rush',name:'Math Rush',category:'Habilidad',desc:'Resuelve operaciones contra el cronómetro.',art:'MATH RUSH',mode:'math'},

];
const grid=document.querySelector('#games-grid'),search=document.querySelector('#search'),empty=document.querySelector('#empty'),modal=document.querySelector('#modal'),area=document.querySelector('#game-area');
const STORE='nexplay-player-v2';
let state={favorites:[],votes:{}};try{state=Object.assign(state,JSON.parse(localStorage.getItem(STORE)||'{}'));}catch(e){}
let filter='Todos',cleanup=()=>{},current=null;const $=s=>area.querySelector(s);
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){}}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderHome(){const recent=JSON.parse(localStorage.getItem('nexplay-recent-v1')||'[]');const list=recent.map(id=>games.find(g=>g.id===id)).filter(Boolean).slice(0,10);const items=list.length?list:games.slice(0,10);const row=document.querySelector('#continue-row');if(row)row.innerHTML=items.map(g=>'<button class="continue-card" data-home-game="'+g.id+'" style="--card-art:'+homeColor(g.id)+'"><strong>'+safe(g.name)+'</strong></button>').join('');const mini=document.querySelector('#feature-mini-grid');if(mini)mini.innerHTML=games.filter(g=>g.id!=='snake-arena').slice(0,4).map(g=>'<button class="feature-mini" data-home-game="'+g.id+'"><strong>'+safe(g.name)+'</strong></button>').join('');}
function homeColor(id){const colors=['linear-gradient(135deg,#2b8da5,#25235d)','linear-gradient(135deg,#b04c37,#3a1c4f)','linear-gradient(135deg,#8c9c35,#203c4e)','linear-gradient(135deg,#1e8c73,#172d55)','linear-gradient(135deg,#3b55a4,#7138a8)'];return colors[Math.abs(id.split('').reduce((a,c)=>a+c.charCodeAt(0),0))%colors.length];}
document.querySelector('#continue-row')?.addEventListener('click',e=>{const b=e.target.closest('[data-home-game]');if(b)openGame(games.find(g=>g.id===b.dataset.homeGame));});
document.querySelector('#feature-mini-grid')?.addEventListener('click',e=>{const b=e.target.closest('[data-home-game]');if(b)openGame(games.find(g=>g.id===b.dataset.homeGame));});
document.querySelector('#feature-main')?.addEventListener('click',()=>openGame(games.find(g=>g.id==='snake-arena')));
document.querySelector('#saved-shortcut')?.addEventListener('click',()=>{filter='Favoritos';render();document.querySelector('#juegos').scrollIntoView({behavior:'smooth'});});
document.querySelector('#friends-shortcut')?.addEventListener('click',()=>alert('La función de amigos estará disponible cuando conectemos las cuentas de NexPlay.'));
document.querySelector('#notifications-shortcut')?.addEventListener('click',()=>alert('No tienes notificaciones nuevas.'));
document.querySelector('#menu-toggle')?.addEventListener('click',()=>document.querySelector('.arcade-sidebar')?.classList.toggle('sidebar-open'));
function render(){const q=(search.value||'').toLocaleLowerCase('es');const shown=games.filter(g=>(filter==='Todos'||(filter==='Favoritos'?state.favorites.includes(g.id):g.category===filter))&&(g.name+' '+g.desc+' '+g.category).toLocaleLowerCase('es').includes(q));grid.innerHTML=shown.map((g,i)=>'<article class="game-card card-'+g.id+'"><div class="game-art art-'+g.id+'"><span class="art-label">'+safe(g.art)+'</span><span class="art-number">Nº '+String(i+1).padStart(2,'0')+'</span><span class="art-scene" aria-hidden="true"></span></div><div class="game-info"><div class="game-meta"><span>'+safe(g.category)+'</span><span>GRATIS</span></div><h3>'+safe(g.name)+'</h3><button class="play" data-game="'+g.id+'">Jugar ahora →</button><div class="card-actions"><button data-vote="like" data-id="'+g.id+'">👍 Me gusta</button><button data-fav="'+g.id+'" class="'+(state.favorites.includes(g.id)?'active':'')+'">'+(state.favorites.includes(g.id)?'♥ Guardado':'♡ Favorito')+'</button></div></div></article>').join('');empty.hidden=shown.length>0;document.querySelector('#game-count').textContent=shown.length+' juegos';}
function toggleFavorite(id){state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):state.favorites.concat(id);save();render();if(current&&current.id===id)syncTools();}
document.querySelectorAll('.category').forEach(b=>b.addEventListener('click',()=>{document.querySelector('.category.active')?.classList.remove('active');b.classList.add('active');filter=b.dataset.filter;render();}));
document.querySelector('#favorites-link')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('.category.active')?.classList.remove('active');filter='Favoritos';render();document.querySelector('#juegos').scrollIntoView({behavior:'smooth'});});
document.querySelector('#favorites-side')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('.category.active')?.classList.remove('active');filter='Favoritos';render();document.querySelector('#juegos').scrollIntoView({behavior:'smooth'});});
search.addEventListener('input',render);
renderHome();
grid.addEventListener('click',e=>{const playBtn=e.target.closest('[data-game]');const fav=e.target.closest('[data-fav]');const vote=e.target.closest('[data-vote]');if(playBtn)openGame(games.find(g=>g.id===playBtn.dataset.game));if(fav)toggleFavorite(fav.dataset.fav);if(vote){state.votes[vote.dataset.id]='like';save();vote.textContent='👍 Te gusta';vote.classList.add('active');}});
function syncTools(){if(!current)return;const v=state.votes[current.id]||'';const fav=state.favorites.includes(current.id);document.querySelector('#like-game').classList.toggle('active',v==='like');document.querySelector('#dislike-game').classList.toggle('dislike-active',v==='dislike');document.querySelector('#favorite-game').classList.toggle('active',fav);document.querySelector('#favorite-game').innerHTML=(fav?'♥':'♡')+' <span>'+(fav?'Guardado':'Favorito')+'</span>';document.querySelector('#like-count').textContent=v==='like'?'1':'0';document.querySelector('#dislike-count').textContent=v==='dislike'?'1':'0';}

const COMMENT_STORE='nexplay-comments-v1';
let commentData={};try{commentData=JSON.parse(localStorage.getItem(COMMENT_STORE)||'{}')||{};}catch(e){}
const playGuides={
 platformer:'Completa los 100 niveles de esta aventura 2D original. Muévete con A/D o las flechas, salta con espacio y recoge monedas. Llega a la puerta de salida para desbloquear el siguiente nivel.',
 morris:'Juegan dos personas por turnos. Cada una coloca tres fichas en casillas vacías. Cuando las seis estén colocadas, mueve una de tus fichas a una casilla vecina libre. Gana quien consiga alinear sus tres fichas en horizontal, vertical o diagonal. Si juegas online, aún hace falta activar un servidor de partidas.',
 race:'Objetivo: avanza y evita los obstáculos. Cambia de carril para esquivarlos y consigue tantos puntos como puedas antes de que termine el tiempo.',
 dodge:'Muévete entre los carriles para esquivar los obstáculos. Cada movimiento correcto suma puntos; evita chocar.',
 jump:'Usa los controles de dirección para moverte y superar los obstáculos. Calcula tus movimientos para llegar al objetivo.',
 targets:'Haz clic o toca el objetivo cada vez que aparezca en una nueva posición. Cuantos más aciertos consigas, más puntos sumarás.',
 blocks:'Selecciona las piezas del tablero para completar el reto y acumular puntos antes de que se agote el tiempo.',
 memory:'Voltea dos cartas cada vez. Encuentra las parejas iguales para sumar puntos.',
 penalty:'Elige hacia qué esquina lanzar. Si el portero se mueve a otra dirección, marcas y consigues puntos.',
 pool:'Pulsa el botón para golpear la bola e intenta encajarla. Cada acierto aumenta tu puntuación.',
 parking:'Usa las flechas para mover el coche. Llévalo hasta la plaza marcada sin salirte del recorrido.',
 maze:'Encuentra el camino hasta la salida. Puedes usar las flechas del teclado o tocar las casillas disponibles.',
 reaction:'Espera a que el botón cambie a verde y púlsalo lo más rápido posible. Si te adelantas, tendrás que intentarlo de nuevo.',
 math:'Resuelve cada suma eligiendo la respuesta correcta. Las respuestas acertadas te dan puntos.',
 word:'Descifra las letras, escribe la palabra correcta y pulsa Comprobar para avanzar.',
 snake:'Mueve la ficha por el tablero con los controles o las flechas. Cada movimiento suma puntos.',
 breaker:'Pulsa Lanzar bola para romper los bloques. Elimina todos los bloques para completar el nivel.',
 merge:'Selecciona fichas iguales que estén juntas para combinarlas y crear valores mayores.',
 defense:'Activa la defensa para detener las oleadas y proteger la base.'
};
function renderComments(){
 if(!current)return;
 const list=document.querySelector('#comment-list');if(!list)return;
 const items=commentData[current.id]||[];
 list.innerHTML=items.length?items.slice().reverse().map(item=>'<article class="comment-item"><strong>'+safe(item.name)+'</strong><p>'+safe(item.text)+'</p><time>'+safe(item.date)+'</time></article>').join(''):'<p class="no-comments">Todavía no hay comentarios. ¡Sé el primero!</p>';
}
function renderRecommendations(){
 const box=document.querySelector('#game-recommendations');if(!box||!current)return;
 const picks=games.filter(g=>g.id!==current.id).sort((a,b)=>(b.category===current.category)-(a.category===current.category)).slice(0,4);
 box.innerHTML=picks.map(g=>'<button type="button" class="recommendation" data-recommend="'+g.id+'"><span class="recommendation-art">'+safe(g.art.slice(0,3))+'</span><span>'+safe(g.name)+'</span></button>').join('');
}
document.querySelector('#comment-form')?.addEventListener('submit',e=>{
 e.preventDefault();if(!current)return;
 const input=document.querySelector('#comment-text'),name=document.querySelector('#comment-name');
 const value=input.value.trim();if(!value)return;
 const entries=commentData[current.id]||(commentData[current.id]=[]);
 entries.push({name:(name.value.trim()||'Jugador').slice(0,24),text:value.slice(0,500),date:new Date().toLocaleString('es-ES')});
 try{localStorage.setItem(COMMENT_STORE,JSON.stringify(commentData));}catch(err){}
 input.value='';renderComments();
});
document.querySelector('#game-recommendations')?.addEventListener('click',e=>{
 const btn=e.target.closest('[data-recommend]');if(btn)openGame(games.find(g=>g.id===btn.dataset.recommend));
});

function openGame(g){
 const recent=JSON.parse(localStorage.getItem('nexplay-recent-v1')||'[]').filter(id=>id!==g.id);recent.unshift(g.id);localStorage.setItem('nexplay-recent-v1',JSON.stringify(recent.slice(0,12)));renderHome();if(!g)return;cleanup();cleanup=()=>{};current=g;document.querySelector('#game-title').textContent=g.name;document.querySelector('#game-category').textContent=g.category.toUpperCase()+' · NEXPLAY ORIGINAL';modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';syncTools();document.querySelector('#how-to-play').textContent=playGuides[g.mode]||g.desc+' Sigue las indicaciones de la partida y consigue la mejor puntuación.';document.querySelector('#game-controls-note').textContent='Controles: ratón o pantalla táctil. Si el juego muestra flechas, también puedes usar las teclas de dirección.';renderRecommendations();renderComments();play(g);}
function closeGame(){cleanup();cleanup=()=>{};modal.classList.remove('open');modal.setAttribute('aria-hidden','true');area.innerHTML='';document.body.style.overflow='';current=null;}
document.querySelector('#close').addEventListener('click',closeGame);modal.addEventListener('click',e=>{if(e.target===modal)closeGame();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeGame();});
document.querySelector('#like-game').addEventListener('click',()=>{if(!current)return;state.votes[current.id]=state.votes[current.id]==='like'?'':'like';save();syncTools();});
document.querySelector('#dislike-game').addEventListener('click',()=>{if(!current)return;state.votes[current.id]=state.votes[current.id]==='dislike'?'':'dislike';save();syncTools();});
document.querySelector('#favorite-game').addEventListener('click',()=>{if(current)toggleFavorite(current.id);});
document.querySelector('#fullscreen-game').addEventListener('click',async()=>{try{if(!document.fullscreenElement)await modal.requestFullscreen();else await document.exitFullscreen();}catch(e){document.querySelector('#fullscreen-game').textContent='Pantalla completa no disponible';}});
document.querySelector('#google-login').addEventListener('click',()=>{alert('El acceso con Google necesita configurar un proyecto OAuth de Google y autorizar el dominio de NexPlay. Todavía no está activado. Puedes jugar como invitado; tus favoritos y votos se guardan en este navegador.');});
function play(g){
 let score=0,seconds=45,timer=null,active=false,first=null,position=1,stepCount=0;
 area.innerHTML='<p>'+safe(g.desc)+' Completa el reto y supera tu mejor puntuación.</p><div class="game-status" id="status">Puntos: 0 · Tiempo: 45</div><div class="challenge-board" id="board"></div><button class="game-action" id="start">Empezar partida</button>';
 const board=$('#board');
 function status(){const el=$('#status');if(el)el.textContent='Puntos: '+score+' · Tiempo: '+seconds;}
 function stop(msg){active=false;clearInterval(timer);status();const el=$('#status');if(el)el.textContent=msg+' · Puntuación final: '+score;const b=$('#start');if(b)b.textContent='Jugar otra vez';}
 function begin(){score=0;seconds=45;active=true;clearInterval(timer);timer=setInterval(()=>{seconds--;status();if(seconds<=0)stop('Tiempo terminado');},1000);status();}
 function buttonGrid(items,cols){board.innerHTML='<div class="challenge-grid" style="grid-template-columns:repeat('+cols+',minmax(0,1fr))">'+items.map((x,i)=>'<button data-i="'+i+'">'+x+'</button>').join('')+'</div>';return [...board.querySelectorAll('button')];}
 function start(){begin();stepCount=0;position=1;first=null;
 if(g.mode==='targets'||g.mode==='defense'){board.innerHTML='<div class="arena-scene"><div class="arena-ground"></div><button class="arena-object target" id="target" style="width:76px;height:76px;left:45%;top:35%">HIT</button></div><p>Haz clic en el objetivo tantas veces como puedas.</p>';const hit=()=>{if(!active)return;score+=10;const t=$('#target');t.style.left=(5+Math.random()*82)+'%';t.style.top=(8+Math.random()*65)+'%';t.style.width=(58+Math.random()*30)+'px';t.style.height=t.style.width;status();};$('#target').onclick=hit;
 }else if(g.mode==='race'||g.mode==='dodge'||g.mode==='jump'){let lane=1,obstacle=2;board.innerHTML='<div class="arena-scene"><div class="arena-ground"></div><div class="arena-object" id="racer" style="width:65px;height:90px;bottom:28%;left:calc(50% - 32px)">CAR</div><div class="arena-object target" id="hazard" style="width:48px;height:48px;top:18%;left:68%">!</div></div><p>Usa izquierda y derecha para cambiar de carril y evitar los obstáculos.</p><div class="arena-controls"><button class="game-action" id="left">← Izquierda</button><button class="game-action" id="right">Derecha →</button></div>';function move(d){if(!active)return;lane=Math.max(0,Math.min(2,lane+d));const racer=$('#racer');racer.style.left=['18%','calc(50% - 32px)','78%'][lane];const hazard=$('#hazard');const hz=Math.floor(Math.random()*3);hazard.style.left=['18%','50%','78%'][hz];hazard.style.top=(10+Math.random()*55)+'%';if(lane===hz){score=Math.max(0,score-5);hazard.textContent='X';}else{score+=8;hazard.textContent='+';}status();}$('#left').onclick=()=>move(-1);$('#right').onclick=()=>move(1);
 }else if(g.mode==='blocks'||g.mode==='memory'){const values=g.mode==='memory'?['A','B','C','D','A','B','C','D','E','F','E','F','G','H','G','H']:Array.from({length:16},(_,i)=>String((i%4)+1));const shuffled=values.sort(()=>Math.random()-.5);const btns=buttonGrid(shuffled,4);let chosen=null;btns.forEach(b=>b.onclick=()=>{if(!active||b.disabled)return;if(g.mode==='blocks'){b.disabled=true;b.classList.add('matched');score+=5;}else if(!chosen){chosen=b;b.classList.add('selected');}else{if(chosen.textContent===b.textContent){chosen.disabled=b.disabled=true;chosen.classList.add('matched');b.classList.add('matched');score+=20;}else{chosen.classList.remove('selected');score=Math.max(0,score-1);}chosen=null;}status();});
 }else if(g.mode==='penalty'){board.innerHTML='<div class="arena-scene" style="min-height:38vh;background:linear-gradient(#174a78,#1c765b)"><div class="arena-object" style="width:190px;height:95px;top:12%;left:calc(50% - 95px);background:transparent;border:8px solid white;border-bottom:0">GOAL</div><div class="arena-object target" id="ball" style="width:45px;height:45px;left:calc(50% - 22px);bottom:18%">●</div></div><p>Selecciona una esquina para chutar. El portero intentará adivinarla.</p>';const controls=document.createElement('div');controls.className='arena-controls';controls.innerHTML='<button class="game-action" data-shot="0">Izquierda</button><button class="game-action" data-shot="1">Centro</button><button class="game-action" data-shot="2">Derecha</button>';board.append(controls);controls.querySelectorAll('button').forEach(b=>b.onclick=()=>{if(!active)return;const goalie=Math.floor(Math.random()*3);const ball=$('#ball');ball.style.left=['18%','calc(50% - 22px)','78%'][+b.dataset.shot];if(+b.dataset.shot!==goalie){score+=15;ball.textContent='GOOL';}else{ball.textContent='PARADA';score=Math.max(0,score-2);}status();});
 }else if(g.mode==='pool'){board.innerHTML='<div class="arena-scene" style="min-height:38vh;background:linear-gradient(135deg,#11634e,#073b36);border:12px solid #8e643d"><div class="arena-object target" style="width:55px;height:55px;left:25%;top:35%;background:#111">8</div><div class="arena-object target" style="width:40px;height:40px;right:22%;top:25%">●</div><div class="arena-object target" style="width:40px;height:40px;right:35%;bottom:22%">●</div></div><button class="game-action" id="shoot">Golpear bola</button><p id="poolmsg">Prepara tu tiro.</p>';$('#shoot').onclick=()=>{if(!active)return;const ok=Math.random()>.3;score+=ok?12:0;$('#poolmsg').textContent=ok?'¡Bola encajada!':'La bola no entró. Prueba otro tiro.';status();};
 }else if(g.mode==='parking'){board.innerHTML='<div class="arena-scene"><div class="arena-ground"></div><div class="arena-object" id="car" style="width:85px;height:48px;left:12%;bottom:32%">CAR</div><div class="arena-object" style="width:100px;height:65px;right:12%;bottom:28%;background:#1d9d78">PARK</div></div><p>Maniobra el coche hasta la plaza de aparcamiento.</p><div class="arena-controls"><button class="game-action" data-dir="left">←</button><button class="game-action" data-dir="up">↑</button><button class="game-action" data-dir="right">→</button><button class="game-action" data-dir="down">↓</button></div>';let x=12,y=60;board.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{if(!active)return;const d=b.dataset.dir;if(d==='left')x-=7;if(d==='right')x+=7;if(d==='up')y-=7;if(d==='down')y+=7;x=Math.max(0,Math.min(85,x));y=Math.max(25,Math.min(80,y));$('#car').style.left=x+'%';$('#car').style.bottom=y+'%';score+=2;if(x>72&&y<48)stop('Aparcamiento perfecto');else status();});
 }else if(g.mode==='maze'){let p=0;const cells=buttonGrid(Array.from({length:16},(_,i)=>i===0?'START':i===15?'EXIT':'·'),4);const walls=new Set([1,2,6,9,13]);function draw(){cells.forEach((b,i)=>{b.textContent=i===p?'YOU':i===15?'EXIT':walls.has(i)?'■':'·';b.classList.toggle('matched',i===p);});}function step(d){if(!active)return;const n=p+d;if(n<0||n>15||(d===1&&p%4===3)||(d===-1&&p%4===0)||walls.has(n))return;p=n;score+=2;draw();status();if(p===15)stop('¡Has escapado!');}cells.forEach((b,i)=>b.onclick=()=>step(i-p));const key=e=>{if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowUp')step(-4);if(e.key==='ArrowDown')step(4);};document.addEventListener('keydown',key);cleanup=()=>{clearInterval(timer);document.removeEventListener('keydown',key);};draw();
 }else if(g.mode==='reaction'){board.innerHTML='<div class="arena-scene" style="min-height:35vh;display:grid;place-items:center"><button id="react" class="arena-object" style="position:relative;width:190px;height:110px">ESPERA...</button></div><p id="reactmsg">Pulsa cuando el botón se vuelva verde.</p>';let ready=false,delay=setTimeout(()=>{ready=true;$('#react').style.background='linear-gradient(135deg,#21d59b,#087d67)';$('#react').textContent='¡AHORA!';},1200+Math.random()*2500);$('#react').onclick=()=>{if(!active)return;if(!ready){clearTimeout(delay);$('#reactmsg').textContent='Demasiado pronto. Inténtalo otra vez.';score=Math.max(0,score-3);}else{score+=25;$('#reactmsg').textContent='¡Buena reacción! +25';ready=false;$('#react').style.background='linear-gradient(135deg,#56e7f3,#3157bb)';$('#react').textContent='ESPERA...';delay=setTimeout(()=>{ready=true;$('#react').style.background='linear-gradient(135deg,#21d59b,#087d67)';$('#react').textContent='¡AHORA!';},900+Math.random()*2200);}status();};cleanup=()=>{clearInterval(timer);clearTimeout(delay);};
 }else if(g.mode==='math'){let answer=0;board.innerHTML='<div class="arena-scene" style="min-height:32vh;display:grid;place-items:center"><div><div id="sum" style="font:900 clamp(35px,7vw,70px) Space Grotesk">5 + 3 = ?</div><div id="answers" class="arena-controls"></div></div></div>';function question(){const a=1+Math.floor(Math.random()*12),b=1+Math.floor(Math.random()*12);answer=a+b;$('#sum').textContent=a+' + '+b+' = ?';const opts=[answer,answer+2,answer-1,answer+4].sort(()=>Math.random()-.5);$('#answers').innerHTML=opts.map(n=>'<button class="game-action" data-answer="'+n+'">'+n+'</button>').join('');$('#answers').querySelectorAll('button').forEach(btn=>btn.onclick=()=>{if(!active)return;if(+btn.dataset.answer===answer)score+=12;else score=Math.max(0,score-3);question();status();});}question();
 }else if(g.mode==='word'){const words=['PLANETA','CARRERA','NEXPLAY','AVENTURA','ESTRELLA'];let word=words[Math.floor(Math.random()*words.length)];function scramble(w){return w.split('').sort(()=>Math.random()-.5).join('');}board.innerHTML='<p>Ordena las letras para formar la palabra.</p><div class="game-status" id="scramble" style="font-size:30px;letter-spacing:8px"></div><input id="wordinput" placeholder="Escribe la palabra" autocomplete="off"><button id="checkword" class="game-action">Comprobar</button><p id="wordmsg"></p>';function next(){word=words[Math.floor(Math.random()*words.length)];$('#scramble').textContent=scramble(word);$('#wordinput').value='';}next();$('#checkword').onclick=()=>{if(!active)return;if($('#wordinput').value.trim().toUpperCase()===word){score+=20;$('#wordmsg').textContent='¡Correcto!';}else $('#wordmsg').textContent='Prueba otra vez.';next();status();};
 }else if(g.mode==='snake'){
 const W=16,H=12;let body=[{x:5,y:6},{x:4,y:6},{x:3,y:6}],dir={x:1,y:0},nextDir={x:1,y:0},food={x:10,y:6},snakeTimer=null;
 board.innerHTML='<div class="snake-hud">Come energía y evita chocar contigo mismo o con los bordes.</div><div id="snake-board" class="snake-board"></div><div class="arena-controls"><button class="game-action" id="snleft">←</button><button class="game-action" id="snup">↑</button><button class="game-action" id="sndown">↓</button><button class="game-action" id="snright">→</button></div>';
 const sb=$('#snake-board');
 function paint(){sb.innerHTML='';for(let y=0;y<H;y++)for(let x=0;x<W;x++){const cell=document.createElement('i');cell.className='snake-cell';if(body.some(p=>p.x===x&&p.y===y))cell.classList.add('snake-body');if(body[0].x===x&&body[0].y===y)cell.classList.add('snake-head');if(food.x===x&&food.y===y)cell.classList.add('snake-food');sb.append(cell);}}
 function turn(x,y){if(x!==-dir.x||y!==-dir.y)nextDir={x,y};}
 function tick(){if(!active)return;dir=nextDir;const head={x:body[0].x+dir.x,y:body[0].y+dir.y};if(head.x<0||head.x>=W||head.y<0||head.y>=H||body.some(p=>p.x===head.x&&p.y===head.y)){stop('¡Fin de la partida!');return;}body.unshift(head);if(head.x===food.x&&head.y===food.y){score+=10;let free=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(!body.some(p=>p.x===x&&p.y===y))free.push({x,y});food=free[Math.floor(Math.random()*free.length)]||{x:0,y:0};}else body.pop();paint();status();}
 [['snleft',-1,0],['snup',0,-1],['sndown',0,1],['snright',1,0]].forEach(([id,x,y])=>$('#'+id).onclick=()=>turn(x,y));
 const key=e=>{const map={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};if(map[e.key]){e.preventDefault();turn(...map[e.key]);}};document.addEventListener('keydown',key);snakeTimer=setInterval(tick,170);paint();cleanup=()=>{clearInterval(timer);clearInterval(snakeTimer);document.removeEventListener('keydown',key);};
 }else if(g.mode==='morris'){
 clearInterval(timer);
 let cells=Array(9).fill(''),player='X',placed={X:0,O:0},selected=-1,finished=false;
 const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 board.innerHTML='<div class="morris-score"><b id="turn-label">Turno: X</b><span id="morris-phase">Colocad tres fichas cada uno</span></div><div id="morris-board" class="morris-board"></div><p id="morris-msg">Turnos alternos: primero coloca tus tres fichas.</p><button class="game-action" id="morris-reset">Reiniciar partida</button><button class="game-action" id="invite-friend">Invitar a un amigo</button><p class="morris-note">Modo local para dos jugadores en el mismo dispositivo. La invitación comparte el enlace del juego; las partidas online sincronizadas requieren un servidor.</p>';
 const mb=$('#morris-board');
 function renderM(){mb.innerHTML=cells.map((v,i)=>'<button class="morris-cell '+(v?'piece-'+v:'')+' '+(selected===i?'chosen':'')+'" data-cell="'+i+'">'+(v||'')+'</button>').join('');$('#turn-label').textContent='Turno: '+player;$('#morris-phase').textContent=placed.X<3||placed.O<3?'Colocad tres fichas cada uno':'Mueve una ficha a una casilla vecina';}
 function won(p){return wins.some(line=>line.every(i=>cells[i]===p));}
 function adjacent(a,b){const ax=a%3,ay=Math.floor(a/3),bx=b%3,by=Math.floor(b/3);return Math.max(Math.abs(ax-bx),Math.abs(ay-by))===1;}
 function clickCell(i){if(finished)return;if(placed.X<3||placed.O<3){if(cells[i])return;cells[i]=player;placed[player]++;if(won(player)){finish();return;}player=player==='X'?'O':'X';}
 else if(selected<0){if(cells[i]===player)selected=i;}
 else {if(i===selected){selected=-1;}else if(!cells[i]&&adjacent(selected,i)){cells[i]=player;cells[selected]='';selected=-1;if(won(player)){finish();return;}player=player==='X'?'O':'X';}}
 renderM();}
 function finish(){finished=true;$('#morris-msg').textContent='¡Gana el jugador '+player+'!';}
 mb.addEventListener('click',e=>{const b=e.target.closest('[data-cell]');if(b)clickCell(+b.dataset.cell);});
 $('#morris-reset').onclick=()=>{cells=Array(9).fill('');player='X';placed={X:0,O:0};selected=-1;finished=false;$('#morris-msg').textContent='Nueva partida. ¡A jugar!';renderM();};
 $('#invite-friend').onclick=()=>{const url=location.href.split('#')[0];const msg='¡Juega conmigo a Tres Fichas en NexPlay! '+url;if(navigator.share)navigator.share({title:'Tres Fichas - NexPlay',text:msg,url}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(msg).then(()=>alert('Enlace de invitación copiado.'));else alert(msg);};
 renderM();
 }else if(g.mode==='platformer'){
 clearInterval(timer);
 const levelKey='nex-platform-level-v1';let level=Math.max(1,Math.min(100,Number(localStorage.getItem(levelKey)||1))),px=35,py=0,vx=0,vy=0,onGround=false,coins=0,raf=0,keys={},wonLevel=false;
 board.innerHTML='<div class="platform-hud"><strong id="platform-level">NIVEL 1 / 100</strong><span id="platform-coins">Monedas: 0</span></div><canvas id="platform-canvas" width="800" height="390" aria-label="Juego de plataformas 2D"></canvas><div class="platform-controls"><button class="game-action" id="pl-left">←</button><button class="game-action" id="pl-right">→</button><button class="game-action" id="pl-jump">SALTAR</button><button class="game-action" id="pl-next" disabled>SIGUIENTE NIVEL</button></div><p id="platform-help">Flechas o A/D para moverte · Espacio para saltar · Llega a la puerta.</p>';
 const canvas=$('#platform-canvas'),ctx=canvas.getContext('2d'),W=800,H=390;
 let platforms=[],levelCoins=[],goal={x:750,y:300,w:30,h:55};
 function buildLevel(){px=35;py=290;vx=0;vy=0;coins=0;wonLevel=false;platforms=[{x:0,y:350,w:170,h:40},{x:210,y:305,w:115,h:18},{x:365,y:265,w:110,h:18},{x:515,y:315,w:95,h:18},{x:660,y:350,w:140,h:40}];const difficulty=Math.min(14,Math.floor((level-1)/7));for(let i=0;i<difficulty;i++){const shift=(level*29+i*67)%410;platforms.push({x:220+shift,y:225-(i%4)*30,w:62,h:14});}levelCoins=platforms.slice(1,-1).map((p,i)=>({x:p.x+p.w/2,y:p.y-22,r:8,taken:false}));goal={x:750,y:295,w:25,h:55};$('#platform-level').textContent='NIVEL '+level+' / 100';$('#platform-coins').textContent='Monedas: 0';$('#pl-next').disabled=true;}
 function draw(){ctx.clearRect(0,0,W,H);const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#10264b');grad.addColorStop(1,'#1b1740');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);for(let i=0;i<55;i++){ctx.fillStyle='#ffffff55';ctx.fillRect((i*137)%W,(i*71)%280,2,2);}ctx.fillStyle='#1d9e83';ctx.fillRect(0,370,W,20);platforms.forEach(p=>{ctx.fillStyle='#334a70';ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle='#42d9d1';ctx.fillRect(p.x,p.y,p.w,5);});levelCoins.forEach(c=>{if(!c.taken){ctx.fillStyle='#ffcf55';ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);ctx.fill();}});ctx.fillStyle='#ff5d8c';ctx.fillRect(goal.x,goal.y,goal.w,goal.h);ctx.fillStyle='#f7f8ff';ctx.fillRect(px,py,25,34);ctx.fillStyle='#091329';ctx.fillRect(px+15,py+8,4,4);ctx.fillStyle='#dce8ff';ctx.font='bold 13px sans-serif';ctx.fillText('SALIDA',goal.x-18,goal.y-9);}
 function frame(){if(!active)return;const oldY=py;if(keys.left)vx=-3.4;else if(keys.right)vx=3.4;else vx*=.78;if(keys.jump&&onGround){vy=-10.5;onGround=false;}px=Math.max(0,Math.min(W-25,px+vx));vy=Math.min(12,vy+.48);py+=vy;onGround=false;for(const p of platforms){if(vy>=0&&oldY+34<=p.y&&py+34>=p.y&&px+25>p.x&&px<p.x+p.w){py=p.y-34;vy=0;onGround=true;}}if(py>H){buildLevel();}levelCoins.forEach(c=>{if(!c.taken&&Math.abs((px+12)-c.x)<20&&Math.abs((py+15)-c.y)<22){c.taken=true;coins++;$('#platform-coins').textContent='Monedas: '+coins;}});if(px+25>goal.x&&px<goal.x+goal.w&&py+34>goal.y){wonLevel=true;active=false;$('#platform-help').textContent=level===100?'¡Has completado los 100 niveles!':'¡Nivel superado! Pulsa Siguiente nivel.';$('#pl-next').disabled=level===100;}draw();if(active)raf=requestAnimationFrame(frame);}
 const keydown=e=>{if(['ArrowLeft','ArrowRight','ArrowUp',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=true;if(e.key===' '||e.key==='ArrowUp'||e.key.toLowerCase()==='w')keys.jump=true;};const keyup=e=>{if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=false;if(e.key===' '||e.key==='ArrowUp'||e.key.toLowerCase()==='w')keys.jump=false;};
 document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);[['pl-left','left'],['pl-right','right'],['pl-jump','jump']].forEach(([id,k])=>{const b=$('#'+id);b.onpointerdown=()=>keys[k]=true;b.onpointerup=b.onpointerleave=b.onpointercancel=()=>keys[k]=false;});
 $('#pl-next').onclick=()=>{if(level<100&&wonLevel){level++;localStorage.setItem(levelKey,String(level));buildLevel();active=true;frame();}};
 buildLevel();active=true;frame();cleanup=()=>{active=false;cancelAnimationFrame(raf);document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);};
 
 }else if(g.mode==='breaker'){let bricks=12;board.innerHTML='<div class="arena-scene" style="min-height:38vh"><div id="bricks" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:20px"></div><div class="arena-object target" style="width:28px;height:28px;bottom:16%;left:48%">●</div><div class="arena-ground"></div></div><button class="game-action" id="break">Lanzar bola</button><p id="brickmsg">Bloques restantes: 12</p>';const br=$('#bricks');for(let i=0;i<12;i++){const d=document.createElement('div');d.style.cssText='height:35px;border-radius:7px;background:linear-gradient(120deg,#4be4f1,#7645ed);box-shadow:0 5px 12px #0005';br.append(d);}$('#break').onclick=()=>{if(!active||!br.children.length)return;const d=br.lastElementChild;d.remove();bricks--;score+=10;$('#brickmsg').textContent='Bloques restantes: '+bricks;status();if(!bricks)stop('¡Nivel completado!');};
 }else if(g.mode==='merge'){let vals=Array.from({length:16},()=>Math.random()>.6?2:0);function draw(){const btns=buttonGrid(vals.map(v=>v||'·'),4);btns.forEach((b,i)=>b.onclick=()=>{if(!active)return;const j=[i-1,i+1,i-4,i+4].find(k=>k>=0&&k<16&&vals[k]===vals[i]&&vals[i]>0);if(j!==undefined){vals[i]*=2;score+=vals[i];vals[j]=0;const empty=vals.findIndex(v=>v===0);if(empty>=0)vals[empty]=2;draw();status();}});}draw();
 }else if(g.mode==='defense'){board.innerHTML='<div class="arena-scene"><div class="arena-ground"></div><div class="arena-object" style="width:85px;height:85px;left:calc(50% - 42px);bottom:30%">BASE</div><button id="enemy" class="arena-object target" style="width:52px;height:52px;left:10%;top:10%">!</button></div><button id="defend" class="game-action">Activar defensa</button><p id="defmsg">Protege la base.</p>';$('#defend').onclick=()=>{if(!active)return;score+=10;const e=$('#enemy');e.style.left=(5+Math.random()*85)+'%';e.style.top=(5+Math.random()*65)+'%';$('#defmsg').textContent='Oleada detenida';status();};
 }}
 $('#start').onclick=start;
 cleanup=()=>{clearInterval(timer);};
}
document.querySelector('#year').textContent=new Date().getFullYear();render();


// Perfil y selector de avatar local.
(()=>{
 const drawer=document.querySelector('#profile-drawer'),backdrop=document.querySelector('#profile-backdrop');
 if(!drawer||!backdrop)return;
 const avatar=document.querySelector('#profile-avatar'),trigger=document.querySelector('#profile-trigger'),picker=document.querySelector('#avatar-picker');
 const closePicker=()=>{picker.hidden=true;};
 const openPicker=()=>{picker.hidden=false;};
 const open=()=>{drawer.classList.add('open');backdrop.classList.add('open');document.body.classList.add('profile-open');drawer.setAttribute('aria-hidden','false');};
 const close=()=>{drawer.classList.remove('open');backdrop.classList.remove('open');document.body.classList.remove('profile-open');drawer.setAttribute('aria-hidden','true');closePicker();};
 function applyAvatar(value){
   localStorage.setItem('nexplay-avatar',value);
   if(value.startsWith('data:image/')){avatar.innerHTML='<img alt="Foto de perfil" src="'+value+'">';trigger.innerHTML='<img alt="" src="'+value+'">';}
   else{avatar.textContent=value;trigger.textContent=value;}
 }
 trigger?.addEventListener('click',open);
 document.querySelector('#profile-close')?.addEventListener('click',close);
 backdrop.addEventListener('click',close);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 avatar?.addEventListener('click',openPicker);
 document.querySelector('#profile-edit-icon')?.addEventListener('click',openPicker);
 document.querySelector('#avatar-picker-close')?.addEventListener('click',closePicker);
 document.querySelectorAll('[data-avatar]').forEach(b=>b.addEventListener('click',()=>{applyAvatar(b.dataset.avatar);closePicker();}));
 document.querySelector('#avatar-file')?.addEventListener('change',e=>{
   const file=e.target.files&&e.target.files[0];if(!file)return;
   if(!/^image\/(png|jpeg|webp|gif)$/.test(file.type)){alert('Elige una imagen PNG, JPG, WEBP o GIF.');e.target.value='';return;}
   if(file.size>2*1024*1024){alert('La foto debe ocupar menos de 2 MB.');e.target.value='';return;}
   const reader=new FileReader();reader.onload=()=>{if(typeof reader.result==='string'){applyAvatar(reader.result);closePicker();}};reader.readAsDataURL(file);e.target.value='';
 });
 document.querySelector('#avatar-remove')?.addEventListener('click',()=>{localStorage.removeItem('nexplay-avatar');const initial=(localStorage.getItem('nexplay-display-name')||'Jugador.NexPlay').slice(0,1).toUpperCase();avatar.textContent=initial;trigger.textContent=initial;closePicker();});
 const edit=()=>{const current=localStorage.getItem('nexplay-display-name')||'Jugador.NexPlay';const value=prompt('¿Qué nombre quieres mostrar en tu perfil?',current);if(value&&value.trim()){const name=value.trim().slice(0,28);localStorage.setItem('nexplay-display-name',name);document.querySelector('#profile-name').textContent='@'+name;if(!localStorage.getItem('nexplay-avatar')){avatar.textContent=name.slice(0,1).toUpperCase();trigger.textContent=name.slice(0,1).toUpperCase();}}};
 document.querySelector('#profile-edit')?.addEventListener('click',edit);
 document.querySelector('#profile-complete')?.addEventListener('click',edit);
 const saved=localStorage.getItem('nexplay-display-name');if(saved){document.querySelector('#profile-name').textContent='@'+saved;}
 const savedAvatar=localStorage.getItem('nexplay-avatar');if(savedAvatar)applyAvatar(savedAvatar);else if(saved){avatar.textContent=saved.slice(0,1).toUpperCase();trigger.textContent=saved.slice(0,1).toUpperCase();}
 document.querySelector('#profile-share')?.addEventListener('click',()=>{const url=location.origin+location.pathname;if(navigator.share)navigator.share({title:'Mi perfil de NexPlay',url}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(url).then(()=>alert('Enlace de NexPlay copiado.'));});
 document.querySelector('#profile-signout')?.addEventListener('click',()=>{close();alert('Estás usando NexPlay como invitado. No hay ninguna cuenta conectada.');});
 document.querySelectorAll('[data-profile-action]').forEach(b=>b.addEventListener('click',()=>alert('Esta sección estará disponible cuando activemos las cuentas de NexPlay.')));
})();
