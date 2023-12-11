import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { SnipedSegmentListItem } from "../../../../models/Segment/SnipedSegmentListItem";
import { useState } from "react";
import { useGetSegmentDetails } from "../../../../hooks/Api/Segments/useGetSegmentDetails";
import { usePostStarSegment } from "../../../../hooks/Api/Segments/usePostStarSegment";
import useSegmentDetailsStore from "../../../../stores/useSegmentDetailsStore";
import useSnipedSegmentsListStore from "../../../../stores/useSnipedSegmentsListStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck as circleCheck } from "@fortawesome/free-solid-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import ActivityMap from "../../ActivityMap";
import { useFindHeading } from "../../../../hooks/useFindHeading";

type SnipedSegmentCardProps = {
  snipedSegment: SnipedSegmentListItem;
  showDetails: boolean;
  setShowDetails: (segmentId: string) => void;
};

const SnipedSegmentCard = (props: SnipedSegmentCardProps) => {
  const { calculateBearing } = useFindHeading();
  const getSegmentDetails = useGetSegmentDetails();
  const starSegment = usePostStarSegment();
  const setSnipedSegments = useSnipedSegmentsListStore(
    (state) => state.setSnipedSegmentsList
  );
  const segmentDetails = useSegmentDetailsStore((state) =>
    state.segmentDetails.find(
      (sd) => sd.segmentId === props.snipedSegment.segmentId
    )
  );

  async function handleShowDetailsButtonClick() {
    await getSegmentDetails.mutateAsync({
      segmentId: props.snipedSegment.segmentId!,
    });
    props.setShowDetails(props.snipedSegment.segmentId!);
  }

  function handleHideDetailsButtonClick() {
    props.setShowDetails("");
  }

  const heading = (): string => {
    let startPoint: { lat: number; lng: number } = {
      lat: props.snipedSegment.summarySegment!.startLatlng[0],
      lng: props.snipedSegment.summarySegment!.startLatlng[1],
    };

    let endPoint: { lat: number; lng: number } = {
      lat: props.snipedSegment.summarySegment!.endLatlng[0],
      lng: props.snipedSegment.summarySegment!.endLatlng[1],
    };

    return calculateBearing(startPoint, endPoint);
  };

  const updateSegmentEffortStarred = (
    snipedSegmentEffortList: SnipedSegmentListItem[],
    segmentId: string,
    starred: boolean
  ): SnipedSegmentListItem[] => {
    return snipedSegmentEffortList.map((item) =>
      item.segmentId === segmentId ? { ...item, starred: starred } : item
    );
  };

  async function handleStarButtonClick() {
    const response = await starSegment.mutateAsync({
      segmentId: props.snipedSegment.segmentId!,
      star: !props.snipedSegment.starred,
    });

    if (!starSegment.isError && !starSegment.isLoading && response !== null) {
      setSnipedSegments((prevList: SnipedSegmentListItem[]) =>
        updateSegmentEffortStarred(
          prevList,
          response.detailedSegment.segmentId,
          response.detailedSegment.starred
        )
      );
    }
  }

  return (
    <Container className="py-2">
      <Row>
        <Col>
          <Card>
            <Card.Title className="p-2 activity-card-heading">
              {props.snipedSegment.name}
            </Card.Title>
            <Card.Body>
              <Row className="justify-content-between">
                <Col sm={12} md={6} lg={4} xl={3}>
                  <span className="activity-card-label">Distance:</span>{" "}
                  {props.snipedSegment.distance}
                </Col>
                <Col sm={12} md={6} lg={4} xl={3}>
                  <span className="activity-card-label">KOM Time:</span>{" "}
                  {props.snipedSegment.komTime}
                </Col>
                <Col sm={12} md={6} lg={4} xl={3}>
                  <span className="activity-card-label">
                    Seconds From Leader:
                  </span>{" "}
                  {props.snipedSegment.secondsFromLeader}
                </Col>
                {props.snipedSegment.athleteStats?.effortCount! > 1 ? (
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <span className="activity-card-label">PR Time:</span>{" "}
                    {props.snipedSegment.athleteStats?.prElapsedTime}
                  </Col>
                ) : (
                  <></>
                )}
                <Col sm={12} md={6} lg={4} xl={3}>
                  <span className="activity-card-label">Direction:</span>{" "}
                  <>{heading()}</>
                </Col>
                {props.showDetails ? (
                  <>
                    <Row>
                      <Col>
                        <ActivityMap
                          stravaMap={segmentDetails?.map!}
                          startLatlng={segmentDetails?.startLatlng!}
                          endLatlng={segmentDetails?.endLatlng!}
                        />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <></>
                )}
              </Row>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-around">
              {getSegmentDetails.isLoading ? (
                <Button
                  type="submit"
                  variant="secondary"
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
              ) : !props.showDetails ? (
                <Button onClick={() => handleShowDetailsButtonClick()}>
                  Details
                </Button>
              ) : (
                <Button onClick={() => handleHideDetailsButtonClick()}>
                  Less
                </Button>
              )}
              {starSegment.isLoading ? (
                <Button
                  type="submit"
                  variant="secondary"
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
                  className="px-4"
                  onClick={() => handleStarButtonClick()}
                >
                  {props.snipedSegment.starred ? (
                    <FontAwesomeIcon icon={solidStar} />
                  ) : (
                    <FontAwesomeIcon icon={regularStar} />
                  )}
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SnipedSegmentCard;
