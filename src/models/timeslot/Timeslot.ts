import {Day} from "../enums/Day.ts";
import {OrdinaryNumber} from "../enums/OrdinaryNumber.ts";

export interface Timeslot {
    day: Day,
    ord_number: OrdinaryNumber,
    is_even: boolean,
}
