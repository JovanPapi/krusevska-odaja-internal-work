import { Popconfirm, Table, TableColumnsType } from "antd";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { ServingTableDTO } from "../../../../api/dto";
import RestServices from "../../../../api/services";
import { ViewOrdersModalState } from "../../../../interfaces";
import Order from "../../../../models/Order";
import OrderProduct from "../../../../models/OrderProduct";

interface OrderProductsProps {
  selectedOrder: Order;
  selectedServingTable: ServingTableDTO;
  setViewOrdersModal: Dispatch<SetStateAction<ViewOrdersModalState>>;
}

/** Functional component used to display all products of selected order, plus features for removing a product from order.
 * @param {Order} selectedOrder Selected order.
 * @param {ServingTableDTO} selectedServingTable Selected serving table.
 * @param {Dispatch} setViewOrdersModal Dispatch function used to update local state inside ServingTable.tsx.
 */
const OrderProducts = ({
  selectedOrder,
  selectedServingTable,
  setViewOrdersModal,
}: OrderProductsProps) => {
  const intl = useIntl();

  const handleDeleteOrderProduct = async (orderProductId: string) => {
    await RestServices.krusevska_odaja_OrderController
      .deleteProductFromOrder({
        orderUuid: selectedOrder.uuid as string,
        orderProductUuid: orderProductId,
      })
      .then((res) => {
        toast.success(res);
        // setReloadServingTable((prev) => (prev === undefined ? false : !prev));
      });

    await RestServices.krusevska_odaja_ServingTableController
      .fetchServingTableById(selectedServingTable.uuid as string)
      .then((res) =>
        setViewOrdersModal((prev) => {
          return { ...prev, selectedServingTable: res };
        })
      );
  };

  const columns: TableColumnsType<OrderProduct> = [
    {
      title: intl.formatMessage({
        id: "adminPage.orderProducts.table.column.productName",
      }),
      render: (_, stp) => stp.product?.name,
    },
    {
      title: intl.formatMessage({
        id: "adminPage.orderProducts.table.column.quantity",
      }),
      dataIndex: "quantity",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.orderProducts.table.column.price",
      }),
      render: (_, stp) => stp.product?.price,
    },
    {
      title: intl.formatMessage({
        id: "adminPage.orderProducts.table.column.totalPrice",
      }),
      render: (_, stp) => (stp.product?.price as number) * stp.quantity,
    },
    {
      title: intl.formatMessage({
        id: "adminPage.orderProducts.table.column.actions",
      }),
      render: (_, stp) => {
        if (selectedServingTable.servingTableStatus === "Reserved") {
          return (
            <Popconfirm
              title={intl.formatMessage({
                id: "adminPage.text.sureToDelete",
              })}
              onConfirm={() => handleDeleteOrderProduct(stp.uuid as string)}
            >
              <span style={{ color: "blue", cursor: "pointer" }}>
                {intl.formatMessage({
                  id: "adminPage.text.delete",
                })}
              </span>
            </Popconfirm>
          );
        }
      },
    },
  ];

  return (
    <Table<OrderProduct>
      rowKey={(stp) => stp.uuid as string}
      columns={columns}
      dataSource={selectedOrder.listOfOrderProducts}
    />
  );
};

export default OrderProducts;
