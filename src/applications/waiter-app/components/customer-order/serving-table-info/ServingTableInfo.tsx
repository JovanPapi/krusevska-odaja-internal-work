import { useApplicationStoreSelector } from "../../../../../store/ApplicationStore";
import { useLanguageSwitcherSelector } from "../../../../../store/language-switcher/LanguageSwitcher";
import { useIntl } from "react-intl";
import "./ServingTableInfo.css";

/** Functional component used to display information about selected table by the waiter. */
const ServingTableInfo = () => {
  const intl = useIntl();
  const { currentLanguage } = useLanguageSwitcherSelector();
  const { selectedServingTable, selectedServingTableOrder } = useApplicationStoreSelector();

  return (
    <div className="servingTableInfo-wrapper">
      <table className="servingTableInfo-table-of-products">
        <thead>
          <tr>
            <th>
              {intl.formatMessage({
                id: "servingTableInfo.text.th.orderNumber",
                defaultMessage: "Order no.",
              })}
            </th>
            <th style={{ width: "200px" }}>
              {intl.formatMessage({
                id: "servingTableInfo.text.th.productName",
                defaultMessage: "Product name",
              })}
            </th>
            <th>
              {intl.formatMessage({
                id: "servingTableInfo.text.th.quantity",
                defaultMessage: "Quantity",
              })}
            </th>
            <th>
              {intl.formatMessage({
                id: "servingTableInfo.text.th.price",
                defaultMessage: "Price",
              })}
            </th>
            <th>
              {intl.formatMessage({
                id: "servingTableInfo.text.th.ingredients",
                defaultMessage: "Ingredients",
              })}
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedServingTable?.listOfOrders.map((order) =>
            order.listOfOrderProducts?.map((stp) => (
              <tr key={stp.uuid}>
                <td>{order.code}</td>
                <td>{currentLanguage === "en" ? stp.product?.name : stp.product?.nameTranslated}</td>
                <td>{stp.quantity}</td>
                <td>{(stp.product?.price ?? 0) * stp.quantity}</td>
                <td>
                  {stp.product?.listOfIngredients.map((ing, index) => {
                    if (index === (stp.product?.listOfIngredients.length as number) - 1) {
                      return ing.name;
                    }
                    return ing.name + ", ";
                  })}
                </td>
              </tr>
            )),
          )}

          {selectedServingTableOrder?.listOfOrderProducts?.map((stp, index) => (
            <tr key={index}>
              <td>{selectedServingTableOrder.code}</td>
              <td>{currentLanguage === "en" ? stp.product?.name : stp.product?.nameTranslated}</td>
              <td>{stp.quantity}</td>
              <td>{(stp.product?.price ?? 0) * stp.quantity}</td>
              <td>
                {stp.product?.listOfIngredients.map((ing, index) => {
                  if (index === (stp.product?.listOfIngredients.length as number) - 1) {
                    return currentLanguage === "en" ? ing.name : ing.nameTranslated;
                  }
                  return currentLanguage === "en" ? ing.name + ", " : ing.nameTranslated + ", ";
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServingTableInfo;
