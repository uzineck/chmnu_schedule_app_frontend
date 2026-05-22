import React from "react";
import {useLocation} from "react-router-dom";
import {ControlPanelTab, ControlPanelTabs} from "./scheduleScreenStyled.ts";

const ScheduleNavSwitcher: React.FC = () => {
    const location = useLocation();
    const isTeacher = location.pathname.startsWith('/teacher');

    return (
        <ControlPanelTabs role="tablist">
            <ControlPanelTab to="/group" $active={!isTeacher} role="tab" aria-selected={!isTeacher}>
                Групи
            </ControlPanelTab>
            <ControlPanelTab to="/teacher" $active={isTeacher} role="tab" aria-selected={isTeacher}>
                Викладачі
            </ControlPanelTab>
        </ControlPanelTabs>
    );
};

export default ScheduleNavSwitcher;
