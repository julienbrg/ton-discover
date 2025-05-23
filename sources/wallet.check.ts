import { Address } from "@ton/core";
import { TonClient4 } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import dotenv from "dotenv";
dotenv.config();

(async (): Promise<void> => {
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com",
    });

    let mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error("MNEMONIC environment variable is not set");
    }
    let keyPair = await mnemonicToWalletKey(mnemonic.split(" "));
    let wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    let wallet_open = await client.open(wallet);

    console.log("Wallet Address:", wallet.address.toString({ testOnly: true }));
    console.log("Balance:", await wallet_open.getBalance());
})();
