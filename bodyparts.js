const hotspots = document.querySelectorAll(".hotspot");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupText = document.getElementById("popupText");
const closeBtn = document.getElementById("closeBtn");

function celebrate(){
  const star=document.createElement("div");
  star.textContent="⭐";
  star.style.position="fixed";
  star.style.left=Math.random()*90+"vw";
  star.style.top=Math.random()*90+"vh";
  star.style.fontSize="24px";
  star.style.pointerEvents="none";
  document.body.appendChild(star);

  setTimeout(()=>star.remove(),800);
}

function speak(text){
const msg = new SpeechSynthesisUtterance(text);
msg.rate = 0.9;
speechSynthesis.cancel();
speechSynthesis.speak(msg);
}

hotspots.forEach(h=>{
h.addEventListener("click",()=>{
const name = h.dataset.name;
const img = h.dataset.img;

popupImg.src = img;
popupText.textContent = name;
popup.classList.remove("hidden");

speak(name);
celebrate();
});
});

closeBtn.onclick = ()=>{
popup.classList.add("hidden");
speechSynthesis.cancel();
};




