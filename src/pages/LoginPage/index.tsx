import React, { useRef, useState } from "react";
import Layout from "../../libs/Layout";
import * as Yup from "yup";
import { useFormik } from "formik";
import "nprogress/nprogress.css";
import createNotification from "../../constants/notification.constants";
import { useNavigate } from "react-router-dom";
import FormFieldError from "../../components/FormFieldError";
import axios from "axios";
import Loading from "../../components/Loading";
import { PATH } from "../../constants/route.constants";
import { useMediaQuery } from "react-responsive";
import { useModal } from "../../contexts/ModalContextProvider";
import ModalWrapper from "../../components/Modal";
type Props = {};

const validationSchema = Yup.object({
  name: Yup.string().required("Vui lòng nhập ID nhân vật"),
});

const LoginPage: React.FC<Props> = () => {
  const navigate = useNavigate();
  const modalCreateRef = useRef<any>(null);
  const { openModal, closeModal } = useModal("createPage");

  const [validationErrors, setValidationErrors] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 980 });
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values: any) => {
      setIsLoading(true);
      try {
        const response: any = await axios.post(
          "https://api.shop-vnggame.com/loginByRole",
          values
        );
        if (response.data.returnCode == 1) {
          localStorage.setItem("name", values.name);
          navigate(PATH.HOME);
        } else {
          setValidationErrors(response?.data.returnMessage || []);
          createNotification("error", response?.data.returnMessage);
        }
      } catch (error: any) {
        createNotification("error", error?.message);
        setValidationErrors(error?.data.returnMessage || []);
      } finally {
        setIsLoading(false);
      }
    },
  });
  const openCreatePageModal = () => {
    openModal();
  };

  const handleDocumentClick = (event: any) => {
    // Kiểm tra xem người dùng có nhấp vào nút mở modal không
    if (
      modalCreateRef.current &&
      !modalCreateRef.current.contains(event.target) &&
      !event.target.classList.contains("btn-modal-open")
    ) {
      closeModal();
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [closeModal]);

  return (
    <Layout>
      <div style={{ marginTop: 0 }}>
        <div className={`container ${isMobile ? "mobile" : "pc"}`}>
          <div className="banner">
            <div className="banner-content banner-img">
              <div className="banner-content__center">
                <picture>
                  <source
                    srcSet={`${
                      isMobile
                        ? "https://scdn-img.vng.games/mainsite/images/WR-banner-600x337.jpg?size=origin&iswebp=1"
                        : "https://scdn-img.vng.games/mainsite/images/WR-searchbanner-1920x450_new.jpg?size=origin&iswebp=1"
                    }`}
                    type="image/webp"
                  />
                  <img
                    src={`${
                      isMobile
                        ? "https://scdn-stc.vng.games/mainsite/images/WR-banner-600x337.jpg"
                        : "https://scdn-stc.vng.games/mainsite/images/WR-searchbanner-1920x450_new.jpg"
                    }`}
                  />
                </picture>
              </div>
            </div>
            {!isMobile && (
              <picture>
                <source
                  srcSet="https://scdn-img.vng.games/mainsite/images/WR-logo-240x160_2D.png?size=origin&iswebp=1"
                  type="image/webp"
                />
                <img
                  src="https://scdn-stc.vng.games/mainsite/images/WR-logo-240x160_2D.png"
                  alt="https://scdn-stc.vng.games/mainsite/images/WR-logo-240x160_2D.png"
                  className="banner-logo"
                />
              </picture>
            )}
            <span className="banner-title">
              Liên Minh Huyền Thoại: Tốc Chiến
            </span>
          </div>
          <div className="content">
            <div className="content-main-flow">
              <div>
                {/**/}
                <div className="content-box authentication" id="Authentication">
                  <div className="mask" />
                  <div className="content-box__header">
                    <div className="content-box__header-container">
                      <span className="content-box__header-number">1</span>
                      <span className="content-box__header-content">
                        Đăng nhập bằng Riot ID hoặc tên người dùng
                      </span>
                    </div>
                    <div
                      className="IdentificationCustomInfo QUICK INLINE"
                      id="Authentication_HowToFindRoleID_A"
                      onClick={openCreatePageModal}
                      ref={modalCreateRef}
                    >
                      {/**/}
                      <a className="GET_UID_IMAGE">Hướng dẫn tìm ID</a>
                    </div>
                  </div>
                  <div className="content-box__content">
                    <div>
                      {/**/}
                      <div className="loginForm">
                        <form
                          className="el-form"
                          auto-complete="on"
                          onSubmit={formik.handleSubmit}
                        >
                          <div className="el-form-item is-required">
                            {/**/}
                            <div className="el-form-item__content">
                              <div className="el-input el-input--prefix el-input--suffix show-user-logged">
                                {/**/}
                                <input
                                  type="text"
                                  autoComplete="off"
                                  id="name"
                                  placeholder=" Riot ID hoặc tên người dùng"
                                  className={`el-input__inner ${
                                    formik.touched.name &&
                                    formik.errors.name &&
                                    "borderErrr"
                                  }`}
                                  {...formik.getFieldProps("name")}
                                />
                              </div>
                              {FormFieldError("name", formik)}
                              {validationErrors && validationErrors.name && (
                                <div
                                  id="Authentication_quick_rid_error_input"
                                  className="el-form-item__error is-error primo-error"
                                >
                                  {validationErrors.name.msg}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="el-button el-button--default button"
                            id="Authentication_SubmitLogin_Button"
                          >
                            <span>Xác nhận</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {isLoading && <Loading />}
              {/**/}
              {/**/}
              {/**/}
              {/**/}
            </div>
          </div>
          {/**/}
        </div>
      </div>
      <ModalWrapper
        size=""
        onClickStopModal={(event: any) => event.stopPropagation()}
        modalName="createPage"
      >
        <div
          data-v-05e4c1f0
          id="Popup_Container_Div"
          className="confirmation-container"
        >
          <div
            data-v-05e4c1f0
            id="Popup_Content_Div"
            custom-value
            className="confirmation-content img"
          >
            {/**/}
            <div
              data-v-05e4c1f0
              id="Popup_BodyDisplay_Div"
              className="confirmation-content__body img "
            >
              <div data-v-05e4c1f0>
                {/**/}
                <picture data-v-05e4c1f0>
                  <source
                    srcSet="https://scdn-img.vng.games/mainsite/images/tocchien.png?size=origin&iswebp=1"
                    type="image/webp"
                  />
                  <img
                    src="https://scdn-stc.vng.games/mainsite/images/tocchien.png"
                    alt="https://scdn-stc.vng.games/mainsite/images/tocchien.png"
                  />
                </picture>
              </div>
            </div>
            {/**/}
          </div>
        </div>
      </ModalWrapper>
    </Layout>
  );
};

export default LoginPage;
