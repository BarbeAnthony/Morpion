const playerToken = "X";
const iaToken = "O";

const bottomLineTriplet = [0, 1, 2];
const midleLineTriplet = [3, 4, 5];
const topLineTriplet = [6, 7, 8];
const leftColTriplet = [0, 3, 6];
const midleColTriplet = [1, 4, 7];
const rightColTriplet = [2, 5, 8];
const firstDiagTriplet = [0, 4, 8];
const secondDiagTriplet = [2, 4, 6];

init();

function init() {
    for(let i=0; i<=8; i++){
        document.getElementById("btn" + i).setAttribute("onclick", "btClick(" + i + ");");
    }
    document.getElementById("btnPlayAgain").setAttribute("onclick", "resetGrid();");
    document.getElementById("btnResetScores").setAttribute("onclick", "resetScores();");
    displayPlayerTurn();
}

//ACTIONS

function btClick(tileID) {
    var morpionTab;
    var gameState;
    placeTokken(playerToken, tileID);

    morpionTab = getMorpionTab();
    if (gameStateCheck(morpionTab) == 'c') {
        iaPlay(morpionTab);
    }

    morpionTab = getMorpionTab();
    gameState = gameStateCheck(morpionTab);
    if (gameState != 'c') {
        displayEnd(gameStateCheck(morpionTab));
        updateScore(gameState);
        disableAllGrid();
    }
}

function placeTokken(token, tileID) {
    var buttonClicked = document.getElementById("btn" + tileID);
    buttonClicked.innerText = token;
    buttonClicked.disabled = true;
}

function getMorpionTab() {
    var morpionTab = [];
    for (let i = 0; i < 9; i++) {
        morpionTab.push(document.getElementById("btn" + i).innerText);
    }
    return morpionTab;
}

function disableAllGrid() {
    for(let i=0; i<=8; i++){
        document.getElementById("btn" + i).disabled = true;
    }
}

function resetScores() {
    document.getElementById("scorePlayer").innerText = "0";
    document.getElementById("scoreNul").innerText = "0";
    document.getElementById("scoreIA").innerText = "0";
    resetGrid();
}

function resetGrid() {
    var button;
    for(let i=0; i<=8; i++){
        button = document.getElementById("btn" + i);
        button.innerText = "";
        button.disabled = false;
    }
    displayPlayerTurn();
}

//DISPLAY MESSAGES


function displayPlayerTurn() {
    document.getElementById("display").innerText = "Dans quelle case souhaitez-vous jouer?";
}

function displayEnd(gameState) {
    if (gameState == 'd') {
        displayMatchDraw();
    } else if (gameState == playerToken) {
        displayMatchWin();
    } else if (gameState == iaToken) {
        displayMatchLose();
    } else {
        document.getElementById("display").innerText = "Erreur : Etat du jeu inconnu.";
    }
}

function displayMatchDraw() {
    document.getElementById("display").innerText = "Partie terminée : match nul.";
}

function displayMatchWin() {
    document.getElementById("display").innerText = "Partie terminée : vous avez gagné !";
}

function displayMatchLose() {
    document.getElementById("display").innerText = "Partie terminée : vous avez perdu...";
}

//SCORE

function updateScore(gameState) {
    switch (gameState) {
        case playerToken:
            document.getElementById("scorePlayer").innerText = parseInt(document.getElementById("scorePlayer").innerText) +1;
            break;
        case iaToken:
            document.getElementById("scoreIA").innerText = parseInt(document.getElementById("scoreIA").innerText) +1;
            break;
        default:
            document.getElementById("scoreNul").innerText = parseInt(document.getElementById("scoreNul").innerText) +1;
    }
}


//IA

//ETAT DU JEU

function gameStateCheck(morpionTab) {
    if (isGameWin(morpionTab) == 'c') {
        if (isGameOver(morpionTab)) {
            return 'd'; //draw
        } else {
            return 'c'; //continue
        }
    } else {
        return isGameWin(morpionTab); //token du gagnant
    }
}

function isGameWin(morpionTab) {
    if (isWinningTriplet(morpionTab, bottomLineTriplet)) return morpionTab[0];
    if (isWinningTriplet(morpionTab, midleLineTriplet)) return morpionTab[3];
    if (isWinningTriplet(morpionTab, topLineTriplet)) return morpionTab[6];
    if (isWinningTriplet(morpionTab, leftColTriplet)) return morpionTab[0];
    if (isWinningTriplet(morpionTab, midleColTriplet)) return morpionTab[1];
    if (isWinningTriplet(morpionTab, rightColTriplet)) return morpionTab[2];
    if (isWinningTriplet(morpionTab, firstDiagTriplet)) return morpionTab[0];
    if (isWinningTriplet(morpionTab, secondDiagTriplet)) return morpionTab[2];
    return 'c'; //pas encore de gagnant, continuer le jeu
}

