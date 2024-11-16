import {EntityWithUuid} from "../EntityWithUuid.ts";
import {LessonType} from "../enums/LessonType.ts";
import {Subject} from "../subject/Subject.ts";
import {Teacher} from "../teacher/Teacher.ts";
import {Room} from "../room/Room.ts";
import {Timeslot} from "../timeslot/Timeslot.ts";

export interface Lesson extends EntityWithUuid{
    type: LessonType;
    subject: Subject;
    teacher: Teacher;
    room: Room;
    timeslot: Timeslot;
}