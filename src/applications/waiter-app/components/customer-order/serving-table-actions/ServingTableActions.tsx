import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { FaCheckDouble, FaMoneyCheck } from "react-icons/fa";
import { PiNewspaperFill } from "react-icons/pi";
import { useIntl } from "react-intl";
import {
  CreateTableWithFirstOrderDTO,
  SaveNewOrderToTableDTO,
} from "../../../../../api/dto";
import RestServices from "../../../../../api/services";
import OrderProduct from "../../../../../models/OrderProduct";
import { useApplicationStoreSelector } from "../../../../../store/ApplicationStore";
import ChargeTable from "../charge-table-modal/ChargeTable";
import "./ServingTableActions.css";

interface ServingTableActions {
  setViewTables: Dispatch<SetStateAction<boolean>>;
}

/** Functional component used to display buttons with whom waiter can execute certain business logic, like create new table, create order, view table etc.
 * @param {Dispatch} setViewTables Dispatch function that updates local state inside CustomerOrder.tsx component.
 */
const ServingTableActions = ({ setViewTables }: ServingTableActions) => {
  const intl = useIntl();

  const [openChargeTableModal, setOpenChargeTableModal] =
    useState<boolean>(false);

  const {
    selectedServingTable,
    selectedWaiter,
    selectedServingTableOrder,
    reloadDataForWaitersPageAfterCRUDAction,
  } = useApplicationStoreSelector();

  const handleConfirmOrderForTable = () => {
    if (
      selectedServingTableOrder?.listOfOrderProducts === undefined ||
      selectedServingTableOrder.listOfOrderProducts.length === 0
    ) {
      toast.error("Please select new products to make make new order");
      return null;
    }

    const saveNewOrderToExistingTable: SaveNewOrderToTableDTO = {
      servingTableUuid: String(selectedServingTable?.uuid),
      waiterUuid: String(selectedWaiter?.uuid),
      orderDTO: {
        code: selectedServingTableOrder?.code as number,
        listOfOrderProducts:
          selectedServingTableOrder?.listOfOrderProducts as OrderProduct[],
      },
    };

    RestServices.krusevska_odaja_ServingTableController
      .updateExistingTableWithNewOrder(saveNewOrderToExistingTable)
      .then((response) => {
        toast.success(response);
        reloadDataForWaitersPageAfterCRUDAction();
      });

    setViewTables(false);
  };

  const handleCreateTableAndFirstOrder = () => {
    const requestBody: CreateTableWithFirstOrderDTO = {
      servingTableCode: selectedServingTable?.code as number,
      waiterUuid: selectedWaiter?.uuid,
      orderDTO: {
        code: selectedServingTableOrder?.code as number,
        listOfOrderProducts:
          selectedServingTableOrder?.listOfOrderProducts as OrderProduct[],
      },
    };

    RestServices.krusevska_odaja_ServingTableController
      .createNewTableAndFirstOrder(requestBody)
      .then((res) => {
        toast.success(res);
        reloadDataForWaitersPageAfterCRUDAction();
      });

    setViewTables(false);
  };

  const handleChargeTableModalOpen = () => setOpenChargeTableModal(true);

  const createTableButtonDisable =
    selectedServingTable === undefined
      ? true
      : selectedServingTable.servingTableStatus === "FREE"
      ? false
      : true;

  const confirmOrderButtonDisable =
    selectedServingTableOrder?.listOfOrderProducts === undefined ||
    selectedServingTableOrder.listOfOrderProducts.length === 0 ||
    selectedServingTable?.servingTableStatus === "FREE"
      ? true
      : false;

  const chargeTableButtonDisable =
    selectedServingTable === undefined ||
    selectedServingTable.servingTableStatus === "FREE";

  return (
    <div className="servingTableActions-wrapper">
      <div className="servingTableActions-flex-wrapper">
        <button
          onClick={handleCreateTableAndFirstOrder}
          disabled={createTableButtonDisable}
          className={
            createTableButtonDisable === true
              ? "servingTableActions-disabled-button"
              : ""
          }
        >
          <p>
            {intl.formatMessage({
              id: "servingTableActions.button.text.newOrder",
              defaultMessage: "New order",
            })}
          </p>
          <PiNewspaperFill style={{ fontSize: 40 }} />
        </button>
        <button
          onClick={handleConfirmOrderForTable}
          disabled={confirmOrderButtonDisable}
          className={
            confirmOrderButtonDisable === true
              ? "servingTableActions-disabled-button"
              : ""
          }
        >
          <p>
            {intl.formatMessage({
              id: "servingTableActions.button.text.confirmOrder",
              defaultMessage: "Confirm order",
            })}
          </p>
          <FaCheckDouble style={{ fontSize: 40 }} />
        </button>

        <button
          disabled={chargeTableButtonDisable}
          onClick={handleChargeTableModalOpen}
          className={
            chargeTableButtonDisable === true
              ? "servingTableActions-disabled-button"
              : ""
          }
        >
          <p style={{ marginBottom: 0 }}>
            {intl.formatMessage({
              id: "servingTableActions.button.text.chargeTable",
              defaultMessage: "Charge table",
            })}
          </p>
          <FaMoneyCheck style={{ fontSize: 40 }} />
        </button>
        <ChargeTable
          openChargeTableModal={openChargeTableModal}
          onClose={() => setOpenChargeTableModal(!openChargeTableModal)}
        />
      </div>
    </div>
  );
};

export default ServingTableActions;
