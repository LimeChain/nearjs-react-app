import "./App.css";
import { BrowserRouter, NavLink } from "react-router-dom"
import React, { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

function App({ currentUser, wallet }: any): any {
  const [user, setUser] = useState(currentUser);
  const [metadata, setMetadata] = useState<{ name: string, symbol: string, decimals: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (wallet) {
        setUser({
          accountId: wallet.getAccountId(),
          balance: (await wallet.account().state()).amount,
        });
      }
    })();
  }, []);

  const handleUser = async (e: any) => {
    if (user && e.target.textContent === "Sign Out") {
      await wallet.signOut();
      window.location.replace(
        window.location.origin + window.location.pathname
      );
    } else if (!user && e.target.textContent === "Login") {
      await wallet.requestSignIn({
        contractId: "usdt.tether-token.near",
        methodNames: ["ft_metadata", "ft_transfer"],
      });
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
            {user ? "Sign Out" : "Login"}
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
