import KitchenOrder from "./KitchenOrder";
import OrderProduct from "./OrderProduct";
import Waiter from "./Waiter";

/** A class used to map Order entity from backend. */
export default class Order {
  /** Main id of the entity. */
  uuid?: string;
  /** Code of order, used to prioritize the order. */
  code?: number;
  /** Total price of the order, calculated from each product it contains. */
  totalPrice?: number;
  /** When was the order created. */
  creationDate?: string;
  /** The waiter that created the order. */
  waiter?: Waiter;
  /** List of products of which the order is made. */
  listOfOrderProducts?: OrderProduct[] = [];
  listOfKitchenOrders?: KitchenOrder[] = [];
}
