import { useEffect, useState, useTransition } from "react";
import { useIntl } from "react-intl";
import Product from "../../../../models/Product";
import { useApplicationStoreSelector } from "../../../../store/ApplicationStore";
import { validateTableOrderFields } from "../../../../utils";
// import "./CustomerOrder.css";
import { Button, Checkbox, Col, Form, InputNumber, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import Ingredient from "../../../../models/Ingredient";
import OrderProduct from "../../../../models/OrderProduct";
import { useLanguageSwitcherSelector } from "../../../../store/language-switcher/LanguageSwitcher";
import ServingTableActions from "./serving-table-actions/ServingTableActions";
import ServingTableInfo from "./serving-table-info/ServingTableInfo";
import TableTotalPrice from "./serving-table-total-price/TableTotalPrice";
import ViewWaiterTables from "./view-waiter-info/ViewWaiterTables";

/** Functional component used to display all neccessary elements to allow a waiter to execute a specific logic (create table, create order, select product etc.). */
const CustomerOrder = () => {
  const intl = useIntl();
  const { currentLanguage } = useLanguageSwitcherSelector();

  const { originalProducts, saveProductToServingTable } =
    useApplicationStoreSelector();

  const [productInput, setProductInput] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<number>(0);
  const [, setViewTables] = useState<boolean>(true);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product>();

  const [selectedProductIngredients, setSelectedProductIngredients] = useState<
    Ingredient[]
  >([]);

  const [, startTransition] = useTransition();

  const [form] = useForm();

  useEffect(() => {
    if (originalProducts !== undefined) {
      setFilteredProducts([...originalProducts]);
    }
  }, [originalProducts]);

  const handleSearchProductInput = (searchValue: string) => {
    setProductInput(searchValue);

    if (searchValue === "") {
      setFilteredProducts([...originalProducts]);
      setSelectedProduct(undefined);
    }

    startTransition(() =>
      setFilteredProducts(
        originalProducts.filter((product) =>
          product.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    );
  };

  const handleProductOptionClick = (stringifiedProduct: string) => {
    if (stringifiedProduct === undefined) {
      setProductInput("undefined");
      setSelectedProduct(undefined);
      setSelectedProductIngredients([]);
      return;
    }

    const parsedProduct: Product = JSON.parse(stringifiedProduct);
    setProductInput(`${parsedProduct.name} ${parsedProduct.description}`);
    setSelectedProduct(parsedProduct);
    setSelectedProductIngredients(parsedProduct.listOfIngredients);
  };

  const handleConfirmButton = () => {
    form.validateFields();

    const tempSelectedProduct = { ...selectedProduct };

    if (tempSelectedProduct?.listOfIngredients !== undefined) {
      if (
        selectedProductIngredients.length !==
        selectedProduct?.listOfIngredients.length
      ) {
        tempSelectedProduct!.listOfIngredients = selectedProductIngredients;
      }
    }

    saveProductToServingTable(tempSelectedProduct as Product, quantityInput);
    setSelectedProduct(undefined);
    setProductInput("");
    setQuantityInput(0);

    form.resetFields();
  };

  const handleSelectProductIngredients = (selectedIngredient: Ingredient[]) => {
    setSelectedProductIngredients(selectedIngredient);
  };

  const validateFields = validateTableOrderFields();

  return (
    <div style={{ padding: "1rem" }}>
      <Form id="selectProductForm" form={form} onFinish={handleConfirmButton}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: "3rem",
          }}
        >
          <div style={{ flexBasis: "35%" }}>
            <Form.Item<OrderProduct>
              layout="vertical"
              label={
                <label style={{ fontSize: "1.1rem", color: "white" }}>
                  {intl.formatMessage({
                    id: "customerOrder.text.productName",
                  })}
                </label>
              }
              name="product"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: "customerOrder.input.validation.product",
                  }),
                },
              ]}
            >
              <Select
                disabled={validateFields}
                showSearch={true}
                placeholder={intl.formatMessage({
                  id: "customerOrder.input.product.placeholder",
                })}
                onSearch={(searchValue) =>
                  handleSearchProductInput(searchValue)
                }
                onChange={handleProductOptionClick}
                value={productInput}
                allowClear={true}
              >
                {filteredProducts.map((product) => (
                  <Select.Option
                    key={product.uuid}
                    value={JSON.stringify(product)}
                    style={{ fontSize: "1rem" }}
                  >
                    {currentLanguage === "en"
                      ? product.name
                      : product.nameTranslated}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ flexBasis: "7%" }}>
            <Form.Item<OrderProduct>
              layout="vertical"
              label={
                <label style={{ fontSize: "1.1rem", color: "white" }}>
                  {intl.formatMessage({
                    id: "customerOrder.text.productQuantity",
                  })}
                </label>
              }
              name="quantity"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({
                    id: "customerOrder.input.validation.productQuantity",
                  }),
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                disabled={validateFields}
                value={quantityInput}
                min={0}
                max={99}
                maxLength={2}
                onChange={(quantity) => setQuantityInput(quantity as number)}
                placeholder="5"
              />
            </Form.Item>
          </div>

          <div style={{ flexBasis: "5%" }}>
            <Form.Item
              layout="vertical"
              label={
                <label style={{ fontSize: "1.1rem", color: "white" }}>
                  {intl.formatMessage({
                    id: "customerOrder.text.productPrice",
                  })}
                </label>
              }
            >
              <InputNumber
                disabled={validateFields}
                readOnly
                value={
                  selectedProduct === undefined ? "" : selectedProduct.price
                }
              />
            </Form.Item>
          </div>

          <div style={{ marginTop: "2.2rem" }}>
            <Button
              disabled={validateFields}
              type="primary"
              htmlType="submit"
              form="selectProductForm"
              style={{ fontSize: "1.1rem" }}
            >
              {intl.formatMessage({
                id: "customerOrder.text.button.confirmproduct",
                defaultMessage: "Confirm product",
              })}
            </Button>
          </div>
        </div>

        <Form.Item
          style={{ marginTop: "1rem", marginBottom: 0 }}
          layout="vertical"
          label={
            <label
              style={{
                fontSize: "1.1rem",
                color: "white",
              }}
            >
              {intl.formatMessage({
                id: "customerOrder.input.ingredients.label",
              })}
            </label>
          }
        >
          {selectedProduct !== undefined &&
          selectedProduct.listOfIngredients.length !== 0 ? (
            <Checkbox.Group<Ingredient>
              value={selectedProductIngredients}
              onChange={handleSelectProductIngredients}
            >
              <Row gutter={[10, 10]}>
                {selectedProduct.listOfIngredients.map((ingredient) => (
                  <Col span={12} key={ingredient.uuid}>
                    <Checkbox
                      value={ingredient}
                      style={{ fontSize: "1rem", color: "white" }}
                    >
                      {currentLanguage === "en"
                        ? ingredient.name
                        : ingredient.nameTranslated}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          ) : null}
        </Form.Item>
      </Form>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          columnGap: "5rem",
          marginTop: "7rem",
          height: "47vh",
        }}
      >
        <ServingTableInfo />
        <ServingTableActions setViewTables={setViewTables} />

        <ViewWaiterTables />
      </div>
      <TableTotalPrice />
    </div>
  );
};

export default CustomerOrder;
