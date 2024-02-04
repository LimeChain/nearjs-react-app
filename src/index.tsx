import React from "react";
import "./index.css";
import App from "./App";
import { WalletConnection, Near, keyStores } from 'near-api-js'
import ReactDOM from "react-dom";
import { setupWalletSelector } from "@near-wallet-selector/core";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupNeth } from "@near-wallet-selector/neth";
import { setupNightly } from "@near-wallet-selector/nightly";
import { setupSender } from "@near-wallet-selector/sender";

async function init() {
  const near = new Near({
    deps: {
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    },
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
  });

  const walletConnection = new WalletConnection(
    near,
    "Nearjs react app"
  );

  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = walletConnection.getAccountId()
  }

  const selector = await setupWalletSelector({ network: "mainnet", modules: [
      setupNearWallet(),
      setupMyNearWallet(),
      setupSender(),
      setupHereWallet(),
      setupNightly(),
      setupNeth(),
    ]
  })
  
  return { currentUser, walletConnection, selector };
}

const initializeNear = async () => {
  try {
    const { currentUser, walletConnection,  selector } = await init();
    renderApp(currentUser, walletConnection,  selector);
  } catch (error) {
    console.error('Error initializing NEAR:', error);
  }
};

initializeNear();

const renderApp = (currentUser: any, walletConnection: any, selector: any) => {
  ReactDOM.render(
    <React.StrictMode>
      <App currentUser={currentUser} wallet={walletConnection} selector={selector} />
    </React.StrictMode>,
    document.getElementById("root")
  );
};