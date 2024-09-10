import {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import axiosInstance from "@/app/api/axios";
import { useRecoilState, useRecoilValue } from "recoil";
import { userToken } from "@/atoms/token";
import { postVerifyEmail } from "@/app/api/services/Auth.service";
import { BrandApprovalStatus } from "@/types/Brand";

type AuthContext = {
  token?: string | null;
  loading: boolean;
  brandStatus?: string | null;
  allowUser?: boolean;
  isNoBrand?: boolean;
  isBrandDeclined?: boolean;
  isBrandPending?: boolean;
  login: (textFieldValue: string, requestId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useRecoilState(userToken);
  const [loading, setLoading] = useState(true);
  const [brandStatus, setBrandStatus] = useState(null);

  useEffect(() => {
    if (token) {
      axiosInstance
        .get("/brand/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setBrandStatus(response.data.approvalStatus);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch brand status:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  const onLogin = async (textFieldValue: string, requestId: string) => {
    try {
      const response = await postVerifyEmail({
        otp: textFieldValue,
        requestId,
      });

      setBrandStatus(response.data.brand.approvalStatus);
      setToken(response.data.accessToken);
    } catch (error) {
      //
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        brandStatus,
        token,
        allowUser: brandStatus === BrandApprovalStatus.Approved,
        isBrandDeclined: brandStatus === BrandApprovalStatus.Declined,
        isBrandPending: brandStatus === BrandApprovalStatus.Pending,
        isNoBrand: !brandStatus,
        login: onLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
