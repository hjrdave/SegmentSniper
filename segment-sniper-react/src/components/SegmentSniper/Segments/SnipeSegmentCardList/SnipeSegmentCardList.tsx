import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  FormSelect,
  Form,
  FloatingLabel,
  FormLabel,
} from "react-bootstrap";
import useSnipeSegmentsListStore from "../../../../stores/useSnipeSegmentsListStore";
import SnipeSegmentCard from "./SnipeSegmentCard";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useFindHeading } from "../../../../hooks/useFindHeading";
import Slider from "../../../UI_Components/Slider/Slider";
import { Headings } from "../../../../enums/Headings";

const SnipeSegmentsCardList = () => {
  const animatedComponents = makeAnimated();
  const [snipeSegmentsList, setSnipeSegment, setSnipeSegmentsList] =
    useSnipeSegmentsListStore((state) => [
      state.snipeSegmentsList,
      state.setSnipeSegment,
      state.setSnipeSegmentsList,
    ]);

  const [useQom, setUseQom] = useState(false);
  const { calculateBearing } = useFindHeading();
  const [showDetailsSegmentId, setShowDetailsSegmentId] = useState<string>("");
  const [selectedSortOption, setSelectedSortOption] = useState<string>("");
  const [secondsFromLeader, setSecondsFromLeader] = useState<number>();
  const [percentageFromLeader, setPercentageFromLeader] = useState<number>();
  const [headingsFilter, setHeadingsFilter] = useState<string[]>([]);
  const headingsArray: { label: string; value: string }[] = Object.entries(
    Headings
  ).map(([key, value]) => ({ label: value, value: key }));

  useEffect(() => {
    addHeadingToEfforts();
  }, []);

  function addHeadingToEfforts() {
    snipeSegmentsList.map((item) => {
      let segment = item.detailedSegmentEffort?.summarySegment;
      if (segment) {
        let startPoint: { lat: number; lng: number } = {
          lat: segment.startLatlng[0],
          lng: segment.startLatlng[1],
        };

        let endPoint: { lat: number; lng: number } = {
          lat: segment.endLatlng[0],
          lng: segment.endLatlng[1],
        };

        item = { ...item, heading: calculateBearing(startPoint, endPoint) };

        setSnipeSegment(item);
      }
    });
  }

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedSortOption(event.target.value);
    if (event.target.value === "shortestDistance") {
      setSnipeSegmentsList(
        [...snipeSegmentsList].sort((a, b) => a.distance! - b.distance!)
      );
    }
    if (event.target.value === "longestDistance") {
      setSnipeSegmentsList(
        [...snipeSegmentsList].sort((a, b) => b.distance! - a.distance!)
      );
    }
    if (event.target.value === "shortestTime") {
      setSnipeSegmentsList(
        [...snipeSegmentsList].sort(
          (a, b) =>
            a.detailedSegmentEffort?.elapsedTime! -
            b.detailedSegmentEffort?.elapsedTime!
        )
      );
    }
    if (event.target.value === "longestTime") {
      setSnipeSegmentsList(
        [...snipeSegmentsList].sort(
          (a, b) =>
            b.detailedSegmentEffort?.elapsedTime! -
            a.detailedSegmentEffort?.elapsedTime!
        )
      );
    }
  }

  function handlePercentageFromLeaderChange(value: number) {
    setPercentageFromLeader(value);
    console.log("percentage from leader value:", percentageFromLeader);
  }

  function handleSecondsFromLeaderChange(value: number) {
    setSecondsFromLeader(value);
  }

  function handleResetSnipeOptions() {
    setSelectedSortOption("Sort by");
    setPercentageFromLeader(0);
    setSecondsFromLeader(0);
    setUseQom(false);
    setHeadingsFilter([]);
    setShowDetailsSegmentId("");
    setSnipeSegmentsList(
      [...snipeSegmentsList].sort(
        (a, b) =>
          +new Date(a.detailedSegmentEffort?.startDate!) -
          +new Date(b.detailedSegmentEffort?.startDate!)
      )
    );
  }

  return snipeSegmentsList.length > 0 ? (
    <>
      <Container className="segment-list-options">
        <Row>
          <Col>
            <p className="mb-1 snipe-options-heading">Snipe Options</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="justify-content-start">
            Percentage From {useQom ? `QOM` : "KOM"}:
          </Col>
          <Col xs={8} className="pt-2">
            <Slider
              onChange={(value) => handlePercentageFromLeaderChange(value)}
              value={percentageFromLeader}
              min={0}
              max={100}
              disabled={false}
            />
          </Col>
          <Col xs={4} className="pb-2">
            <Form.Control
              type="number"
              value={percentageFromLeader || ""}
              style={{
                width: "80%",
                display: "inline-block",
                marginRight: "5px",
              }}
              onChange={(e) => setPercentageFromLeader(Number(e.target.value))}
              pattern="[0-9]*"
            />
            <span style={{ display: "inline-block" }}>%</span>
          </Col>
        </Row>
        <FormGroup>
          <Row className="pb-2">
            <Col xs={6} className="justify-content-end">
              <FormLabel>Seconds From {useQom ? `QOM` : "KOM"}:</FormLabel>
            </Col>
            <Col xs={6} className="justify-content-end">
              <Form.Control
                type="number"
                value={secondsFromLeader}
                pattern="[0-9]*"
                style={{
                  width: "80%",
                  display: "inline-block",
                  marginRight: "5px",
                }}
              />
            </Col>
          </Row>
        </FormGroup>
        <Row className="pb-2">
          <Col xs={6} className="justify-content-end">
            <p>Heading:</p>
          </Col>

          <Col xs={6} className="justify-content-end">
            <Select
              closeMenuOnSelect={false}
              components={animatedComponents}
              isMulti
              options={headingsArray}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(e) => console.log(e)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Use QOM:</p>
          </Col>
          <Col>
            <Form.Check
              type="switch"
              checked={useQom}
              id="QomSwitch"
              onChange={(e) => {
                setUseQom(e.target.checked);
              }}
            />
          </Col>
        </Row>
        <Row className="d-flex align-items-center ">
          <Col className="mb-2 mb-sm-0">
            <FormGroup controlId="sortControl">
              <FormSelect
                value={selectedSortOption}
                onChange={(e) => handleSortChange(e)}
              >
                <option>Sort by</option>
                <option value="longestDistance">Longest Distance</option>
                <option value="shortestDistance">Shortest Distance</option>
                <option value="shortestTime">Shortest Time</option>
                <option value="longestTime">Longest Time</option>
              </FormSelect>
            </FormGroup>
          </Col>
          <Col>
            <Button
              variant="secondary"
              onClick={() => handleResetSnipeOptions()}
            >
              Reset
            </Button>
          </Col>
        </Row>
      </Container>
      <Row className="pt-3">
        <Col className="d-flex justify-content-around">
          <h4>Segments: {snipeSegmentsList.length}</h4>
        </Col>
      </Row>
      {snipeSegmentsList.map((item) => (
        <SnipeSegmentCard
          key={uuidv4()}
          snipeSegment={item}
          useQom={useQom}
          showDetails={showDetailsSegmentId === item.segmentId}
          setShowDetails={setShowDetailsSegmentId}
        />
      ))}
    </>
  ) : (
    <Container fluid>
      <Row className="align-items-center justify-content-center pt-5">
        <Col className="text-center">
          <h4>No Segments to Snipe</h4>
        </Col>
      </Row>
    </Container>
  );
};

export default SnipeSegmentsCardList;
