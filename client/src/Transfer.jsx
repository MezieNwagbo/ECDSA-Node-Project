import { useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";
import { toHex } from "ethereum-cryptography/utils.js";
import server from "./server";

function Transfer({
  address,
  publicKey,
  setBalance,
  privateKey,
  setErrorMessage,
}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      //message = amount
      // hash message(convert to bytes first), (an object {sender, amount, recipient})
      const amountHash = keccak256(utf8ToBytes(sendAmount));

      //sign message
      const signature = secp256k1.sign(amountHash, privateKey);

      const jsonString = JSON.stringify(signature, (key, value) => {
        if (typeof value === "bigint") {
          return value.toString(); // Convert BigInt values to strings
        }
        return value; // Return other values as is
      });

      const messageBody = {
        sender: address,
        publicKey,
        amount: parseInt(sendAmount),
        signature: jsonString,
        recipient,
        amountHash,
      };

      console.log("transaction sent");
      console.log(typeof publicKey);
      // console.log(jsonString);

      const {
        data: { balance },
      } = await server.post(`send`, messageBody);
      setBalance(balance);
    } catch (error) {
      // alert(ex.response.data.message);
      console.log(error.response.data.message);
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
