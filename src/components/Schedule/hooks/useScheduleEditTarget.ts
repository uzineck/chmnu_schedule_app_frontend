import { useSchedule } from "../Context/hooks/useSchedule.ts";
import { useAuth } from "../../Auth/Context/hooks/useAuth.ts";
import { ClientRole } from "../../../models/enums/ClientRole.ts";
import type { ScheduleEditMode } from "../Context/ScheduleContext.tsx";

interface ScheduleEditTarget {
    mode: ScheduleEditMode;
}

/**
 * Resolves which schedule editor the user is acting in.
 *
 * Prefers the context flag set by AdminGroupScreen / HeadmanGroupScreen on mount.
 * Falls back to role inference only if the user reached a lesson action route
 * without going through a schedule screen (the action itself already guards
 * against missing groupUuid / lessonUuid).
 *
 * Role inference biases toward 'admin' when the user has both ADMIN /
 * SCHEDULE_MANAGER and HEADMAN — picking 'headman' here would route writes
 * to the headman's own group regardless of which group they actually opened.
 */
export const useScheduleEditTarget = (): ScheduleEditTarget => {
    const { scheduleEditMode } = useSchedule();
    const { client } = useAuth();

    const inferredMode: ScheduleEditMode =
        client?.roles.some(
            (role) => role === ClientRole.ADMIN || role === ClientRole.SCHEDULE_MANAGER,
        )
            ? 'admin'
            : 'headman';

    const mode = scheduleEditMode ?? inferredMode;

    return { mode };
};
