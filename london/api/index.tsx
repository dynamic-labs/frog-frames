import { Button, Frog } from "frog";
import { handle } from "frog/vercel";

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

let index = 0;
const pages = 2;
const lastPageIndex = pages - 1;
app.frame("/", (c) => {
  const { buttonValue, status } = c;
  if (buttonValue == "prev" && index > 0) index -= 1;
  if (buttonValue == "next" && index < pages - 1) index += 1;
  const imageMap: Record<number, string> = {
    0: "https://utfs.io/f/b33f8085-58ea-458b-9129-25dcecbd1b51-34jguv.jpeg",
    1: "https://utfs.io/f/b83178ba-bc0f-4185-8725-34a9d1a2bbd5-dw6b7w.png",
  };

  return c.res({
    image: imageMap[index],
    imageAspectRatio: "1:1",
    intents: [
      index != 0 && <Button value="prev">Previous</Button>,
      index != lastPageIndex && <Button value="next">Next</Button>,
      index == lastPageIndex && (
        <Button.Link href="https://docs.dynamic.xyz/introduction/welcome">
          Get Started
        </Button.Link>
      ),
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
