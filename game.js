const animals = [
    "cat","dog","lion","tiger","cow","horse","goat","bear",
    "zebra","giraffe","rabbit","fox","deer","camel","wolf",
    "panda","rhino","hippo","cheetah","buffalo","donkey",
    "pig","sheep","yak","otter","squirrel","leopard",
    "monkey","elephant"
    ];

    let targetAnimal = "";
    let stars = 0;
    const maxStars = 100;

    const grid = document.getElementById("gameGrid");
    const instruction = document.getElementById("instruction");
    const starCount = document.getElementById("starCount");
    const bucket = document.getElementById("bucket");

    function speak(text){
      const u = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(u);
        }

        function playSound(name){
          const audio = new Audio(`sounds/${name}.mp3`);
            audio.play();
            }

            function randomAnimals(){
              const shuffled = animals.sort(()=>0.5-Math.random());
                return shuffled.slice(0,4);
                }

                function newRound(){
                  grid.innerHTML = "";
                    const set = randomAnimals();
                      targetAnimal = set[Math.floor(Math.random()*4)];

                        instruction.innerText = `Tap the ${targetAnimal.toUpperCase()}`;

                          set.forEach(animal=>{
                              const card = document.createElement("div");
                                  card.className = "card";

                                      card.innerHTML = `
                                            <img src="images/${animal}.png">
                                                  <p>${animal}</p>
                                                      `;

                                                          card.onclick = ()=>handleClick(animal);

                                                              grid.appendChild(card);
                                                                });
                                                                }

                                                                function handleClick(animal){

                                                                  if(animal === targetAnimal){

                                                                      stars += 10;
                                                                          starCount.innerText = stars;

                                                                              speak(animal);
                                                                                  playSound("star");

                                                                                      showPopup(animal);

                                                                                          if(stars >= maxStars){
                                                                                                bucket.classList.add("overflow");
                                                                                                    }

                                                                                                      } else {
                                                                                                          playSound("oh");
                                                                                                            }
                                                                                                            }

                                                                                                            function showPopup(animal){
                                                                                                              const popup = document.getElementById("popup");
                                                                                                                document.getElementById("popupImg").src = `images/${animal}.png`;
                                                                                                                  document.getElementById("popupText").innerText = animal.toUpperCase();

                                                                                                                    popup.classList.remove("hidden");

                                                                                                                      speak(animal);
                                                                                                                      }

                                                                                                                      function closePopup(){
                                                                                                                        document.getElementById("popup").classList.add("hidden");
                                                                                                                          newRound();
                                                                                                                          }

                                                                                                                          newRound();
