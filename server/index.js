const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0xe37d27a90c": 100, //dan
  "0xf401bf3942": 50, //al
  "0x3c4fba8c1a": 75, //ben
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;

  res.send({ balance });
});

app.post("/send", (req, res) => {
  //recover public key
  //recover address
  //if address is valid continue
  //if address is not valid return

  const { sender, publicKey, recipient, amount, amountHash, signature } =
    req.body;

  //convert signature values back to bigInt
  const parsedSignature = JSON.parse(signature, (key, value) => {
    if (typeof value === "string") {
      return BigInt(value); // Convert string to bigint
    }
    return value; // Return other values as is
  });

  console.log("transaction received");

  //convert amountHash to uint8 array
  const amountHashArray = new Uint8Array(Object.values(amountHash));

  //verify that message is signed
  const isSigned = secp256k1.verify(
    parsedSignature,
    amountHashArray,
    publicKey
  );

  if (isSigned) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: "Unauthorized transaction" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
