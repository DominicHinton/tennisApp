import React from "react";
import players from "../scoring/players"
import StandardGame from "../scoring/standardgame";

const game = StandardGame();

function Main() {
    return (
        <div>
            <h1>Tennis App</h1>
            <div class="player">
                <h3>{players[0]}</h3>
                <h4>{game.player1Score}</h4>
                <button onClick={game.player1Point}>+</button>
            </div>
            <div class="player">
                <h3>{players[1]}</h3>
                <button onClick={game.player2Point}>+</button>
            </div>
            
        </div>
    )
}

export default Main;