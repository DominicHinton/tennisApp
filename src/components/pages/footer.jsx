import React from "react";

const year = new Date().getFullYear();

function Footer() {
    return (
        <div>
            <p>&copy Dominic Hinton {year}</p>
        </div>
    )
}

export default Footer;