
let config ;
let uiVisible = false;
let reverseCode = "";
let attempts;
let gotWrong = false
let found = false;

function getRandomLetterOrNumber() {
    let randomIndex;
    let entry;
    let randomCode = "";
    for (let i = 0; i < 3; i++) {
        randomIndex = Math.round(Math.random() * (config.length-1));
        entry = config[randomIndex];
        if(Math.random() < 0.5){
            randomCode = randomCode + entry.letter 
            reverseCode = reverseCode + entry.number;

        } 
        else{
            randomCode = randomCode + entry.number;
            reverseCode = reverseCode + entry.letter;
            
        }    
        
    }  
    
  // Randomly choose whether to return the letter or number
    return randomCode;
}

function populateCharacterMapping() {
    const characterMapping = document.getElementsByClassName("character-mapping")[0];
    config.forEach((entry,i) => {
        const div = document.createElement("div")
        div.classList.add("mapping-item");
        div.textContent = `${entry.letter} = ${entry.number} , `;
        if (i === config.length - 1) {
            div.textContent = div.textContent.slice(0, -2); // Remove the last comma and space
        }
        characterMapping.appendChild(div);
    });
}

function startTimerBar(durationMin, onComplete) {
    const progressBar = document.getElementsByClassName("timer-bar")[0];
    const startTime = Date.now();
    const interval = setInterval(() => {
        if(found){
            clearInterval(interval);
            if(typeof onComplete === "function") {
                onComplete({correct: true});
            }
        }

        if(gotWrong && attempts > 0){
            durationMin = durationMin - (durationMin/5); 
            gotWrong = false; 

        }
        if(attempts <= 0){
            clearInterval(interval);
            if(typeof onComplete === "function") {
                onComplete({correct: false});
            }
        }
        const elapsedTime = Date.now() - startTime;
        const percent = Math.max(0, 100 - (elapsedTime / durationMin) * 100);
        progressBar.style.width = percent + "%";

        if(percent <= 0){
            clearInterval(interval);
            if(typeof onComplete === "function") {
                onComplete({correct: false});
            }
            cleaningUI();
        }

        
    }, 100);
}

function fetchToLua(data){
    fetch(`https://${GetParentResourceName()}/closeUI`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
    });
}

function cleaningUI(){
    const characterMapping = document.getElementsByClassName("character-mapping")[0];
    const inputField = document.getElementsByClassName("nice-input")[0];
    document.getElementById("miniui-container").style.display = "none";
    inputField.value = ""; // Clear the input field
    characterMapping.innerHTML = ""; // Clear the character mapping
    reverseCode = ""; // Reset the reverseCode
    uiVisible = false; // Reset the uiVisible flag
}


document.addEventListener("keydown", function (event) {
    if(event.key === "Enter"){
        //console.log("reverseCode: ", reverseCode, "\n");

        const input = document.getElementsByClassName("nice-input")[0].value;
        if(input == reverseCode){
            found = true;
            cleaningUI();
        }   
        else{
            attempts--;
            gotWrong = true;
            if(attempts === 0){
                cleaningUI();
            } 
            else{
                document.getElementsByClassName("nice-input")[0].value = "";
                document.getElementById("randomCode").textContent = getRandomLetterOrNumber();
                document.getElementById("attempts").textContent = `${attempts}`;
            }
        }
    }
    else if(event.key === "Escape") {
        attempts = 0;
        cleaningUI();
    }
    
});

window.addEventListener("message", function (event) {

    if(event.data.type === "ui" && !uiVisible){
        if(event.data.status === true) {
            if (!event.data.config || !event.data.config.table || !event.data.config.details.attempts || !event.data.config.details.timer) {
                console.error("Missing config or config.table from event data:", event.data);
                return;
            }

            config = event.data.config.table;

            let randomCode = getRandomLetterOrNumber();
            attempts = event.data.config.details.attempts;
            found = false;
            document.getElementById("attempts").textContent = `${attempts}`;
            document.getElementById("randomCode").textContent = randomCode;
            populateCharacterMapping();
            startTimerBar(event.data.config.details.timer, fetchToLua);
            document.getElementById("miniui-container").style.display = "block";
            uiVisible = true; 
        
        } 
        else{
            document.getElementById("miniui-container").style.display = "none";
        }
    }

});



