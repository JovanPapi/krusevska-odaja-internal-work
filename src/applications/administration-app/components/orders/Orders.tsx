import { Popconfirm, Table, TableColumnsType } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { ServingTableDTO } from "../../../../api/dto";
import RestServices from "../../../../api/services";
import { ViewOrdersModalState } from "../../../../interfaces";
import Order from "../../../../models/Order";
import { formatStringDate } from "../../../../utils";
import OrderProducts from "./OrderProducts";

interface OrdersProps {
  selectedServingTable: ServingTableDTO;
  setViewOrdersModal: Dispatch<SetStateAction<ViewOrdersModalState>>;
}

/** Functional component used to display orders of selected serving table, plus features for edit, remove.
 * @param {ServingTableDTO} selectedServingTable Serving table selected by logged in waiter.
 * @param {Dispatch} setViewOrdersModal Dispatch function that updates local state inside ServingTable.tsx.
 */
const Orders = ({ selectedServingTable, setViewOrdersModal }: OrdersProps) => {
  const intl = useIntl();

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  const handleDeleteOrder = async (orderId: string) => {
    await RestServices.krusevska_odaja_OrderController
      .deleteOrderFromServingTable(orderId)
      .then((res) => {
        toast.success(res);
        // setReloadServingTable((prev) => (prev === undefined ? false : !prev));
      });

    await RestServices.krusevska_odaja_ServingTableController
      .fetchServingTableById(selectedServingTable.uuid as string)
      .then((res) => {
        setViewOrdersModal((prev) => {
          return { ...prev, selectedServingTable: res };
        });
      });
  };

  const handleOnExpandOrder = (expanded: boolean, order: Order) => {
    if (expanded === true) {
      setExpandedRowKeys([...expandedRowKeys, order.uuid as string]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== order.uuid));
    }
  };

  const expandedServingTableColumn: TableColumnsType<Order> = [
    {
      title: intl.formatMessage({
        id: "adminPage.orders.table.column.orderNumber",
      }),
      dataIndex: "code",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.orders.table.column.creationData",
      }),
      render: (_, order) => formatStringDate(order.creationDate as string),
    },
    {
      title: intl.formatMessage({
        id: "adminPage.orders.table.column.totalPrice",
      }),
      dataIndex: "totalPrice",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.orders.table.column.actions",
      }),
      render: (_, order) => {
        if (selectedServingTable.servingTableStatus === "Reserved") {
          return (
            <div style={{ display: "flex", columnGap: "2.5rem" }}>
              <Popconfirm
                title={intl.formatMessage({
                  id: "adminPage.text.sureToDelete",
                })}
                onConfirm={() => handleDeleteOrder(order.uuid as string)}
              >
                <span style={{ color: "blue", cursor: "pointer" }}>
                  {intl.formatMessage({
                    id: "adminPage.text.delete",
                  })}
                </span>
              </Popconfirm>
            </div>
          );
        }
      },
    },
  ];

  return (
    <Table<Order>
      rowKey={(order) => order.uuid as string}
      columns={expandedServingTableColumn}
      dataSource={selectedServingTable.listOfOrders}
      expandable={{
        onExpand: (expanded, order) => handleOnExpandOrder(expanded, order),
        expandedRowKeys: expandedRowKeys,
        expandedRowRender: (selectedOrder) => (
          <OrderProducts
            selectedOrder={selectedOrder}
            selectedServingTable={selectedServingTable}
            setViewOrdersModal={setViewOrdersModal}
          />
        ),
      }}
    />
  );
};

export default Orders;
