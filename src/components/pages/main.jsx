import React from "react";
import players from "../scoring/players"
import StandardGame from "../scoring/standardgame";

function Main() {
    return (
        <div>
            <h1>Tennis App</h1>
            <div class="player">
                <h3>{players[0]}</h3>
                <h4>{StandardGame.player1Score}</h4>
                <button onClick={StandardGame.player1Point}>+</button>
            </div>
            <div class="player">
                <h3>{players[1]}</h3>
                <button onClick={StandardGame.player2Point}>+</button>
            </div>
            
        </div>
    )
}

export default Main;