"use client";
import { useCallback, useState } from "react";
import { Page, Tabs } from "@shopify/polaris";
import { useRecoilValue } from "recoil";
import useSWR from "swr";

import { ACCOUNT, SETTINGS } from "@/utils/routes";
import { userToken } from "@/atoms/token";
import { Brand } from "@/types/Brand";

import { swrFetcher } from "../api/swrFetcher";
import AccountSection from "./AccountSection";
import SettingsSection from "./SettingsSection";
import Footer from "../components/Footer";

const tabs = [
  {
    id: "account-tab",
    content: "Account",
    panelID: "account-content",
  },
  {
    id: "settings-tab",
    content: "Settings",
    panelID: "settings-content",
  },
];

export default function AccountPage({ defaultPage }: { defaultPage?: string }) {
  const token = useRecoilValue(userToken);
  const [selectedTab, setSelectedTab] = useState(defaultPage || "account");
  const { data, isLoading } = useSWR<Brand>(["/brand/me", token], swrFetcher, {
    shouldRetryOnError: false,
  });

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    open(!!selectedTabIndex ? SETTINGS : ACCOUNT, "_self");
  }, []);

  if (isLoading || !data) {
    return null;
  }

  return (
    <Page fullWidth>
      <Tabs
        tabs={tabs}
        selected={selectedTab === "account" ? 0 : 1}
        onSelect={handleTabChange}
      >
        {selectedTab === "account" && (
          <AccountSection
            declineReason={data.declineReason}
            brandEmail={data.email}
            brandLogoUrl={data.brandLogoUrl}
            approveStatus={data.approvalStatus}
          />
        )}
        {selectedTab === "settings" && <SettingsSection />}
      </Tabs>
      <Footer />
    </Page>
  );
}