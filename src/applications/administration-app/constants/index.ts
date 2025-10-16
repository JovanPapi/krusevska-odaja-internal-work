import { DefaultOptionType } from "antd/es/select";

/** Helper object that maps all categories of a Product (salads, grill, deserts etc.) inside an array.
 *
 * It's used to remove boiler plate code inside main component, where its used.
 */
export const productCategoryStringArray: DefaultOptionType[] = [
  { label: "Salads", value: "SALADS" },
  { label: "Garnish and extra", value: "GARNISH_AND_EXTRA" },
  { label: "Appetizers", value: "APPETIZERS" },
  { label: "Grill", value: "GRILL" },
  { label: "Dishes to order", value: "DISHES_TO_ORDER" },
  { label: "Specialities", value: "SPECIALITIES" },
  { label: "Cooked dishes", value: "COOKED_DISHES" },
  { label: "Desserts", value: "DESSERTS" },
  { label: "Snacks", value: "SNACKS" },
  { label: "Aperatives", value: "APERATIVES" },
  { label: "Drinks", value: "DRINKS" },
];

/** Helper function to remove boiler plate code inside main component, where its used.
 *
 * Its purpose is to return the label of specific enumeration.
 */
export const mapProductCategoryEnumValues = (enumValue: string) =>
  productCategoryStringArray.find((p) => p.value === enumValue)?.label;
