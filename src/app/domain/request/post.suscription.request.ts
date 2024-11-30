import { SuscriptionTimeUnits } from "../enum/suscription.time.units";

export interface PostSuscriptionPaymentRequest {
	amount: number;
	suscriptionQuantity: number;
	susucriptionQuantityTimeUnits: SuscriptionTimeUnits;
}