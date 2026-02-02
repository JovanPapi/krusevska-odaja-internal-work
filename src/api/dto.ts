import Order from "../models/Order";
import OrderProduct from "../models/OrderProduct";
import Payments from "../models/Payments";

/** Interface that defines a shape of object used in HTTP request as body, meant for creating new serving table with first order. */
export interface CreateTableWithFirstOrderDTO {
  /** ID of the waiter that creates the table. */
  waiterUuid?: string;
  /** Code of the serving table chosen by the waiter. */
  servingTableCode?: number;
  /** OrderDTO object that describes the order of the customer, created by the waiter. */
  orderDTO?: OrderDTO;
}

/** Interface that defines a shape of object used in HTTP request as body, meant for saving new customer order to an existing table. */
export interface SaveNewOrderToTableDTO {
  /** ID of the existing serving table, chosen by the waiter. */
  servingTableUuid: string;
  /** ID of the waiter. */
  waiterUuid: string;
  /** OrderDTO object that contains the new customer order, created by the waiter. */
  orderDTO?: OrderDTO;
}

/** Interface that defines a shape of object used in HTTP request as body, meant for paying a table full price or some other amount of the table price. */
export interface PayTablePriceDTO {
  /** ID of the existing serving table, chosen by the waiter. */
  servingTableUuid: string;
  /** ID of the waiter. */
  waiterUuid: string;
  /** The amount to pay of the table price. */
  amountToPay: number;
}

/** Interface that defines a shape of object meant to be mapped inside a table and display all payments made in certain day or time.
 *
 *  Used only by admins in administration page.
 */
export interface PaymentDTO {
  /** Main ID of the payment record saved in the database */
  uuid?: string;
  /** Date of when was the payment made. */
  paymentDate?: string;
  /** Method that describes how was the payment executed (CASH, CARD). */
  paymentMethod?: string;
  /** How much did the customer paid. */
  amountPaid?: number;
  /** Name of the waiter who made the payment. */
  waiter?: { firstName: string; lastName: string };
}

/** Interface that defines a shape of object used in HTTP request as body, meant to process admin data and logs him in the application if request data is correct. */
export interface AdminDTO {
  username: string;
  /** Password of the admin account. */
  password: string;
}

export interface UserProfile {
  uuid: number;
  firstName: string;
  lastName: string;
  username: string;
}

/** Interface that defines a shape of object meant to be mapped inside a table and display all serving tables from the database.
 *
 * Used only by admins in adminstration page.
 */
export interface ServingTableDTO {
  /** Main ID of the serving table record in the DB. */
  uuid?: string;
  /** Code of the table. Used to dintinguish tables. */
  code?: number;
  /** Total price of the table, based on all orders made on that table. */
  totalPrice?: number;
  /** Amount paid of the table full price. */
  amountPaid?: number;
  /** Remaining balance of the table full price. Calculated after some amount is paid. */
  remainingBalance?: number;
  /** Status of the table (OPEN, CLOSED). */
  servingTableStatus?: string;
  /** Name of the waiter that is responsible for the table. */
  waiter?: { firstName: string; lastName: string };
  /** All orders made for the table. */
  listOfOrders?: Order[];
  /** All payments made for the table. */
  listOfPayments?: Payments[];
}

export interface UpdateServingTableDTO {
  uuid?: string;
  code?: number;
  waiterUuid?: string;
}

/** Interface that defines a shape of object meant for declaring list of order products properties in certain interfaces. */
export interface OrderDTO {
  /** Code of the order (1,2,3 etc.) that is incrementet automatically when saved in the DB. */
  code?: number;
  /** List of products inside the order. */
  listOfOrderProducts?: OrderProduct[];
}

/** Interface that defines a shape of object used as a request body for updating waiter. */
export interface UpdateWaiterDTO {
  /** Unique id of waiter. */
  uuid?: string;
  /** Unique Code of the waiter. */
  code?: number;
  /** First name of waiter. */
  firstName?: string;
  /** Last name of waiter. */
  lastName?: string;
}
