import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";
import { configDotenv } from "dotenv";
import { ChainEnum } from "@dynamic-labs/sdk-api/models/ChainEnum";
import { CreateUserEmbeddedWalletsFromFarcasterRequest } from "@dynamic-labs/sdk-api/models/CreateUserEmbeddedWalletsFromFarcasterRequest";
import { UserResponse } from "@dynamic-labs/sdk-api/models/UserResponse";

configDotenv();

const key = process.env.KEY;
const environmentId = process.env.ENVIRONMENT_ID;

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

let newWallets: string[];

const createEmbeddedWallet = async (
  email: string,
  fid: number,
  chains: ChainEnum[]
) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chains,
      email,
      fid,
    } as CreateUserEmbeddedWalletsFromFarcasterRequest),
  };

  const response = await fetch(
    `https://app.dynamicauth.com/api/v0/environments/${environmentId}/embeddedWallets/farcaster`,
    //`http://localhost:4200/api/v0/environments/${environmentId}/embeddedWallets/farcaster`,
    options
  );
  const data = await response.json();
  newWallets = (data as UserResponse).user.wallets.map(
    (wallet: any) => wallet.publicKey
  );

  return newWallets;
};

app.frame("/", async (c) => {
  const { frameData, inputText, status } = c;
  const isValidEmail = inputText
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputText)
    : false;

  const fid = frameData?.fid;
  const error = status != "initial" && (!isValidEmail || !fid);

  if (!error && inputText && fid && status != "initial")
    newWallets = await createEmbeddedWallet(inputText, frameData?.fid, [
      ChainEnum.Sol,
      ChainEnum.Evm,
    ]);

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(to right, #432889, #17101F)",
            backgroundSize: "100% 100%",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
            fontSize: 30,
            fontStyle: "normal",
          }}
        >
          {status === "initial" && !error ? (
            <div style={{ color: "white" }}>Create an embedded wallet</div>
          ) : newWallets && newWallets.length > 0 ? (
            newWallets.map((wallet, index) => (
              <div key={index} style={{ color: "white" }}>
                {wallet}
              </div>
            ))
          ) : (
            <div style={{ color: "white" }}>
              No wallets created yet or an error occurred.
            </div>
          )}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter a valid email" />,
      <Button value="submit">Create Embedded Wallet</Button>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
