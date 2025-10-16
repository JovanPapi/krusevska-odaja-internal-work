import {
  Button,
  Input,
  Popconfirm,
  Table,
  TableColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd";

import { ChangeEvent, useEffect, useState, useTransition } from "react";
import { useIntl } from "react-intl";
import RestServices from "../../../../api/services";
import Product from "../../../../models/Product";
import { useLanguageSwitcherSelector } from "../../../../store/language-switcher/LanguageSwitcher";

import { mapProductCategoryEnumValues } from "../../constants";
import CreateProduct from "./CreateProduct";
import EditProduct from "./EditProduct";
import "./Products.css";
import toast from "react-hot-toast";

interface TableParams {
  pagination: TablePaginationConfig;
}

/** Functional component used to display list of products retrieved from backend inside a table, plus features for edit, create, remove. */
const Products = () => {
  const intl = useIntl();
  const { currentLanguage } = useLanguageSwitcherSelector();

  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>();

  const [reloadProducts, setReloadProducts] = useState<boolean>();

  const [filterProductsInput, setFilterProductsInput] = useState<string>("");

  const [editModalState, setEditModalState] = useState<{
    editModalOpen: boolean;
    selectedProduct?: Product;
  }>({ editModalOpen: false, selectedProduct: undefined });

  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const [, startTransition] = useTransition();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    setIsDataLoading(true);
    RestServices.krusevska_odaja_ProductController
      .fetchProducts()
      .then((response) => {
        setOriginalProducts(response);
        setFilteredProducts(response);
        setIsDataLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsDataLoading(false);
      });
  }, [reloadProducts]);

  const columns: TableColumnsType<Product> = [
    {
      title: intl.formatMessage({ id: "adminPage.products.table.column.name" }),
      render: (_, product) =>
        currentLanguage === "en" ? product.name : product.nameTranslated,
    },
    {
      title: intl.formatMessage({
        id: "adminPage.products.table.column.price",
      }),
      dataIndex: "price",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.products.table.column.description",
      }),
      dataIndex: "description",
    },
    {
      title: intl.formatMessage({
        id: "adminPage.products.table.column.category",
      }),
      render: (_, product) =>
        mapProductCategoryEnumValues(product.productCategory),
    },
    {
      title: intl.formatMessage({
        id: "adminPage.products.table.column.ingredients",
      }),
      render: (_, record) =>
        record.listOfIngredients?.map((ing, index) => {
          if (index === (record.listOfIngredients?.length as number) - 1)
            return currentLanguage === "en" ? ing.name : ing.nameTranslated;
          return currentLanguage === "en"
            ? ing.name + ", "
            : ing.nameTranslated + ", ";
        }),
    },
    {
      title: intl.formatMessage({
        id: "adminPage.products.table.column.actions",
      }),
      render: (_, product) => (
        <div style={{ display: "flex", columnGap: "2.5rem" }}>
          <Popconfirm
            title={intl.formatMessage({ id: "adminPage.text.sureToDelete" })}
            onConfirm={() => handleDeleteProduct(product.uuid as string)}
          >
            <span style={{ color: "blue", cursor: "pointer" }}>
              {intl.formatMessage({ id: "adminPage.text.delete" })}
            </span>
          </Popconfirm>
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              setEditModalState({
                editModalOpen: true,
                selectedProduct: product,
              });
            }}
          >
            {intl.formatMessage({ id: "adminPage.button.edit" })}
          </span>
        </div>
      ),
    },
  ];

  const handleDeleteProduct = (productId: string) => {
    RestServices.krusevska_odaja_ProductController
      .deleteProductById(productId)
      .then((response) => {
        toast.success(response);
        setReloadProducts(!reloadProducts);
      });
  };

  const handleTableChange: TableProps<Product>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setFilterProductsInput(filterText);

    if (filterText === "") setFilteredProducts(originalProducts);

    startTransition(() => {
      setFilteredProducts(
        originalProducts.filter((p) =>
          p.name?.toLowerCase().includes(filterText.toLowerCase())
        )
      );
    });
  };

  return (
    <div className="products-wrapper">
      <h2 style={{ color: "white" }}>
        {intl.formatMessage({ id: "adminPage.products.text.filterProducts" })}
      </h2>
      <Input onChange={handleInputChange} value={filterProductsInput} />
      <br />
      <div style={{ textAlign: "end" }}>
        <Button type="primary" onClick={() => setCreateModalOpen(true)}>
          {intl.formatMessage({
            id: "adminPage.products.button.createNewProduct",
          })}
        </Button>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <Table<Product>
          rowKey={(product) => product.uuid as string}
          columns={columns}
          dataSource={filteredProducts}
          pagination={tableParams.pagination}
          loading={isDataLoading}
          onChange={handleTableChange}
        />
      </div>

      {editModalState.editModalOpen === true ? (
        <EditProduct
          editModalOpen={editModalState.editModalOpen}
          selectedProduct={editModalState.selectedProduct as Product}
          setEditModalState={setEditModalState}
          setReloadProducts={setReloadProducts}
        />
      ) : null}

      {createModalOpen === true ? (
        <CreateProduct
          createModalOpen={createModalOpen}
          setCreateModalOpen={setCreateModalOpen}
          setReloadProducts={setReloadProducts}
        />
      ) : null}
    </div>
  );
};

export default Products;
