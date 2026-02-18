const area = document.getElementById("gameArea");
const title = document.getElementById("title");
const popup = document.getElementById("popup");


let alphabetIndex = 0;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function speak(text){
  const msg = new SpeechSynthesisUtterance(text);

  // child-like voice tuning
  msg.pitch = 1.8;
  msg.rate = 1;
  msg.volume = 1;

  speechSynthesis.speak(msg);
}

function buildLevel(){
  area.innerHTML = "";
  popup.style.display = "none";

  let target = letters[alphabetIndex];
  title.innerText = `Tap all ${target}`;

  speak(`Tap all ${target}`);

  let total = 30;
  let targets = Math.floor(Math.random()*5)+4;

  let pool = [];

  for(let i=0;i<targets;i++) pool.push(target);

  while(pool.length < total){
    let r = letters[Math.floor(Math.random()*26)];
    if(r!==target) pool.push(r);
  }

  pool.sort(()=>Math.random()-0.5);

  let remaining = targets;

  pool.forEach(letter=>{
    let div = document.createElement("div");
    div.className = "circle";
    div.innerText = letter;

    div.onclick = ()=>{
      if(letter === target && !div.classList.contains("correct")){
        div.classList.add("correct");
        speak(letter);
        remaining--;

        if(remaining===0){
          celebrate();
        }

      }else if(letter !== target){
        div.classList.add("wrong");
        playOh();
        setTimeout(()=>div.classList.remove("wrong"),800);
      }
    };

    area.appendChild(div);
  });
}

function playOh(){
  const audio = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
  audio.play();
}

function celebrate(){
  popup.style.display = "flex";
  confettiBurst();
}

function nextLevel(){
  alphabetIndex++;
  if(alphabetIndex>=letters.length) alphabetIndex=0;
  buildLevel();
}

/* ===== Confetti ===== */

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize",resize);

let confetti = [];

function confettiBurst(){
  confetti = [];
  for(let i=0;i<150;i++){
    confetti.push({
      x:Math.random()*canvas.width,
      y:-20,
      r:Math.random()*6+4,
      d:Math.random()*10,
      color:`hsl(${Math.random()*360},100%,50%)`,
      tilt:Math.random()*10-10
    });
  }
  animateConfetti();
}

function animateConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  confetti.forEach(c=>{
    ctx.fillStyle = c.color;
    ctx.fillRect(c.x,c.y,c.r,c.r);

    c.y += c.d;
    c.x += Math.sin(c.tilt);

    if(c.y > canvas.height){
      c.y = -10;
      c.x = Math.random()*canvas.width;
    }
  });

  requestAnimationFrame(animateConfetti);
}

/* Start */
buildLevel();
