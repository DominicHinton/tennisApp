// Logic mostly working - currently have a one game and one point lag in scoring which needs a fix


import React, {useState} from "react";
import players from "./players";

//Best of how many sets
let numberOfSets = 3;
let setsToWin = 0;
while (2 * setsToWin < numberOfSets) {
    setsToWin++;
}
//Tie breakers at 6-6
let decideWithTieBreakers = true;
//No tie breaker in final set
let longFinalSet = true;
//Boolean to aid implementing tie breaker
let gameIsTieBreak = false;
//Deal with points to win normal game or tie break (4 or 7)
let winningPoints;

function StandardMatch() {
    
    //Points
    const [player1Points, updatePlayer1Points] = useState(0);
    const [player2Points, updatePlayer2Points] = useState(0);

    function player1Point() {
        updatePlayer1Points(player1Points + 1);
        checkGameWinner();
    }
    function player2Point() {
        updatePlayer2Points(player2Points + 1);
        checkGameWinner();
    }

    //Games
    const [player1Games, updatePlayer1Games] = useState(0);
    const [player2Games, updatePlayer2Games] = useState(0);

    function checkGameWinner() {
        if (gameIsTieBreak) {
            winningPoints = 7;
        } else {
            winningPoints = 4;
        }
        if (player1Points - player2Points >= 2 && player1Points >= winningPoints) {
            updatePlayer1Games(player1Games + 1);
            updatePlayer1Points(0);
            updatePlayer2Points(0);
            checkSetWinner();
        } else if (player2Points - player1Points >= 2 && player2Points >= winningPoints) {
            updatePlayer2Games(player2Games + 1)
            updatePlayer1Points(0);
            updatePlayer2Points(0);
            checkSetWinner();
        } else {
            console.log(player1Points + " - " + player2Points);
        }
    }


    //Sets
    const [player1Sets, updatePlayer1Sets] = useState(0);
    const [player2Sets, updatePlayer2Sets] = useState(0);

    function checkSetWinner() {
        //Check if just played a tie break and award set to winner
        if (gameIsTieBreak) {
            if (player1Games === 7 && player2Games === 6)
            {
                updatePlayer1Sets(player1Sets + 1);
                checkMatchWinner();
                if (player1Sets < setsToWin) {
                    updatePlayer1Games(0);
                    updatePlayer2Games(0);
                }
            }
            if (player2Games === 7 && player1Games === 6)
            {
                updatePlayer2Sets(player2Sets + 1);
                checkMatchWinner();
                if (player2Sets < setsToWin) {
                    updatePlayer1Games(0);
                    updatePlayer2Games(0);
                }
            }
        }
        //Check if next game needs to be a tie break
        if (decideWithTieBreakers === true && player1Games === 6 && player2Games === 6 && (!longFinalSet || player1Sets + player2Sets + 1 < numberOfSets )) {
            gameIsTieBreak = true;
        } else {
            gameIsTieBreak = false;
        }
        // if last game wasn't a tie break and next game doesn't need to be
        if (player1Games >= 6 && player1Games - player2Games >= 2) {
            updatePlayer1Sets(player1Sets + 1);
            checkMatchWinner();
            if (player1Sets < setsToWin) {
                updatePlayer1Games(0);
                updatePlayer2Games(0);
            }
        } else if (player2Games >= 6 && player2Games - player1Games >= 2) {
            updatePlayer2Sets(player2Sets + 1);
            checkMatchWinner();
            if (player2Sets < setsToWin) {
                updatePlayer1Games(0);
                updatePlayer2Games(0);
            }

        }  
    }

    //Match
    function checkMatchWinner() {
        if (player1Sets >= setsToWin) {
            updatePlayer1Points("Winner");
            updatePlayer2Points("Loser");
        }
        if (player2Sets >= setsToWin) {
            updatePlayer2Points("Winner");
            updatePlayer1Points("Loser");
        }
    }

    

    


    return (
        <div>
            <div class="player">
                <h3>{players[0]}</h3>
                <h4>{player1Sets}            {player1Games}             {player1Points}</h4>
                <button onClick={player1Point}>+</button>
            </div>
            <div class="player">
                <h3>{players[1]}</h3>
                <h4>{player2Sets}            {player2Games}              {player2Points}</h4>
                <button onClick={player2Point}>+</button>
            </div>
        </div>
    );
}
export default StandardMatch;
