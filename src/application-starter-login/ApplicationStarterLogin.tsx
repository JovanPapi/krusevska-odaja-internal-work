import { ActivePageStateProps, AuthorizationModalStateProps } from "../interfaces";
import { Button, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import { FaUtensils } from "react-icons/fa";
import { GiHotMeal } from "react-icons/gi";
import { IoSettings } from "react-icons/io5";
import { useIntl } from "react-intl";
import "./ApplicationStarterLogin.css";

interface ApplicationStarterLoginProps {
  setAuthorizeModalState: React.Dispatch<React.SetStateAction<AuthorizationModalStateProps>>;
}

const adminPageActive: ActivePageStateProps = {
  administrationPage: true,
  kitchenPage: false,
  waiterPage: false,
};

const kitchenPageActive: ActivePageStateProps = {
  administrationPage: false,
  kitchenPage: true,
  waiterPage: false,
};

const waiterPageActive: ActivePageStateProps = {
  administrationPage: false,
  kitchenPage: false,
  waiterPage: true,
};

/** Functional component used to login a user (admin, waiter or kitchen).
 *
 *  It's mandatory, through this page a user must be logged in, in order to use the functionalities of the system.
 *
 * @param {React.Dispatch} setAuthorizeModalState Dispatcher function that sets the state of the modal. */
const ApplicationStarterLogin = ({ setAuthorizeModalState }: ApplicationStarterLoginProps) => {
  const intl = useIntl();

  const handlePageButtonOnClick = (updatedModalActivePage: ActivePageStateProps) =>
    setAuthorizeModalState({
      activePage: updatedModalActivePage,
      modalOpen: true,
    });

  return (
    <Layout>
      <Content className="application-starter-content-wrapper">
        <div>
          <h1>{intl.formatMessage({ id: "applicationStarterLogin.title.1" })}</h1>
          <p>{intl.formatMessage({ id: "applicationStarterLogin.title.2" })}</p>
          <p>{intl.formatMessage({ id: "applicationStarterLogin.title.3" })}</p>
          <p>{intl.formatMessage({ id: "applicationStarterLogin.title.4" })}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "1.5rem",
            }}>
            <Button
              className="button admin"
              icon={<IoSettings fontSize={"1.8rem"} />}
              onClick={() => handlePageButtonOnClick(adminPageActive)}>
              {intl.formatMessage({
                id: "applicationStarterLogin.button.admin",
              })}
            </Button>
            <Button
              className="button waiter"
              icon={<FaUtensils fontSize={"1.8rem"} />}
              onClick={() => {
                handlePageButtonOnClick(waiterPageActive);
              }}>
              {intl.formatMessage({
                id: "applicationStarterLogin.button.waiter",
              })}
            </Button>
            <Button
              className="button kitchen"
              icon={<GiHotMeal fontSize={"1.8rem"} />}
              onClick={() => handlePageButtonOnClick(kitchenPageActive)}>
              {intl.formatMessage({
                id: "applicationStarterLogin.button.kitchen",
              })}
            </Button>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ApplicationStarterLogin;
