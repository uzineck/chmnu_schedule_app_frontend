
export enum LessonType {
  LECTURE = 'lecture',
  PRACTICE = 'practice',
}

export const lessonTypeOptionsUa = [
  { value: LessonType.LECTURE, label: "Лекція" },
  { value: LessonType.PRACTICE, label: "Практика" },
];

export const lessonTypeOptionsEn = [
  { value: LessonType.LECTURE, label: "Lecture" },
  { value: LessonType.PRACTICE, label: "Practice" },
];