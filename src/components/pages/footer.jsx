import React from "react";

const year = new Date().getFullYear();

function Footer() {
    return (
        <div class="centred">
            <p>&copy; Dominic Hinton {year}</p>
        </div>
    )
}

export default Footer;