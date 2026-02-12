const animals = ["🐱","🐶","🐵","🐰","🦊","🐻","🐯","🐸"];
const target = "🐱";

let stars = 0;

const grid = document.getElementById("gameGrid");
const starText = document.getElementById("stars");

const correctSound = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b3f1b.mp3");
const wrongSound = new Audio("https://cdn.pixabay.com/audio/2022/03/10/audio_c1b63b0c52.mp3");

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5);
}

function newRound(){
grid.innerHTML="";
let set = shuffle([...animals]).slice(0,4);

if(!set.includes(target)){
set[0]=target;
}

shuffle(set);

set.forEach(animal=>{
let card=document.createElement("div");
card.className="card";
card.textContent=animal;

card.onclick=()=>tapAnimal(animal);

grid.appendChild(card);
});
}

function tapAnimal(animal){

if(animal===target){

correctSound.play();
stars+=10;
starText.textContent=stars;

showPopup();
confettiBurst();

}else{
wrongSound.play();
}
}

function showPopup(){
document.getElementById("popup").classList.add("show");
}

function closePopup(){
document.getElementById("popup").classList.remove("show");
newRound();
}

/* confetti */

const canvas=document.getElementById("confetti");
const ctx=canvas.getContext("2d");

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let pieces=[];

function confettiBurst(){

pieces=[];

for(let i=0;i<80;i++){
pieces.push({
x:Math.random()*canvas.width,
y:-10,
r:Math.random()*6+4,
d:Math.random()*40
});
}

animateConfetti();
}

function animateConfetti(){

ctx.clearRect(0,0,canvas.width,canvas.height);

pieces.forEach(p=>{
ctx.beginPath();
ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
ctx.fillStyle=`hsl(${Math.random()*360},100%,50%)`;
ctx.fill();

p.y+=5;
});

requestAnimationFrame(animateConfetti);
}

newRound();