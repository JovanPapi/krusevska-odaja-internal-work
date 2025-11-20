import { AdministrationAppActivePage } from "../../../../interfaces";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import "./Header.css";

const initialState: AdministrationAppActivePage = {
  productsPage: true,
  ingredientsPage: false,
  waitersPage: false,
  servingtablesPage: false,
  paymentsPage: false,
};

const initialStateOfPagesFalse: AdministrationAppActivePage = {
  productsPage: false,
  ingredientsPage: false,
  waitersPage: false,
  servingtablesPage: false,
  paymentsPage: false,
};

/** Functional component that displays a Header with Links to each of the entities. */
const Header = () => {
  const intl = useIntl();

  const [activePage, setActivePage] = useState<AdministrationAppActivePage>(initialState);

  const clickedLink = (path: string) =>
    setActivePage(() => {
      return { ...initialStateOfPagesFalse, [path]: true };
    });

  return (
    <div className="header-wrapper-admin">
      <Link
        to="/products"
        className={activePage.productsPage ? "admin-page-header-link-active" : ""}
        onClick={() => clickedLink("productsPage")}>
        {intl.formatMessage({
          id: "adminPage.header.menuItem.products",
          defaultMessage: "Products",
        })}
      </Link>
      <Link
        to="/ingredients"
        className={activePage.ingredientsPage ? "admin-page-header-link-active" : ""}
        onClick={() => clickedLink("ingredientsPage")}>
        {intl.formatMessage({
          id: "adminPage.header.menuItem.ingredients",
          defaultMessage: "Ingredients",
        })}
      </Link>
      <Link
        to="/waiters"
        className={activePage.waitersPage ? "admin-page-header-link-active" : ""}
        onClick={() => clickedLink("waitersPage")}>
        {intl.formatMessage({
          id: "adminPage.header.menuItem.waiters",
          defaultMessage: "Waiters",
        })}
      </Link>
      <Link
        to="/serving-tables"
        className={activePage.servingtablesPage ? "admin-page-header-link-active" : ""}
        onClick={() => clickedLink("servingtablesPage")}>
        {intl.formatMessage({
          id: "adminPage.header.menuItem.servingTables",
          defaultMessage: "Serving tables",
        })}
      </Link>
      <Link
        to="/payments"
        className={activePage.paymentsPage ? "admin-page-header-link-active" : ""}
        onClick={() => clickedLink("paymentsPage")}>
        {intl.formatMessage({
          id: "adminPage.header.menuItem.payments",
          defaultMessage: "Payments",
        })}
      </Link>
    </div>
  );
};

export default Header;
