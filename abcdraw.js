const canvas=document.getElementById("canvas");
const ctx=canvas.getContext("2d");
const pencil=document.getElementById("pencil");
const title=document.getElementById("title");

function resize(){
canvas.width=canvas.offsetWidth;
canvas.height=canvas.offsetHeight;
}
resize();
addEventListener("resize",resize);

ctx.lineWidth=4;
ctx.lineCap="round";
ctx.strokeStyle="#ff5c8a";

const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let index=0;

const cellW=80;
const cellH=80;

function speak(t){
const msg=new SpeechSynthesisUtterance(t);
msg.pitch=1.8;
speechSynthesis.cancel();
speechSynthesis.speak(msg);
}

function writeSound(){
const ac=new (window.AudioContext||window.webkitAudioContext)();
const o=ac.createOscillator();
const g=ac.createGain();
o.connect(g);
g.connect(ac.destination);
o.frequency.value=600;
o.start();
g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.15);
}

/* ---------- HUMAN STYLE STROKES ---------- */

function strokesFor(letter,x,y){

const s=50;

switch(letter){

case "A":
return [
[[x,y+s],[x+s/2,y],[x+s,y+s]],
[[x+s*0.25,y+s*0.6],[x+s*0.75,y+s*0.6]]
];

case "B":
return [
[[x,y],[x,y+s]],
[[x,y],[x+s*0.6,y+s*0.25],[x,y+s*0.5]],
[[x,y+s*0.5],[x+s*0.6,y+s*0.75],[x,y+s]]
];

default:
/* fallback simple line */
return [
[[x,y],[x+s,y+s]]
];
}
}

/* ---------- ANIMATE STROKE ---------- */

function animateStroke(points,done){

let i=0;
ctx.beginPath();
ctx.moveTo(points[0][0],points[0][1]);

function step(){

if(i>=points.length-1){
done();
return;
}

const [x1,y1]=points[i];
const [x2,y2]=points[i+1];

let t=0;

function seg(){

const x=x1+(x2-x1)*t;
const y=y1+(y2-y1)*t;

ctx.lineTo(x,y);
ctx.stroke();

pencil.style.left=x+"px";
pencil.style.top=y+"px";

writeSound();

t+=0.1;

if(t<=1){
requestAnimationFrame(seg);
}else{
i++;
step();
}
}

seg();
}

step();
}

/* ---------- WRITE LETTER ---------- */

function writeLetter(){

if(index>=letters.length){
celebrate();
return;
}

const letter=letters[index];
speak("This is "+letter);

const col=index%10;
const row=Math.floor(index/10);

const baseX=20+col*cellW;
const baseY=40+row*cellH;

const strokes=strokesFor(letter,baseX,baseY);

let s=0;

function nextStroke(){

if(s>=strokes.length){
index++;
title.innerText=index<letters.length?
"Tap to write "+letters[index]:
"Great job!";
return;
}

animateStroke(strokes[s],()=>{
s++;
nextStroke();
});
}

nextStroke();
}

/* tap */

canvas.onclick=writeLetter;

/* ---------- CONFETTI ---------- */

const c=document.getElementById("confetti");
const cx=c.getContext("2d");

function resizeC(){
c.width=innerWidth;
c.height=innerHeight;
}
resizeC();
addEventListener("resize",resizeC);

let confetti=[];

function celebrate(){

for(let i=0;i<200;i++){
confetti.push({
x:Math.random()*c.width,
y:-20,
d:Math.random()*5+2,
c:`hsl(${Math.random()*360},100%,50%)`
});
}

animateConfetti();
}

function animateConfetti(){

cx.clearRect(0,0,c.width,c.height);

confetti.forEach(p=>{
cx.fillStyle=p.c;
cx.fillRect(p.x,p.y,6,6);
p.y+=p.d;
});

requestAnimationFrame(animateConfetti);
}
