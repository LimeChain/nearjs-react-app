import React from "react";
import "./index.css";
import App from "./App";
import * as keyStores from '@near-js/keystores-browser'
import { WalletConnection, Near } from '@near-js/wallet-account'
import ReactDOM from "react-dom";

async function init() {
  const near = new Near({
    deps: {
      keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    },
    networkId: "mainnet",
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://app.mynearwallet.com/",
    helperUrl: "https://helper.mainnet.near.org",
  });

  const walletConnection = new WalletConnection(
    near,
    "Nearjs react app"
  );

  let currentUser;
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    };
  }

  return { currentUser, walletConnection };
}

const initializeNear = async () => {
  try {
    const { currentUser, walletConnection } = await init();
    renderApp(currentUser, walletConnection);
  } catch (error) {
    console.error('Error initializing NEAR:', error);
  }
};

initializeNear();

const renderApp = (currentUser: any, walletConnection: any) => {
  ReactDOM.render(
    <React.StrictMode>
      <App currentUser={currentUser} wallet={walletConnection} />
    </React.StrictMode>,
    document.getElementById("root")
  );
};