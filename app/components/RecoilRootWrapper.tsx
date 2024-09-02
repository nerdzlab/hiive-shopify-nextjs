"use client";

import React, { PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";

function RecoilRootWrapper({ children }: PropsWithChildren) {
  return <RecoilRoot>{children}</RecoilRoot>;
}

export default RecoilRootWrapper;
