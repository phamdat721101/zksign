"use client";
/* eslint-disable */
import {
  AlertCircle,
  DollarSignIcon,
  FingerprintIcon,
  Wallet,
  WalletCardsIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import History from "@/components/dashboard/HistoryTable";
import UploadForm from "@/components/dashboard/UploadForm";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
  Transaction,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { useState, useEffect } from "react";
// import { getBalance } from "@/lib/helper_func";

export default function Dashboard() {
  const { publicKey, connected, requestTransaction } = useWallet();
  const [balance, setBalance] = useState<string>("0");

  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     const value = await getBalance(publicKey);
  //     setBalance(value);
  //     console.log(value);
  //   };

  //   fetchBalance();
  // }, [publicKey]);

  const clickHandler = () => {
    const handleSign = async () => {
      if (!publicKey || !requestTransaction) {
        console.log("Undefine key aleo");
        return;
      }

      const fee = 350_000;
      const inputs = [
        "aleo10qwt04dklqyclh9wfqj76npzckfv6lvvpad20rta0gjlvdlxgq8sf07d6x",
        "2411u128",
      ];
      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        "zksignaleov1.aleo",
        "create_document",
        inputs,
        fee,
        false
      );
      const txid = await requestTransaction(aleoTransaction);
      if (txid) {
        console.log(txid);
      } else {
        return;
      }
    };
    handleSign();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 md:p-14 space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <WalletCardsIcon width={28} height={28} />
            <h1 className="text-xl sm:text-2xl">Your Wallet</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-6 sm:justify-around">
            <div className="flex items-center gap-4">
              <Wallet className="w-8 h-8 sm:w-[45px] sm:h-[45px]" />
              <div>
                <h2 className="font-semibold text-xs sm:text-base">ADDRESS</h2>
                <p className="text-base sm:text-xl">
                  {formatAddress(publicKey)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DollarSignIcon className="w-8 h-8 sm:w-[45px] sm:h-[45px]" />
              <div>
                <h2 className="font-semibold text-xs sm:text-base">ALEO</h2>
                <p className="text-base sm:text-xl">
                  {connected ? +balance / 1_000_000 : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <FingerprintIcon className="w-8 h-8 sm:w-[45px] sm:h-[45px]" />
              <div>
                <h2 className="font-semibold text-xs sm:text-base">SIGN</h2>
                <p className="text-base sm:text-xl">
                  {connected ? "0" : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification */}
      {/* <Alert
        variant="destructive"
        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-2 sm:justify-between bg-card p-4"
      >
        <div className="flex gap-2 text-center sm:text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You will need to opt into SIGN before you can start sending
            eContracts.
          </AlertDescription>
        </div>
        <Button
          onClick={clickHandler}
          variant="destructive"
          size="sm"
          className="w-full sm:w-auto"
        >
          OPT-IN
        </Button>
      </Alert> */}

      {/* Upload Contract */}
      <UploadForm />

      {/* Document Tabs and Table */}
      <History />
    </div>
  );
}

function formatAddress(address: string | null): string {
  if (!address) {
    return "N/A";
  }

  if (address.length <= 8) {
    return address;
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
