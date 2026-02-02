import ApplicationStarterLogin from "./application-starter-login/ApplicationStarterLogin";
import AdministratorApp from "./applications/administration-app/AdministratorApp";
import KitchenPage from "./applications/kitchen-app/components/KitchenApp";
import WaiterApp from "./applications/waiter-app/components/WaiterApp";
import { ActivePageStateProps, AuthorizationModalStateProps } from "./interfaces";
import ModalAuthorize from "./modal-authorize/ModalAuthorize";
import { useApplicationStoreSelector } from "./store/ApplicationStore";
import { useLanguageSwitcherSelector } from "./store/language-switcher/LanguageSwitcher";
import { Button, Dropdown, Flex, Layout, MenuProps } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";
import "./MainApplication.css";

const { Sider } = Layout;

const activePageInitialState: ActivePageStateProps = {
  administrationPage: false,
  kitchenPage: false,
  waiterPage: false,
};

const MainApplication = () => {
  const [activePage, setActivePage] = useState<ActivePageStateProps>(activePageInitialState);
  const intl = useIntl();

  const { handleChangeLanguage } = useLanguageSwitcherSelector();

  const [authorizeModalState, setAuthorizeModalState] = useState<AuthorizationModalStateProps>({
    activePage: activePageInitialState,
    modalOpen: false,
  });

  const { clearStorage, setToken, setUser, token } = useApplicationStoreSelector();

  useEffect(() => {
    const sessionToken = sessionStorage.getItem("token");

    if (sessionToken !== null) {
      setToken(sessionToken);

      const activePage = sessionStorage.getItem("activePage");

      setActivePage((prevState) => {
        return { ...prevState, [activePage as string]: true };
      });

      const user = JSON.parse(sessionStorage.getItem("user") as string);
      setUser(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLanguageMenu: MenuProps["items"] = [
    {
      key: 1,
      label: (
        <p style={{ width: "100%", margin: 0, padding: "0.5rem" }} onClick={() => handleChangeLanguage("en")}>
          {intl.formatMessage({ id: "app.sideMenu.language.switcher.english" })}
        </p>
      ),
    },
    {
      key: 2,
      label: (
        <p style={{ width: "100%", margin: 0, padding: "0.5rem" }} onClick={() => handleChangeLanguage("mk")}>
          {intl.formatMessage({
            id: "app.sideMenu.language.switcher.macedonian",
          })}
        </p>
      ),
    },
  ];

  const handleUserLogout = () => {
    if (sessionStorage.getItem("user") === null) {
      toast.error("No user is logged in");
      return;
    }

    clearStorage();
    setActivePage(activePageInitialState);
    toast.success("Logout successful");
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider>
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

      {token === undefined ? <ApplicationStarterLogin setAuthorizeModalState={setAuthorizeModalState} /> : null}

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
