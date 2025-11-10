import { Input, InputNumber, Tooltip } from "antd";
import { ChangeEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import { useIntl } from "react-intl";
import RestServices from "../../../../api/services";
import KitchenOrder from "../../../../models/KitchenOrder";
import { useApplicationStoreSelector } from "../../../../store/ApplicationStore";
import "./Header.css";

/** Functional component used to display element in the header (top) of the screen.
 *
 * It consist of fields for waiter and serving table which if are not filled,
 *  all other functionalities (create table, select product, create order etc.) become unavable for the logged user (waiter)
 */
const Header = () => {
  const intl = useIntl();
  const [inputFieldsState, setInputFieldsState] = useState({
    tableInput: "",
  });
  const [listCompletedKitchenOrders, setListCompletedKitchenOrders] = useState<
    KitchenOrder[]
  >([]);

  const {
    selectedWaiter,
    selectedServingTable,
    selectedServingTableOrder,
    saveSelectedWaiterByCode,
    saveSelectedServingTableByCode,
  } = useApplicationStoreSelector();

  useEffect(() => {
    if (selectedServingTable !== undefined) {
      setInputFieldsState({ tableInput: String(selectedServingTable.code) });
    } else setInputFieldsState({ tableInput: "" });
  }, [selectedServingTable]);

  useEffect(() => {
    if (selectedWaiter !== undefined) {
      RestServices.krusevska_odaja_KitchenOrdersController
        .fetchCompletedKitchenOrders(selectedWaiter.uuid as string)
        .then((res) => setListCompletedKitchenOrders(res))
        .catch((error) => toast.error(error));
    }
  }, [selectedWaiter]);

  const handleInputWaiter = (event: ChangeEvent<HTMLInputElement>) => {
    const temp = event.target.value;
    if (temp === "") setInputFieldsState({ tableInput: "" });
    saveSelectedWaiterByCode(temp);
  };

  const handleInputTable = (event: ChangeEvent<HTMLInputElement>) => {
    const tableNumber = event.target.value;
    setInputFieldsState({ tableInput: tableNumber });
    saveSelectedServingTableByCode(tableNumber);
  };

  const tempCompletedKOs = () =>
    listCompletedKitchenOrders.map((ko) => {
      return (
        <p>
          {intl.formatMessage({ id: "header.dropdown.menuItem.text1" })}{" "}
          {ko.order?.code}{" "}
          {intl.formatMessage({ id: "header.dropdown.menuItem.text2" })}{" "}
          {ko.servingTable?.code}{" "}
          {intl.formatMessage({ id: "header.dropdown.menuItem.text3" })}
        </p>
      );
    });

  return (
    <div className="header-wrapper">
      <div className="header-flex-wrapper">
        <p
          style={{
            margin: 0,
            fontSize: "1.2rem",
            color: "white",
          }}
        >
          {intl.formatMessage({
            id: "header.text.waiter",
            defaultMessage: "Waiter",
          })}
        </p>

        <Input.Password
          min={0}
          max={99}
          maxLength={2}
          style={{ width: "20%" }}
          onChange={handleInputWaiter}
          iconRender={() => false}
          value={selectedWaiter?.code}
        />

        <Input
          readOnly={true}
          width="20vw"
          style={{ fontSize: "1rem" }}
          value={
            selectedWaiter === undefined
              ? ""
              : `${selectedWaiter.firstName} ${selectedWaiter.lastName}`
          }
        />
      </div>

      <div className="header-flex-wrapper-item-divider" />

      <div
        style={{
          display: "flex",
          columnGap: "1rem",
          alignItems: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "1.2rem",
            color: "white",
            whiteSpace: "nowrap",
          }}
        >
          {intl.formatMessage({
            id: "header.text.tableNumber",
            defaultMessage: "Table number",
          })}
        </p>

        <Input
          value={inputFieldsState.tableInput}
          id="tableInputField"
          disabled={selectedWaiter === undefined ? true : false}
          style={{ width: "20%", fontSize: "1rem" }}
          min={0}
          max={99}
          maxLength={2}
          onChange={handleInputTable}
        />

        <Input
          disabled={selectedWaiter === undefined ? true : false}
          readOnly
          width="20vw"
          style={{ fontSize: "1rem" }}
          value={
            selectedServingTable === undefined
              ? ""
              : intl.formatMessage({
                  id:
                    selectedServingTable.servingTableStatus === "FREE"
                      ? "header.text.tableFree"
                      : "header.text.tableReserved",
                })
          }
        />
      </div>

      <div className="header-flex-wrapper-item-divider" />

      <div
        style={{
          display: "flex",
          columnGap: "1rem",
          alignItems: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "1.2rem",
            color: "white",
            whiteSpace: "nowrap",
          }}
        >
          {intl.formatMessage({
            id: "header.text.orderNumber",
            defaultMessage: "Order number",
          })}
        </p>

        <InputNumber
          disabled={selectedWaiter === undefined ? true : false}
          readOnly={true}
          style={{ width: "20%" }}
          value={
            selectedServingTable === undefined
              ? ""
              : selectedServingTableOrder?.code
          }
        />
      </div>

      {selectedWaiter !== undefined ? (
        <div className="header-notification-wrapper">
          <Tooltip
            placement="bottom"
            title={
              <div className="header-notification-panel-title-wrapper">
                {tempCompletedKOs()}
              </div>
            }
          >
            <div className="header-notification-icon">
              <IoNotificationsCircleOutline
                className={
                  listCompletedKitchenOrders.length > 0
                    ? "notification-bell-active"
                    : "notification-bell-inactive"
                }
              />
              {listCompletedKitchenOrders.length > 0 ? (
                <span
                  className="notification-text-active animate-pulse-text"
                  key={listCompletedKitchenOrders.length}
                >
                  {intl.formatMessage({
                    id: "header.notification.panel.waiter.news",
                  })}
                </span>
              ) : (
                <span
                  className="notification-text-inactive animate-pulse-text"
                  key={listCompletedKitchenOrders.length}
                >
                  {intl.formatMessage({
                    id: "header.notification.panel.waiter.noNews",
                  })}
                </span>
              )}
            </div>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
