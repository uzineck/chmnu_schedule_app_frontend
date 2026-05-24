import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "../../Context/hooks/useSchedule.ts";
import CreateLessonModal from "../Modals/CreateLessonModal.tsx";

const CreateLesson = () => {
    const { day, ordinaryNumber, groupUuid, bumpScheduleRefresh } = useSchedule();
    const navigate = useNavigate();

    // Direct hit on the route URL (refresh / deep-link) — context is empty,
    // so just step back up to the schedule and let it render normally.
    useEffect(() => {
        if (!day || !ordinaryNumber || !groupUuid) {
            navigate('..', { replace: true });
        }
    }, [day, ordinaryNumber, groupUuid, navigate]);

    const handleClose = () => {
        navigate('..');
    };

    const handleSuccess = () => {
        bumpScheduleRefresh();
        navigate('..');
    };

    if (!day || !ordinaryNumber || !groupUuid) return null;

    return (
        <CreateLessonModal
            open={true}
            onClose={handleClose}
            onSuccess={handleSuccess}
        />
    );
};

export default CreateLesson;
