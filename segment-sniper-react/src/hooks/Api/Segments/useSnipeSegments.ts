import useApiConfigStore from "../../../stores/useApiConfigStore";
import useTokenDataStore from "../../../stores/useTokenStore";
import { ApiContract } from "../../../services/Api/ApiCommon/ApiContract";
import getSnipeSegmentsList, {
  SnipeSegmentsRequest,
  SnipeSegmentsResponse,
} from "../../../services/Api/Segment/getSnipeSegmentsList";
import useSnipeSegmentsListStore from "../../../stores/useSnipeSegmentsListStore";
import { useMutation } from "@tanstack/react-query";

export const useSnipeSegments = () => {
  const apiConfig = useApiConfigStore((state) => state.apiConfig);
  const setSnipedSegmentsList = useSnipeSegmentsListStore(
    (state) => state.setSnipedSegmentsList
  );
  const tokenData = useTokenDataStore((state) => state.tokenData);

  const { mutateAsync, isLoading, isError, error, data } = useMutation(trigger);

  async function trigger(request: SnipeSegmentsRequest) {
    const contract: ApiContract = {
      baseUrl: apiConfig!.baseUrl,
      token: tokenData?.accessToken!,
      request: request,
    };

    const response: SnipeSegmentsResponse = await getSnipeSegmentsList(
      contract
    );
    setSnipedSegmentsList(response.snipedSegments);
  }
  return { mutateAsync, isLoading, isError, error, data };
};
