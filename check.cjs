const vm=require('vm'),fs=require('fs'),assert=require('assert');
const ctx=new Proxy({},{get:()=>()=>{}}),elements={};function el(id){return elements[id]??={textContent:'',innerHTML:'',classList:{add(){},remove(){}},addEventListener(){}}}elements.game={width:1280,height:590,getContext:()=>ctx};
const env={document:{getElementById:el,querySelector:()=>el('tag'),querySelectorAll:()=>[]},window:{innerWidth:1280,addEventListener(){}},requestAnimationFrame(){},console,Math};vm.createContext(env);vm.runInContext(fs.readFileSync('dist/game.js','utf8'),env);function run(s){return vm.runInContext(s,env)}
run('draw();start();for(let i=0;i<45;i++)update()');assert.equal(run('player.ground'),true);assert.equal(run('player.y'),442);
run('keys.Space=true;update()');assert(run('player.vy')<0);run('keys.Space=false;for(let i=0;i<60;i++)update()');assert(run('player.ground'));
run('player.x=stars[0].x-16;player.y=stars[0].y-28;update()');assert(run('score')>=1);
run('player.x=enemies[0].x-55;player.y=442;player.dir=1;doAttack();update();update()');assert.equal(run('enemies[0].alive'),false);
run('pause()');assert.equal(run('state'),'paused');const px=run('player.x');run('keys.ArrowRight=true;update()');assert.equal(run('player.x'),px);run('keys.ArrowRight=false;start()');
run('invincible=0;hurt(true)');assert.equal(run('health'),2);assert(run('player.y')<500);
run('player.x=3540;update()');assert.equal(run('state'),'complete');run('start()');assert.equal(run('level'),1);assert.equal(run('health'),3);run('player.x=3540;update();start();player.x=3540;update()');assert.equal(run('state'),'win');run('start()');assert.equal(run('level'),0);assert.equal(run('score'),0);
run('health=1;invincible=0;hurt()');assert.equal(run('state'),'over');run('start()');assert.equal(run('health'),3);console.log('PASS: landing, jumping, stars, tie attack, pause, fall recovery, 3-level progression, victory, game over, restart.');
for(let subject=0;subject<3;subject++){
  run(`level=${subject};loadLevel();state='playing'`);
  assert(run('stars.every(s=>s.lesson&&s.lesson.glyph&&s.lesson.word)'));
  const expected=run('stars[0].lesson.word');run('player.x=stars[0].x-16;player.y=stars[0].y-28;update()');assert(elements.status.textContent.includes(expected));
  run('camera=3000;attack=15;draw();player.dir=-1;draw()');
}
assert.equal(run('lessons[0][0].word'),'ก ไก่');assert.equal(run('lessons[1][9].word'),'10 สิบ');assert.equal(run('lessons[2][2].word'),'C · Cat = แมว');console.log('PASS: subject tokens, learning feedback, academy rendering and hand-held tie in both directions across all 3 worlds.');
