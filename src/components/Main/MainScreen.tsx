import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './MainScreen.css';

const MainScreen = () => {
    const location = useLocation();
    const message = location.state?.logout_message;

    // State to track selected button
    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page);
    };

    return (
        <div className="main-screen">
            <h1>Welcome to the Schedule</h1>

            {message && <p>{message}</p>}

            <div className="button-container">
                <Link
                    to="/group"
                    className={`button ${selectedPage === 'group' ? 'selected' : ''}`}
                    onClick={() => handleButtonClick('group')}
                >
                    Group
                </Link>

                <Link
                    to="/teacher"
                    className={`button ${selectedPage === 'teacher' ? 'selected' : ''}`}
                    onClick={() => handleButtonClick('teacher')}
                >
                    Teacher
                </Link>
            </div>
        </div>
    );
};

export default MainScreen;
