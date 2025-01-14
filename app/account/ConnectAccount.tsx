import { userToken } from "@/atoms/token";
import { useAuth } from "@/context/AuthContext";
import { BrandApprovalStatus } from "@/types/Brand";
import { Link, AccountConnection } from "@shopify/polaris";
import { useState, useCallback } from "react";
import { useSetRecoilState } from "recoil";

function ConnectAccount({
  approveStatus,
  brandLogoUrl,
  brandEmail,
}: {
  brandEmail?: string;
  brandLogoUrl?: string;
  approveStatus?: BrandApprovalStatus;
}) {
  const [connected, setConnected] = useState(approveStatus !== "declined");
  const setToken = useSetRecoilState(userToken);
  const auth = useAuth();
  const { updateBrandStatus } = auth || {};

  const buttonText = connected ? "Disconnect" : "Connect";

  const details = connected ? (
    <div className="">
      <Link url="https://links.joinhiive.com/ZNptzprB1ub" external>
        https://links.joinhiive.com/ZNptzprB1ub
      </Link>
      <p>{brandEmail}</p>
    </div>
  ) : (
    "No account connected"
  );
  const terms = connected ? null : (
    <p>
      By clicking <strong>Connect</strong>, you agree to accept Hiive`s{" "}
      <Link url="https://www.hiive.com/terms" external>
        terms and conditions
      </Link>
      .
    </p>
  );

  const handleAction = () => {
    if (!connected) {
      open("/brand/verify", "_self");
    } else if (updateBrandStatus) {
      updateBrandStatus(BrandApprovalStatus.Pending);
      setToken("");
    }
  };

  return (
    <AccountConnection
      avatarUrl={brandLogoUrl}
      connected={connected}
      title={connected ? undefined : "Connection needed"}
      action={{
        content: buttonText,
        onAction: handleAction,
      }}
      details={details}
      termsOfService={terms}
    />
  );
}

export default ConnectAccount;
