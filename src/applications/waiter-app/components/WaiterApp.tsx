import CustomerOrder from "./customer-order/CustomerOrder";
import Header from "./header/Header";
import { useApplicationStoreSelector } from "../../../store/ApplicationStore";
import { Layout, Spin } from "antd";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import "./WaiterApp.css";

const { Header: HeaderHTML, Content } = Layout;

/** Main functional component used to display all neccessary information and functions for waiter to complete his work.
 *
 * It serves as wrapper component.
 */
const WaiterApp = () => {
  const intl = useIntl();

  const { reloadDataForWaitersPageAfterCRUDAction } = useApplicationStoreSelector();

  const { isDataLoading } = useApplicationStoreSelector();

  useEffect(() => {
    reloadDataForWaitersPageAfterCRUDAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isDataLoading === true ? (
        <div className="main-content">
          <Spin
            tip={
              <p style={{ fontSize: "1.5rem" }}>
                {intl.formatMessage({
                  id: "app.sideMenu.spinner.text",
                })}
              </p>
            }
            fullscreen={true}
            size="large"
          />
        </div>
      ) : (
        <Layout style={{ width: "100%", height: "100%" }}>
          <HeaderHTML className="waiter-app-header-wrapper">
            <Header />
          </HeaderHTML>
          <Content className="waiter-app-main-content">
            <CustomerOrder />
          </Content>
        </Layout>
      )}
    </>
  );
};

export default WaiterApp;
