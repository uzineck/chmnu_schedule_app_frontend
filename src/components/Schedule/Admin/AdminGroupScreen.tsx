import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Subgroup } from "../../../models/enums/Subgroup.ts";
import { Group } from "../../../models/group/Group.ts";
import ButtonContainer from "../../Buttons/ButtonContainer.tsx";
import { useTime } from "../Context/hooks/useTime.ts";
import GroupSearch from "../Group/GroupSearch.tsx";
import GroupSchedule from "../Group/GroupSchedule.tsx";
import { useSchedule } from "../Context/hooks/useSchedule.ts";
import { message } from "antd";
import {ScheduleButtonContainer, ScheduleScreen, ScheduleScreenControls} from "../scheduleScreenStyled.ts";

const AdminGroupScreen = () => {
    const { groupUuid } = useParams<{ groupUuid: string }>();
    const [searchParams] = useSearchParams();
    const { group, subgroup, isEvenWeek, setSubgroup, setIsEvenWeek, setGroupUuid, setGroup } = useSchedule();
    const { currentTime } = useTime();
    const [groupList, setGroupList] = useState<Group[]>([]);

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const location = useLocation();
    const isInitialized = useRef(false);

    const updateURL = useCallback(
        (group: Group | null, subgroup: Subgroup | null, weekType: boolean) => {
            if (!group) return;

            const basePath = `/admin/schedule/manage/group/${group.uuid}`;
            const queryParams = new URLSearchParams({
                weekType: weekType.toString(),
                ...(group.has_subgroups && { subgroup: subgroup || "" }),
            });

            navigate(`${basePath}/lessons?${queryParams.toString()}`, { replace: true });
        },
        [navigate]
    );

    const resolveSubgroup = useCallback(
        (group: Group | null) => {
            const storedSubgroup = localStorage.getItem("lastSubgroup");
            if (group?.has_subgroups) {
                const subgroup = searchParams.get("subgroup") || storedSubgroup;
                setSubgroup(subgroup === Subgroup.B ? Subgroup.B : Subgroup.A);
            } else {
                setSubgroup(null);
            }
        },
        [setSubgroup, searchParams]
    );

    const resolveWeekType = useCallback(() => {
        const weekTypeFromSearchParams = searchParams.get("weekType");
        const storedWeekType = localStorage.getItem("lastWeekType");
        if (weekTypeFromSearchParams) {
            return weekTypeFromSearchParams === "true";
        } else if (storedWeekType) {
            return storedWeekType === "true";
        } else if (currentTime) {
            const currentTimeWeekType =  currentTime.is_even;
            localStorage.setItem("lastWeekType", currentTimeWeekType.toString());
            return currentTimeWeekType;
        }
    }, [searchParams, currentTime]);

    useEffect(() => {
        const storedGroupUuid = localStorage.getItem("lastGroupUuid");
        let initialGroup = null;

        if (groupUuid && groupList.length > 0) {
            initialGroup = groupList.find((g) => g.uuid === groupUuid);
        } else if (storedGroupUuid && groupList.length > 0) {
            initialGroup = groupList.find((g) => g.uuid === storedGroupUuid);
        }

        if (initialGroup) {
            setGroup(initialGroup);
            setGroupUuid(initialGroup.uuid);
        }
        resolveSubgroup(initialGroup || null);

        const weekType = resolveWeekType();
        setIsEvenWeek(weekType || false);

        if (initialGroup) {
            isInitialized.current = true;
        }
    }, [setIsEvenWeek, resolveSubgroup, resolveWeekType, setGroup, groupUuid, groupList, setGroupUuid]);

    useEffect(() => {
        if (isInitialized.current) {
            updateURL(group, subgroup, isEvenWeek);
        }
    }, [group, subgroup, isEvenWeek, updateURL]);

    const handleGroupSelect = (group: Group | null) => {
        if (group) {
            setGroup(group);
            setGroupUuid(group.uuid);
            resolveSubgroup(group || null);
        }
        if (group) {
            localStorage.setItem("lastGroupUuid", group.uuid);
        }
    };

    const handleSubgroupChange = (selectedSubgroup: Subgroup) => {
        setSubgroup(selectedSubgroup);
        localStorage.setItem("lastSubgroup", selectedSubgroup);
    };

    const handleWeekTypeChange = (weekType: boolean) => {
        setIsEvenWeek(weekType);
        localStorage.setItem("lastWeekType", weekType.toString());
    };

    const handleGroupListFetched = (groups: Group[]) => {
        setGroupList(groups);
    };

    useEffect(() => {
        const deleteLesson = location.state?.deleteLesson;
        const deleteLessonError = location.state?.deleteLessonError;
        const addLesson = location.state?.addLesson;
        const addLessonError = location.state?.addLessonError;
        const editLesson = location.state?.updateLesson;
        const editLessonError = location.state?.updateLessonError;
        const incorrectUsageError = location.state?.incorrectUsageError;

        const successMessage = deleteLesson || addLesson || editLesson;
        const errorMessage = deleteLessonError || addLessonError || editLessonError;
        const warningMessage = incorrectUsageError;

        if (successMessage) {
            messageApi.success({ content: successMessage, duration: 2 });
        }

        if (errorMessage) {
            messageApi.error({ content: errorMessage, duration: 3 });
        }

        if (warningMessage) {
            messageApi.warning({ content: warningMessage, duration: 3 });
        }
    }, [location.state, messageApi]);

    return (
        <ScheduleScreen>
            {contextHolder}
            <ScheduleScreenControls>
                <GroupSearch
                    onGroupSelect={handleGroupSelect}
                    onGroupListFetched={handleGroupListFetched}
                    selectedGroup={group}
                />
                <ScheduleButtonContainer>
                    {group?.has_subgroups ? (
                        <ButtonContainer
                            options={[
                                { label: "Підгрупа A", value: Subgroup.A },
                                { label: "Підгрупа B", value: Subgroup.B },
                            ]}
                            selectedValue={subgroup}
                            onChange={handleSubgroupChange}
                        />
                    ) : null}
                    <ButtonContainer
                        options={[
                            { label: "Тиждень над", value: true },
                            { label: "Тиждень під", value: false },
                        ]}
                        selectedValue={isEvenWeek}
                        onChange={handleWeekTypeChange}
                    />
                </ScheduleButtonContainer>
            </ScheduleScreenControls>
            {groupUuid && isInitialized.current && (
                <GroupSchedule
                    key={`${groupUuid}-${subgroup}-${isEvenWeek}`}
                    groupUuid={groupUuid}
                    subgroup={subgroup}
                    is_even={isEvenWeek}
                    isEditable={true}
                />
            )}
        </ScheduleScreen>
    );
};

export default AdminGroupScreen;
