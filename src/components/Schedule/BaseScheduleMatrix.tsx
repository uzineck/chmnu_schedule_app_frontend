import {useEffect, useMemo, useRef, useState} from "react";
import {Lesson} from "../../models/lesson/Lesson";
import {Day, dayIndexMap, dayOptionsUa} from "../../models/enums/Day";
import {OrdinaryNumber} from "../../models/enums/OrdinaryNumber";
import {getLessonTime} from "../../models/enums/LessonTime";
import LessonDetails from "./Lesson/LessonDetail";
import MultiLessonCard from "./Lesson/MultiLessonCard.tsx";
import {LessonForTeacher} from "../../models/lesson/LessonForTeacher";
import {useNavigate} from "react-router-dom";
import {AiOutlinePlus} from "react-icons/ai";
import {useSchedule} from "./Context/hooks/useSchedule.ts";
import {useTime} from "./Context/hooks/useTime.ts";
import {useMediaQuery} from "../../hooks/useMediaQuery.ts";
import {mq} from "../../styles/media.ts";
import {readExpiringEntry, todayEpoch, writeExpiringEntry} from "../../utils/expiringStorage.ts";
import ScheduleEmptyState from "./ScheduleEmptyState.tsx";
import {
    AddLessonButton,
    AddLessonIcon,
    AddMoreLessonButton,
    AddMoreLessonIcon,
    BodyCell,
    CurrentLessonIndicator,
    DayCell,
    DayTab,
    DayTabsRow,
    EmptySlotText,
    MatrixTable,
    OrdNumber,
    PagerTab,
    PagerTabsRow,
    PhoneScheduleContainer,
    ScheduleMatrixWrapper,
    TimeCell,
    TimeRange,
    TimeslotCard,
    TimeslotList,
    TimeslotOrd,
    TimeslotTimeRow,
    TimeslotTimeText,
} from "./scheduleMatrixStyled.ts";

interface BaseScheduleMatrixProps {
    lessons: Lesson[] | LessonForTeacher[] | null;
    isEditable?: boolean;
    /** Phone view: message shown when the selected day has no lessons but
     *  other days do. Defaults to a group-flavoured wording. */
    emptyDayMessage?: string;
    /** Phone view: hint under the empty-day message. */
    emptyDayHint?: string;
}

const DAY_SHORT_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт"];

type LessonCell = (Lesson | LessonForTeacher)[] | null;

const TABLET_PAGES: { label: string; dayIndices: number[] }[] = [
    { label: "Пн-Ср", dayIndices: [0, 1, 2] },
    { label: "Ср-Пт", dayIndices: [2, 3, 4] },
];

const pageForDayIndex = (dayIndex: number): number => (dayIndex <= 2 ? 0 : 1);

const PHONE_DAY_KEY = "phoneDayMemo";
const TABLET_PAGE_KEY = "tabletPageMemo";

const readStoredIndex = (key: string, max: number): number => {
    const raw = readExpiringEntry(key, todayEpoch());
    if (raw === null) return -1;
    const n = parseInt(raw, 10);
    return Number.isInteger(n) && n >= 0 && n <= max ? n : -1;
};

