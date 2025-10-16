import {
  Input,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import "./Payments.css";
import { PaymentDTO } from "../../../../api/dto";
import RestServices from "../../../../api/services";
import { useIntl } from "react-intl";

interface TableParams {
  pagination: TablePaginationConfig;
}

/** Functional component used to display all payments inside a table. */
const Payment = () => {
  const intl = useIntl();

  const [originalPayments, setOriginalPayments] = useState<PaymentDTO[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentDTO[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>();

  const [filterPaymentsInput, setFilterPaymentsInput] = useState<string>("");

  const [, startTransition] = useTransition();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    setIsDataLoading(true);
    RestServices.krusevska_odaja_Paymnets
      .fetchPayments()
      .then((response) => {
        setOriginalPayments(response);
        setFilteredPayments(response);
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsDataLoading(false);
      });
  }, []);

  const columns: TableColumnsType<PaymentDTO> = [
    {
      title: intl.formatMessage({
        id: "adminPage.payments.table.column.paymentDate",
      }),
      dataIndex: "paymentDate",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.payments.table.column.paymentMethod",
      }),
      dataIndex: "paymentMethod",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.payments.table.column.amountPaid",
      }),
      dataIndex: "amountPaid",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.payments.table.column.waiterName",
      }),
      dataIndex: "waiterName",
    },
  ];

  const handleTableChange: TableProps["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setFilterPaymentsInput(filterText);

    if (filterText === "") setFilteredPayments(originalPayments);

    startTransition(() => {
      setFilteredPayments(
        originalPayments.filter((p) =>
          p.waiterName?.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    });
  };

  return (
    <div className="waiters-wrapper">
      <h2 style={{ color: "white" }}>
        {intl.formatMessage({ id: "adminPage.payments.text.filterPayments" })}
      </h2>
      <Input onChange={handleInputChange} value={filterPaymentsInput} />
      <div style={{ marginTop: "1.5rem" }}>
        <Table<PaymentDTO>
          rowKey={(payment) => payment.uuid as string}
          columns={columns}
          dataSource={filteredPayments}
          pagination={tableParams.pagination}
          loading={isDataLoading}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default Payment;
