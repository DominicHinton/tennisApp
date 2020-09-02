// Logic mostly working - problems as follows:
// 1) Bug reversing value of variable "player1IsServing" before match starts

//TODO
//Use a Form to capture detailed stats about points
//Update gameStats Object using form details at end of each point
//Implement logic for break points, breaks of serve etc

import React, {useState, useEffect} from "react";
import players from "./players";

function StandardMatch() {
    console.log("render");
    //Best of how many sets
    let numberOfSets = 3;
    let setsToWin = 0;
    //re-factor this
    while (2 * setsToWin < numberOfSets) {
        setsToWin++;
    }
    //Tie breakers at 6-6
    let decideWithTieBreakers = true;
    //No tie breaker in final set
    let longFinalSet = true;
    //Boolean to aid implementing tie breaker 
    const [gameIsTieBreak, updateGameIsTieBreak] = useState(false);
    //Player1 Can Start As Server for testing - I have a bug reversing value before match starts, setting to false to temporarily fix till bug found.
    const [player1IsServing, updatePlayer1IsServing] = useState(false);
    const [player1StartedTieBreak, updatePlayer1StartedTieBreak] = useState(true);
    //Deal with points to win normal game or tie break (4 or 7)
    let winningPoints;
    //Previous Set Scores for Display
    let [player1PreviousSets, updatePlayer1PreviousSets] = useState([]);
    let [player2PreviousSets, updatePlayer2PreviousSets] = useState([]);

    

    //Object for handling stats
    let gameStats = {
        match : {
            sets : 0,
            games : 0,
            points : 0,
            breaksOfServe : 0
        },
        player1 : {
            sets : 0,
            tieBreaksWon : 0,
            gamesWon : 0,
            pointsWon : 0,
            brokeOpponentServe : 0,
            brokenOnOwnServe : 0,
            firstServePointsPlayed : 0,
            secondServePointsPlayed : 0,
            breakPointsPlayedOnServe : 0,
            breakPointsPlayedOnReturn : 0,
            breakPointsWonOnServe : 0,
            breakPointsWonOnReturn : 0,
            aces : 0,
            doubleFaults : 0,
            winners : 0,
            unforcedErrors : 0

        }
    }
    
    //Points
    const [player1Points, updatePlayer1Points] = useState(0);
    const [player2Points, updatePlayer2Points] = useState(0);
    
    //Games
    const [player1Games, updatePlayer1Games] = useState(0);
    const [player2Games, updatePlayer2Games] = useState(0);

    //Sets
    const [player1Sets, updatePlayer1Sets] = useState(0);
    const [player2Sets, updatePlayer2Sets] = useState(0);

    //Functions

    //PlayerPoints from clicker
    function player1Point() {
        updatePlayer1Points(player1Points + 1);
        console.log(gameStats);
    }
    function player2Point() {
        updatePlayer2Points(player2Points + 1);
        console.log(gameStats);
    }
    //Check if someone won the game
    function checkGameWinner() {
        if (gameIsTieBreak) {
            winningPoints = 7;
            //After first point of tie break, save which player started serving the tie break to allow for determination of server in next set.
            updatePlayer1StartedTieBreak(player1IsServing);

            //In tie break, server changes after odd points
            if ((player1Points + player2Points) % 2 != 0) {
                updatePlayer1IsServing(!player1IsServing);
            }
        } else {
            winningPoints = 4;
        }
        const player1TwoAhead = player1Points - player2Points >= 2;
        const Player1EnoughToWin = player1Points >= winningPoints;

        if (player1TwoAhead && Player1EnoughToWin) {
            updatePlayer1Games(player1Games + 1);
            updatePlayer1Points(0);
            updatePlayer2Points(0);
        } else if (player2Points - player1Points >= 2 && player2Points >= winningPoints) {
            updatePlayer2Games(player2Games + 1)
            updatePlayer1Points(0);
            updatePlayer2Points(0);
        } else {
            console.log(player1Points + " - " + player2Points);
        }
    }
    //Games has ended: Check if someone won the set, change server & handle 6-6 if tiebreak is needed
    function checkSetWinner() {
        //Change the server
        updatePlayer1IsServing(!player1IsServing);
        //Check if just played a tie break and award set to winner
        if (gameIsTieBreak) {
            updatePlayer1IsServing(!player1StartedTieBreak);
            const signal = player1Games - player2Games;
            if (signal === 1)
            {
                updatePlayer1Sets(player1Sets + 1);
                updatePlayer1PreviousSets(player1PreviousSets => [...player1PreviousSets, player1Games]);
                updatePlayer2PreviousSets(player2PreviousSets => [...player2PreviousSets, player2Games]);
            }
            else if (signal === -1)
            {
                updatePlayer2Sets(player2Sets + 1);
                updatePlayer1PreviousSets(player1PreviousSets => [...player1PreviousSets, player1Games]);
                updatePlayer2PreviousSets(player2PreviousSets => [...player2PreviousSets, player2Games]);
            }
            else {
                console.log("Error! After a Tiebreak", player1Games, player2Games);
            }
            updatePlayer1Games(0);
            updatePlayer2Games(0);
            updateGameIsTieBreak(false);
            return;
        }
        //Check if next game needs to be a tie break
        if (decideWithTieBreakers === true && player1Games === 6 && player2Games === 6 && (!longFinalSet || player1Sets + player2Sets + 1 < numberOfSets )) {
            //useState here
            updateGameIsTieBreak(true);
            } else {
            updateGameIsTieBreak(false);
        }
        // if last game wasn't a tie break and next game doesn't need to be
        if (player1Games >= 6 && player1Games - player2Games >= 2) {
            updatePlayer1Sets(player1Sets + 1);
            updatePlayer1PreviousSets(player1PreviousSets => [...player1PreviousSets, player1Games]);
            updatePlayer2PreviousSets(player2PreviousSets => [...player2PreviousSets, player2Games]);
            if (player1Sets < setsToWin) {
                updatePlayer1Games(0);
                updatePlayer2Games(0);
            }
        } else if (player2Games >= 6 && player2Games - player1Games >= 2) {
            updatePlayer2Sets(player2Sets + 1);
            updatePlayer1PreviousSets(player1PreviousSets => [...player1PreviousSets, player1Games]);
            updatePlayer2PreviousSets(player2PreviousSets => [...player2PreviousSets, player2Games]);
            if (player2Sets < setsToWin) {
                updatePlayer1Games(0);
                updatePlayer2Games(0);
            }

        }  
    }
    //Check if match is won
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

    //Use effect
    useEffect(function() {
        checkGameWinner()
    }, [player1Points, player2Points]);

    useEffect(function() {
        checkSetWinner()
    }, [player1Games, player2Games]);

    //Test if superfluous later
    useEffect(function() {
        checkSetWinner()
    }, [gameIsTieBreak]);

    useEffect(function() {
        checkMatchWinner()
    }, [player1Sets, player2Sets]);    
    

    //Display points tennis style
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

    //player1Serving
    function displayPlayer1Serving() {
        if (player1IsServing) {
            return "player1 is Serving";
        }
        else {
            return "player2 is Serving";
        }
    }

    // return jsx for rendering
    return (
        <div>
            <div className="player">
                <div className="row">
                    <div className="col-mid-1 padding-right-3">
                        <button onClick={player1Point}>+</button>
                    </div>
                    <div className="col-mid-5">
                        <h3>{players[0]}</h3>
                    </div>
                    <div className="col-small-1">
                        {player1IsServing && <p>*</p>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-mid-3">
                        <h4>Sets</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>Games</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>Points</h4>
                    </div>
                    <div className="col-mid-1"></div>
                    <div className="col-mid-3">
                        <h4>Previous Sets</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-mid-3">
                        <h4>{player1Sets}</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>{player1Games}</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>{pointsDisplay(player1Points, player2Points)[0]}</h4>
                    </div>
                    <div className="col-mid-1"></div>
                    <div className="col-mid-3">
                        <h4>{player1PreviousSets}</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-mid-3">
                        <input type="checkbox" label="Ace1" value="Ace1" name="Ace1" /> <label htmlFor="Ace1">Ace</label>
                    </div>
                    <div className="col-mid-3">
                        <input type="checkbox" label="SecondServe1" value="SecondServe1" name="SecondServe1" /> <label htmlFor="SecondServe1">Second Serve</label>
                    </div>
                    <div className="col-mid-3">
                        <input type="checkbox" label="DoubleFault1" value="DoubleFault1" name="DoubleFault1" /> <label htmlFor="DoubleFault1">Double Fault</label>
                    </div>
                    <div className="col-mid-3">
                        <input type="checkbox" label="Winner1" value="Winner1" name="Winner1" /> <label htmlFor="Winner1e">Winner</label>
                    </div>
                    <div className="col-mid-3">                        
                        <input type="checkbox" label="UnforcedError1" value="UnforcedError1" name="UnforcedError1" /> <label htmlFor="UnforcedError1">Unforced Error</label>
                    </div>
                </div>     
            </div>
            <hr className="divider"/>
            <div className="player">
                <div className="row">
                    <div className="col-mid-1 padding-right-3">
                        <button onClick={player2Point}>+</button>
                        
                    </div>
                    <div className="col-mid-5">
                        <h3>{players[1]}  </h3>
                    </div>
                    <div className="col-small-1">
                        {!player1IsServing && <p>*</p>}
                    </div>
                </div>      
                <div className="row">
                    <div className="col-mid-3">
                        <h4>Sets</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>Games</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>Points</h4>
                    </div>
                    <div className="col-mid-1"></div>
                    <div className="col-mid-3">
                        <h4>Previous Sets</h4>
                    </div>
                </div>
                <div className="row">
                    <div className="col-mid-3">
                        <h4>{player2Sets}</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>{player2Games}</h4>
                    </div>
                    <div className="col-mid-3">
                        <h4>{pointsDisplay(player1Points, player2Points)[1]}</h4>
                    </div>
                    <div className="col-mid-1"></div>
                    <div className="col-mid-3">
                        <h4>{player2PreviousSets}</h4>
                    </div>
                </div>                  
            </div>
            <hr className="divider"/>
        </div>
    );
}
export default StandardMatch;
