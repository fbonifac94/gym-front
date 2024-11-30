import { ScheduledClass } from "./class.scheduled";
import { Customer } from "./customer";

export interface ScheduledClaszInscription {
    id: number;
    scheduledClasz: ScheduledClass;
    customer: Customer;
}