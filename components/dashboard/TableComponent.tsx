"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction } from "@demox-labs/aleo-wallet-adapter-base";
import { WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { Badge } from "@/components/ui/badge";
import ImageViewer from "../ipfsviewer/ImageViewer";
import { toast } from "sonner";

interface TableProps {
  data?: {
    id: string;
    viewkey: string;
    cid: string;
    signed_status: number;
  }[];
}

export default function TableComponent({ data = [] }: TableProps) {
  const [selectedRow, setSelectedRow] = useState<(typeof data)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connected, publicKey, requestTransaction } = useWallet();

  const generateRandomNumber = (seed: string) => {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.floor(Math.random() * hash);
  };

  const signDocument = async (address: string | null) => {
    if (!publicKey || !requestTransaction || !address) {
      console.log("Undefine key aleo");
      return;
    }

    const randomNumber = generateRandomNumber(publicKey);
    const fee = 350_000;
    const inputs = ["123field", `${randomNumber}field`, "10u8"];
    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.TestnetBeta,
      "zksignaleov3.aleo",
      "sign",
      inputs,
      fee,
      false
    );
    const txid = await requestTransaction(aleoTransaction);
    if (txid) {
      console.log(txid);
      toast("You signed successfully!", {
        description: `Transition ID: ${txid}`,
        action: {
          label: "x",
          onClick: () => console.log("Close"),
        },
      });
    }
  };

  const signAndUpdateDB = async (cid: string) => {
    try {
      if (!cid) return;
      const obj = { cid };
      const response = await fetch("https://zksign-dev.vercel.app/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });

      const result = await response.json();

      console.log(result);
    } catch (err) {
      console.error("Error update DB:", err);
    }
  };

  return (
    <div className="px-5">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-bold text-lg">NFD ID</TableHead>
            <TableHead className="font-bold text-lg">eContract Name</TableHead>
            <TableHead className="font-bold text-lg">Status</TableHead>
            <TableHead className="font-bold text-lg"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connected &&
            data.length > 0 &&
            data.map((row, index) => (
              <TableRow
                key={index}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell
                  onClick={() => {
                    setSelectedRow(row);
                    setIsModalOpen(true);
                  }}
                >
                  {row.cid}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSelectedRow(row);
                    setIsModalOpen(true);
                  }}
                >
                  My contract {index + 1}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setSelectedRow(row);
                    setIsModalOpen(true);
                  }}
                >
                  {row.signed_status === 0 ? (
                    <Badge variant="destructive">Not signed</Badge>
                  ) : (
                    <Badge className="bg-green-500">Signed</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      signDocument(publicKey);
                      signAndUpdateDB(row.cid);
                    }}
                    disabled={row.signed_status === 1}
                  >
                    Sign
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {!connected && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center font-semibold text-lg"
              >
                No Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isModalOpen && selectedRow && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-4 rounded-lg max-w-3xl w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>
            <ImageViewer
              cid={selectedRow.cid}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-4 p-4 border-t">
        <Button variant="ghost" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>1</span>
        <Button variant="ghost" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
