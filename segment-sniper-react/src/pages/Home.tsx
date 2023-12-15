import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../enums/AppRoutes";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Container
        className="d-grid justify-content-center bg-light text-dark border rounded mx-auto my-2 "
        style={{ width: "100%", height: "600px" }}
      >
        <Row>
          <Col sm={12} className="text-center pt-3 my-2">
            <h4>Welcome to the Segment Sniper!</h4>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Card>
              <Card.Body className="text-center my-2">
                Are you a Strava athlete that spends too much time looking for
                segments to KOM? If so, this app is designed and built for you.
                With proprietary analytics and data aggregations, the Strava
                Segment Sniper is the premier tool that will assist you into the
                top spot on the leader boards. Whether it is harnessing the
                power of the wind, or uncovering the segments that you are close
                to #1, we're leveraging new technology in your quest to dominate
                your routes.
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="text-center my-1 py-1">
          <Col sm={12}>
            <p>Are you ready to get started?</p>
          </Col>
          <Col sm={12} className="pb-4">
            <Button onClick={() => navigate(`/${AppRoutes.Login}`)}>
              Start Sniping!
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
