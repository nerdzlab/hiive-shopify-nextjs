import axiosInstance from "../axios";

export const postSendEmail = async ({ email }: { email: string }) => {
  try {
    const response = await axiosInstance.post("/auth/send-otp", { email });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};

export const postVerifyEmail = async ({
  requestId,
  otp,
}: {
  requestId: string;
  otp: string;
}) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", {
      otp,
      requestId,
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};

export const postResendCode = async ({ requestId }: { requestId: string }) => {
  try {
    const response = await axiosInstance.post("/auth/resend-otp", {
      requestId,
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch");
  }
};
