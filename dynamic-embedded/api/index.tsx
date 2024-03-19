import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

app.frame("/", async (c) => {
  const { frameData, inputText, buttonValue } = c;
  const isValidEmail = inputText
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputText)
    : false;
  const res = await fetch("https://random-word-api.herokuapp.com/word");
  const data = await res.text();
  const fid = frameData?.fid;

  // only after a button has been clicked
  const error = buttonValue && (!isValidEmail || !fid);
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
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {error ? "error creating wallet" : inputText || data}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter an email" />,
      <Button value="submit">Create</Button>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
