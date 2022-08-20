import { request } from "https";

import type { VercelRequest, VercelResponse } from "@vercel/node";

const requestAuth = (refreshToken: string) =>
  new Promise((resolve, reject) => {
    const body = [
      "refresh_token=" + refreshToken,
      "client_id=" + process.env["CLIENT_ID"],
      "client_secret=" + process.env["CLIENT_SECRET"],
      "grant_type=refresh_token",
    ].join("&");

    const req = request(
      {
        host: "oauth2.googleapis.com",
        path: "/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      res => {
        res.on("data", data => resolve(data));
        res.on("end", () => reject(""));
      }
    );

    req.on("error", () => reject(""));

    req.write(body);
    req.end();
  });

export default async (apiReq: VercelRequest, apiRes: VercelResponse) => {
  const response = await requestAuth(apiReq.query["refresh_token"] as string);

  apiRes.status(200).send(response);
};
