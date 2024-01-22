// MenuButton.js
import React from 'react';

function MenuButton({ onClick, isDarkMode }) {
    return (
        <button style={getButtonStyle(isDarkMode)} onClick={onClick}>
            &#x2630; {/* Unicode character for the hamburger menu */}
        </button>
    );
}

const getButtonStyle = (isDarkMode) => {
    const buttonStyle = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        fontSize: '24px',  // Adjust the font size to control the icon size
        backgroundColor: isDarkMode ? '#555' : '#4CAF50',
        color: '#fff',  // Set text color to white
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
    };

    return buttonStyle;
};

export default MenuButton;
