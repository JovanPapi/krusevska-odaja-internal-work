import { ServingTableDTO, UpdateServingTableDTO } from "../../../../api/dto";
import RestServices from "../../../../api/services";
import { useApplicationStoreSelector } from "../../../../store/ApplicationStore";
import { Button, Form, InputNumber, Modal, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface EditServingTableProps {
  selectedServingTable: ServingTableDTO;
  editModalOpen: boolean;
  setReloadServingTables: Dispatch<SetStateAction<boolean | undefined>>;
  setEditModalState: Dispatch<
    SetStateAction<{
      editModalOpen: boolean;
      selectedServingTable?: ServingTableDTO;
    }>
  >;
}

/** Functional component used to update certain fields of selected serving table.
 * @param {ServingTableDTO} selectedServingTable Selected serving table from the HTML table element.
 * @param {boolean} editModalOpen Tells whether edit modal component is open or closed.
 * @param {Dispatch} setReloadServingTables Dispatch function that refreshes the list of serving table inside ServingTable.tsx component
 *  upon updating the selected table.
 * @param {Dispatch} setEditModalState Dispatch function that updates local state of ServingTable.tsx component
 */
const EditServingTable = ({
  selectedServingTable,
  editModalOpen,
  setEditModalState,
  setReloadServingTables,
}: EditServingTableProps) => {
  const intl = useIntl();

  const [form] = Form.useForm();

  const { originalWaiters } = useApplicationStoreSelector();

  const handleCloseModal = () =>
    setEditModalState({
      editModalOpen: false,
      selectedServingTable: undefined,
    });

  const handleEditServingTable = (servingTableToUpdate: UpdateServingTableDTO) => {
    form.validateFields();

    RestServices.servingTableController
      .updateServingTable({
        uuid: selectedServingTable.uuid,
        waiterUuid: servingTableToUpdate.waiterUuid,
        code: servingTableToUpdate.code,
      })
      .then((res) => {
        toast.success(res);
        setEditModalState({
          editModalOpen: false,
          selectedServingTable: undefined,
        });
        setReloadServingTables((prevValue) => !prevValue);
      });
  };

  const modalTitle = (
    <p>
      <b>
        {intl.formatMessage({
          id: "adminPage.editServingTable.title.text",
        })}{" "}
        {selectedServingTable.waiterName}{" "}
      </b>
    </p>
  );

  return (
    <Modal
      open={editModalOpen}
      title={modalTitle}
      onCancel={handleCloseModal}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          {intl.formatMessage({ id: "adminPage.button.close" })}
        </Button>,
        <Button key="submit" htmlType="submit" type="primary" form="editForm">
          {intl.formatMessage({ id: "adminPage.button.edit" })}
        </Button>,
      ]}>
      <Form<UpdateServingTableDTO>
        id="editForm"
        labelCol={{ span: 8 }}
        form={form}
        onFinish={handleEditServingTable}
        layout="vertical">
        <Form.Item<UpdateServingTableDTO>
          label={intl.formatMessage({ id: "adminPage.text.code" })}
          name="code"
          initialValue={selectedServingTable.code}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editServingTable.input.code.validation",
              }),
            },
          ]}>
          <InputNumber style={{ width: "65%" }} placeholder="6" />
        </Form.Item>

        <Form.Item<UpdateServingTableDTO>
          label={intl.formatMessage({
            id: "adminPage.form.label.changeWaiter",
          })}
          name="waiterUuid"
          initialValue={selectedServingTable.waiterName}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editServingTable.input.selectWaiter.validation",
              }),
            },
          ]}>
          <Select
            style={{ width: "65%" }}
            options={originalWaiters.map((waiter): DefaultOptionType => {
              return {
                label: `${waiter.firstName} ${waiter.lastName}`,
                value: waiter.uuid,
              };
            })}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditServingTable;
