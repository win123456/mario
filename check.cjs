const vm=require('vm'),fs=require('fs'),assert=require('assert');
const gradient={addColorStop(){}};
const ctx=new Proxy({},{get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>gradient:()=>{}}),elements={};
function el(id){return elements[id]??={textContent:'',innerHTML:'',classList:{add(){},remove(){}},addEventListener(){}}}elements.game={width:1280,height:590,getContext:()=>ctx};
class AudioContextMock{constructor(){this.currentTime=0;this.destination={}}resume(){}createOscillator(){return{frequency:{value:0},connect(){},start(){},stop(){}}}createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}}
class ImageMock{constructor(){this.complete=true;this.naturalWidth=256;this.naturalHeight=256}}
const env={document:{getElementById:el,querySelector:()=>el('tag'),querySelectorAll:()=>[]},window:{innerWidth:1280,AudioContext:AudioContextMock,addEventListener(){}},Image:ImageMock,requestAnimationFrame(){},setTimeout(){},console,Math};
vm.createContext(env);for(const file of ['dist/storybook.js','dist/game.js'])vm.runInContext(fs.readFileSync(file,'utf8'),env);function run(s){return vm.runInContext(s,env)}
run('draw();start();for(let i=0;i<45;i++)update()');assert.equal(run('player.ground'),true);assert.equal(run('player.y'),442);
run('keys.Space=true;update()');assert(run('player.vy')<0);run('keys.Space=false;for(let i=0;i<60;i++)update()');assert(run('player.ground'));
run('player.x=stars[0].x-16;player.y=stars[0].y-28;update()');assert(run('score')>=1);
run('player.x=enemies[0].x-55;player.y=442;player.dir=1;doAttack();update();update()');assert.equal(run('enemies[0].alive'),false);
run('pause()');assert.equal(run('state'),'paused');const px=run('player.x');run('keys.ArrowRight=true;update()');assert.equal(run('player.x'),px);run('keys.ArrowRight=false;start()');
run('invincible=0;hurt(true)');assert.equal(run('health'),2);assert(run('player.y')<500);
run('player.x=4810;update()');assert.equal(run('state'),'complete');run('start()');assert.equal(run('level'),1);assert.equal(run('health'),3);run('player.x=4810;update();start();player.x=4810;update()');assert.equal(run('state'),'win');run('start()');assert.equal(run('level'),0);assert.equal(run('score'),0);
run('health=1;invincible=0;hurt()');assert.equal(run('state'),'over');run('start()');assert.equal(run('health'),3);
for(let subject=0;subject<3;subject++){
 run(`level=${subject};loadLevel();state='playing'`);assert(run('stars.every(s=>s.lesson&&s.lesson.glyph&&s.lesson.word)'));
 const expected=run('stars[0].lesson.word');run('player.x=stars[0].x-16;player.y=stars[0].y-28;update()');assert(elements.status.textContent.includes(expected));
 run('camera=4300;attack=15;draw();player.dir=-1;draw()');
 const initialX=run('worldMovingPlatforms[0].x');run('update()');assert.notEqual(run('worldMovingPlatforms[0].x'),initialX);assert(run('stars.filter(s=>s.movingPlatform).every(s=>Math.abs(s.x-s.movingPlatform.x-s.moveOffsetX)<.001)'));
 run("enterBonus('cloud');draw()");assert.equal(run('routeMode'),'cloud');run('exitBonus()');assert.equal(run('routeMode'),'main');
 run("enterBonus('tunnel');draw();invincible=0;health=3;player.x=180;player.y=510;player.vy=0;update()");assert.equal(run('health'),2);assert.equal(run('player.x'),70);run('exitBonus()');
}
run("storyArt.teacher.complete=false;storyArt.cottage.complete=false;storyArt.valley.complete=false;loadLevel();draw()");
console.log('PASS: movement, jump, stars, tie combat, pause, health, all level transitions, victory/restart, moving platforms/stars, cloud/tunnel routes, lava, illustrated rendering and missing-image fallbacks.');
