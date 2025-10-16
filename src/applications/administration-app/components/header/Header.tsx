import { Link } from "react-router-dom";
import "./Header.css";
import { useIntl } from "react-intl";

/** Functional component that displays a Header with Links to each of the entities. */
const Header = () => {
  const intl = useIntl();

  return (
    <div className="header-wrapper-admin">
      <Link to="/products">
        {intl.formatMessage({
          id: "adminPage.header.menuItem.products",
          defaultMessage: "Products",
        })}
      </Link>
      <Link to="/ingredients">
        {intl.formatMessage({
          id: "adminPage.header.menuItem.ingredients",
          defaultMessage: "Ingredients",
        })}
      </Link>
      <Link to="/waiters">
        {intl.formatMessage({
          id: "adminPage.header.menuItem.waiters",
          defaultMessage: "Waiters",
        })}
      </Link>
      <Link to="/serving-tables">
        {intl.formatMessage({
          id: "adminPage.header.menuItem.servingTables",
          defaultMessage: "Serving tables",
        })}
      </Link>
      <Link to="/payments">
        {intl.formatMessage({
          id: "adminPage.header.menuItem.payments",
          defaultMessage: "Payments",
        })}
      </Link>
    </div>
  );
};

export default Header;
