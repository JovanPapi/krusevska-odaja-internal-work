import KitchenOrder from "./KitchenOrder";
import Order from "./Order";
import ServingTable from "./ServingTable";

/** A class used to map Waiter entity from backend. */
export default class Waiter {
  /** Main ID of the entity. */
  uuid?: string;
  /** Private code by which waiters are distinguished. Only waiters alone know their codes. */
  code?: number;
  /** First name of the waiter. */
  firstName: string = "";
  /** Last name of the waiter. */
  lastName: string = "";
  /** List of serving tables that are created by the waiter. */
  listOfServingTables?: ServingTable[] = [];
  /** List of orders that are created by the waiter. */
  listOfOrders?: Order[] = [];

  listOfKitchenOrders?: KitchenOrder[] = [];
}
