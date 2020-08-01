// Logic mostly working - problems as follows:
// 1) Tie break not working. (Take a set to 5 games all, then take to 6 - 6, we observe normal games and end up playing long set.)
// 2) Extra click needed at the end of each game to lake scores to 0 and start new game, same issue with sets.

import React, {useState} from "react";
import players from "./players";

function StandardMatch() {

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

    function pointsDisplay(p1, p2) {
        //In tie-break, just return the points as they stand
        if (gameIsTieBreak) {
            return [p1, p2];
        }
        //In non-tie break, deal with 0, 15, 30, 40, A etc
        else {
            let pointsOne;
            let pointsTwo;
            //early points < 40
            if (p1 === 0) {pointsOne = 0;}
            if (p1 === 1) {pointsOne = 15;}
            if (p1 === 2) {pointsOne = 30;}
            if (p2 === 0) {pointsTwo = 0;}
            if (p2 === 1) {pointsTwo = 15;}
            if (p2 === 2) {pointsTwo = 30;}
            //40-less than 40
            if (p1 === 3 && p1 > p2) {pointsOne = 40;}
            if (p2 === 3 && p2 > p1) {pointsTwo = 40;}
            //deuce
            if (p1 === p2 && p1 >= 3) {
                pointsOne = 40;
                pointsTwo = 40;
            }
            //Advantage - this won't deal with any bug where game still ongoing despite player being 9-0 up.
            if (p1 > p2 && p2 >= 3) {
                pointsOne = "A";
                pointsTwo = 40;
            }
            if (p2 > p1 && p1 >= 3) {
                pointsTwo = "A";
                pointsOne = 40;
            }
            return [pointsOne, pointsTwo];
        }

    }

    return (
        <div>
            <div class="player">
                <div class="row">
                    <div class="col-mid-1 padding-right-3">
                        <button onClick={player1Point}>+</button>
                    </div>
                    <div class="col-mid-5">
                        <h3>{players[0]}</h3>
                    </div>
                </div>
                <div class="row">
                    <div class="col-mid-3">
                        <h4>Sets</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>Games</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>Points</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-mid-3">
                        <h4>{player1Sets}</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>{player1Games}</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>{pointsDisplay(player1Points, player2Points)[0]}</h4>
                    </div>
                </div>    
            </div>
            <hr class="divider"/>
            <div class="player">
                <div class="row">
                    <div class="col-mid-1 padding-right-3">
                        <button onClick={player2Point}>+</button>
                    </div>
                    <div class="col-mid-5">
                        <h3>{players[1]}</h3>
                    </div>
                </div>      
                <div class="row">
                    <div class="col-mid-3">
                        <h4>Sets</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>Games</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>Points</h4>
                    </div>
                </div>
                <div class="row">
                    <div class="col-mid-3">
                        <h4>{player2Sets}</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>{player2Games}</h4>
                    </div>
                    <div class="col-mid-3">
                        <h4>{pointsDisplay(player1Points, player2Points)[1]}</h4>
                    </div>
                </div>                  
            </div>
        </div>
    );
}
export default StandardMatch;
