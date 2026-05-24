import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "../../Context/hooks/useSchedule.ts";
import EditLessonModal from "../Modals/EditLessonModal.tsx";

const EditLesson = () => {
    const { day, ordinaryNumber, groupUuid, lesson, bumpScheduleRefresh } = useSchedule();
    const navigate = useNavigate();

    useEffect(() => {
        if (!lesson || !day || !ordinaryNumber || !groupUuid) {
            navigate('..', { replace: true });
        }
    }, [lesson, day, ordinaryNumber, groupUuid, navigate]);

    const handleClose = () => {
        navigate('..');
    };

    const handleSuccess = () => {
        bumpScheduleRefresh();
        navigate('..');
    };

    if (!lesson || !day || !ordinaryNumber || !groupUuid) return null;

    return (
        <EditLessonModal
            open={true}
            onClose={handleClose}
            onSuccess={handleSuccess}
        />
    );
};

export default EditLesson;
