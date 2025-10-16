/** A class used to map Ingredient entity from backend. */
export default class Ingredient {
  /** Main id of the entity. */
  uuid?: string;
  /** Name of the igredient. */
  name: string = "";
  /** Translated name of the ingredient, in macedonian. */
  nameTranslated: string = "";
}
