import { useState, useEffect } from "react";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to use this feature");
      return false;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      return true;
    } catch (err) {
      setError("Failed to connect wallet");
      return false;
    }
  };

  const sendTransaction = async () => {
    if (!window.ethereum || !account) {
      setError("Wallet not connected");
      return false;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Example transaction parameters
      const tx = {
        to: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Example address
        value: ethers.utils.parseEther("0.001"), // 0.001 ETH
      };

      const transaction = await signer.sendTransaction(tx);
      await transaction.wait();
      return true;
    } catch (err) {
      setError("Transaction failed");
      return false;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  return {
    account,
    error,
    connectWallet,
    sendTransaction,
  };
};
