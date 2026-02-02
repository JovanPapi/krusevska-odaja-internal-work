import { UpdateWaiterDTO } from "../../../../api/dto";
import RestServices from "../../../../api/services";
import Waiter from "../../../../models/Waiter";
import { Button, Form, Input, InputNumber, Modal } from "antd";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface EditWaiterProps {
  selectedWaiter: Waiter;
  editModalOpen: boolean;
  setReloadWaiters: Dispatch<SetStateAction<boolean | undefined>>;
  setEditModalState: Dispatch<SetStateAction<{ editModalOpen: boolean; selectedWaiter?: Waiter }>>;
}

/** Functional component used to update certain fields of selected waiter.
 * @param {Waiter} selectedWaiter Selected waiter from the HTML table element.
 * @param {boolean} editModalOpen Tells whether edit modal component is open or closed.
 * @param {Dispatch} setReloadWaiters Dispatch function that refreshes the list of waiters inside Waiters.tsx component
 *  upon updating the selected waiter
 * @param {Dispatch} setEditModalState Dispatch function that updates local state of Waiters.tsx component
 */
const EditWaiter = ({ selectedWaiter, editModalOpen, setReloadWaiters, setEditModalState }: EditWaiterProps) => {
  const intl = useIntl();

  const [form] = Form.useForm();

  const handleCloseModal = () => setEditModalState({ editModalOpen: false, selectedWaiter: undefined });

  const handleEditWaiter = (updatedWaiter: UpdateWaiterDTO) => {
    form.validateFields();

    updatedWaiter.uuid = selectedWaiter.uuid;

    RestServices.waiterController.updateWaiter(updatedWaiter).then((res) => {
      toast.success(res);
      setEditModalState({
        editModalOpen: false,
        selectedWaiter: undefined,
      });
      setReloadWaiters((prevValue) => !prevValue);
    });
  };

  const modalTitle = (
    <p>
      {intl.formatMessage({ id: "adminPage.editWaiter.text.editWaiter" })}
      <b>{`${selectedWaiter.firstName} ${selectedWaiter.lastName}`}</b>
    </p>
  );

  return (
    <Modal
      width="20%"
      open={editModalOpen}
      title={modalTitle}
      onCancel={handleCloseModal}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          {intl.formatMessage({ id: "adminPage.button.close" })}
        </Button>,
        <Button key="submit" htmlType="submit" type="primary" form="editForm">
          {intl.formatMessage({
            id: "adminPage.button.edit",
          })}
        </Button>,
      ]}>
      <Form<UpdateWaiterDTO>
        id="editForm"
        labelCol={{ span: 8 }}
        form={form}
        onFinish={handleEditWaiter}
        layout="vertical">
        <Form.Item<UpdateWaiterDTO>
          label={intl.formatMessage({ id: "adminPage.text.firstName" })}
          name="firstName"
          initialValue={selectedWaiter.firstName}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editWaiter.input.validation.firstName",
              }),
            },
          ]}>
          <Input pattern="[A-Za-z\s]*" placeholder="Michael" />
        </Form.Item>

        <Form.Item<UpdateWaiterDTO>
          label={intl.formatMessage({ id: "adminPage.text.lastName" })}
          name="lastName"
          initialValue={selectedWaiter.lastName}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editWaiter.input.validation.lastName",
              }),
            },
          ]}>
          <Input pattern="[A-Za-z\s]*" placeholder="Jordan" />
        </Form.Item>

        <Form.Item<UpdateWaiterDTO>
          label={intl.formatMessage({ id: "adminPage.text.code" })}
          name="code"
          initialValue={selectedWaiter.code}
          tooltip={intl.formatMessage({
            id: "adminpage.tooltip.enterNumbersOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editWaiter.input.validation.code",
              }),
            },
          ]}>
          <InputNumber style={{ width: "100%" }} placeholder="5" maxLength={2} min={0} max={99} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditWaiter;
