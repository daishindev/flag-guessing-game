//DOM elements
let showFlag = document.querySelector(".showFlag");
let flagImg = document.querySelector(".flagImg");
let flagP = document.querySelector(".flagP");
let guessInput = document.getElementById("guessInput");
let submitButton = document.getElementById("submitButton");
let startGameButton = document.getElementById("startGameButton");
let restartButton = document.getElementById("restartButton");
let pointsP = document.querySelector(".pointsP");
let livesP = document.querySelector(".livesP");
let countryList = document.getElementById("countryList");
let bottomUI = document.querySelector(".bottomUI");
let wrongAudio = new Audio("src/wrong.mp3");
let gameOverScreen = document.querySelector(".gameOverScreen");
gameOverScreen.style.display = "none";

//Game variables
let answerCommonName;
let answerOffName;
let guessAnswer;
let points;
let lives;

//Sets defaul points count
setDefaultPoints = () => {
  points = 0;
  lives = 3;
};

//initializes the game
async function initializeGame() {
  let randomNumber = Math.floor(Math.random() * 251);
  const response = await axios.get("https://restcountries.com/v3.1/all");
  const data = response.data;
  const currCountry = data[randomNumber];

  //clear list
  const countryNames = data.map((country) => country.name.common);
  while (countryList.firstChild) {
    countryList.removeChild(countryList.firstChild);
  }

  countryNames.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    countryList.appendChild(option);
  });

  guessInput.value = "";
  guessInput.disabled = false;
  submitButton.disabled = false;
  answerCommonName = currCountry.name.common.toLowerCase();
  answerOffName = currCountry.name.official.toLowerCase();
  console.log(currCountry);
  flagImg.src = currCountry.flags.png;

  startGameButton.style.display = "none";
  bottomUI.style.display = "flex";
  setDefaultPoints();
  livesP.innerText = "Lives: " + lives;
  pointsP.innerText = "Points: " + points;
}
//restart game function
async function restartGame() {
  initializeGame();
  gameOverScreen.style.display = "none";
}
//fetches new data, separate because i call it when the answer is correct
async function fetchNewData() {
  try {
    let randomNumber = Math.floor(Math.random() * 251);
    const response = await axios.get("https://restcountries.com/v3.1/all");
    const data = response.data;
    const currCountry = data[randomNumber];
    guessInput.value = "";
    guessInput.disabled = false;
    submitButton.disabled = false;
    answerCommonName = currCountry.name.common.toLowerCase();
    answerOffName = currCountry.name.official.toLowerCase();
    console.log(currCountry);
    flagImg.src = currCountry.flags.png;

    startGameButton.style.display = "none";
  } catch (error) {
    console.error(error);
  }
}

//shake animation
shakeText = () => {
  livesP.style.animation = "none";
  livesP.offsetHeight;
  livesP.style.animation = "fastShakeAnim 0.3s ease 0s 1 forwards";
  wrongAudio.play();
};

function handleSubmit() {
  guessInputAnswer = guessInput.value.toLowerCase();
  if (guessInputAnswer != "") {
    if (
      guessInputAnswer == answerCommonName ||
      guessInputAnswer == answerOffName
    ) {
      console.log("You are right!");
      guessInput.value = "";
      fetchNewData();
      points++;
      pointsP.innerText = "Points: " + points;
      const correctAnswerP = document.createElement("p");
      correctAnswerP.classList.add("correctAnswerP");
      correctAnswerP.textContent =
        "Yes! It was " + answerCommonName.toUpperCase();
      showFlag.appendChild(correctAnswerP);
      setTimeout(function () {
        correctAnswerP.remove();
      }, 1000);
    } else {
      console.log("Nothing happened");
      console.log(guessInputAnswer);
      console.log(answerCommonName);
      lives--;
      livesP.innerText = "Lives: " + lives;
      shakeText();
      if (lives == 0) {
        gameOverScreen.style.display = "flex";
        guessInput.disabled = true;
        submitButton.disabled = true;
        startGameButton.style.display = "block";
      }
    }
  }
}

//when enter is pressed, it Submits
guessInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    submitButton.click();
  }
});
