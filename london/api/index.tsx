import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

let index = 0;
app.frame("/", (c) => {
  const { buttonValue, status } = c;
  if (buttonValue == "prev" && index > 0) index -= 1;
  if (buttonValue == "next" && index < 3) index += 1;
  const imageMap: Record<number, string> = {
    0: "https://utfs.io/f/b33f8085-58ea-458b-9129-25dcecbd1b51-34jguv.jpeg",
    1: "https://utfs.io/f/e930778a-092d-4417-9532-ddb29e7a32a6-hjcgih.png",
  };

  return c.res({
    image: imageMap[index],
    imageAspectRatio: index == 0 ? "1:1" : "1.91:1",
    intents: [
      <Button value="prev">Previous</Button>,
      <Button value="next">Next</Button>,
      //<Button.Link href="mailto:matt@dynamic.xyz">Questions?</Button.Link>,
      //,status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
