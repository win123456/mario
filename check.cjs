const vm=require('vm'),fs=require('fs'),assert=require('assert');
const gradient={addColorStop(){}};
const transforms=[],imageDraws=[];
const ctx=new Proxy({},{get:(_,key)=>key==='createLinearGradient'||key==='createRadialGradient'?()=>gradient:key==='setTransform'?(...args)=>transforms.push(args):key==='drawImage'?(...args)=>imageDraws.push(args):()=>{}}),elements={};
function el(id){return elements[id]??={textContent:'',innerHTML:'',classList:{add(){},remove(){}},addEventListener(){}}}elements.game={width:1280,height:590,getContext:()=>ctx};
class AudioContextMock{constructor(){this.currentTime=0;this.destination={}}resume(){}createOscillator(){return{frequency:{value:0},connect(){},start(){},stop(){}}}createGain(){return{gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}}
class ImageMock{constructor(){this.complete=true;this.naturalWidth=323;this.naturalHeight=512}}
const touchButtons=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<button\b[^>]*data-key="([^"]+)"[^>]*>/g)].map(match=>({dataset:{key:match[1]},handlers:{},setPointerCapture(){},addEventListener(event,handler){this.handlers[event]=handler}}));
const env={document:{getElementById:el,querySelector:()=>el('tag'),querySelectorAll:()=>touchButtons},window:{innerWidth:1280,devicePixelRatio:2,AudioContext:AudioContextMock,addEventListener(){}},Image:ImageMock,requestAnimationFrame(){},setTimeout(){},console,Math};
vm.createContext(env);for(const file of ['dist/storybook.js','dist/game.js'])vm.runInContext(fs.readFileSync(file,'utf8'),env);function run(s){return vm.runInContext(s,env)}
assert.equal(elements.game.width,2560);assert.equal(elements.game.height,1180);assert.equal(run('W'),1280);assert.deepEqual(transforms[0],[2,0,0,2,0,0]);
run('storyHero(70,442,1)');const heroDraw=imageDraws.at(-1);assert(Math.abs(heroDraw[3]/heroDraw[4]-323/512)<1e-9);
const decorationFrames=run(`(()=>{const originalDaisy=daisy,seen=[];daisy=(...args)=>seen.push(args);const platform={x:500,y:311,w:145,h:28};const frames=[];for(let i=0;i<100;i++){platform.x=500+Math.sin(i*.1)*58;platform.y=311+Math.cos(i*.1)*4;seen.length=0;paintPlatform(platform);frames.push(JSON.stringify(seen))}daisy=originalDaisy;return frames})()`);assert(decorationFrames[0]!=='[]');assert(decorationFrames.every(f=>f===decorationFrames[0]),'Flowers must retain local positions, size and color as a platform moves');
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
const downButton=touchButtons.find(b=>b.dataset.key==='ArrowDown');assert(downButton,'Mobile needs a pipe-entry button');
run("level=0;loadLevel();state='playing';player.x=pipeX()-16;player.y=380;player.ground=true");
downButton.handlers.pointerdown({preventDefault(){},pointerId:1});assert.equal(run('routeMode'),'tunnel');downButton.handlers.pointerup();assert.equal(run('keys.ArrowDown'),false);
run("loadLevel();state='playing';player.x=pipeX()-16;player.y=365;player.vy=4;player.ground=false");
downButton.handlers.pointerdown({preventDefault(){},pointerId:2});assert.equal(run('routeMode'),'main');run('for(let i=0;i<8;i++)update()');assert.equal(run('routeMode'),'tunnel','Holding down should enter once the player lands on the pipe');downButton.handlers.pointercancel();assert.equal(run('keys.ArrowDown'),false);
run("loadLevel();state='playing';player.x=70;player.y=442;player.ground=true");downButton.handlers.pointerdown({preventDefault(){},pointerId:3});run('update()');assert.equal(run('routeMode'),'main','Down away from a pipe must not teleport');downButton.handlers.lostpointercapture();assert.equal(run('keys.ArrowDown'),false);
run("storyArt.teacher.complete=false;storyArt.cottage.complete=false;storyArt.valley.complete=false;loadLevel();draw()");
console.log('PASS: movement, jump, stars, tie combat, pause, health, all level transitions, victory/restart, moving platforms/stars, cloud/tunnel routes, lava, illustrated rendering and missing-image fallbacks.');
