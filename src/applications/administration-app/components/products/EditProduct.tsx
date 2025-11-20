import RestServices from "../../../../api/services";
import Product from "../../../../models/Product";
import { productCategoryStringArray } from "../../constants";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface EditProductProps {
  selectedProduct: Product;
  editModalOpen: boolean;
  setReloadProducts: Dispatch<SetStateAction<boolean | undefined>>;
  setEditModalState: Dispatch<SetStateAction<{ editModalOpen: boolean; selectedProduct?: Product }>>;
}

/** Functional component used for updating a selected product.
 * @param {Product} selectedProduct Selected product.
 * @param {boolean} editModalOpen Tells whether the edit modal component is open or closed.
 * @param {Dispatch} setReloadProducts Dispatch function that refreshes the list of products inside Products.tsx upon updating selected product.
 * @param {Dispatch} setEditModalState Dispatch function that updates the local state of Products.tsx.
 */
const EditProduct = ({ selectedProduct, editModalOpen, setEditModalState, setReloadProducts }: EditProductProps) => {
  const intl = useIntl();

  const [form] = Form.useForm();

  const handleCloseModal = () => setEditModalState({ editModalOpen: false, selectedProduct: undefined });

  const handleEditProduct = (updatedProduct: Product) => {
    form.validateFields();

    // No need for extra logic for editing the ingredients.
    // If the ingredients are wrong for the newly created product,
    // It can be deleted and created with the right ingredients
    updatedProduct.uuid = selectedProduct.uuid;
    updatedProduct.listOfIngredients = selectedProduct.listOfIngredients;

    RestServices.productController.updateProduct(updatedProduct).then((res) => {
      toast.success(res);
      setEditModalState({ editModalOpen: false, selectedProduct: undefined });
      setReloadProducts((prevValue) => !prevValue);
    });
  };

  const modalTitle = (
    <p>
      {intl.formatMessage({ id: "adminPage.editProduct.title.text" })} {selectedProduct.name}
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
      <Form<Product> id="editForm" labelCol={{ span: 8 }} form={form} onFinish={handleEditProduct} layout="vertical">
        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.name",
          })}
          name="name"
          initialValue={selectedProduct.name}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editProduct.input.name.validation",
              }),
            },
          ]}>
          <Input style={{ width: "75%" }} pattern="[A-Za-z\s]*" placeholder="White wine.." />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.nameTranslated",
          })}
          name="nameTranslated"
          initialValue={selectedProduct.nameTranslated}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editProduct.input.name.validation",
              }),
            },
          ]}>
          <Input style={{ width: "75%" }} placeholder="Бело вино.." />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.price",
          })}
          name="price"
          initialValue={selectedProduct.price}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterNumbersOnly",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editProduct.input.price.validation",
              }),
            },
          ]}>
          <InputNumber style={{ width: "75%" }} min={0} max={10000} placeholder="90" />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.description",
          })}
          name="description"
          initialValue={selectedProduct.description}
          rules={[{ required: false }]}>
          <TextArea style={{ width: "75%", textAlign: "center" }} />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.category",
          })}
          name="productCategory"
          initialValue={selectedProduct.productCategory}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.selectCategoryOfProduct",
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editProduct.input.category.validation",
              }),
            },
          ]}>
          <Select style={{ width: "75%" }} options={productCategoryStringArray} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProduct;
