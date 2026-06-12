import axiosClient from "../api/axiosClient";

interface LoginPayload {
  userId: string;
  password: string;
}

export const loginUser = async (
  payload: LoginPayload
) => {
  const response = await axiosClient.post(
    "/auth/login",
    payload
  );

  return response.data;
};