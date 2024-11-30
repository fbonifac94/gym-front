import { UserStatus } from "./enum/user-status";
import { Person } from "./person";

export interface User {
    id: number;
	email: string;
    status: UserStatus;
	expireDate: Date;
    person: Person;
}