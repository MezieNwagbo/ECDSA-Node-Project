import server from "./server";
import { useEffect } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex } from "ethereum-cryptography/utils.js";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  publicKey,
  setPublicKey,
}) {
  async function deriveAddress(key) {
    //get public key
    const pubKey = toHex(secp256k1.getPublicKey(key));

    //get wallet address
    const walletAddress = "0x" + toHex(secp256k1.getPublicKey(key).slice(-5));
    setPublicKey(pubKey);
    setAddress(walletAddress);
    console.log(address);
    if (address) {
      console.log("code ran here, address " + publicKey);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  const onChange = async (e) => {
    const key = e.target.value;
    setPrivateKey(key);
  };

  useEffect(() => {
    if (privateKey.length === 64) {
      deriveAddress(privateKey);
    }
  }, [address, privateKey]);

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Input Private Key
        <input
          placeholder="Input address private key"
          value={privateKey}
          onChange={(e) => onChange(e)}
        ></input>
      </label>

      <div className="balance">Wallet Address: {address}</div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
