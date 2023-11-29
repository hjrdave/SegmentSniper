import { Col, Container, Row } from "react-bootstrap";
import useUserStore from "../stores/useUserStore";
import MainMenu from "../components/MainMenu";
import ConnectWithStrava from "../components/ConnectWithStrava";
import { useGetUserHasStravaToken } from "../hooks/Api/Auth/useGetHasStravaToken";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const user = useUserStore((state) => state.user);
  const checkUserHasTokenData = useGetUserHasStravaToken();

  async function checkUserHasTokenDataFunc() {
    await checkUserHasTokenData.mutateAsync();
  }

  useEffect(() => {
    checkUserHasTokenDataFunc();
  }, []);

  useEffect(() => {
    if (checkUserHasTokenData.error !== null) {
      toast.error(`API Error: ${checkUserHasTokenData.error}`);
    }
  }, [checkUserHasTokenData.error!]);

  return (
    <>
      <Container
        className="d-flex flex-column justify-content-center  "
        style={{ width: "auto" }}
      >
        {user?.hasStravaTokenData ? (
          <Row>
            <Col>
              <MainMenu />
            </Col>
          </Row>
        ) : (
          <ConnectWithStrava />
        )}
      </Container>
    </>
  );
}
