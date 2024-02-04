import "./App.css";
import { BrowserRouter, NavLink } from "react-router-dom"
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { WalletSelector } from "@near-wallet-selector/core";
import "@near-wallet-selector/modal-ui/styles.css";

function App({ currentUser, wallet, selector }: { currentUser: any, wallet: any, selector: WalletSelector }): any {
  const [user, setUser] = useState(currentUser);
  const [metadata, setMetadata] = useState<{ name: string, symbol: string, decimals: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (wallet) {
        setUser(
          wallet.getAccountId(),
        );
      }
    })();
  }, []);

  const handleUser = async (e: any) => {
    if (!user) {
      const modal = setupModal(selector, {
        contractId: "usdt.tether-token.near"
      });
      modal.show()
    } else {
      await wallet.signOut();
      window.location.reload()
    }
  };

  const readMetadata = async () => {
    setLoading(true);

    try {
      const tokenMetadata = await wallet.account().viewFunction({
        contractId: "usdt.tether-token.near",
        methodName: "ft_metadata",
      });
      setMetadata(tokenMetadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  const stateChangeFunctionCall = async () => {
    const functionCallRes = await wallet.account().functionCall({
      contractId: "usdt.tether-token.near",
      methodName: "ft_transfer",
      args: { amount: 100, receiver_id: "example.receiver.near" },
    });
  };

  return (
    <BrowserRouter>
      <div className="navbar-container">
        <div className="nav-links">
          <NavLink to="/">
            Home
          </NavLink>
        </div>
        <div className="profile-section">
          <span />
          {user && <h3>{user?.accountId}</h3>}
          <button className="user-button" onClick={handleUser}>
            {!!user ? "Sign Out" : "Login"}
          </button>
        </div>
      </div>
      {user && (
        <div className="container">
          {!metadata && (
            <button onClick={readMetadata}>
              {loading ? (
                <BeatLoader size={8} color={"#fff"} loading={loading} />
              ) : (
                "Read token metadata"
              )}
            </button>
          )}
          {metadata && (
            <div className="token-info">
              <p>Token name: {metadata.name}</p>
              <p>Token symbol: {metadata.symbol}</p>
              <p>Token decimals: {metadata.decimals}</p>
            </div>
          )}
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
