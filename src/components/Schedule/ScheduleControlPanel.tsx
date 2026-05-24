import { ReactNode } from "react";
import styled from "styled-components";
import { Subgroup } from "../../models/enums/Subgroup.ts";
import {
    ControlPanel,
    ControlPanelBody,
    ScheduleButtonContainer,
    ScheduleScreenControls,
    ScheduleScreenSearchContainer,
} from "./scheduleScreenStyled.ts";
import FilterTabRow from "./FilterTabRow.tsx";
import { formatRelativeUa } from "../../utils/relativeTime.ts";

const LastUpdated = styled.div`
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-top: 12px;
    line-height: 1.2;
    text-align: right;
`;

interface ScheduleControlPanelProps {
    topSlot?: ReactNode;
    searchSlot?: ReactNode;
    showFilters?: boolean;
    hasSubgroups: boolean;
    subgroup?: Subgroup | null;
    onSubgroupChange?: (next: Subgroup) => void;
    weekType: boolean;
    currentWeekType?: boolean | null;
    onWeekTypeChange: (next: boolean) => void;
    /** ISO datetime of the schedule's last update; null hides the indicator. */
    lastUpdatedIso?: string | null;
}

const ScheduleControlPanel = ({
    topSlot,
    searchSlot,
    showFilters = true,
    hasSubgroups,
    subgroup = null,
    onSubgroupChange,
    weekType,
    currentWeekType,
    onWeekTypeChange,
    lastUpdatedIso,
}: ScheduleControlPanelProps) => {
    const lastUpdatedLabel = lastUpdatedIso ? formatRelativeUa(lastUpdatedIso) : null;
    const lastUpdatedNode = lastUpdatedLabel ? (
        <LastUpdated>Оновлено: {lastUpdatedLabel}</LastUpdated>
    ) : null;

    return (
        <ControlPanel>
            {topSlot}
            <ControlPanelBody>
                <ScheduleScreenControls>
                    {searchSlot && (
                        <ScheduleScreenSearchContainer>
                            {searchSlot}
                        </ScheduleScreenSearchContainer>
                    )}
                    {showFilters && (
                        <ScheduleButtonContainer>
                            {hasSubgroups && onSubgroupChange && (
                                <FilterTabRow
                                    label="Підгрупа"
                                    options={[
                                        { label: 'A', value: Subgroup.A },
                                        { label: 'B', value: Subgroup.B },
                                    ]}
                                    selectedValue={subgroup}
                                    onChange={onSubgroupChange}
                                />
                            )}
                            <FilterTabRow
                                label="Тиждень"
                                options={[
                                    { label: 'Над', value: true },
                                    { label: 'Під', value: false },
                                ]}
                                selectedValue={weekType}
                                currentValue={currentWeekType}
                                onChange={onWeekTypeChange}
                            />
                        </ScheduleButtonContainer>
                    )}
                </ScheduleScreenControls>
                {lastUpdatedNode}
            </ControlPanelBody>
        </ControlPanel>
    );
};

export default ScheduleControlPanel;
