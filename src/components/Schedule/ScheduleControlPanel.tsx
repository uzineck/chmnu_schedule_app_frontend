import { ReactNode } from "react";
import { Subgroup } from "../../models/enums/Subgroup.ts";
import {
    ControlPanel,
    ControlPanelBody,
    ScheduleButtonContainer,
    ScheduleScreenControls,
    ScheduleScreenSearchContainer,
} from "./scheduleScreenStyled.ts";
import FilterTabRow from "./FilterTabRow.tsx";

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
}: ScheduleControlPanelProps) => {
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
            </ControlPanelBody>
        </ControlPanel>
    );
};

export default ScheduleControlPanel;
