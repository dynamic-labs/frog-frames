import { Button, Frog, TextInput, parseEther } from "frog";

export const app = new Frog();

app.frame("/", (c) => {
  return c.res({
    action: "/finish",
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Perform a transaction
      </div>
    ),
    intents: [
      <TextInput placeholder="Value (ETH)" />,
      <Button.Transaction target="/send-ether">Send Ether</Button.Transaction>,
    ],
  });
});

app.frame("/finish", (c) => {
  const { transactionId } = c;
  return c.res({
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    ),
  });
});

app.transaction("/send-ether", (c) => {
  const { inputText } = c;

  return c.send({
    chainId: "eip155:1",
    to: "0x711ACA028ECAEA178EbC29c7059CFdb195FaCD37",
    value: parseEther(inputText ?? "0"),
  });
});
