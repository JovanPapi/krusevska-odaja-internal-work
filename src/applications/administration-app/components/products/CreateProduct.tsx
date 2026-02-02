import RestServices from "../../../../api/services";
import Ingredient from "../../../../models/Ingredient";
import Product from "../../../../models/Product";
import { useLanguageSwitcherSelector } from "../../../../store/language-switcher/LanguageSwitcher";
import { productCategoryStringArray } from "../../constants";
import { useApplicationStoreSelector } from "../../store/AdministrationPageStoreProvider";
import { Button, Form, Input, InputNumber, Modal, Select, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface CreateProductProps {
  createModalOpen: boolean;
  setReloadProducts: Dispatch<SetStateAction<boolean | undefined>>;
  setCreateModalOpen: Dispatch<SetStateAction<boolean>>;
}

/** Functional component used for creating new product.
 * @param {boolean} createModalOpen Tells whether the create modal component is open or closed.
 * @param {Dispatch} setReloadProducts Dispatch function that refreshes the list of products inside Products.tsx upon updating selected product.
 * @param {Dispatch} setCreateModalOpen Dispatch function that updates the local state of Products.tsx.
 */
const CreateProduct = ({ createModalOpen, setReloadProducts, setCreateModalOpen }: CreateProductProps) => {
  const intl = useIntl();

  const { currentLanguage } = useLanguageSwitcherSelector();

  const [form] = Form.useForm();

  const { listOfIngredients } = useApplicationStoreSelector();
  const [inputIngredients, setInputIngredients] = useState<string>("");

  const handleCloseModal = () => setCreateModalOpen(!createModalOpen);

  const handleCreateProduct = (newProduct: Product, ingredients: string) => {
    form.validateFields();

    const tempIng = ingredients.split(",");

    newProduct.listOfIngredients = [];
    tempIng.forEach((ing) => {
      newProduct.listOfIngredients?.push(
        listOfIngredients.find((ing1) =>
          currentLanguage === "en"
            ? ing1.name?.toLowerCase() === ing.trim().toLowerCase()
            : ing1.nameTranslated?.toLowerCase() === ing.trim().toLowerCase(),
        ) as Ingredient,
      );
    });

    RestServices.productController.createProduct(newProduct).then((res) => {
      toast.success(res);
      setCreateModalOpen(false);
      setReloadProducts((prevValue) => !prevValue);
    });
  };

  const mapIngredientsToString = listOfIngredients.map((ing, index) => {
    if (index === listOfIngredients.length - 1) {
      return currentLanguage === "en" ? ing.name : ing.nameTranslated;
    }
    return currentLanguage === "en" ? ing.name + ", " : ing.nameTranslated + ", ";
  });

  const modalTitle = <p>{intl.formatMessage({ id: "adminPage.createProduct.title.text" })}</p>;

  return (
    <Modal
      width="20%"
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
      <Form<Product>
        id="createForm"
        form={form}
        onFinish={(values) => handleCreateProduct(values, inputIngredients)}
        labelCol={{ span: 8 }}
        layout="vertical">
        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.name",
          })}
          name="name"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editProduct.input.name.validation",
              }),
            },
          ]}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}>
          <Input pattern="[A-Za-z\s]*" placeholder="White wine..." />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.nameTranslated",
          })}
          name="nameTranslated"
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: "adminPage.editProduct.input.name.validation",
              }),
            },
          ]}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.enterTextOnly",
          })}>
          <Input placeholder="Бело вино..." />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.price",
          })}
          name="price"
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
          <InputNumber style={{ width: "100%" }} min={0} max={10000} placeholder="350..." />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.description",
          })}
          name="description"
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.additionalDescriptionForProduct",
          })}>
          <TextArea />
        </Form.Item>

        <Form.Item<Product>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.category",
          })}
          name="productCategory"
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
          <Select options={productCategoryStringArray} />
        </Form.Item>

        <Form.Item<string>
          label={intl.formatMessage({
            id: "adminPage.editProduct.form.label.ingredients",
          })}
          tooltip={intl.formatMessage({
            id: "adminPage.tooltip.addIngredients",
          })}>
          <Tooltip title={mapIngredientsToString}>
            <Input
              placeholder="Hard cheese, leak, onions..."
              onChange={(e) => setInputIngredients(e.target.value)}
              pattern="[A-Za-z,\s]*"
            />
          </Tooltip>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProduct;
