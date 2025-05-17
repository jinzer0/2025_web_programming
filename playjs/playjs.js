


function calc() {
    let x = document.getElementById("x");
    let y = document.getElementById("y");
    let sum = document.getElementById("sum");
    sum.value = Number.parseInt(x.value) + Number.parseInt(y.value);
}

let computerNumber = 53;
let nGuesses = 0;

function numGuess() {
    nGuesses++;
    // let result에 문자열 저장해서 분기에 따라 문자열 변경, hint.value = result;
    document.getElementById("guesses").value = nGuesses;
    let hint = document.getElementById("result");
    let input = Number.parseInt(document.getElementById("user").value);
    if (computerNumber > input) hint.value = "낮습니다.";
    else if (computerNumber < input) hint.value = "높습니다.";
    else hint.value = "성공입니다.";
}

function replay() {
    let input_text = ["user", "result", "guesses"];
    input_text.forEach((x) => document.getElementById(x).value = "");
    computerNumber = Math.round(Math.random() * 100 + 1);
    nGuesses = 0;
    document.getElementById("guesses").value = nGuesses;
    document.getElementById("test").value = computerNumber;


}

function setCTime() {
    let date = new Date();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    document.getElementById("ctime").innerHTML = months[month] + " " + day + " " + hour + ":" + min + ":" + sec;
    setTimeout(setCTime, 1000);
}

var word_list = ["banana", "apple", "cat", "word", "computer", "science"];

function showWordList() {
    let wordList = document.getElementById("wordList");
    wordList.innerHTML = word_list.join(", ");
}

function addWord() {
    let user_input = prompt("단어를 입력하세요");
    if (user_input == null) return;
    if (word_list.includes(user_input)) alert("이미 존재하는 단어입니다.");
    else {
        word_list.push(user_input);
        showWordList();
    }

}

function sortWord() {
    word_list.sort();
    showWordList();
}

function shuffleWord() {
    for (let i = word_list.length - 1; i > 1; i--) {
        let rand_idx = Math.floor(Math.random() * (i + 1));
        let temp = word_list[i];
        word_list[i] = word_list[rand_idx];
        word_list[rand_idx] = temp;
    }
    showWordList();
    // document.getElementById("wordList").innerHTML = word_list.toString();
}


const max_guess = 6;
let guess = "";
let guess_count = max_guess;
let word;


function newGame() {
    let rand_idx = parseInt(Math.random() * word_list.length);
    guess = "";
    guess_count = max_guess;
    word = word_list[rand_idx];
    let button = document.getElementById("guessbutton");
    button.disabled = "";
    updatePage();
}

function updatePage() {
    let img = document.getElementById("hangmanpic");
    img.src = "hangman/hangman" + guess_count + ".gif";
    let clue = document.getElementById("clue");
    let clue_string = "";
    for (let i = 0; i < word.length; i++) {
        if (guess.includes(word.charAt(i))) clue_string += word.charAt(i) + " ";
        else clue_string += "_ ";
    }
    clue.innerHTML = clue_string;
    let guessstr = document.getElementById("guessstr");
    if (guess_count === 0) guessstr.innerHTML = "YOU LOSE";
    else if (!clue_string.includes("_")) guessstr.innerHTML = "YOU WIN";
    else guessstr.innerHTML = "Guesses: " + guess;
}

function guessLetter() {
    let letter = document.getElementById("hguess").value;
    if (guess.includes(letter)) return;
    if (guess_count === 0 || !document.getElementById("clue").innerHTML.includes("_")) return;

    guess += letter;
    if (!word.includes(letter)) guess_count--;
    updatePage();
}

function innerTest() {
    document.getElementById("innerTest").innerText = prompt();

}

function changeImage() {
    let src = document.getElementById("img");
    console.log(src.src);
    src.src = src.src.includes("IMG_2079.jpg") ? "000073870025.jpg" : "IMG_2079.jpg";
}

let colorNames = ["maroon", "red", "orange", "yellow", "olive", "purple", "fuchsia", "white", "lime", "green", "navy", "blue", "aqua", "teal", "black", "silver", "gray"];


