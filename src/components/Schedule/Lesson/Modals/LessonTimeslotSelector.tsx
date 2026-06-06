import { OrdinaryNumber } from "../../../../models/enums/OrdinaryNumber.ts";
import { Subgroup } from "../../../../models/enums/Subgroup.ts";
import {
    TimeslotSection,
    TimeslotSectionTitle,
    TimeslotRow,
    TimeslotRowLabel,
    TimeslotChip,
} from "./lessonModalStyled.ts";

const weekOptions: { value: boolean; label: string }[] = [
    { value: true, label: "Над" },
    { value: false, label: "Під" },
];

const ordOptions: OrdinaryNumber[] = Object.values(OrdinaryNumber).filter(
    (v): v is OrdinaryNumber => typeof v === "number",
);

interface LessonTimeslotSelectorProps {
    currentOrd: OrdinaryNumber;
    currentIsEven: boolean;
    currentSubgroup: Subgroup | null;
    extraOrds: Set<OrdinaryNumber>;
    extraWeeks: Set<boolean>;
    extraSubgroups: Set<Subgroup>;
    onExtraOrdsChange: (ords: Set<OrdinaryNumber>) => void;
    onExtraWeeksChange: (weeks: Set<boolean>) => void;
    onExtraSubgroupsChange: (subgroups: Set<Subgroup>) => void;
}

const LessonTimeslotSelector = ({
    currentOrd,
    currentIsEven,
    currentSubgroup,
    extraOrds,
    extraWeeks,
    extraSubgroups,
    onExtraOrdsChange,
    onExtraWeeksChange,
    onExtraSubgroupsChange,
}: LessonTimeslotSelectorProps) => {
    const toggleOrd = (ord: OrdinaryNumber) => {
        if (ord === currentOrd) return;
        const next = new Set(extraOrds);
        if (next.has(ord)) next.delete(ord); else next.add(ord);
        onExtraOrdsChange(next);
    };

    const toggleWeek = (isEven: boolean) => {
        if (isEven === currentIsEven) return;
        const next = new Set(extraWeeks);
        if (next.has(isEven)) next.delete(isEven); else next.add(isEven);
        onExtraWeeksChange(next);
    };

    const toggleSubgroup = (sg: Subgroup) => {
        if (sg === currentSubgroup) return;
        const next = new Set(extraSubgroups);
        if (next.has(sg)) next.delete(sg); else next.add(sg);
        onExtraSubgroupsChange(next);
    };

    return (
        <TimeslotSection>
            <TimeslotSectionTitle>Дублювати на</TimeslotSectionTitle>

            <TimeslotRow>
                <TimeslotRowLabel>Тиждень:</TimeslotRowLabel>
                {weekOptions.map(({ value, label }) => {
                    const isCurrent = value === currentIsEven;
                    const isActive = isCurrent || extraWeeks.has(value);
                    return (
                        <TimeslotChip
                            key={String(value)}
                            type="button"
                            $active={isActive}
                            $current={isCurrent}
                            onClick={() => toggleWeek(value)}
                        >
                            {label}
                        </TimeslotChip>
                    );
                })}
            </TimeslotRow>

            <TimeslotRow>
                <TimeslotRowLabel>Пара:</TimeslotRowLabel>
                {ordOptions.map((ord) => {
                    const isCurrent = ord === currentOrd;
                    const isActive = isCurrent || extraOrds.has(ord);
                    return (
                        <TimeslotChip
                            key={ord}
                            type="button"
                            $active={isActive}
                            $current={isCurrent}
                            onClick={() => toggleOrd(ord)}
                        >
                            {ord}
                        </TimeslotChip>
                    );
                })}
            </TimeslotRow>

            <TimeslotRow>
                <TimeslotRowLabel>Підгрупа:</TimeslotRowLabel>
                {currentSubgroup !== null ? (
                    Object.values(Subgroup).map((sg) => {
                        const isCurrent = sg === currentSubgroup;
                        const isActive = isCurrent || extraSubgroups.has(sg);
                        return (
                            <TimeslotChip
                                key={sg}
                                type="button"
                                $active={isActive}
                                $current={isCurrent}
                                onClick={() => toggleSubgroup(sg)}
                            >
                                {sg}
                            </TimeslotChip>
                        );
                    })
                ) : (
                    <TimeslotChip type="button" $active $current>
                        Уся група
                    </TimeslotChip>
                )}
            </TimeslotRow>
        </TimeslotSection>
    );
};

export default LessonTimeslotSelector;
