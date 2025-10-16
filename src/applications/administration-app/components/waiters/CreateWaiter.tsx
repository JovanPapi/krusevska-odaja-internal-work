import { Button, Form, Input, InputNumber, Modal } from "antd";
import { Dispatch, SetStateAction } from "react";
import RestServices from "../../../../api/services";
import Waiter from "../../../../models/Waiter";

import { useIntl } from "react-intl";
import toast from "react-hot-toast";

interface CreateWaiterProps {
  createModalOpen: boolean;
  setReloadWaiters: Dispatch<SetStateAction<boolean | undefined>>;
  setCreateModalOpen: Dispatch<SetStateAction<boolean>>;
}

/** Functional component used to create new waiter.
 * @param {boolean} createModalOpen Tells whether create modal component is open or closed.
 * @param {Dispatch} setReloadWaiters Dispatch function that refreshes the list of waiters inside Waiters.tsx component
 *  upon updating the selected waiter
 * @param {Dispatch} setCreateModalOpen Dispatch function that updates local state of Waiters.tsx component
 */
const CreateWaiter = ({
  createModalOpen,
  setReloadWaiters,
  setCreateModalOpen,
}: CreateWaiterProps) => {
  const intl = useIntl();

  const [form] = Form.useForm();

  const handleCloseModal = () => setCreateModalOpen(!createModalOpen);

  const handleCreateWaiter = (newWaiter: Waiter) => {
    form.validateFields();

    newWaiter.listOfOrders = [];
    newWaiter.listOfServingTables = [];

    RestServices.krusevska_odaja_WaiterController
      .createWaiter(newWaiter)
      .then((res) => {
        toast.success(res);
        setCreateModalOpen(false);
        setReloadWaiters((prevValue) => !prevValue);
      });
  };

  const modalTitle = (
    <p>
      <b>{intl.formatMessage({ id: "adminPage.createWaiter.title.text" })}</b>
    </p>
  );
  return (
    <Modal
      open={createModalOpen}
      onCancel={handleCloseModal}
      title={modalTitle}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          {intl.formatMessage({ id: "adminPage.button.close" })}
        </Button>,
        <Button type="primary" form="createForm" htmlType="submit" key="submit">
          {intl.formatMessage({
            id: "adminPage.button.create",
          })}
        </Button>,
      ]}
    >
      <Form<Waiter>
        id="createForm"
        form={form}
        onFinish={handleCreateWaiter}
        labelCol={{ span: 8 }}
        layout="vertical"
      >
        <Form.Item<Waiter>
          label={intl.formatMessage({ id: "adminPage.text.firstName" })}
          name="firstName"
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.createWaiter.input.validation.firstName",
              }),
            },
          ]}
        >
          <Input
            style={{ width: "65%" }}
            pattern="[A-Za-z\s]*"
            placeholder="Michael"
          />
        </Form.Item>

        <Form.Item<Waiter>
          label={intl.formatMessage({ id: "adminPage.text.lastName" })}
          name="lastName"
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.createWaiter.input.validation.lastName",
              }),
            },
          ]}
        >
          <Input
            style={{ width: "65%" }}
            pattern="[A-Za-z\s]*"
            placeholder="Jordan"
          />
        </Form.Item>

        <Form.Item<Waiter>
          label={intl.formatMessage({ id: "adminPage.text.code" })}
          name="code"
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
          ]}
        >
          <InputNumber
            style={{ width: "65%" }}
            placeholder="5"
            max={99}
            min={0}
            maxLength={2}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateWaiter;
