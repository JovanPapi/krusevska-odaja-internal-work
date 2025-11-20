import CreateIngredient from "./CreateIngredient";
import EditIngredient from "./EditIngredient";
import RestServices from "../../../../api/services";
import Ingredient from "../../../../models/Ingredient";
import { useLanguageSwitcherSelector } from "../../../../store/language-switcher/LanguageSwitcher";
import { Button, Input, Popconfirm, Table, TableColumnsType, TablePaginationConfig, TableProps } from "antd";
import { ChangeEvent, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import "./Ingredients.css";

interface TableParams {
  pagination: TablePaginationConfig;
}

/** Functional component that displays table in which all ingredients retrieved from the backend are listed, plus features for edit, create, remove. */
const Ingredients = () => {
  const intl = useIntl();
  const { currentLanguage } = useLanguageSwitcherSelector();

  const [originalIngredients, setOriginalIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>();

  const [reloadIngredients, setReloadIngredients] = useState<boolean>();

  const [filterIngredientsInput, setFilterIngredientsInput] = useState<string>("");

  const [editModalState, setEditModalState] = useState<{
    editModalOpen: boolean;
    selectedIngredient?: Ingredient;
  }>({ editModalOpen: false, selectedIngredient: undefined });

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
        const response = await RestServices.ingredientController.fetchIngredients();
        setOriginalIngredients(response);
        setFilteredIngredients(response);
        setIsDataLoading(false);
      } catch (err) {
        toast.error(err as string);
      } finally {
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [reloadIngredients]);

  const columns: TableColumnsType<Ingredient> = [
    {
      title: intl.formatMessage({
        id: "adminPage.ingredients.table.column.name",
      }),
      render: (_, ing) => (currentLanguage === "en" ? ing.name : ing.nameTranslated),
    },
    {
      title: intl.formatMessage({
        id: "adminPage.ingredients.table.column.actions",
      }),
      render: (_, ingredient) => (
        <div style={{ display: "flex", columnGap: "2.5rem" }}>
          <Popconfirm
            title={intl.formatMessage({
              id: "adminPage.text.sureToDelete",
            })}
            onConfirm={() => handleDeleteIngredient(ingredient.uuid as string)}>
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
                selectedIngredient: ingredient,
              });
            }}>
            {intl.formatMessage({
              id: "adminPage.button.edit",
            })}
          </span>
        </div>
      ),
    },
  ];

  const handleDeleteIngredient = (ingredientId: string) => {
    RestServices.ingredientController.deleteIngredientById(ingredientId).then((response) => {
      toast.success(response);
      setReloadIngredients(!reloadIngredients);
    });
  };

  const handleTableChange: TableProps<Ingredient>["onChange"] = (pagination) => {
    setTableParams({
      pagination,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const filterText = event.target.value;
    setFilterIngredientsInput(filterText);

    if (filterText === "") {
      setFilteredIngredients(originalIngredients);
    }

    startTransition(() => {
      setFilteredIngredients(
        originalIngredients.filter((p) =>
          currentLanguage === "en"
            ? p.name?.toLowerCase().includes(filterText.toLowerCase())
            : p.nameTranslated.toLowerCase().includes(filterText.toLowerCase()),
        ),
      );
    });
  };
  return (
    <div className="ingredients-wrapper">
      <h2 style={{ color: "white" }}>
        {intl.formatMessage({
          id: "adminPage.ingredients.text.filterIngredients",
        })}
      </h2>
      <Input onChange={handleInputChange} value={filterIngredientsInput} />
      <br />
      <div style={{ textAlign: "end" }}>
        <Button type="primary" onClick={() => setCreateModalOpen(true)}>
          {intl.formatMessage({
            id: "adminpage.ingredients.text.createNewIngredient",
          })}
        </Button>
      </div>
      <div style={{ marginTop: "1.5rem" }}>
        <Table<Ingredient>
          rowKey={(ingredient) => ingredient.uuid as string}
          columns={columns}
          dataSource={filteredIngredients}
          pagination={tableParams.pagination}
          loading={isDataLoading}
          onChange={handleTableChange}
        />
      </div>

      {editModalState.editModalOpen === true ? (
        <EditIngredient
          editModalOpen={editModalState.editModalOpen}
          selectedIngredient={editModalState.selectedIngredient as Ingredient}
          setEditModalState={setEditModalState}
          setReloadIngredient={setReloadIngredients}
        />
      ) : null}

      {createModalOpen === true ? (
        <CreateIngredient
          createModalOpen={createModalOpen}
          setCreateModalOpen={setCreateModalOpen}
          setReloadIngredients={setReloadIngredients}
        />
      ) : null}
    </div>
  );
};

export default Ingredients;
