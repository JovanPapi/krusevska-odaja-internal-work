import { useIntl } from "react-intl";
import { useApplicationStoreSelector } from "../../../../../store/ApplicationStore";
import { formatStringDate } from "../../../../../utils";
import "./index.css";

/** Functional component used to display all orders of selected table. */
const ViewTableOrders = () => {
  const intl = useIntl();

  const { selectedServingTable, saveSelectedServingTableOrderByCode } =
    useApplicationStoreSelector();

  if (selectedServingTable === undefined) return null;

  if (selectedServingTable.listOfOrders?.length === 0)
    return (
      <div className="viewTables-wrapper">
        <p>
          {intl.formatMessage({ id: "viewTableOrders.text.tableHasNoOrders" })}
        </p>
      </div>
    );

  const handleViewSelectOrder = (orderCode: number) =>
    saveSelectedServingTableOrderByCode(orderCode);

  return (
    <div className="viewTables-wrapper">
      <p style={{ fontWeight: 600 }}>
        {intl.formatMessage({ id: "viewTableOrders.text.selectedTableNumber" })}{" "}
        {selectedServingTable?.code}
      </p>
      <div style={{ paddingLeft: "1rem" }}>
        <table className="viewTables-orders-table">
          <thead>
            <tr>
              <th style={{ width: 100 }}>
                {intl.formatMessage({
                  id: "viewTableOrders.text.th.orderNumber",
                })}
              </th>
              <th>
                {intl.formatMessage({
                  id: "viewTableOrders.text.th.orderCreationDate",
                })}
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedServingTable?.listOfOrders?.map((order) => (
              <tr
                key={order.code}
                onClick={() => handleViewSelectOrder(order.code as number)}
                style={{ textAlign: "center" }}
              >
                <td>
                  <span>{order.code}</span>
                </td>
                <td>{formatStringDate(order.creationDate as string)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewTableOrders;
