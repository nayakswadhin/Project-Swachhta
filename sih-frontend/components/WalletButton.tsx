import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletButtonProps {
  account: string | null;
  onConnect: () => void;
}

export const WalletButton: React.FC<WalletButtonProps> = ({
  account,
  onConnect,
}) => {
  return (
    <Button
      variant="outline"
      className="gap-2 border-2 border-emerald-600 hover:bg-emerald-50 font-semibold text-emerald-800"
      onClick={onConnect}
    >
      <Wallet className="h-5 w-5" />
      {account ? (
        <span>{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
      ) : (
        <span>Connect Wallet</span>
      )}
    </Button>
  );
};
