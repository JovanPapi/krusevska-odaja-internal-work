import Order from "./Order";
import OrderProduct from "./OrderProduct";
import ServingTable from "./ServingTable";
import Waiter from "./Waiter";

export default class KitchenOrder {
  /** Main id of the entity. */
  uuid?: string;

  completed?: boolean;

  waiter?: Waiter;

  order?: Order;

  servingTable?: ServingTable;

  listOfOrderProducts?: OrderProduct[];
}
