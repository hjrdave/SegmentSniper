import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../enums/AppRoutes";
import logo from "../../assets/images/segment_sniper_pro_logo.svg";
import * as yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useState } from "react";
import { usePostForgotPassword } from "../../hooks/Api/Auth/usePostForgotPassword";

export default function ForgotPasswordWidget() {
  const [validated, setValidated] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const callForgotPassword = usePostForgotPassword();
  const navigate = useNavigate();

  interface ForgotPasswordForm {
    emailAddress?: string | null;
  }

  const validationSchema = yup.object({
    emailAddress: yup
      .string()
      .required("Please enter an email address")
      .email("Please enter a valid email address"),
  });

  const formik = useFormik<ForgotPasswordForm>({
    initialValues: {
      emailAddress: null,
    },
    onSubmit: async () => {},
    validationSchema,
    validateOnChange: validated,
    validateOnBlur: validated,
  });

  return (
    <>
      <Row className="vh-100 d-flex justify-content-center mt-5">
        <Col md={6} lg={5} xs={10}>
          <div className="border "></div>
          <Card className="shadow">
            <Card.Body>
              <div className="mb-3 text-center">
                <img src={logo} alt="logo" className="logo pb-2" />
                <div className="mb-3">
                  <Form
                    name="loginForm"
                    onSubmit={(e) => {
                      setValidated(true);
                      formik.handleSubmit(e);
                    }}
                  >
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Control
                        type="text"
                        placeholder="Email Address"
                        name="emailAddress"
                        isInvalid={!!formik.errors.emailAddress}
                        onChange={(e) => {
                          formik.setFieldValue("emailAddress", e.target.value);
                          setEmailAddress(e.target.value);
                        }}
                        onBlur={formik.handleBlur}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.emailAddress}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid">
                      {callForgotPassword.isLoading ? (
                        <Button
                          type="submit"
                          variant="secondary"
                          className={"me-1"}
                        >
                          <Spinner
                            as="span"
                            variant="light"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            animation="border"
                          />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="primary"
                          className={"me-1 primary-rounded-button "}
                          disabled={callForgotPassword.isLoading}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </Form>
                  <div className="d-flex inline mt-3">
                    <Col>
                      <Link
                        to={AppRoutes.ForgotPassword}
                        className="text-primary fw-bold"
                      >
                        Forgot Password
                      </Link>
                    </Col>
                    <Col>
                      <p className="mb-0  text-center">
                        Don't have an account?{" "}
                        <Link
                          to={AppRoutes.Register}
                          className="text-primary fw-bold"
                        >
                          Sign Up
                        </Link>
                      </p>
                    </Col>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}