function createColorTable() {
    for (let i = 0; i < colorNames.length; i++) {
        let box = document.createElement("div");
        box.setAttribute("class", "ctbox");
        box.style.display = "inline-block";
        box.style.width = "60px";
        box.style.padding = "10px";
        box.style.backgroundColor = colorNames[i];
        box.innerText = colorNames[i];
        document.getElementById("colorTable").appendChild(box);
    }
}

function removeColorTable() {
    let table = document.getElementById("colorTable");
    let boxes = document.getElementsByClassName("ctbox");
    // let boxes = table.getElementsByTagName("div");
    // let boxes = table.childNodes;


    // while (boxes.length !== 0) {
    //     for (let i = 0; i < boxes.length; i++) table.removeChild(boxes[i]);
    //     boxes = document.getElementsByClassName("ctbox");
    // }

    // while (boxes[0]) table.removeChild(boxes[0]);
    let parent = document.getElementById("colorTable");
    var child = document.getElementsByTagName("div");
    var child = document.getElementsByClassName("ctbox");
    var child = parent.childNodes;
    var child = document.querySelectorAll(".ctbox");
    // while (child[0]) parent.removeChild(child[0]);
    for (let i = 0; i < child.length; i++) {
        parent.removeChild(child[i]);
    }
    // while (table.hasChildNodes()) table.removeChild(table.firstChild);
}

function changeColor() { // Nested function 으로 사용 가능
    let target = document.getElementById("target");
    target.style.backgroundColor = target.style.backgroundColor === "green" ? "yellow" : "green";
    target.style.color = target.style.color === "red" ? "blue" : "red";
}

let change_color = setInterval(changeColor, 1000);

function stopTextColor() {
    clearInterval(change_color);
}


window.addEventListener("load", ready);
function ready() {
    let calculate_button = document.querySelector("#calculate_button");
    calculate_button.addEventListener("click", calc);

    let num_guess = document.querySelector("#num_guess");
    num_guess.addEventListener("click", numGuess);

    let re_play = document.querySelector("#re_play");
    re_play.addEventListener("click", replay);


    let add_word = document.querySelector("#add_word");
    add_word.addEventListener("click", addWord);

    let show_wordlist = document.querySelector("#show_wordlist");
    show_wordlist.addEventListener("click", showWordList);

    let sort_word = document.querySelector("#sort_word");
    sort_word.addEventListener("click", sortWord);

    let shuffle_word = document.querySelector("#shuffle_word");
    shuffle_word.addEventListener("click", shuffleWord);

    let inner_test = document.querySelector("#innerTest");
    inner_test.addEventListener("click", innerTest);


    let change_image = document.querySelector("#change_image");
    change_image.addEventListener("click", changeImage);


    let ctCreate = document.querySelector("#ctCreate");
    ctCreate.addEventListener("click", createColorTable);


    let ctRemove = document.querySelector("#ctRemove");
    ctRemove.addEventListener("click", removeColorTable);

    let stop_text_color = document.querySelector("#stop_text_color");
    stop_text_color.addEventListener("click", stopTextColor);

    let guess_button = document.querySelector("#guessbutton");
    guess_button.addEventListener("click", guessLetter);

    let new_game = document.querySelector("#new_game");
    new_game.addEventListener("click", newGame);

    document.querySelector("#moveBox").addEventListener("click", moveBox);
    changeColor();
    setCTime();

    /*
    using anonymous function
    window.onload = function() {
        document.querySelector("#calculate_button").onclick = calc;
    }
    */
}


/*
function myMove() {
    let ele = #animate
    let pos = 0
    let id = setinterval(frame, 5)
    function frame() {
        if (pos==350) clearinterval(id)
        pos++;
        ele.style.top = pos + "px";
        ele.style.left = pos + "px";
    }
}

*/

function moveBox() {
    let regex = /^[0-9]+ABC$/;
    regex.tes
    let animate_box = document.querySelector("#animate");
    let pos = 0;
    let interval = setInterval(frame, 5);
    function frame() {
        if (pos === 350) clearInterval(interval);
        pos++;
        animate_box.style.top = pos+"px";
        animate_box.style.left = pos+"px";
    }
}
