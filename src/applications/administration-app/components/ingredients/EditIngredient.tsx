import RestServices from "../../../../api/services";
import Ingredient from "../../../../models/Ingredient";
import { Button, Form, Input, Modal } from "antd";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface EditIngredientProps {
  selectedIngredient: Ingredient;
  editModalOpen: boolean;
  setReloadIngredient: Dispatch<SetStateAction<boolean | undefined>>;
  setEditModalState: Dispatch<SetStateAction<{ editModalOpen: boolean; selectedIngredient?: Ingredient }>>;
}

/** Functional component responsible for editing a selecting ingredient.
 * @param {Ingredient} selectedIngredient Ingredient that needs to be updated.
 * @param {boolean} editModalOpen Tells whether the edit modal component is opened or closed.
 * @param {Dispatch} setReloadIngredient Dispatch function used to refresh the list of ingredient upon editing selected ingredient.
 * @param {Dispatch} setEditModalState Dispatch function used to update local state of the Ingredien.tsx.
 */
const EditIngredient = ({
  selectedIngredient,
  editModalOpen,
  setEditModalState,
  setReloadIngredient,
}: EditIngredientProps) => {
  const intl = useIntl();

  const [form] = Form.useForm();

  const handleCloseModal = () => setEditModalState({ editModalOpen: false, selectedIngredient: undefined });

  const handleEditIngredient = (updatedIngredient: Ingredient) => {
    form.validateFields();

    updatedIngredient.uuid = selectedIngredient.uuid;

    RestServices.ingredientController.updateIngredient(updatedIngredient).then((res) => {
      toast.success(res);
      setEditModalState({
        editModalOpen: false,
        selectedIngredient: undefined,
      });
      setReloadIngredient((prevValue) => !prevValue);
    });
  };

  const modalTitle = (
    <p>
      {intl.formatMessage({ id: "adminPage.editIngredient.text.title" })} <b>{selectedIngredient.name}</b>
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
      <Form<Ingredient>
        id="editForm"
        labelCol={{ span: 8 }}
        form={form}
        onFinish={handleEditIngredient}
        layout="vertical">
        <Form.Item<Ingredient>
          label={intl.formatMessage({
            id: "adminPage.editIngredient.form.label.name",
          })}
          name="name"
          initialValue={selectedIngredient.name}
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
          initialValue={selectedIngredient.nameTranslated}
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

export default EditIngredient;