const BaseScheduleMatrix = ({
    lessons,
    isEditable = false,
    emptyDayMessage = "У цей день пар немає",
    emptyDayHint = "Спробуйте інший день тижня.",
}: BaseScheduleMatrixProps) => {
    const { currentTime } = useTime();
    const { day: lastSelectedDay, isEvenWeek, setOrdinaryNumber, setDay } = useSchedule();
    const navigate = useNavigate();

    const isPhone = useMediaQuery(mq.down('tablet'));
    const isDesktop = useMediaQuery(mq.up('desktop'));
    const isTablet = !isPhone && !isDesktop;

    const todayIndex = currentTime?.day && currentTime.day >= 1 && currentTime.day <= 5
        ? currentTime.day - 1
        : 0;

    const lastSelectedDayIndex = lastSelectedDay !== null
        ? Object.values(Day).indexOf(lastSelectedDay)
        : -1;
    const storedPhoneDayIndex = readStoredIndex(PHONE_DAY_KEY, 4);
    const storedTabletPageIndex = readStoredIndex(TABLET_PAGE_KEY, TABLET_PAGES.length - 1);

    const initialPhoneDayIndex =
        lastSelectedDayIndex >= 0 ? lastSelectedDayIndex
        : storedPhoneDayIndex >= 0 ? storedPhoneDayIndex
        : todayIndex;
    const initialTabletPageIndex =
        storedTabletPageIndex >= 0 ? storedTabletPageIndex
        : pageForDayIndex(initialPhoneDayIndex);

    const [phoneDayIndex, setPhoneDayIndex] = useState<number>(initialPhoneDayIndex);
    const [tabletPageIndex, setTabletPageIndex] = useState<number>(initialTabletPageIndex);
    const didSyncRef = useRef(
        lastSelectedDayIndex >= 0 || storedPhoneDayIndex >= 0 || storedTabletPageIndex >= 0,
    );

    useEffect(() => {
        if (lastSelectedDay !== null) setDay(null);
        // consume-once: only restore the day immediately after coming back
        // from lesson create/edit/delete; subsequent visits default to today
        // (subject to the expiring localStorage memo).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (didSyncRef.current) return;
        if (currentTime?.day == null) return;
        const idx = currentTime.day >= 1 && currentTime.day <= 5 ? currentTime.day - 1 : 0;
        setPhoneDayIndex(idx);
        setTabletPageIndex(pageForDayIndex(idx));
        didSyncRef.current = true;
    }, [currentTime]);

    const handlePhoneDayChange = (idx: number) => {
        setPhoneDayIndex(idx);
        writeExpiringEntry(PHONE_DAY_KEY, idx.toString(), todayEpoch());
    };

    const handleTabletPageChange = (idx: number) => {
        setTabletPageIndex(idx);
        writeExpiringEntry(TABLET_PAGE_KEY, idx.toString(), todayEpoch());
    };

    const matrix = useMemo<LessonCell[][]>(() => {
        const m: LessonCell[][] = Array.from({ length: 7 }, () => Array(5).fill(null));
        lessons?.forEach((lesson) => {
            const dayIndex = Object.values(Day).indexOf(lesson.timeslot.day);
            const ordNumberIndex = lesson.timeslot.ord_number - 1;
            const existing = m[ordNumberIndex][dayIndex];
            if (!existing) {
                m[ordNumberIndex][dayIndex] = [lesson];
            } else {
                existing.push(lesson);
            }
        });
        return m;
    }, [lessons]);

    const handleAddLesson = (dayIndex: number, ordNumberIndex: number) => {
        setDay(dayIndexMap(dayIndex + 1));
        setOrdinaryNumber(ordNumberIndex + 1);
        navigate('lesson/create');
    };

    const isCurrentLessonAt = (rowIndex: number, dayIndex: number) =>
        currentTime?.day === dayIndex + 1 &&
        currentTime?.lesson === rowIndex + 1 &&
        currentTime?.is_even === isEvenWeek;

    if (isPhone) {
        const dayIndex = phoneDayIndex;
        const dayLessons = matrix.map((row) => row[dayIndex]);
        const dayIsEmpty = dayLessons.every((cell) => !cell);

        return (
            <PhoneScheduleContainer>
                <DayTabsRow role="tablist">
                    {DAY_SHORT_LABELS.map((label, idx) => (
                        <DayTab
                            key={idx}
                            type="button"
                            role="tab"
                            aria-selected={idx === phoneDayIndex}
                            active={idx === phoneDayIndex}
                            isToday={idx === todayIndex}
                            onClick={() => handlePhoneDayChange(idx)}
                        >
                            {label}
                        </DayTab>
                    ))}
                </DayTabsRow>
                {dayIsEmpty && !isEditable ? (
                    <ScheduleEmptyState
                        message={emptyDayMessage}
                        hint={emptyDayHint}
                    />
                ) : (
                <TimeslotList>
                    {dayLessons.map((cell, rowIndex) => {
                        const ordinaryNumber = (rowIndex + 1) as OrdinaryNumber;
                        const lessonTime = getLessonTime(ordinaryNumber);
                        const isCurrent = !!cell && isCurrentLessonAt(rowIndex, dayIndex);

                        return (
                            <TimeslotCard key={rowIndex} isCurrentLesson={isCurrent}>
                                <TimeslotTimeRow>
                                    <TimeslotOrd>{ordinaryNumber}</TimeslotOrd>
                                    <TimeslotTimeText>
                                        {lessonTime.startTime} — {lessonTime.endTime}
                                    </TimeslotTimeText>
                                </TimeslotTimeRow>
                                {cell ? (
                                    <>
                                        {!isEditable && cell.length > 1 ? (
                                            <MultiLessonCard lessons={cell} />
                                        ) : (
                                            cell.map((lesson, idx) => (
                                                <LessonDetails
                                                    key={idx}
                                                    lesson={lesson}
                                                    isEditable={isEditable}
                                                />
                                            ))
                                        )}
                                        {isEditable && (
                                            <AddMoreLessonButton
                                                type="button"
                                                onClick={() => handleAddLesson(dayIndex, rowIndex)}
                                            >
                                                <AiOutlinePlus size={18} /> Додати ще
                                            </AddMoreLessonButton>
                                        )}
                                    </>
                                ) : isEditable ? (
                                    <AddLessonButton
                                        type="button"
                                        onClick={() => handleAddLesson(dayIndex, rowIndex)}
                                    >
                                        <AiOutlinePlus size={20} /> Додати заняття
                                    </AddLessonButton>
                                ) : (
                                    <EmptySlotText>—</EmptySlotText>
                                )}
                                {isCurrent && <CurrentLessonIndicator />}
                            </TimeslotCard>
                        );
                    })}
                </TimeslotList>
                )}
            </PhoneScheduleContainer>
        );
    }

    const visibleDayIndices = isTablet
        ? TABLET_PAGES[tabletPageIndex].dayIndices
        : [0, 1, 2, 3, 4];

    return (
        <>
            {isTablet && (
                <PagerTabsRow role="tablist">
                    {TABLET_PAGES.map((page, idx) => (
                        <PagerTab
                            key={idx}
                            type="button"
                            role="tab"
                            aria-selected={idx === tabletPageIndex}
                            active={idx === tabletPageIndex}
                            onClick={() => handleTabletPageChange(idx)}
                        >
                            {page.label}
                        </PagerTab>
                    ))}
                </PagerTabsRow>
            )}
            <ScheduleMatrixWrapper>
                <MatrixTable>
                    <thead>
                    <tr>
                        <TimeCell>Час</TimeCell>
                        {visibleDayIndices.map((dayIndex) => (
                            <DayCell
                                key={dayIndex}
                                isCurrentDay={currentTime?.day === dayIndex + 1}
                            >
                                {dayOptionsUa[dayIndex].label}
                            </DayCell>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {matrix.map((row, rowIndex) => {
                        const ordinaryNumber = (rowIndex + 1) as OrdinaryNumber;
                        const lessonTime = getLessonTime(ordinaryNumber);

                        return (
                            <tr key={rowIndex}>
                                <TimeCell>
                                    <OrdNumber>{ordinaryNumber}</OrdNumber>
                                    <TimeRange>
                                        <span>{lessonTime.startTime}</span>
                                        <span>{lessonTime.endTime}</span>
                                    </TimeRange>
                                </TimeCell>
                                {visibleDayIndices.map((dayIndex) => {
                                    const lessonCell = row[dayIndex];
                                    const isCurrent = !!lessonCell && isCurrentLessonAt(rowIndex, dayIndex);
                                    const isCurrentDay = currentTime?.day === dayIndex + 1;

                                    return (
                                        <BodyCell
                                            key={dayIndex}
                                            hasLesson={!!lessonCell}
                                            isCurrentLesson={isCurrent}
                                            isCurrentDay={isCurrentDay}
                                        >
                                            {lessonCell && (
                                                <div>
                                                    {!isEditable && lessonCell.length > 1 ? (
                                                        <MultiLessonCard lessons={lessonCell} />
                                                    ) : (
                                                        lessonCell.map((lesson, idx) => (
                                                            <LessonDetails
                                                                key={idx}
                                                                lesson={lesson}
                                                                isEditable={isEditable}
                                                            />
                                                        ))
                                                    )}
                                                    {isEditable && (
                                                        <AddMoreLessonIcon
                                                            type="button"
                                                            aria-label="Додати ще одне заняття"
                                                            onClick={() => handleAddLesson(dayIndex, rowIndex)}
                                                        >
                                                            <AiOutlinePlus size={16} />
                                                        </AddMoreLessonIcon>
                                                    )}
                                                </div>
                                            )}
                                            {isEditable && !lessonCell && (
                                                <AddLessonIcon
                                                    type="button"
                                                    aria-label="Додати заняття"
                                                    onClick={() => handleAddLesson(dayIndex, rowIndex)}
                                                >
                                                    <AiOutlinePlus size={20} />
                                                </AddLessonIcon>
                                            )}
                                            {isCurrent && <CurrentLessonIndicator />}
                                        </BodyCell>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </MatrixTable>
            </ScheduleMatrixWrapper>
        </>
    );
};

export default BaseScheduleMatrix;
