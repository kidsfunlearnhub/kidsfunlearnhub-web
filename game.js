const animals=[
    "cat","dog","lion","tiger","cow","horse","goat","bear",
    "zebra","giraffe","rabbit","fox","deer","camel","wolf",
    "panda","rhino","hippo","cheetah","buffalo","donkey",
    "pig","sheep","yak","otter","squirrel","leopard",
    "monkey","elephant"
    ];

    let targetAnimal="";
    let stars=0;
    let level=1;

    const grid=document.getElementById("gameGrid");
    const instruction=document.getElementById("instruction");
    const starCount=document.getElementById("starCount");
    const bucket=document.getElementById("bucket");
    const levelText=document.getElementById("level");

    function speak(text){
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }

    function playSound(name){
    new Audio(`sounds/${name}.mp3`).play();
    }

    function randomAnimals(){
    return [...animals].sort(()=>0.5-Math.random()).slice(0,4);
    }

    function newRound(){
    grid.innerHTML="";
    const set=randomAnimals();
    targetAnimal=set[Math.floor(Math.random()*4)];

    instruction.innerText=`Tap the ${targetAnimal.toUpperCase()}`;

    set.forEach(animal=>{
    const card=document.createElement("div");
    card.className="card";

    card.innerHTML=`
    <img src="images/${animal}.png">
    <p>${animal}</p>
    `;

    card.onclick=()=>handleClick(animal);

    grid.appendChild(card);
    });
    }

    function handleClick(animal){

    if(animal===targetAnimal){

    stars+=10;
    starCount.innerText=stars;

    playSound(animal);
    speak(animal);

    showPopup(animal);
    celebrate();

    if(stars%50===0){
    level++;
    levelText.innerText=`Level ${level}`;
    unlockReward();
    }

    if(stars>=100) bucket.classList.add("glow");

    }else{
    playSound("oh");
    }
    }

    function showPopup(animal){
    document.getElementById("popupImg").src=`images/${animal}.png`;
    document.getElementById("popupText").innerText=animal.toUpperCase();
    document.getElementById("popup").classList.remove("hidden");
    }

    function closePopup(){
    document.getElementById("popup").classList.add("hidden");
    newRound();
    }

    function unlockReward(){
    const reward=document.getElementById("reward");
    reward.classList.remove("hidden");
    playSound("reward");

    setTimeout(()=>reward.classList.add("hidden"),2500);
    }

    /* CONFETTI SYSTEM */

    const canvas=document.getElementById("confetti");
    const ctx=canvas.getContext("2d");

    canvas.width=innerWidth;
    canvas.height=innerHeight;

    let confetti=[];

    function celebrate(){
    for(let i=0;i<80;i++){
    confetti.push({
    x:Math.random()*canvas.width,
    y:-10,
    r:Math.random()*6+4,
    d:Math.random()*50,
    color:`hsl(${Math.random()*360},100%,50%)`
    });
    }
    }

    function drawConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    confetti.forEach((c,i)=>{
    ctx.beginPath();
    ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
    ctx.fillStyle=c.color;
    ctx.fill();

    c.y+=4;
    c.x+=Math.sin(c.d);

    if(c.y>canvas.height) confetti.splice(i,1);
    });

    requestAnimationFrame(drawConfetti);
    }

    drawConfetti();

    newRound();
