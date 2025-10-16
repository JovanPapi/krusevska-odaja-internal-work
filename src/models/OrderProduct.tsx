import Product from "./Product";

/** A class used to map OrderProduct entity from backend. */
export default class OrderProduct {
  /** Main ID of the entity. */
  uuid?: string;
  /** The actual product that is selected by the waiter. */
  product?: Product;
  /** Quantity of the selected product. */
  quantity: number = 0;
}
