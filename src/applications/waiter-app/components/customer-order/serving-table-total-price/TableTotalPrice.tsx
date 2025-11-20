import { useApplicationStoreSelector } from "../../../../../store/ApplicationStore";
import { Input } from "antd";
import { useIntl } from "react-intl";
import "./TableTotalPrice.css";

/** Functional component used to display total price of selected serving table and its new order, if there is a one. */
const TableTotalPrice = () => {
  const intl = useIntl();

  const { selectedServingTableOrder } = useApplicationStoreSelector();

  const newOrderPrice = selectedServingTableOrder?.listOfOrderProducts?.reduce<number>((sum, product) => {
    sum += (product.product?.price as number) * product.quantity;

    return sum;
  }, 0);

  const newOrderPriceFinal =
    newOrderPrice === undefined
      ? ""
      : String(newOrderPrice + " " + intl.formatMessage({ id: "orderPrice.text.denari" }));

  return (
    <div className="orderPrice-wrapper">
      <div className="orderPrice-flex-item">
        <div>
          <p>{intl.formatMessage({ id: "orderPrice.text.newOrderPrice" })}:</p>
        </div>

        <div>
          <Input value={newOrderPriceFinal} readOnly />
        </div>
      </div>
    </div>
  );
};

export default TableTotalPrice;
