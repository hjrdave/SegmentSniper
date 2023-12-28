import { useMutation } from "@tanstack/react-query";

import { ApiContract } from "../../../services/Api/ApiCommon/ApiContract";
import useApiConfigStore from "../../../stores/useApiConfigStore";
import getLogout, {
  RevokeUserTokenResponse,
} from "../../../services/Api/Auth/getLogout";
import useTokenDataStore from "../../../stores/useTokenStore";

export const useGetLogout = () => {
  const apiConfig = useApiConfigStore((state) => state.apiConfig);
  const tokenData = useTokenDataStore((state) => state.tokenData);
  const { mutateAsync, isLoading, isError, error, data } = useMutation(trigger);

  async function trigger() {
    const contract: ApiContract = {
      baseUrl: apiConfig!.baseUrl,
      token: tokenData?.accessToken!,
    };

    const response: RevokeUserTokenResponse = await getLogout(contract);

    return response;
  }

  return { mutateAsync, isLoading, isError, error, data };
};
