import RestServices from "../../../api/services";
import Ingredient from "../../../models/Ingredient";
import Product from "../../../models/Product";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AdministrationPageStoreState {
  listOfProducts: Product[];
  listOfIngredients: Ingredient[];
}

const initialState: AdministrationPageStoreState = {
  listOfProducts: [],
  listOfIngredients: [],
};

/** Function that creates the context, storing information (global state) that can be used across all components. */
const AdministrationPageStore = createContext<AdministrationPageStoreState>(initialState);

/** Function that returns the Context of AdministrationPageStore.tsx. */
export const useApplicationStoreSelector = () => useContext(AdministrationPageStore);

interface AdministrationPageStoreProviderProps {
  children: ReactNode;
}

/** Functional component that serves as Provider, specific for Administration page only
 *
 * Its global state is defined using Context API from React itself.
 * @param {ReactNode} children Presents everything that is rendered, all components, wrapped in providers to use states and functions on global level.
 */
const AdministrationPageStoreProvider = ({ children }: AdministrationPageStoreProviderProps) => {
  const [listOfProducts, setListOfProducts] = useState<Product[]>([]);
  const [listOfIngredients, setListOfIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    RestServices.productController
      .fetchProducts()
      .then((res) => setListOfProducts(res))
      .catch((err) => alert(err));

    RestServices.ingredientController
      .fetchIngredients()
      .then((res) => setListOfIngredients(res))
      .catch((err) => alert(err));
  }, []);

  return (
    <AdministrationPageStore.Provider value={{ listOfProducts, listOfIngredients }}>
      {children}
    </AdministrationPageStore.Provider>
  );
};

export default AdministrationPageStoreProvider;
