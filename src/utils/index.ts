import ServingTable from "../models/ServingTable";
import Waiter from "../models/Waiter";

/** A function that checks and disables certain fields if neither waiter or serving table is selected.
 * @returns {boolean} Boolean value
 */
export const validateTableOrderFields = (selectedWaiter?: Waiter, selectedServingTable?: ServingTable) => {
  if (selectedWaiter === undefined || selectedServingTable === undefined) {
    return true;
  } else {
    return false;
  }
};

/** A function that formats given input of string in to readable date.
 * @param {string} formatStringDate Input string that needs to be refined in to date (hours, minutes, seconds).
 */
export const formatStringDate = (formatStringDate: string): string => {
  const date = new Date(formatStringDate);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const time = parseInt(hours) < 12 ? "AM" : "PM";

  return `${hours}:${minutes}:${seconds} ${time}`;
};
