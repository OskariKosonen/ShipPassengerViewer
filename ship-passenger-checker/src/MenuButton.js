// MenuButton.js
import React from 'react';

function MenuButton({ onClick }) {
    return (
        <button style={buttonStyle} onClick={onClick}>
            &#x2630; {/* Unicode character for the hamburger menu */}
        </button>
    );
}

const buttonStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    fontSize: '24px',  // Adjust the font size to control the icon size
    backgroundColor: '#4CAF50',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
};

export default MenuButton;
