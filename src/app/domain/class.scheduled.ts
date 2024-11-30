import { Clasz } from "./clasz";
import { Status } from "./enum/status";
import { Teacher } from "./teacher";

export interface ScheduledClass {
    id: number;
	initDateTime: Date;
	endDateTime: Date;
	actualClassPersonsAmount: number;
	totalClassPersonsAmount: number;
	clasz: Clasz;
	teacher: Teacher;
	status: Status;
}