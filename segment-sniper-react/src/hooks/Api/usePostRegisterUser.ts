import { useMutation } from "react-query";
import { useNeuron } from "../../store/AppStore";
import postRegisterUser, {
  RegisterUserRequest,
  RegisterUserResponse,
} from "../../services/Api/postRegisterUser";
import { ApiContract } from "../../services/Api/ApiCommon/ApiContract";
import { User } from "../../store/types/user";
import { ApiConfig } from "../../store/types/apiConfig";

export const usePostRegisterUser = () => {
  const { mutate, isLoading } = useMutation(trigger);
  const [user, setUser] = useNeuron<User>("user");
  const [apiConfig] = useNeuron<ApiConfig>("apiConfig");

  async function trigger(request: RegisterUserRequest) {
    const contract: ApiContract = {
      baseUrl: apiConfig.baseUrl,
      request: request,
    };

    const response: RegisterUserResponse = await postRegisterUser(contract);

    console.log(response);

    let registeredUser: User = {
      id: response.id,
      firstName: response.firstName,
      emailAddress: response.emailAddress,
    };

    setUser(registeredUser);
  }

  return { mutate, isLoading };
};
