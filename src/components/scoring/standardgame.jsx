import React, {useState} from "react";

import players from "./players";


function StandardGame() {
    const [standardGame, updateStandardGame] = useState(
        {player1Score : 0, player2Score : 0});

    function player1Point(previous) {
        updateStandardGame({player1Score : previous.player1Score + 1, player2Score : previous.player2Score});
        return standardGame;
    }

    function player2Point(previous) {
        updateStandardGame({player1Score : previous.player1Score, player2Score : previous.player2Score + 1});
        return standardGame;
    }
    
}
export default StandardGame;