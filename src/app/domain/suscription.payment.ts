import { User } from "./user";

export interface SuscriptionPayment {
    id: number;
	amount: number;
	date: Date;
	quantity: number;
	susucriptionQuantityTimeUnits: string;
	user: User;
}