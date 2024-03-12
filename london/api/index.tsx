import { Button, Frog, TextInput } from "frog";
import { handle } from "frog/vercel";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

let index = 0;
const pages = 2;
app.frame("/", (c) => {
  const { buttonValue, status } = c;
  if (buttonValue == "prev" && index > 0) index -= 1;
  if (buttonValue == "next" && index < pages - 1) index += 1;
  const imageMap: Record<number, string> = {
    0: "https://utfs.io/f/b33f8085-58ea-458b-9129-25dcecbd1b51-34jguv.jpeg",
    1: "https://utfs.io/f/b83178ba-bc0f-4185-8725-34a9d1a2bbd5-dw6b7w.png",
    /*
    1: "https://utfs.io/f/e930778a-092d-4417-9532-ddb29e7a32a6-hjcgih.png",
    2: "https://utfs.io/f/282418ed-8882-451f-b013-ebc68a7fd8e9-modo2.png",
    3: "https://utfs.io/f/b17d400b-e636-450a-a619-be942a60c516-naq7j.png",
    */
  };

  return c.res({
    image: imageMap[index],
    imageAspectRatio: "1:1", //index == 0 ? "1:1" : "1.91:1",
    intents: [
      <Button value="prev">Previous</Button>,
      <Button value="next">Next</Button>,
      index == pages - 1 && (
        <Button.Link href="https://docs.dynamic.xyz/introduction/welcome">
          Questions?
        </Button.Link>
      ),
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
