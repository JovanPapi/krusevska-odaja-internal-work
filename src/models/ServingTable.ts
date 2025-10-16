import KitchenOrder from "./KitchenOrder";
import Order from "./Order";
import Waiter from "./Waiter";

/** A class used to map ServingTable entity from backend. */
export default class ServingTable {
  /** Main ID of the entity. */
  uuid?: string;
  /** Code by which serving tables are distinguished. */
  code?: number;
  /** The status of the table. */
  servingTableStatus?: "FREE" | "RESERVED" | "CLOSED";
  /** The waiter that created the table. */
  waiter?: Waiter;
  /** The total price of the table, calculated by its orders and products within. */
  totalPrice?: number;
  /** The amount that has been payed for the table. Can be full payed or partial. */
  amountPaid?: number;
  /** The remaining balance of the table that is updated when some amount is payed. */
  remainingBalance?: number;
  /** List of orders created for the table. */
  listOfOrders: Order[] = [];

  listOfKitchenOrders?: KitchenOrder[] = [];
}
