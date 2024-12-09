import "./style.css";
import { Link } from "react-router-dom";
import React from 'react';
import {useAuth} from "../Auth/AuthProvider.tsx";

export const Header: React.FC = () => {
    const { isLoggedIn } = useAuth();

    return (
        <>
            <header className="header">
                <Link to="/" className="header-title">
                    <h1>Schedule</h1>
                </Link>
                <div className="header-buttons">
                    {isLoggedIn ? (
                        <Link to="/logout" className="header-button">
                            Logout
                        </Link>
                    ) : (
                        <Link to="/login" className="header-button">
                            Login
                        </Link>
                    )}
                </div>
            </header>
        </>
    );
};
