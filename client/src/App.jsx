import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <>
      {errorMessage && <div className="error">Error: {errorMessage}</div>}

      <div className="app">
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          setAddress={setAddress}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
          publicKey={publicKey}
          setPublicKey={setPublicKey}
        />
        <Transfer
          setBalance={setBalance}
          address={address}
          privateKey={privateKey}
          publicKey={publicKey}
          setPublicKey={setPublicKey}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </>
  );
}

export default App;
