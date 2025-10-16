import { useIntl } from "react-intl";
import { useApplicationStoreSelector } from "../../../../../store/ApplicationStore";
import "./index.css";

/** Functional component used to display all RESERVED tables of the waiter.
 *
 * They can be selected to fast access table informations and serve as a reminder of all RESERVED tables by the waiter.
 */
const ViewWaiterTables = () => {
  const intl = useIntl();

  const { selectedWaiter, saveSelectedServingTableByCode } =
    useApplicationStoreSelector();

  if (selectedWaiter === undefined)
    return (
      <div className="viewTables-wrapper">
        <p>
          {intl.formatMessage({
            id: "viewWaiterTables.text.noSelectedWaiter",
          })}
        </p>
      </div>
    );

  const noTablesElement = (
    <li>
      {intl.formatMessage({
        id: "viewWaiterTables.text.waiterNoReservedTables",
      })}
    </li>
  );

  const handleViewSelectedTable = (tableCode: string) =>
    saveSelectedServingTableByCode(tableCode);

  return (
    <div className="viewTables-wrapper">
      <p>
        {intl.formatMessage({ id: "viewWaiterTables.text.allTablesForWaiter" })}{" "}
        <span style={{ fontWeight: 600 }}>
          {selectedWaiter.firstName} {selectedWaiter.lastName}:
        </span>
      </p>
      <div style={{ paddingLeft: "1rem" }}>
        {selectedWaiter.listOfServingTables === undefined ||
        selectedWaiter.listOfServingTables.length === 0
          ? noTablesElement
          : selectedWaiter.listOfServingTables!.map((table) => (
              <li
                key={table.code}
                onClick={() => handleViewSelectedTable(String(table.code))}
              >
                <span style={{ fontWeight: 600 }}>
                  {intl.formatMessage({
                    id: "viewWaiterTables.text.tableNumber",
                  })}{" "}
                  {table.code}
                </span>
              </li>
            ))}
      </div>
    </div>
  );
};

export default ViewWaiterTables;
