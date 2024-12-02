import { Link, AccountConnection } from "@shopify/polaris";
import { useState, useCallback } from "react";

function ConnectAccount() {
  const [connected, setConnected] = useState(false);
  const accountName = connected ? "Jane Appleseed" : "";

  const handleAction = useCallback(() => {
    setConnected((connected) => !connected);
  }, []);

  const buttonText = connected ? "Disconnect" : "Connect";
  const details = connected ? "Account connected" : "No account connected";
  const terms = connected ? null : (
    <p>
      By clicking <strong>Connect</strong>, you agree to accept Hiive`s{" "}
      <Link url="https://www.hiive.com/terms" external>
        terms and conditions
      </Link>
      .
    </p>
  );

  return (
    <AccountConnection
      accountName={accountName}
      connected={connected}
      title="Connection needed"
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
