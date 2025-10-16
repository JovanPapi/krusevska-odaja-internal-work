import { Button, Dropdown, Flex, Layout, MenuProps } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import AdministratorApp from "./applications/administration-app/AdministratorApp";
import ApplicationStarterLogin from "./application-starter-login/ApplicationStarterLogin";
import {
  ActivePageStateProps,
  AuthorizationModalStateProps,
} from "./interfaces";
import KitchenPage from "./applications/kitchen-app/components/KitchenApp";
import "./MainApplication.css";
import { useLanguageSwitcherSelector } from "./store/language-switcher/LanguageSwitcher";
import ModalAuthorize from "./modal-authorize/ModalAuthorize";
import WaiterApp from "./applications/waiter-app/components/WaiterApp";
import { useApplicationStoreSelector } from "./store/ApplicationStore";

const { Sider } = Layout;

const activePageInitialState: ActivePageStateProps = {
  administrationPage: false,
  kitchenPage: false,
  waiterPage: false,
};

const MainApplication = () => {
  useEffect(() => {
    const activePage = sessionStorage.getItem("activePage");
    if (activePage === "admin")
      setActivePage((prevState) => {
        return { ...prevState, administrationPage: true };
      });
    else if (activePage === "waiter")
      setActivePage((prevState) => {
        return { ...prevState, waiterPage: true };
      });
    else if (activePage === "kitchen")
      setActivePage((prevState) => {
        return { ...prevState, kitchenPage: true };
      });
  }, []);

  const intl = useIntl();

  const { handleChangeLanguage } = useLanguageSwitcherSelector();

  const [activePage, setActivePage] = useState<ActivePageStateProps>(
    activePageInitialState
  );

  const [authorizeModalState, setAuthorizeModalState] =
    useState<AuthorizationModalStateProps>({
      activePage: activePageInitialState,
      modalOpen: false,
    });

  const { clearStorage } = useApplicationStoreSelector();

  const changeLanguageMenu: MenuProps["items"] = [
    {
      key: 1,
      label: (
        <span onClick={() => handleChangeLanguage("en")}>
          {intl.formatMessage({ id: "app.sideMenu.language.switcher.english" })}
        </span>
      ),
    },
    {
      key: 2,
      label: (
        <span onClick={() => handleChangeLanguage("mk")}>
          {intl.formatMessage({
            id: "app.sideMenu.language.switcher.macedonian",
          })}
        </span>
      ),
    },
  ];

  const handleUserLogout = () => {
    if (sessionStorage.getItem("adminToken") === null) {
      toast.error("No user is logged in");
      return;
    }

    clearStorage();
    setActivePage(activePageInitialState);
    toast.success("Logout successful");
  };

  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Sider width="fit-content" style={{ height: "100vh" }}>
        <Flex vertical gap="1.9rem">
          <Dropdown menu={{ items: changeLanguageMenu }}>
            <Button>
              {intl.formatMessage({
                id: "app.sideMenu.button.text.switchLanguage",
              })}
            </Button>
          </Dropdown>
          <Button type="primary" onClick={() => handleUserLogout()}>
            {intl.formatMessage({ id: "app.sideMenu.button.logout.text" })}
          </Button>
        </Flex>
      </Sider>

      {JSON.stringify(activePage) === JSON.stringify(activePageInitialState) ? (
        <ApplicationStarterLogin
          setAuthorizeModalState={setAuthorizeModalState}
        />
      ) : null}

      {activePage.administrationPage === true ? (
        <AdministratorApp />
      ) : activePage.waiterPage === true ? (
        <WaiterApp />
      ) : activePage.kitchenPage === true ? (
        <KitchenPage />
      ) : null}

      {authorizeModalState.modalOpen === true ? (
        <ModalAuthorize
          authorizeModalState={authorizeModalState}
          setModalAuthorizeState={setAuthorizeModalState}
          setActivePage={setActivePage}
        />
      ) : null}
    </Layout>
  );
};

export default MainApplication;