function isWinningTriplet(morpionTab, triplet) {
    var firstTile = morpionTab[triplet[0]];
    var secondTile = morpionTab[triplet[1]];
    var thirdTile = morpionTab[triplet[2]];

    if (firstTile != '' && firstTile == secondTile && firstTile == thirdTile) {
        return true;
    }
    return false;
}

function isGameOver(morpionTab) {
    // si le tableau contient au moins un '', la partie n'est pas forcément  terminée
    for (let tile in morpionTab) {
        if (morpionTab[tile] == '') return false;
    }
    return true;
}


//IA adversaire

function iaPlay(morpionTab) {
    var iaPlayedHisTurn = false;

    iaPlayedHisTurn = iaPlayToWin(morpionTab);
    if (iaPlayedHisTurn == false) iaPlayedHisTurn = iaPlayToDefend(morpionTab);
    if (iaPlayedHisTurn == false) iaPlayedHisTurn = iaCenterFree(morpionTab);
    if (iaPlayedHisTurn == false) iaRandomPlay(morpionTab);
}

function iaPlayToWin(morpionTab) {
    return findGameFinisherTripletAndCompleteIt(morpionTab, iaToken);
}

function iaPlayToDefend(morpionTab) {
    return findGameFinisherTripletAndCompleteIt(morpionTab, playerToken);
}

function findGameFinisherTripletAndCompleteIt(morpionTab, potentialWiningToken) {
    if (completeTripletIfGameFinisher(morpionTab, bottomLineTriplet, potentialWiningToken)) return true;
    if (completeTripletIfGameFinisher(morpionTab, midleLineTriplet, potentialWiningToken)) return true;
    if (completeTripletIfGameFinisher(morpionTab, topLineTriplet, potentialWiningToken)) return true;
    if (completeTripletIfGameFinisher(morpionTab, leftColTriplet, potentialWiningToken)) return true;
    if (completeTripletIfGameFinisher(morpionTab, midleColTriplet, potentialWiningToken)) return true;
    if (completeTripletIfGameFinisher(morpionTab, rightColTriplet, potentialWiningToken)) return true;
    if (completeTripletIfGameFinisher(morpionTab, firstDiagTriplet, potentialWiningToken)) return true;
    if (completeTripletIfGameFinisher(morpionTab, secondDiagTriplet, potentialWiningToken)) return true;
    return false;
}

function completeTripletIfGameFinisher(morpionTab, triplet, potentialWiningToken) {
    if (isTripletGameFinisher(morpionTab, triplet) &&
        isSearchedTokenInTriplet(morpionTab, triplet, potentialWiningToken)) {
        playInGameFinisherTile(morpionTab, triplet);
        return true;
    }
    return false;
}

function isTripletGameFinisher(morpionTab, triplet) {
    var firstTile = morpionTab[triplet[0]];
    var secondTile = morpionTab[triplet[1]];
    var thirdTile = morpionTab[triplet[2]];

    if ((firstTile == '' && secondTile != '' && secondTile == thirdTile)            // 1 vide et 2 = 3 non vides
        || (secondTile == '' && firstTile != '' && firstTile == thirdTile)      // 2 vide et 1 = 3 non vides
        || (thirdTile == '' && firstTile != '' && firstTile == secondTile)) {   // 3 vide et 1 = 2 non vides
        return true;
    }
    return false;
}

function isSearchedTokenInTriplet(morpionTab, triplet, potentialWiningToken) {
    return (morpionTab[triplet[0]] == potentialWiningToken || morpionTab[triplet[1]] == potentialWiningToken);
}

function playInGameFinisherTile(morpionTab, triplet) {
    if (morpionTab[triplet[0]] == '') placeTokken(iaToken, triplet[0]);
    else if (morpionTab[triplet[1]] == '') placeTokken(iaToken, triplet[1]);
    else placeTokken(iaToken, triplet[2]);
}

function iaCenterFree(morpionTab) {
    if (morpionTab[4] == '') {
        placeTokken(iaToken, 4);
        return true;
    }
    return false;
}

function iaRandomPlay(morpionTab) {
    //L'IA liste les index des cases vides et en tire un aléatoirement.
    var freeTilesIndexes = [-1, -1, -1, -1, -1, -1, -1, -1];
    var lastUsedIndexInTab = -1;
    var iaMove = -1;

    for (let i = 0; i < morpionTab.length; i++) {
        if (morpionTab[i] == '') {
            lastUsedIndexInTab++;
            freeTilesIndexes[lastUsedIndexInTab] = i;
        }
    }

    iaMove = freeTilesIndexes[randomBox(0, lastUsedIndexInTab)];
    placeTokken(iaToken, iaMove);
}

function randomBox(low, high) {
    //byte aléatoire entre low et high inclus
    return ((Math.floor(Math.random() * (high + 1 - low)) + low));
} 
