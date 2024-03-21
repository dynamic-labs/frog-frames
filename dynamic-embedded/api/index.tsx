import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";
import { configDotenv } from "dotenv";
import { ChainEnum } from "@dynamic-labs/sdk-api/models/ChainEnum";
import { UserResponse } from "@dynamic-labs/sdk-api/models/UserResponse";

configDotenv();

const key = process.env.KEY;
const environmentId = process.env.ENVIRONMENT_ID;
let newWallets: string[];

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

const createEmbeddedWallet = async (
  email: string,
  fid: number,
  chains: ChainEnum[]
) => {
  console.log("Creating embedded wallets for", email, fid, chains);
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      fid,
      chains,
    }),
  };

  const response = await fetch(
    `https://app.dynamic-preprod.xyz/api/v0/environments/${environmentId}/embeddedWallets/farcaster`,
    options
  ).then((r) => r.json());

  console.log(response);
  newWallets = (response as UserResponse).user.wallets.map(
    (wallet: any) => wallet.publicKey
  );

  return newWallets;
};

app.frame("/", async (c) => {
  const { frameData, inputText, status, buttonValue } = c;
  const isValidEmail = inputText
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputText)
    : false;

  const fid = frameData?.fid;
  let error = status != "initial" && (!isValidEmail || !fid);

  if (
    !error &&
    status != "initial" &&
    isValidEmail &&
    inputText &&
    fid &&
    buttonValue === "submit"
  ) {
    try {
      newWallets = await createEmbeddedWallet(inputText, fid, [
        ChainEnum.Sol,
        ChainEnum.Evm,
      ]);
    } catch (e) {
      error = true;
    }
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            "url('https://utfs.io/f/56f3dcce-8eee-4cc4-8ece-240a03298b6b-r0q65m.jpeg')",
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
            background:
              "url('https://utfs.io/f/56f3dcce-8eee-4cc4-8ece-240a03298b6b-r0q65m.jpeg')",
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
            <div style={{ color: "black" }}>
              Create a Dynamic EVM + Solana embedded wallet
            </div>
          ) : newWallets && newWallets.length > 0 ? (
            newWallets.map((wallet, index) => (
              <div key={index} style={{ color: "black" }}>
                {index == 0 ? `EVM: ${wallet}` : `SOL: ${wallet}`}
              </div>
            ))
          ) : (
            <div style={{ color: "black" }}>
              No wallets created yet or an error occurred.
            </div>
          )}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter a valid email" />,
      <Button value="submit">Create SOL + EVM Embedded Wallets</Button>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
