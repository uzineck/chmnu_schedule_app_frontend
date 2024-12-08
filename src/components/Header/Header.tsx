import { useState } from "react";
import "./style.css";
import Login from "../Login";
import React from 'react';

export const Header: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    const handleLoginClick = () => {
        setIsLoginOpen(true);
    };

    const handleCloseLogin = () => {
        setIsLoginOpen(false);
    };

    return (
        <>
            <header className="header">
                <h1 className="header-title">Schedule</h1>
                <div className="header-buttons">
                    <button className="header-button" onClick={handleLoginClick}>
                        Login
                    </button>
                    <button className="header-button">Sign Up</button>
                </div>
            </header>

            {isLoginOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={handleCloseLogin}>
                            ×
                        </button>
                        <Login onClose={handleCloseLogin} />
                    </div>
                </div>
            )}
        </>
    );
};
