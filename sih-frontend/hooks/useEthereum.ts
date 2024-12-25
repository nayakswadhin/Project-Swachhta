import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { WASTE_RECORD_ABI } from "../contract/WasteRecord";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your deployed contract address

export function useEthereum() {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          WASTE_RECORD_ABI,
          provider.getSigner()
        );
        setContract(contract);

        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    }
  };

  return { account, contract, provider, connectWallet };
}
