import { Day } from "./day";
import { Status } from "./enum/status";
import { Schedule } from "./schedule";
import { Teacher } from "./teacher";

export interface Clasz {
    id: number;
    day: Day;
    initSchedule: Schedule;
    endSchedule: Schedule;
    teacher: Teacher;
    name: string;
    classPersonsAmount: number;
    status: Status;
}