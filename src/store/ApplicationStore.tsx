import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import RestServices from "../api/services";
import Order from "../models/Order";
import Product from "../models/Product";
import ServingTable from "../models/ServingTable";
import Waiter from "../models/Waiter";

interface ApplicationStoreProps {
  originalWaiters: Waiter[];
  originalProducts: Product[];
  selectedWaiter?: Waiter;
  selectedServingTable?: ServingTable;
  selectedServingTableOrder?: Order;
  isDataLoading: boolean;
  saveSelectedWaiterByCode: (waiterCode: string) => void;
  saveSelectedServingTableByCode: (tableCode: string) => void;
  saveSelectedServingTableOrderByCode: (orderCode: number) => void;
  saveProductToServingTable: (product: Product, quantity: number) => void;
  reloadDataForWaitersPageAfterCRUDAction: () => void;
  clearStorage: () => void;
}

const initialState: ApplicationStoreProps = {
  originalWaiters: [],
  originalProducts: [],
  selectedWaiter: undefined,
  selectedServingTable: undefined,
  selectedServingTableOrder: undefined,
  isDataLoading: true,
  saveSelectedWaiterByCode: () => null,
  saveSelectedServingTableByCode: () => null,
  saveSelectedServingTableOrderByCode: () => null,
  saveProductToServingTable: () => null,
  reloadDataForWaitersPageAfterCRUDAction: () => null,
  clearStorage: () => null,
};

/** Function that creates the context, storing information (global state) that can be used across all components. */
export const ApplicationStore =
  createContext<ApplicationStoreProps>(initialState);

/** Function that returns the Context of ApplicationStore.tsx. */
export const useApplicationStoreSelector = () => useContext(ApplicationStore);

/** Functional component that serves as Provider, used by all pages. It allows all other components to use his state, functions etc.
 *
 * Its global state is defined using Context API from React itself.
 * @param {ReactNode} children Presents everything that is rendered, all components, wrapped in providers to use states and functions on global level.
 */
function ApplicationStoreProvider({ children }: { children: ReactNode }) {
  const [originalWaiters, setOriginalWaiters] = useState<Waiter[]>([]);
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);

  const [selectedWaiter, setSelectedWaiter] = useState<Waiter>();
  const [selectedServingTable, setSelectedServingTable] =
    useState<ServingTable>();
  const [selectedServingTableOrder, setSelectedServingTableOrder] =
    useState<Order>();

  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [reloadData, setReloadData] = useState<boolean>();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const adminToken = sessionStorage.getItem("adminToken");
    if (adminToken !== null) setReloadData(true);
  }, []);

  // TODO: This can be changed. We can call waiters and products inside waiter application when its main component will render.
  // TODO: And it will render only and only when a user with role waiter is signed in
  useEffect(() => {
    if (reloadData === undefined) {
      return;
    } else {
      setIsDataLoading(true);

      startTransition(() => {
        RestServices.krusevska_odaja_ProductController
          .fetchProducts()
          .then((res) => {
            setOriginalProducts(res);
            setIsDataLoading(false);
          })
          .catch(() => {
            setIsDataLoading(false);
          });
      });
    }
  }, [reloadData]);

  useEffect(() => {
    if (reloadData === undefined) {
      return;
    } else {
      setIsDataLoading(true);

      startTransition(() => {
        RestServices.krusevska_odaja_WaiterController
          .fetchWaitersForWaiterPage()
          .then((res) => {
            setOriginalWaiters(res);
            refreshSelectedWaiterAfterChargingTable(res);
            setIsDataLoading(false);
          })
          .catch(() => {
            setIsDataLoading(false);
          });
      });
    }
  }, [reloadData]);

  const refreshSelectedWaiterAfterChargingTable = (
    originalWaiters: Waiter[]
  ) => {
    if (selectedWaiter === undefined) return;

    const updatedWaiter = originalWaiters.find(
      (waiter) => waiter.code === selectedWaiter?.code
    );

    setSelectedWaiter(updatedWaiter as Waiter);
    setSelectedServingTable(undefined);
    setSelectedServingTableOrder(undefined);
  };

  /** A function that selected waiter from original waiters list by code */
  const saveSelectedWaiterByCode = (waiterCode: string) => {
    if (waiterCode === "") {
      setSelectedWaiter(undefined);
      setSelectedServingTable(undefined);
      setSelectedServingTableOrder(undefined);
      return;
    }

    const parsedWaiterCode = parseInt(waiterCode);

    setSelectedWaiter(
      originalWaiters.find((waiter) => waiter.code === parsedWaiterCode)
    );

    setSelectedServingTable(undefined);
  };

  /** A function that selects serving table from the table list of selected waiter */
  const saveSelectedServingTableByCode = (tableCode: string) => {
    if (tableCode === "") {
      setSelectedServingTable(undefined);
      return;
    }

    const parsedTableCode = parseInt(tableCode);
    const checkTable = selectedWaiter?.listOfServingTables?.find(
      (table) => table?.code === parsedTableCode
    );

    const newOrder: Order = {
      code: undefined,
      creationDate: "",
      listOfOrderProducts: [],
      waiter: selectedWaiter,
    };

    if (checkTable !== undefined) {
      setSelectedServingTable({ ...checkTable });

      newOrder.code = (checkTable.listOfOrders?.at(-1)?.code as number) + 1;
      setSelectedServingTableOrder({ ...newOrder });
    } else {
      const newServingTable: ServingTable = {
        code: parsedTableCode,
        servingTableStatus: "FREE",
        listOfOrders: [],
      };

      newOrder.code = 1;
      setSelectedServingTable(newServingTable);
      setSelectedServingTableOrder({ ...newOrder });
    }
  };

  const saveSelectedServingTableOrderByCode = (orderCode: number) => {
    if (orderCode === undefined) return null;

    setSelectedServingTableOrder(
      selectedServingTable?.listOfOrders?.find(
        (order) => order.code === orderCode
      )
    );
  };

  const saveProductToServingTable = (product: Product, quantity: number) => {
    const tempOrder: Order = { ...(selectedServingTableOrder as Order) };

    tempOrder.listOfOrderProducts?.push({
      quantity,
      product,
    });

    setSelectedServingTableOrder({ ...tempOrder });
  };

  const reloadDataForWaitersPageAfterCRUDAction = () =>
    setReloadData(!reloadData);

  const clearStorage = () => {
    setOriginalProducts([]);
    setOriginalWaiters([]);
    setSelectedServingTable(undefined);
    setSelectedServingTableOrder(undefined);
    setSelectedWaiter(undefined);
    sessionStorage.clear();
  };

  return (
    <ApplicationStore.Provider
      value={{
        originalWaiters,
        originalProducts,
        selectedWaiter,
        selectedServingTable,
        selectedServingTableOrder,
        isDataLoading,
        saveSelectedWaiterByCode,
        saveSelectedServingTableByCode,
        saveSelectedServingTableOrderByCode,
        saveProductToServingTable,
        reloadDataForWaitersPageAfterCRUDAction,
        clearStorage,
      }}
    >
      {children}
    </ApplicationStore.Provider>
  );
}

export default ApplicationStoreProvider;
