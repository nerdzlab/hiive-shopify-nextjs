import { storeIsConnected } from "@/lib/db/session-storage";
import { verifyRequest } from "@/lib/shopify/verify";
import { NextResponse } from "next/server";

export type APIResponse<DataType> = {
  status: "success" | "error";
  data?: DataType;
  message?: string;
};

type Data = {
  accessToken?: string;
  shop?: string;
};

export async function GET(req: Request) {
  // session token is located in the request headers
  const validSession = await verifyRequest(req, false); // could use middleware for this?
  const data = await storeIsConnected(validSession);

  return NextResponse.json<APIResponse<Data>>({
    status: "success",
    data: {
      accessToken: validSession.accessToken,
      shop: validSession.shop,
    },
  });
}
