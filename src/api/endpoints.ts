type EndpointProps = string;

/** Object container with nested objects that have functions who return string values (URLs), i.e the names of the APIs in the backend */
export const endpoints = {
  /** Contains URLs that are part of backend API for admins */
  authenticateController: {
    authenticate: (): EndpointProps => "/api/authenticate/login",
  },

  /** Contains URLs that are part of backend API for products */
  productController: {
    fetchProducts: (): EndpointProps => "/api/products/fetch-products",
    deleteProductById: (): EndpointProps => "/api/products/delete-product",
    updateProduct: (): EndpointProps => "/api/products/update-product",
    createProduct: (): EndpointProps => "/api/products/create-product",
  },

  /** Contains URLs that are part of backend API for ingredients */
  ingredientController: {
    fetchIngredients: (): EndpointProps => "/api/ingredients/fetch-ingredients",
    deleteProductById: (): EndpointProps =>
      "/api/ingredients/delete-ingredient",
    updateIngredient: (): EndpointProps => "/api/ingredients/update-ingredient",
    createIngredient: (): EndpointProps => "/api/ingredients/create-ingredient",
  },

  /** Contains URLs that are part of backend API for waiters */
  waiterController: {
    fetchWaitersForAdminPage: (): EndpointProps =>
      "/api/waiters/fetch-waiters-for-admin-page",
    fetchWaitersForWaiterPage: (): EndpointProps =>
      "/api/waiters/fetch-waiters-for-waiter-page",
    deleteWaiterById: (): EndpointProps => "/api/waiters/delete-waiter",
    updateWaiter: (): EndpointProps => "/api/waiters/update-waiter",
    createWaiter: (): EndpointProps => "/api/waiters/create-waiter",
  },

  /** Contains URLs that are part of backend API for payments done by certain waiter */
  paymentController: {
    fetchPayments: (): EndpointProps => "/api/payments/fetch-payments",
  },

  /** Contains URLs that are part of backend API for serving tables, created by certain waiter */
  servingTableController: {
    fetchServingTables: (): EndpointProps =>
      "/api/serving-tables/fetch-serving-tables",

    fetchServingTableById: (): EndpointProps =>
      "/api/serving-tables/fetch-serving-table-by-id",

    deleteServingTableById: (): EndpointProps =>
      "/api/serving-tables/delete-serving-table",

    updateServingTable: (): EndpointProps =>
      "/api/serving-tables/update-serving-table",

    closeServingTableById: (): EndpointProps =>
      "/api/serving-tables/close-serving-table",

    createNewTableAndFirstOrder: (): EndpointProps =>
      "/api/serving-tables/create-serving-table-with-first-order",

    saveNewOrderToExistingTable: (): EndpointProps =>
      "/api/serving-tables/update-serving-table-with-new-order",

    payTablePrice: (): EndpointProps =>
      "/api/serving-tables/pay-serving-table-price",
  },

  /** Contains URLs that are part of backend API for customer orders, created by certain waiter */
  orderController: {
    deleteOrderProductFromOrder: (): EndpointProps =>
      "/api/orders/delete-product-from-order",

    deleteOrderFromServingTable: (): EndpointProps =>
      "/api/orders/delete-order-from-serving-table",
  },

  /** Contains URLs that are part of backend API for kitchen order */
  kitchenOrdersController: {
    fetchUncompletedKitchenOrders: (): EndpointProps =>
      "/api/kitchen-orders/fetch-uncompleted-kitchen-orders",

    fetchCompletedKitchenOrtders: (): EndpointProps =>
      "/api/kitchen-orders/fetch-completed-kitchen-orders",

    markKitchenOrderAsCompleted: (): EndpointProps =>
      "/api/kitchen-orders/mark-order-as-completed",
  },
};
