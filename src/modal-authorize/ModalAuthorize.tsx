import { AdminDTO } from "../api/dto";
import RestServices from "../api/services";
import { ActivePageStateProps, AuthorizationModalStateProps } from "../interfaces";
import { useApplicationStoreSelector } from "../store/ApplicationStore";
import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useIntl } from "react-intl";

interface ModalAuthorizeProps {
  authorizeModalState: AuthorizationModalStateProps;
  setModalAuthorizeState: Dispatch<SetStateAction<AuthorizationModalStateProps>>;
  setActivePage: Dispatch<SetStateAction<ActivePageStateProps>>;
}

/** Functional component that renders necessary HTML elements that are used to login a user.
 * @param {AuthorizationModalStateProps} authorizeModalState Contains information of which page is currently active and if the modal is open or closed.
 * @param {Dispatch} setModalAuthorizeState Dispatch function that updates the state of the MainApplication.tsx.
 * @param {Dispatch} setActivePage Dispatch function that updates a state inside MainApplication.tsx.
 */
const ModalAuthorize = ({ authorizeModalState, setModalAuthorizeState, setActivePage }: ModalAuthorizeProps) => {
  const [form] = useForm();

  const { setUser, setToken } = useApplicationStoreSelector();

  const intl = useIntl();

  if (authorizeModalState.modalOpen === false) {
    return null;
  }

  const handleCloseModal = () =>
    setModalAuthorizeState((prevState) => {
      return { ...prevState, modalOpen: false };
    });

  const activePage =
    authorizeModalState.activePage.administrationPage === true
      ? "administrationPage"
      : authorizeModalState.activePage.kitchenPage === true
        ? "kitchenPage"
        : "waiterPage";

  const modalTitle =
    activePage === "administrationPage"
      ? "modalAuthorize.title.adminPage"
      : activePage === "waiterPage"
        ? "modalAuthorize.title.waiterPage"
        : "modalAuthorize.title.kitchenPage";

  const handleAuthorizeUser = (adminDTO: AdminDTO) => {
    form.validateFields();

    RestServices.authenticateController
      .authenticateUser(adminDTO)
      .then((response) => {
        const { user, token } = response.data;

        sessionStorage.setItem("token", token); // generated token for successfull login by an admin
        sessionStorage.setItem("activePage", activePage);
        sessionStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setToken(token);

        // clearSelectedWaiterAndTable(); when switching from waiter to other application, we delete waiter filled data
        //  (wont be necessary with the new changes, only one application available at a time)

        setModalAuthorizeState((prevState) => {
          return { ...prevState, modalOpen: false };
        });

        setActivePage(authorizeModalState.activePage);

        toast.success("Successfully authorized");
        form.resetFields();
      })
      .catch(() => {
        form.resetFields();
      });
  };

  return (
    <Modal
      title={intl.formatMessage({ id: modalTitle })}
      open={authorizeModalState.modalOpen}
      onClose={handleCloseModal}
      footer={[
        <Button key="back" onClick={handleCloseModal}>
          {intl.formatMessage({ id: "modalAuthorize.button.close" })}
        </Button>,
        <Button type="primary" form="authorizeForm" htmlType="submit" key="submit">
          {intl.formatMessage({ id: "modalAuthorize.button.authorize" })}
        </Button>,
      ]}>
      <Form<AdminDTO> id="authorizeForm" form={form} layout="vertical" onFinish={handleAuthorizeUser}>
        <Form.Item<AdminDTO>
          name="username"
          className="username"
          label={intl.formatMessage({
            id: "modalAuthorize.form.label.username",
          })}
          tooltip={intl.formatMessage({
            id: "modalAuthorize.form.label.username",
          })}>
          <Input />
        </Form.Item>

        <Form.Item<AdminDTO>
          name="password"
          label={intl.formatMessage({
            id: "modalAuthorize.form.label.password",
          })}
          tooltip={intl.formatMessage({
            id: "modalAuthorize.form.label.password",
          })}>
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAuthorize;
