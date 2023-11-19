import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Container,
  Row,
  Col,
  Form,
  FloatingLabel,
  Button,
  Spinner,
} from "react-bootstrap";

import { ActivityTypes } from "../../../enums/ActivityTypes";
import {
  ActivitySearchRequest,
  useHandleActivitySearch,
} from "../../../hooks/Api/Activity/useHandleActivitySearch";
import toast from "react-hot-toast";
import useSegmentsListStore from "../../../stores/useSegmentsListStore";
import useSnipedSegmentsListStore from "../../../stores/useSnipedSegmentsListStore";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../../enums/AppRoutes";

function ActivityListLookupForm() {
  const [validated, setValidated] = useState(false);
  const handleActivitySearch = useHandleActivitySearch();
  const navigate = useNavigate();
  const resetSegmentsList = useSegmentsListStore(
    (state) => state.resetSegmentsList
  );
  const resetSnipedSegments = useSnipedSegmentsListStore(
    (state) => state.resetSnipedSegmentsList
  );
  interface ActivityListLookupForm {
    activityId?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    activityType?: string | null;
  }

  const validationSchema = yup.object({
    activityId: yup
      .number()
      .nullable()
      .when([], {
        is: () => "startDate" === null,
        then: (schema) =>
          schema.required("Activity Id or start and end date are required"),
      }),
    startDate: yup.date().when([], {
      is: () => "activityId" !== null,
      then: (schema) => schema.nullable(),
    }),
    endDate: yup
      .date()
      .nullable()
      .when("startDate", (startDate, schema) => {
        return startDate !== null
          ? schema
              .min(startDate, "End date must be after start date")
              .required("End date is required")
          : schema;
      }),
  });

  const initialValues = {
    activityId: null,
    activityType: "Ride",
    startDate: null,
    endDate: null,
  };

  async function handleSearch(request: ActivitySearchRequest) {
    resetSegmentsList();
    resetSnipedSegments();
    handleActivitySearch.mutateAsync(request);
  }

  useEffect(() => {
    if (handleActivitySearch.error !== null)
      toast.error(`Activity search error: ${handleActivitySearch.error}`);
  }, [handleActivitySearch.error]);

  const formik = useFormik<ActivityListLookupForm>({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values: ActivityListLookupForm) => {
      setValidated(true);
      const searchProps: ActivitySearchRequest = {
        activityId: values.activityId ?? "",
        startDate: values.startDate,
        endDate: values.endDate,
        activityType: values.activityType as unknown as ActivityTypes,
      };
      handleSearch(searchProps);
      navigate(AppRoutes.ActivitySearchResults);
    },
    validationSchema: validationSchema,
    validateOnBlur: validated,
    validateOnChange: validated,
  });

  const handleFormReset = () => {
    formik.resetForm({
      values: {
        activityId: null,
        activityType: "Ride",
        startDate: null,
        endDate: null,
      },
    });
    formik.setErrors({});
    setValidated(false);
  };

  const disableSearch = (): boolean => {
    return false;
    // return (
    //   formik.values.activityId === null &&
    //   (formik.values.endDate === null || formik.values.startDate === null)
    // );
  };

  return (
    <>
      <Container className="d-flex flex-column col-6 md-auto pt-2 mb-1 mt-2 shadow bg-light text-dark border rounded">
        <Row>
          <Col className="text-center">
            <h3>Activity List Lookup</h3>
            <p className="mb-0">Look up an activity by ID:</p>
            <Form
              name="activityLookupForm"
              onSubmit={(event) => {
                event.preventDefault();
                setValidated(true);
                formik.handleSubmit(event);
              }}
            >
              <Row className="d-flex justify-content-center">
                <Col md={4} lg={3} className="p-1 ">
                  <Form.Group className="p-2" controlId="activityId">
                    <FloatingLabel
                      label={`Activity Id`}
                      controlId="activityIdLabel"
                    >
                      <Form.Control
                        type="number"
                        value={(formik.values.activityId as string) ?? ""}
                        isInvalid={!!formik.errors.activityId}
                        onChange={(e) => {
                          formik.setFieldValue("activityId", e.target.value);
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.activityId}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
                <Col lg={5}>
                  <p className="pt-4">Test Id = 9102798217</p>
                </Col>
              </Row>
              <hr className="hr-75" />
              <p>or by a date range:</p>
              <Row className=" justify-content-center mb-3">
                <Col md={4}>
                  <Form.Group className="" controlId="startDate">
                    <FloatingLabel
                      label="Start Date"
                      controlId="startDateLabel"
                    >
                      <Form.Control
                        type="date"
                        value={
                          formik.values.startDate
                            ?.toISOString()
                            .split("T")[0] ?? ""
                        }
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          formik.setFieldValue("startDate", selectedDate);
                        }}
                        isInvalid={!!formik.errors.startDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.startDate}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="" controlId="endDate">
                    <FloatingLabel label="End Date" controlId="endDateLabel">
                      <Form.Control
                        type="date"
                        value={
                          formik.values.endDate?.toISOString().split("T")[0] ??
                          ""
                        }
                        onChange={(e) => {
                          const selectedDate = new Date(e.target.value);
                          formik.setFieldValue("endDate", selectedDate);
                        }}
                        isInvalid={!!formik.errors.endDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.endDate}
                      </Form.Control.Feedback>
                    </FloatingLabel>
                  </Form.Group>
                </Col>
              </Row>
              <hr className="hr-75" />
              <Row>
                <Col>
                  <Form.Group controlId="activityTypeRadios">
                    <Form.Label id="activityTypeRadioButtons" className="p-2">
                      Activity Type:
                    </Form.Label>
                    {Object.values(ActivityTypes).map((type) => (
                      <Form.Check
                        key={type}
                        type="radio"
                        inline
                        value={type}
                        name="activity-type-radio"
                        label={type}
                        id={`${type}-radio`}
                        checked={formik.values.activityType === type}
                        onChange={(e) => {
                          formik.setFieldValue("activityType", e.target.value);
                        }}
                      />
                    ))}
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end mb-2">
                <Row>
                  <Col>
                    <Button
                      variant="secondary"
                      className={"me-1"}
                      onClick={() => {
                        handleFormReset();
                      }}
                    >
                      Reset
                    </Button>
                  </Col>
                  <Col>
                    {handleActivitySearch.isLoading ? (
                      <Button
                        type="submit"
                        variant="primary"
                        className={"primary-rounded-button"}
                        style={{ width: "75px" }}
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
                        className={"me-1 primary-rounded-button"}
                        disabled={
                          handleActivitySearch.isLoading || disableSearch()
                        }
                      >
                        Search
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ActivityListLookupForm;
