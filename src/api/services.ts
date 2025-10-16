import { DeleteProductFromOrderDTO } from "../interfaces";
import Ingredient from "../models/Ingredient";
import KitchenOrder from "../models/KitchenOrder";
import Product from "../models/Product";
import Waiter from "../models/Waiter";
import axiosApi from "./axiosApi";
import {
  AdminDTO,
  CreateTableWithFirstOrderDTO,
  PaymentDTO,
  PayTablePriceDTO,
  SaveNewOrderToTableDTO,
  ServingTableDTO,
  UpdateServingTableDTO,
  UpdateWaiterDTO,
} from "./dto";
import { endpoints } from "./endpoints";

/** Object with nested objects who contains functions that make HTTP requests to specific APIs */
const RestServices = {
  /** Contains functions that make HTTP requests to Authenticate API */
  krusevska_odaja_AuthenticateController: {
    authenticateUser: (adminDTO: AdminDTO) =>
      axiosApi<string>(
        endpoints.authenticateController.authenticate(),
        "POST",
        adminDTO
      ),
  },

  /** Contains functions that make HTTP requests to Product API */
  krusevska_odaja_ProductController: {
    fetchProducts: () =>
      axiosApi<Product[]>(endpoints.productController.fetchProducts(), "GET"),

    deleteProductById: (productId: string) =>
      axiosApi<string>(
        endpoints.productController.deleteProductById(),
        "DELETE",
        { productId }
      ),

    updateProduct: (productToUpdate: Product) =>
      axiosApi<string>(endpoints.productController.updateProduct(), "POST", {
        productToUpdate,
      }),

    createProduct: (productToCreate: Product) =>
      axiosApi<string>(endpoints.productController.createProduct(), "POST", {
        productToCreate,
      }),
  },

  /** Contains functions that make HTTP requests to Ingredient API */
  krusevska_odaja_IngredientController: {
    fetchIngredients: () =>
      axiosApi<Ingredient[]>(
        endpoints.ingredientController.fetchIngredients(),
        "GET"
      ),

    deleteIngredientById: (ingredientId: string) =>
      axiosApi<string>(
        endpoints.ingredientController.deleteProductById(),
        "DELETE",
        { ingredientId }
      ),

    updateIngredient: (ingredientToUpdate: Ingredient) =>
      axiosApi<string>(
        endpoints.ingredientController.updateIngredient(),
        "POST",
        { ingredientToUpdate }
      ),

    createIngredient: (ingredientToCreate: Ingredient) =>
      axiosApi<string>(
        endpoints.ingredientController.createIngredient(),
        "POST",
        { ingredientToCreate }
      ),
  },

  /** Contains functions that make HTTP requests to Waiter API */
  krusevska_odaja_WaiterController: {
    fetchWaitersForAdminPage: () =>
      axiosApi<Waiter[]>(
        endpoints.waiterController.fetchWaitersForAdminPage(),
        "GET"
      ),

    fetchWaitersForWaiterPage: () =>
      axiosApi<Waiter[]>(
        endpoints.waiterController.fetchWaitersForWaiterPage(),
        "GET"
      ),

    deleteWaiterById: (waiterUuid: string) =>
      axiosApi<string>(
        endpoints.waiterController.deleteWaiterById(),
        "DELETE",
        { waiterUuid }
      ),

    updateWaiter: (waiterToUpdate: UpdateWaiterDTO) =>
      axiosApi<string>(endpoints.waiterController.updateWaiter(), "POST", {
        waiterToUpdate,
      }),

    createWaiter: (waiterToCreate: Waiter) =>
      axiosApi<string>(endpoints.waiterController.createWaiter(), "POST", {
        waiterToCreate,
      }),
  },

  /** Contains functions that make HTTP requests to Payment API */
  krusevska_odaja_Paymnets: {
    fetchPayments: () =>
      axiosApi<PaymentDTO[]>(
        endpoints.paymentController.fetchPayments(),
        "GET"
      ),
  },

  /** Contains functions that make HTTP requests to Serving Tables API */
  krusevska_odaja_ServingTableController: {
    fetchServingTables: () =>
      axiosApi<ServingTableDTO[]>(
        endpoints.servingTableController.fetchServingTables(),
        "GET"
      ),

    fetchServingTableById: (servingTableUuid: string) =>
      axiosApi<ServingTableDTO>(
        endpoints.servingTableController.fetchServingTableById(),
        "POST",
        { servingTableUuid }
      ),

    deleteServingTableById: (servingTableUuid: string) =>
      axiosApi<string>(
        endpoints.servingTableController.deleteServingTableById(),
        "DELETE",
        { servingTableUuid }
      ),

    updateServingTable: (servingTableToUpdate: UpdateServingTableDTO) =>
      axiosApi<string>(
        endpoints.servingTableController.updateServingTable(),
        "POST",
        { servingTableToUpdate }
      ),

    closeServingTableById: (servingTableUuid: string) =>
      axiosApi<string>(
        endpoints.servingTableController.closeServingTableById(),
        "POST",
        { servingTableUuid }
      ),

    createNewTableAndFirstOrder: (
      servingTableToCreate: CreateTableWithFirstOrderDTO
    ) =>
      axiosApi<string>(
        endpoints.servingTableController.createNewTableAndFirstOrder(),
        "POST",
        {
          servingTableToCreate,
        }
      ),

    updateExistingTableWithNewOrder: (
      servingTableToUpdate: SaveNewOrderToTableDTO
    ) =>
      axiosApi<string>(
        endpoints.servingTableController.saveNewOrderToExistingTable(),
        "POST",
        { servingTableToUpdate }
      ),

    payTablePrice: (payServingTablePrice: PayTablePriceDTO) =>
      axiosApi<string>(
        endpoints.servingTableController.payTablePrice(),
        "POST",
        {
          payServingTablePrice,
        }
      ),
  },

  /** Contains functions that make HTTP requests to Orders API */
  krusevska_odaja_OrderController: {
    deleteProductFromOrder: (
      deleteProductFromOrderDTO: DeleteProductFromOrderDTO
    ) =>
      axiosApi<string>(
        endpoints.orderController.deleteOrderProductFromOrder(),
        "DELETE",
        { deleteProductFromOrderDTO }
      ),

    deleteOrderFromServingTable: (orderUuid: string) =>
      axiosApi<string>(
        endpoints.orderController.deleteOrderFromServingTable(),
        "DELETE",
        { orderUuid }
      ),
  },

  /** Contains functions that make HTTP requests to Kitchen Orders API */
  krusevska_odaja_KitchenOrdersController: {
    fetchUncompletedKitchenOrders: () =>
      axiosApi<KitchenOrder[]>(
        endpoints.kitchenOrdersController.fetchUncompletedKitchenOrders(),
        "GET"
      ),

    fetchCompletedKitchenOrders: (waiterUuid: string) =>
      axiosApi<KitchenOrder[]>(
        endpoints.kitchenOrdersController.fetchCompletedKitchenOrtders(),
        "POST",
        { waiterUuid }
      ),

    markKitchenOrderAsCompleted: (kitchenOrderUuid: string) =>
      axiosApi<string>(
        endpoints.kitchenOrdersController.markKitchenOrderAsCompleted(),
        "POST",
        { kitchenOrderUuid }
      ),
  },
};

export default RestServices;
