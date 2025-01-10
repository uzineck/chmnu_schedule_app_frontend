export enum Day {
    MONDAY = "MN",
    TUESDAY = "TS",
    WEDNESDAY = "WD",
    THURSDAY = "TH",
    FRIDAY = "FR",
}

export const dayOptionsUa = [
    { value: Day.MONDAY, label: "Понеділок" },
    { value: Day.TUESDAY, label: "Вівторок" },
    { value: Day.WEDNESDAY, label: "Середа" },
    { value: Day.THURSDAY, label: "Четвер" },
    { value: Day.FRIDAY, label: "П'ятниця" },
];

export const dayOptionsEn = [
    { value: Day.MONDAY, label: "Monday" },
    { value: Day.TUESDAY, label: "Tuesday" },
    { value: Day.WEDNESDAY, label: "Wednesday" },
    { value: Day.THURSDAY, label: "Thursday" },
    { value: Day.FRIDAY, label: "Friday" },
];

export const dayIndexMap = ((dayIndex: number) => {
    switch (dayIndex) {
        case 1:
            return Day.MONDAY;
        case 2:
            return Day.TUESDAY;
        case 3:
            return Day.WEDNESDAY;
        case 4:
            return Day.THURSDAY;
        case 5:
            return Day.FRIDAY;
        default:
            return Day.MONDAY;
    }
});