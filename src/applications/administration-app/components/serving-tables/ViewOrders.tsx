import { ServingTableDTO } from "../../../../api/dto";
import { ViewOrdersModalState } from "../../../../interfaces";
import Orders from "../orders/Orders";
import { Button, Modal } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useIntl } from "react-intl";

interface ViewOrdersProps {
  viewOrdersModal: ViewOrdersModalState;
  setViewOrdersModal: Dispatch<SetStateAction<ViewOrdersModalState>>;
  setReloadServingTables: Dispatch<SetStateAction<boolean | undefined>>;
}

/** Function component used to view orders of selected table.
 * @param {ViewOrdersModalState} viewOrdersModal Contains information of selected serving table and boolean whether modal is open or closed.
 * @param {Dispatch} setViewOrdersModal Dispatch function that updates local state inside ServingTable.tsx.
 * @param {Dispatch} setReloadServingTables Dispatch function that refreshes the list of serving table inside ServingTable.tsx component
 *  upon deleting orders or specific products from selected order.
 */
const ViewOrdersModal = ({ viewOrdersModal, setViewOrdersModal, setReloadServingTables }: ViewOrdersProps) => {
  const intl = useIntl();

  const handleCloseModal = () => {
    setReloadServingTables((prevValue) => !prevValue);
    setViewOrdersModal({
      viewOrdersModalOpen: false,
      selectedServingTable: undefined,
    });
  };

  const modalTitle = (
    <div>
      <p>
        <b>{intl.formatMessage({ id: "adminPage.viewOrders.title.waiter" })}</b>{" "}
        {viewOrdersModal.selectedServingTable?.waiterName}
      </p>
      <p>
        <b>
          {intl.formatMessage({
            id: "adminPage.viewOrders.title.servingTableNo",
          })}
        </b>{" "}
        {viewOrdersModal.selectedServingTable?.code}
      </p>
      <p>
        <b>
          {intl.formatMessage({
            id: "adminPage.viewOrders.title.statusOfTable",
          })}
        </b>{" "}
        {viewOrdersModal.selectedServingTable?.servingTableStatus}
      </p>
      <p>
        <b>{intl.formatMessage({ id: "adminPage.viewOrders.title.totalPrice" })}</b>{" "}
        {viewOrdersModal.selectedServingTable?.totalPrice}
      </p>
      <p>
        <b>
          {intl.formatMessage({
            id: "adminPage.viewOrders.title.remainingBalance",
          })}
        </b>{" "}
        {viewOrdersModal.selectedServingTable?.remainingBalance}
      </p>
    </div>
  );

  return (
    <Modal
      open={viewOrdersModal.viewOrdersModalOpen}
      onCancel={handleCloseModal}
      title={modalTitle}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          {intl.formatMessage({ id: "adminPage.button.close" })}
        </Button>,
      ]}>
      <Orders
        selectedServingTable={viewOrdersModal.selectedServingTable as ServingTableDTO}
        setViewOrdersModal={setViewOrdersModal}
      />
    </Modal>
  );
};

export default ViewOrdersModal;
