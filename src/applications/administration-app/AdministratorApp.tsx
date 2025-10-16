import { Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Ingredients from "./components/ingredients/Ingredients";
import Payment from "./components/payments/Payments";
import Products from "./components/products/Products";
import ServingTables from "./components/serving-tables/ServingTable";
import Waiters from "./components/waiters/Waiters";

const { Header: HeaderLayout, Content } = Layout;

/** Main functional component for the Administration page.
 *
 *  It serves as wrapper for all other components related to the administration page. */
const AdministratorApp = () => {
  return (
    <BrowserRouter>
      <Layout>
        <HeaderLayout
          style={{
            width: "100vw",
            backgroundColor: "#242424",
            height: "fit-content",
          }}
        >
          <Header />
        </HeaderLayout>
        <Content style={{ backgroundColor: "#4d4b4b" }}>
          <Routes>
            <Route path="/products" Component={Products} />
            <Route path="/ingredients" Component={Ingredients} />
            <Route path="/waiters" Component={Waiters} />
            <Route path="/payments" Component={Payment} />
            <Route path="/serving-tables" Component={ServingTables} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
};

export default AdministratorApp;
