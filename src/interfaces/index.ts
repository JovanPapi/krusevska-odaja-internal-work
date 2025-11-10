import { ServingTableDTO } from "../api/dto";

/** Interface that defines shape of object meant for active page local state. */
export interface ActivePageStateProps {
  /** Property with type boolean, indicating if administration page is active or not. */
  administrationPage: boolean;
  /** Property with type boolean, indicating if waiter page is active or not. */
  waiterPage: boolean;
  /** Property with type boolean, indicating if kitchen page is active or not. */
  kitchenPage: boolean;
}

export interface AdministrationAppActivePage {
  productsPage: boolean;
  ingredientsPage: boolean;
  waitersPage: boolean;
  servingtablesPage: boolean;
  paymentsPage: boolean;
}

/** Interface that defines shape of object meant for authorization modal component. */
export interface AuthorizationModalStateProps {
  /** Property with type boolean, indicating is the modal is open or closed. */
  modalOpen: boolean;
  /** Property with type ActivePageStateProps, object that contains information of which page is currently active (admin, waiter, kitchen). */
  activePage: ActivePageStateProps;
}

/** Interface that defines shape of object meant for opening order of selected serving table in a modal. */
export interface ViewOrdersModalState {
  /** Property with type boolean, indicating if view orders modal component is open or closed. */
  viewOrdersModalOpen: boolean;
  /** Property with type ServingTableDTO, object that contains the selected serving table. */
  selectedServingTable?: ServingTableDTO;
}

/** Interface that defines shape of object used in HTTP requests as body, meant for deliting a specific product of selected order. */
export interface DeleteProductFromOrderDTO {
  /** ID of the selected order. */
  orderUuid: string;
  /** ID of the specific product from the selected order. */
  orderProductUuid: string;
}
