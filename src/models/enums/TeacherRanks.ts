export enum TeacherRanks {
    PROFESSOR = "professor",
    ASSOCIATE_PROFESSOR = "associate_professor",
    SENIOR_LECTURER = "senior_lecturer",
    LECTURER = "lecturer",
    GRADUATE_STUDENT = "graduate_student"
}

export const rankOptionsEn = [
    { value: TeacherRanks.LECTURER, label: "LECTURER" },
    { value: TeacherRanks.SENIOR_LECTURER, label: "SENIOR LECTURER" },
    { value: TeacherRanks.ASSOCIATE_PROFESSOR, label: "ASSOCIATE PROFESSOR" },
    { value: TeacherRanks.PROFESSOR, label: "PROFESSOR" },
    { value: TeacherRanks.GRADUATE_STUDENT, label: "GRADUATE STUDENT" },
];

export const rankOptionsUa = [
    { value: TeacherRanks.LECTURER, label: "Викладач" },
    { value: TeacherRanks.SENIOR_LECTURER, label: "Старший викладач" },
    { value: TeacherRanks.ASSOCIATE_PROFESSOR, label: "Доцент" },
    { value: TeacherRanks.PROFESSOR, label: "Професор" },
    { value: TeacherRanks.GRADUATE_STUDENT, label: "Аспірант" },
];
