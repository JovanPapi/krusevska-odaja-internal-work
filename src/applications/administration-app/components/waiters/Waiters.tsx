import CreateWaiter from "./CreateWaiter";
import EditWaiter from "./EditWaiter";
import RestServices from "../../../../api/services";
import Waiter from "../../../../models/Waiter";
import { Button, Input, Popconfirm, Table, TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import "./Waiters.css";

import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface TableParams {
  pagination: TablePaginationConfig;
}

/** Functional component used to display list of waiters retrieved from backend, inside a html table element.
 *
 * Offers features such as deleting waiter, edit, create.
 */
const Waiters = () => {
  const intl = useIntl();

  const [originalWaiters, setOriginalWaiters] = useState<Waiter[]>([]);
  const [filteredWaiters, setFilteredWaiters] = useState<Waiter[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>();

  const [reloadWaiters, setReloadWaiters] = useState<boolean>();

  const [filterWaitersInput, setFilterWaitersInput] = useState<string>("");

  const [editModalState, setEditModalState] = useState<{
    editModalOpen: boolean;
    selectedWaiter?: Waiter;
  }>({ editModalOpen: false, selectedWaiter: undefined });

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [, startTransition] = useTransition();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 7,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setIsDataLoading(true);
      try {
        const response = await RestServices.waiterController.fetchWaitersForAdminPage();
        setOriginalWaiters(response);
        setFilteredWaiters(response);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setIsDataLoading(false);
      }
    };
    loadData();
  }, [reloadWaiters]);

  const columns: TableColumnsType<Waiter> = [
    {
      title: intl.formatMessage({ id: "adminPage.waiters.table.column.name" }),
      render: (_, waiter) => `${waiter.firstName} ${waiter.lastName}`,
    },
    {
      title: intl.formatMessage({ id: "adminPage.waiters.table.column.code" }),
      dataIndex: "code",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.waiters.table.column.actions",
      }),
      render: (_, waiter) => (
        <div style={{ display: "flex", columnGap: "2.5rem" }}>
          <Popconfirm
            title={intl.formatMessage({
              id: "adminPage.text.sureToDelete",
            })}
            onConfirm={() => handleDeleteWaiter(waiter.uuid as string)}>
            <span style={{ color: "blue", cursor: "pointer" }}>
              {intl.formatMessage({
                id: "adminPage.text.delete",
              })}
            </span>
          </Popconfirm>
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              setEditModalState({
                editModalOpen: true,
                selectedWaiter: waiter,
              });
            }}>
            {intl.formatMessage({
              id: "adminPage.text.edit",
            })}
          </span>
        </div>
      ),
    },
  ];

  const handleDeleteWaiter = (waiterId: string) => {
    RestServices.waiterController.deleteWaiterById(waiterId).then((response) => {
      toast.success(response);
      setReloadWaiters(!reloadWaiters);
    });
  };

  const handleTableChange: TableProps<Waiter>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setFilterWaitersInput(filterText);

    if (filterText === "") {
      setFilteredWaiters(originalWaiters);
    }

    startTransition(() => {
      setFilteredWaiters(
        originalWaiters.filter(
          (p) =>
            p.firstName?.toLowerCase().includes(filterText.toLowerCase()) ||
            p.lastName?.toLowerCase().includes(filterText.toLowerCase()),
        ),
      );
    });
  };

  return (
    <div className="waiters-wrapper">
      <h2 style={{ color: "white" }}>{intl.formatMessage({ id: "adminPage.waiters.text.filterWaiters" })}</h2>
      <Input onChange={handleInputChange} value={filterWaitersInput} />
      <br />
      <div style={{ textAlign: "end" }}>
        <Button type="primary" onClick={() => setCreateModalOpen(true)}>
          {intl.formatMessage({ id: "adminPage.waiters.text.createWaiter" })}
        </Button>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <Table<Waiter>
          rowKey={(waiter) => waiter.uuid as string}
          columns={columns}
          dataSource={filteredWaiters}
          pagination={tableParams.pagination}
          loading={isDataLoading}
          onChange={handleTableChange}
        />
      </div>

      {editModalState.editModalOpen === true ? (
        <EditWaiter
          editModalOpen={editModalState.editModalOpen}
          selectedWaiter={editModalState.selectedWaiter as Waiter}
          setEditModalState={setEditModalState}
          setReloadWaiters={setReloadWaiters}
        />
      ) : null}

      {createModalOpen === true ? (
        <CreateWaiter
          createModalOpen={createModalOpen}
          setCreateModalOpen={setCreateModalOpen}
          setReloadWaiters={setReloadWaiters}
        />
      ) : null}
    </div>
  );
};

export default Waiters;
