import dotenv from "dotenv";
import { Address, contractAddress, toNano } from "@ton/core";
import { TonClient4 } from "@ton/ton";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { SampleTactContract } from "./output/sample_SampleTactContract";

dotenv.config();

(async (): Promise<void> => {
    const client = new TonClient4({
        endpoint: "https://sandbox-v4.tonhubapi.com",
    });

    let owner = Address.parse("kQC4xJuzIh9MXg6EE6U5SvjI67dRbz8ADMnBGmrIbTxeHt9J");
    let init = await SampleTactContract.init(owner, 0n);
    let contract_address = contractAddress(0, init);
    let contract = await SampleTactContract.fromAddress(contract_address);
    let contract_open = await client.open(contract);

    console.log("Current Counter Value: " + (await contract_open.getCounter()));

    let mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        throw new Error("MNEMONIC environment variable is not set");
    }
    let keyPair = await mnemonicToWalletKey(mnemonic.split(" "));
    let wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    let wallet_open = await client.open(wallet);

    console.log("Sending increment message...");
    await contract_open.send(
        wallet_open.sender(keyPair.secretKey),
        {
            value: toNano("0.05"),
        },
        {
            $$type: "Increment",
        }
    );

    console.log("Transaction sent! Waiting for confirmation...");

    setTimeout(async () => {
        console.log("New Counter Value: " + (await contract_open.getCounter()));
    }, 20000);
})();
