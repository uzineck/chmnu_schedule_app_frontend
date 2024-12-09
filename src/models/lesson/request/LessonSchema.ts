import {LessonType} from "../../enums/LessonType.ts";
import {Timeslot} from "../../timeslot/Timeslot.ts";

export interface LessonSchema {
    schema : {
        subject_uuid: string;
        teacher_uuid: string;
        room_uuid: string;
    }
    lesson_schema : {
        type: LessonType;
        timeslot: Timeslot;
    }
}