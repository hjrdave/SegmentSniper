import { useState } from "react";
import useActivityListStore from "../../../../stores/useActivityListStore";
import useSegmentsListStore from "../../../../stores/useSegmentsListStore";
import ActivityCard from "./ActivityCard";
import { Col, Container, Row } from "react-bootstrap";

const ActivityCardList = () => {
  const [activityList, resetActivityList] = useActivityListStore((state) => [
    state.activityList,
    state.resetActivityList,
  ]);

  const [selectedActivity, setSelectedActivity] = useState<string>("");

  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const resetSegmentList = useSegmentsListStore(
    (state) => state.resetSegmentsList
  );

  const clearSearchResults = () => {
    resetActivityList();
    resetSegmentList();
  };

  return activityList.length > 0 ? (
    activityList.map((item) => {
      <ActivityCard
        setSelectedActivity={setSelectedActivity}
        activity={activityList.find((x) => x.activityId === selectedActivity)!}
      />;
    })
  ) : (
    <Container>
      <Row>
        <Col>
          <h4>No activities to display</h4>
        </Col>
      </Row>
    </Container>
  );
};