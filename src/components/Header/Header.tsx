import "./style.css";

export const Header = () => {
    return (
        <header className="header">
            <h1 className="header-title">Schedule</h1>
            <div className="header-buttons">
                <button className="header-button">Login</button>
                <button className="header-button">Sign Up</button>
            </div>
        </header>
    );
};
