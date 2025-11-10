import Ingredient from "./Ingredient";
import Order from "./Order";

/** A class used to map Product entity from backend. */
export default class Product {
  /** Main ID of the entity. */
  uuid?: string;
  /** Name of the product. */
  name: string = "";
  /** Translated name of the product in macedonian. */
  nameTranslated: string = "";
  /** Price of the product. */
  price: number = 0;
  /** Category of the product (salad, grill, desert etc.). */
  productCategory: string = "";
  /** Description of the product. */
  description: string = "";
  /** Ingredients that the product contain. To some products, the ingredients are not described. */
  listOfIngredients: Ingredient[] = [];
  /** List of orders where the product is present. */
  listOfOrders: Order[] = [];
}
