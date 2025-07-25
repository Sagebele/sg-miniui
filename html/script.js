const Config = [
  {letter:"a", number:'1'}, {letter:"b", number:'2'}, {letter:"c", number:'3'},
  {letter:"d", number:'4'}, {letter:"e", number:'5'}, {letter:"f", number:'6'},
  {letter:"g", number:'7'}, {letter:"h", number:'8'}, {letter:"i", number:'9'},
  {letter:"j", number: '10'}, {letter:"k", number: '11'}, {letter:"l", number: '12'},
  {letter:"m", number: '13'}, {letter:"n", number: '14'}, {letter:"o", number: '15'},
  {letter:"p", number: '16'}, {letter:"q", number: '17'}, {letter:"r", number: '18'},
  {letter:"s", number: '19'}, {letter:"t", number: '20'}, {letter:"u", number: '21'},
  {letter:"v", number: '22'}, {letter:"w", number: '23'}, {letter:"x", number: '24'},
  {letter:"y", number: '25'}, {letter:"z", number: '26'}
];
let uiVisible = false;
let reverseCode = "";
let attempts = 3;
let gotWrong = false
let found = false;

function getRandomLetterOrNumber() {
    let randomIndex;
    let entry;
    let randomCode = "";
    for (let i = 0; i < 3; i++) {
        randomIndex = Math.round(Math.random() * (Config.length-1));
        entry = Config[randomIndex];
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
    Config.forEach((entry,i) => {
        const div = document.createElement("div")
        div.classList.add("mapping-item");
        div.textContent = `${entry.letter} = ${entry.number} , `;
        if (i === Config.length - 1) {
            div.textContent = div.textContent.slice(0, -2); // Remove the last comma and space
        }
        characterMapping.appendChild(div);
    });
}

function startTimerBar(durationMin, onComplete) {
    const progressBar = document.getElementsByClassName("timer-bar")[0];
    //console.log("Starting timer bar with duration: \n", progressBar.style.width);
    const startTime = Date.now();
    const interval = setInterval(() => {
        if(gotWrong && attempts > 0){
            durationMin = durationMin - 17000; 
            gotWrong = false; 

        }
        console.log("Attempts left: \n", attempts);
        if(attempts <= 0){
            console.log("No attempts left, clearing interval");
            clearInterval(interval);
            if(typeof onComplete === "function") {
                onComplete({correct: false});
            }
        }
        const elapsedTime = Date.now() - startTime;
        const percent = Math.max(0, 100 - (elapsedTime / durationMin) * 100);
        //console.log("Elapsed time: ", elapsedTime, "Percent: ", percent, " tonumber:", Number(percent));
        progressBar.style.width = percent + "%";

        if(percent <= 0){
            clearInterval(interval);
            if(typeof onComplete === "function") {
                onComplete({correct: false});
            }
        }

        if(found){
            console.log("Found the correct code, clearing interval");
            clearInterval(interval);
            if(typeof onComplete === "function") {
                onComplete({correct: true});
            }
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
    inputField.value = ""; // Clear the input field
    characterMapping.innerHTML = ""; // Clear the character mapping
    reverseCode = ""; // Reset the reverseCode
    uiVisible = false; // Reset the uiVisible flag
}


document.addEventListener("keydown", function (event) {
    if(event.key === "Enter"){
        console.log("reverseCode: ", reverseCode);

        const input = document.getElementsByClassName("nice-input")[0].value;
        console.log("Enter key pressed, checking input ", input);
        if(input == reverseCode){
            found = true;
            console.log("Correct input, closing UI");
            cleaningUI();
            document.getElementById("miniui-container").style.display = "none";
            console.log("UI closed and cleaned up");
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
        document.getElementById("miniui-container").style.display = "none";
    }
    
});

window.addEventListener("message", function (event) {
    if(event.data.type === "ui" && !uiVisible) {
        if(event.data.status === true) {
            let randomCode = getRandomLetterOrNumber();
            attempts = 3;found = false;
            document.getElementById("attempts").textContent = `${attempts}`;
            document.getElementById("randomCode").textContent = randomCode;
            populateCharacterMapping();
            startTimerBar(60000, fetchToLua);
            document.getElementById("miniui-container").style.display = "block";
            uiVisible = true; 
        
        } 
        else{
            document.getElementById("miniui-container").style.display = "none";
        }
    }

});




// document.getElementById("closeBtn").addEventListener("click", function () {
//   fetch(`https://${GetParentResourceName()}/closeUI`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json; charset=UTF-8",
//     },
//     body: JSON.stringify({}),
//   });
// });
