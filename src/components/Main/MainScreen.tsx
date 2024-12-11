import { useState } from "react";
import { useLocation } from "react-router-dom";
import './module.css';
import ButtonContainer from "../Buttons/ButtonContainer.tsx";

const MainScreen = () => {
    const location = useLocation();
    const message = location.state?.logout_message;

    const [selectedPage, setSelectedPage] = useState<string | null>(null);

    const handleButtonClick = (page: string) => {
        setSelectedPage(page);
    };

    return (
        <div className="main-screen">
            {message && <p>{message}</p>}

            <ButtonContainer
                options={[
                    {
                        label: 'Group',
                        value: 'group',
                        isLink: true,
                        to: '/group'
                    },
                    {
                        label: 'Teacher',
                        value: 'teacher',
                        isLink: true,
                        to: '/teacher'
                    }
                ]}
                selectedValue={selectedPage}
                onChange={handleButtonClick}
            />

        </div>
    );
};

export default MainScreen;
