/** A class used to map Payments entity from backend. */
export default class Payments {
  /** Main ID of the entity. */
  uuid?: string;
  /** Date of when the payment was made. */
  paymentDate?: string;
  /** Method by which the payment was made (CASH, CARD). */
  paymentMethod?: string;
  /** Amount that was paid with the payment. */
  amountPaid?: number;
}
