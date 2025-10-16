import { useEffect, useState } from "react";

import { Button, Popconfirm, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import type { ColumnsType } from "antd/es/table";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import RestServices from "../../../api/services";
import KitchenOrder from "../../../models/KitchenOrder";
import { useLanguageSwitcherSelector } from "../../../store/language-switcher/LanguageSwitcher";
import "./KitchenApp.css";

/** Functional component used to display all created orders from a waiter.
 *
 * Offers a feature for marking a completed order from the kitchen chefs.
 */
const KitchenPage = () => {
  const intl = useIntl();
  const { currentLanguage } = useLanguageSwitcherSelector();

  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);

  useEffect(() => {
    RestServices.krusevska_odaja_KitchenOrdersController
      .fetchUncompletedKitchenOrders()
      .then((res) => setKitchenOrders(res));
  }, []);

  const handleCompleteOrder = async (kitchenOrderUuid: string) => {
    await RestServices.krusevska_odaja_KitchenOrdersController
      .markKitchenOrderAsCompleted(kitchenOrderUuid)
      .then((res) => {
        toast.success(res);
      });

    await RestServices.krusevska_odaja_KitchenOrdersController
      .fetchUncompletedKitchenOrders()
      .then((res) => setKitchenOrders(res));
  };

  const columns: ColumnsType<KitchenOrder> = [
    {
      title: intl.formatMessage({
        id: "kitchenApplication.table.column.orderPriority",
      }),
      render: (_, __, index) => <p>{index + 1}</p>,
    },
    {
      title: intl.formatMessage({
        id: "kitchenApplication.table.column.waiterName",
      }),
      render: (_, item) => (
        <span>{item.waiter?.firstName + " " + item.waiter?.lastName}</span>
      ),
    },
    {
      title: intl.formatMessage({
        id: "kitchenApplication.table.column.servingTableNumber",
      }),
      render: (_, item) => <span>{item.servingTable?.code}</span>,
    },
    {
      title: intl.formatMessage({
        id: "kitchenApplication.table.column.listOfProducts",
      }),
      dataIndex: "listOfOrderProducts",
      render: (_, kitchenOrder) =>
        kitchenOrder.listOfOrderProducts?.map((kitchenOrder) => (
          <>
            <div style={{ display: "flex", gap: "1rem" }}>
              <p>-</p>
              <p>{`${intl.formatMessage({
                id: "kitchenApplication.table.column.listOfProducts.name",
              })}: ${
                currentLanguage === "en"
                  ? kitchenOrder.product?.name
                  : kitchenOrder.product?.nameTranslated
              },`}</p>
              <p>{`${intl.formatMessage({
                id: "kitchenApplication.table.column.listOfProducts.quantity",
              })}: ${kitchenOrder.quantity}${
                kitchenOrder.product?.listOfIngredients.length !== 0 ? "," : ""
              }`}</p>
              {kitchenOrder.product!.listOfIngredients.length === 0 ? null : (
                <p>{`${intl.formatMessage({
                  id: "kitchenApplication.table.column.listOfProducts.ingredients",
                })}:  ${kitchenOrder.product?.listOfIngredients.map(
                  (ingredient, index) => {
                    const ingName =
                      currentLanguage === "en"
                        ? ingredient.name
                        : ingredient.nameTranslated;
                    if (
                      index ===
                      (kitchenOrder.product?.listOfIngredients
                        .length as number) -
                        1
                    )
                      return ingName;
                    else return ingName + ", ";
                  }
                )}`}</p>
              )}
            </div>
          </>
        )),
    },
    {
      title: "Action",
      render: (_, kitchenOrder) => (
        <Popconfirm
          title={intl.formatMessage({
            id: "kitchenApplication.popConfirm.text",
          })}
          onConfirm={() => handleCompleteOrder(kitchenOrder.uuid as string)}
        >
          <Button type="primary">
            {intl.formatMessage({ id: "kitchenApplication.button.text" })}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Content style={{ backgroundColor: "#4d4b4b" }}>
      <Table<KitchenOrder>
        rowKey={(order) => order.uuid as string}
        columns={columns}
        dataSource={kitchenOrders}
      />
    </Content>
  );
};

export default KitchenPage;
