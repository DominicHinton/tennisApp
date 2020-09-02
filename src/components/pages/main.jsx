import React from "react";
import players from "../scoring/players"
import StandardMatch from "../scoring/standardmatch";

function Main() {
    return (
        <div class="match-display">
            <h1 class="title">Tennis Match</h1>
            <StandardMatch />
            
        </div>
    )
}

export default Main;