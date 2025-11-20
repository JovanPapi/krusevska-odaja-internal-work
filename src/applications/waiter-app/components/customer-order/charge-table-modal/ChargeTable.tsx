import { PayTablePriceDTO } from "../../../../../api/dto";
import RestServices from "../../../../../api/services";
import Order from "../../../../../models/Order";
import ServingTable from "../../../../../models/ServingTable";
import { useApplicationStoreSelector } from "../../../../../store/ApplicationStore";
import { formatStringDate } from "../../../../../utils";
import React, { Dispatch, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import toast from "react-hot-toast";
import { IntlShape, useIntl } from "react-intl";
import "./ChargeTable.css";

interface ChargeTableProps {
  openChargeTableModal: boolean;
  onClose: () => void;
}

/** Functional component used to display orders info of selected table, with option to pay certain amount of the total price of the selected serving table, or the full price.
 *
 * If paid the full price, the table will be closed (not removed from DB)
 * @param {boolean} openChargeTableModal Tells whether charge table modal component is open or closed.
 * @param {function} onClose Closes the modal.
 */
const ChargeTable = ({ openChargeTableModal, onClose }: ChargeTableProps) => {
  const intl = useIntl();

  const { selectedWaiter, selectedServingTable, reloadDataForWaitersPageAfterCRUDAction } =
    useApplicationStoreSelector();

  const [amountToPayInput, setAmountToPayInput] = useState<string>("0");

  // Apply custom class to body before browser renders changes to the screen
  // useEffect runs after DOM has been updated
  useLayoutEffect(() => {
    if (openChargeTableModal) {
      document.body.classList.add("chargeTable-disbale-bg-interactive");
    }

    return () => {
      document.body.classList.remove("chargeTable-disbale-bg-interactive");
      setAmountToPayInput("0");
    };
  }, [openChargeTableModal]);

  if (openChargeTableModal === false) {
    return null;
  }

  const handlePayTable = () => {
    if (amountToPayInput === "") {
      toast.error("Amount to pay must not be an empty string");
      return null;
    }

    const amountToPay = parseInt(amountToPayInput);
    if (
      amountToPay > (selectedServingTable?.totalPrice as number) ||
      amountToPay > (selectedServingTable?.remainingBalance as number)
    ) {
      toast.error("Amount to pay must not be higher than remaining balance or total amount");
      return null;
    }

    if (amountToPay <= 0) {
      toast.error("Amount to pay must not be lower or equal to 0");
      return null;
    }

    const payTablePriceDTO: PayTablePriceDTO = {
      servingTableUuid: selectedServingTable?.uuid as string,
      waiterUuid: selectedWaiter?.uuid as string,
      amountToPay,
    };

    RestServices.servingTableController.payTablePrice(payTablePriceDTO).then((response) => {
      toast.success(response);
      reloadDataForWaitersPageAfterCRUDAction();

      onClose();
    });
  };

  return ReactDOM.createPortal(
    <div className="chargeTable-wrapper">
      <p className="chargeTable-paragraph-decor">
        {intl.formatMessage({ id: "chargeTable.text.selectedWaiter" })} {selectedWaiter?.firstName}{" "}
        {selectedWaiter?.lastName}
      </p>
      <p style={{ margin: 0 }} className="chargeTable-paragraph-decor">
        {intl.formatMessage({ id: "chargeTable.text.selectedTableNumber" })} {selectedServingTable?.code}
      </p>

      <div className="chargeTable-tableOrders">
        <RenderTableOrdersAndProducts listOfOrders={selectedServingTable?.listOfOrders} intl={intl} />
      </div>

      <RenderTablePriceDetails
        selectedServingTable={selectedServingTable}
        amountToPay={amountToPayInput}
        setAmountToPay={setAmountToPayInput}
        intl={intl}
      />

      <div className="chargeTable-footer-wrapper">
        <button type="button" onClick={handlePayTable} disabled={parseInt(amountToPayInput) === 0}>
          {intl.formatMessage({ id: "chargeTable.text.payTable" })}
        </button>
        <button type="button" onClick={onClose}>
          {intl.formatMessage({ id: "chargeTable.text.close" })}
        </button>
      </div>
    </div>,
    document.getElementById("charge-table-modal") as HTMLElement,
  );
};

interface RenderTableOrdersAndProductsProps {
  listOfOrders?: Order[];
  intl: IntlShape;
}

const RenderTableOrdersAndProducts = ({ listOfOrders, intl }: RenderTableOrdersAndProductsProps) => {
  if (listOfOrders === undefined || listOfOrders.length === 0) {
    return <p>The Table has not orders yet.</p>;
  }

  return (
    <>
      {listOfOrders.map((order, index) => (
        <div key={index} className="chargeTable-tableOrders-list-item">
          <p className="chargeTable-paragraph-decor" style={{ margin: 0 }}>
            {intl.formatMessage({ id: "chargeTable.text.order" })} {order.code}
            {", "}
            {formatStringDate(order.creationDate as string)}
          </p>
          <ul>
            {order.listOfOrderProducts?.map((product, index) => (
              <li key={index * 10} style={{ fontSize: "1.1rem" }}>
                {intl.formatMessage({ id: "chargeTable.text.product" })}
                {product.product?.name}
                {", "}
                {intl.formatMessage({ id: "chargeTable.text.quantity" })}
                {product.quantity}
                {", "}
                {intl.formatMessage({ id: "chargeTable.text.price" })}
                {(product.product?.price as number) * product.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

interface RenderTablePriceDetailsProps {
  selectedServingTable?: ServingTable;
  amountToPay: string;
  intl: IntlShape;
  setAmountToPay: Dispatch<React.SetStateAction<string>>;
}

const RenderTablePriceDetails = ({
  selectedServingTable,
  amountToPay,
  intl,
  setAmountToPay,
}: RenderTablePriceDetailsProps) => {
  return (
    <div className="chargeTable-tablePrice-details-wrapper">
      <div>
        <p>{intl.formatMessage({ id: "chargeTable.text.totalPrice" })} </p>
        <p>{selectedServingTable?.totalPrice}</p>
      </div>

      <div className="chargeTable-tablePrice-details-div-divider"></div>

      <div>
        <p>{intl.formatMessage({ id: "chargeTable.text.amountPaid" })} </p>
        <p>{selectedServingTable?.amountPaid}</p>
      </div>

      <div className="chargeTable-tablePrice-details-div-divider"></div>

      <div>
        <p>{intl.formatMessage({ id: "chargeTable.text.remainingBalance" })} </p>
        <p>{selectedServingTable?.remainingBalance}</p>
      </div>

      <div>
        <p>{intl.formatMessage({ id: "chargeTable.text.amountToPay" })} </p>
        <input type="text" value={amountToPay} onChange={(event) => setAmountToPay(event.target.value)} />
      </div>
    </div>
  );
};

export default ChargeTable;
