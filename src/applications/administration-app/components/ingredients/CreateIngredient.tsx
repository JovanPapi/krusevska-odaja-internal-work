import RestServices from "../../../../api/services";
import Ingredient from "../../../../models/Ingredient";
import { Button, Form, Input, Modal } from "antd";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface CreateIngredientProps {
  createModalOpen: boolean;
  setCreateModalOpen: Dispatch<SetStateAction<boolean>>;
  setReloadIngredients: Dispatch<SetStateAction<boolean | undefined>>;
}

/** Functional component used to create new ingredient.
 * @param {boolean} createModalOpen Tells whether the create modal component is open or closed.
 * @param {Dispatch} setCreateModalOpen Dispatch function that updates local state inside Ingredient.tsx.
 * @param {Dispatch} setReloadIngredients Dispatch function that refreshes the list of ingredients inside Ingredient.tsx upon creating new ingredient element.
 */
const CreateIngredient = ({ createModalOpen, setCreateModalOpen, setReloadIngredients }: CreateIngredientProps) => {
  const intl = useIntl();

  const [form] = Form.useForm();

  const handleCloseModal = () => setCreateModalOpen(!createModalOpen);

  const handleCreateIngredient = (newIngredient: Ingredient) => {
    form.validateFields();

    RestServices.ingredientController.createIngredient(newIngredient).then((res) => {
      toast.success(res);
      setCreateModalOpen(false);
      setReloadIngredients((prevValue) => !prevValue);
    });
  };

  const modalTitle = (
    <p>
      <b>{intl.formatMessage({ id: "adminPage.createIngredient.text.title" })}</b>
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
          {intl.formatMessage({ id: "adminPage.button.create" })}
        </Button>,
      ]}>
      <Form<Ingredient>
        id="createForm"
        form={form}
        onFinish={handleCreateIngredient}
        labelCol={{ span: 8 }}
        layout="vertical">
        <Form.Item<Ingredient>
          label={intl.formatMessage({
            id: "adminPage.editIngredient.form.label.name",
          })}
          name="name"
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editIngredient.input.name.validation",
              }),
            },
          ]}>
          <Input style={{ width: "65%" }} pattern="[A-Za-z\s]*" placeholder="Onion.." />
        </Form.Item>

        <Form.Item<Ingredient>
          label={intl.formatMessage({
            id: "adminPage.editIngredient.form.label.nameTranslated",
          })}
          name="nameTranslated"
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editIngredient.input.name.validation",
              }),
            },
          ]}>
          <Input style={{ width: "65%" }} placeholder="Кромид.." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateIngredient;
