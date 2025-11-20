import Header from "./components/header/Header";
import Ingredients from "./components/ingredients/Ingredients";
import Payment from "./components/payments/Payments";
import Products from "./components/products/Products";
import ServingTables from "./components/serving-tables/ServingTable";
import Waiters from "./components/waiters/Waiters";
import { Layout } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const { Header: HeaderLayout, Content } = Layout;

/** Main functional component for the Administration page.
 *
 *  It serves as wrapper for all other components related to the administration page. */
const AdministratorApp = () => {
  return (
    <Layout>
      <BrowserRouter>
        <HeaderLayout
          style={{
            backgroundColor: "#242424",
            height: "fit-content",
          }}>
          <Header />
        </HeaderLayout>
        <Content style={{ backgroundColor: "#4d4b4b" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<Products />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/waiters" element={<Waiters />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/serving-tables" element={<ServingTables />} />
          </Routes>
        </Content>
      </BrowserRouter>
    </Layout>
  );
};

export default AdministratorApp;
