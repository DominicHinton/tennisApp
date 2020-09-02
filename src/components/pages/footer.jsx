import React from "react";

const year = new Date().getFullYear();

function Footer() {
    return (
        <div className="centred">
            <p>&copy; Dominic Hinton {year}</p>
        </div>
    )
}

export default Footer;