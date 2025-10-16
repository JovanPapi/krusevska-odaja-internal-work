import {
  Input,
  Popconfirm,
  Radio,
  RadioChangeEvent,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd";

import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { ServingTableDTO } from "../../../../api/dto";
import RestServices from "../../../../api/services";

import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import { ViewOrdersModalState } from "../../../../interfaces";
import EditServingTable from "./EditServingTable";
import "./ServingTable.css";
import ViewOrdersModal from "./ViewOrders";

interface TableParams {
  pagination: TablePaginationConfig;
}

// TODO: make new filter for tables with closed status but their remaining balance is greater than 0 (non-fiscal tables, just printed paragon and then table is closed by the owners)
/** Functional component used to display list of serving tables retrived from backend, inside html table element.
 *  Also offers features for edit and delete functions. */
const ServingTables = () => {
  const intl = useIntl();

  const [originalServingTables, setOriginalServingTables] = useState<
    ServingTableDTO[]
  >([]);
  const [filteredServingTables, setFilteredServingTables] = useState<
    ServingTableDTO[]
  >([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>();

  const [reloadServingTables, setReloadServingTables] = useState<boolean>();

  const [filterServingTableInput, setFilterServingTableInput] =
    useState<string>("");

  const [editModal, setEditModal] = useState<{
    editModalOpen: boolean;
    selectedServingTable?: ServingTableDTO;
  }>({ editModalOpen: false, selectedServingTable: undefined });

  const [viewOrdersModal, setViewOrdersModal] = useState<ViewOrdersModalState>({
    viewOrdersModalOpen: false,
    selectedServingTable: undefined,
  });

  const [, startTransition] = useTransition();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [filterByTableStatus, setFilterByTableStatus] = useState<
    "Reserved" | "Closed"
  >("Reserved");

  useEffect(() => {
    setIsDataLoading(true);
    RestServices.krusevska_odaja_ServingTableController
      .fetchServingTables()
      .then((response) => {
        setOriginalServingTables(response);
        setFilteredServingTables(
          response.filter(
            (stp) => stp.servingTableStatus === filterByTableStatus
          )
        );
        setIsDataLoading(false);
      })
      .catch(() => {
        setIsDataLoading(false);
      });
  }, [reloadServingTables]);

  const columns: TableColumnsType<ServingTableDTO> = [
    {
      title: intl.formatMessage({
        id: "adminPage.servingTable.table.column.tableNo",
      }),
      dataIndex: "code",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.servingTable.table.column.totalPrice",
      }),
      dataIndex: "totalPrice",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.servingTable.table.column.amountPaid",
      }),
      dataIndex: "amountPaid",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.servingTable.table.column.remainingBalance",
      }),
      dataIndex: "remainingBalance",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.servingTable.table.column.status",
      }),
      dataIndex: "servingTableStatus",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.servingTable.table.column.waiterName",
      }),
      dataIndex: "waiterName",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.servingTable.table.column.actions",
      }),
      render: (_, servingTable) => (
        <div style={{ display: "flex", columnGap: "2.5rem" }}>
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() =>
              setViewOrdersModal({
                viewOrdersModalOpen: true,
                selectedServingTable: servingTable,
              })
            }
          >
            {intl.formatMessage({
              id: "adminPage.servingTable.table.column.actions.button.viewOrders",
            })}
          </span>
          {servingTable.servingTableStatus === "Reserved" ? (
            <>
              <span
                style={{ color: "blue", cursor: "pointer" }}
                onClick={() => {
                  setEditModal({
                    editModalOpen: true,
                    selectedServingTable: servingTable,
                  });
                }}
              >
                {intl.formatMessage({ id: "adminPage.button.edit" })}
              </span>
              <Popconfirm
                title={intl.formatMessage({
                  id: "adminPage.servingTable.popup.sureToClose",
                })}
                onConfirm={() =>
                  //TODO: Implemented, but need to implement entity for non-fiscal checks/payments (не е извадена фискална сметка за затворената маса, црни пари)
                  handleCloseServingTable(servingTable.uuid as string)
                }
              >
                <span style={{ color: "blue", cursor: "pointer" }}>
                  {intl.formatMessage({ id: "adminPage.button.close" })}
                </span>
              </Popconfirm>
              <Popconfirm
                title={intl.formatMessage({
                  id: "adminPage.text.sureToDelete",
                })}
                onConfirm={() =>
                  handleDeleteServingTable(servingTable.uuid as string)
                }
              >
                <span style={{ color: "blue", cursor: "pointer" }}>
                  {intl.formatMessage({ id: "adminPage.text.delete" })}
                </span>
              </Popconfirm>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  const handleDeleteServingTable = (servingTableId: string) => {
    RestServices.krusevska_odaja_ServingTableController
      .deleteServingTableById(servingTableId)
      .then((response) => {
        toast.success(response);
        setReloadServingTables(!reloadServingTables);
      });
  };

  const handleCloseServingTable = (servingTableId: string) => {
    RestServices.krusevska_odaja_ServingTableController
      .closeServingTableById(servingTableId)
      .then((response) => {
        toast.success(response);
        setReloadServingTables(!reloadServingTables);
      });
  };

  const handleTableChange: TableProps<ServingTableDTO>["onChange"] = (
    pagination
  ) => {
    setTableParams({
      pagination,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setFilterServingTableInput(filterText);

    if (filterText === "") setFilteredServingTables(originalServingTables);

    startTransition(() => {
      setFilteredServingTables(
        originalServingTables.filter((stp) =>
          stp.waiterName?.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    });
  };

  const handleTableStatusChange = (e: RadioChangeEvent) => {
    setFilterByTableStatus(e.target.value);
    startTransition(() => {
      setFilteredServingTables(
        originalServingTables.filter(
          (stp) => stp.servingTableStatus === e.target.value
        )
      );
    });
  };

  return (
    <div className="servingTable-wrapper">
      <h2 style={{ color: "white" }}>
        {intl.formatMessage({
          id: "adminPage.servingTable.text.filterServingTables",
        })}
      </h2>
      <Input onChange={handleInputChange} value={filterServingTableInput} />
      <br />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          columnGap: "1rem",
          marginLeft: "-7rem",
        }}
      >
        <p style={{ color: "white", fontSize: "1rem", marginTop: "1.5rem" }}>
          {intl.formatMessage({
            id: "adminPage.servingTable.text.selectStatusOfTable",
          })}
        </p>
        <Radio.Group
          style={{
            marginTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            rowGap: "1rem",
          }}
          value={filterByTableStatus}
          onChange={handleTableStatusChange}
        >
          <Radio style={{ color: "white", fontSize: "1rem" }} value="Reserved">
            {intl.formatMessage({ id: "adminPage.servingTable.text.reserved" })}
          </Radio>
          <Radio style={{ color: "white", fontSize: "1rem" }} value="Closed">
            {intl.formatMessage({ id: "adminPage.servingTable.text.closed" })}
          </Radio>
        </Radio.Group>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <Table<ServingTableDTO>
          rowKey={(st) => st.uuid as string}
          columns={columns}
          dataSource={filteredServingTables}
          pagination={tableParams.pagination}
          loading={isDataLoading}
          onChange={handleTableChange}
        />
      </div>

      {editModal.editModalOpen === true ? (
        <EditServingTable
          editModalOpen={editModal.editModalOpen}
          selectedServingTable={
            editModal.selectedServingTable as ServingTableDTO
          }
          setEditModalState={setEditModal}
          setReloadServingTables={setReloadServingTables}
        />
      ) : null}

      {viewOrdersModal.viewOrdersModalOpen === true ? (
        <ViewOrdersModal
          setReloadServingTables={setReloadServingTables}
          setViewOrdersModal={setViewOrdersModal}
          viewOrdersModal={viewOrdersModal}
        />
      ) : null}
    </div>
  );
};

export default ServingTables;
