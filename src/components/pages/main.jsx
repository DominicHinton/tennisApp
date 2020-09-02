import React from "react";
import players from "../scoring/players"
import StandardMatch from "../scoring/standardmatch";

function Main() {
    return (
        <div className="match-display">
            <h1 className="title">Tennis Match</h1>
            <StandardMatch />
            
        </div>
    )
}

export default Main;