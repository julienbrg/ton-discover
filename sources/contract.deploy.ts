import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { Address, contractAddress } from "@ton/core";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { SampleTactContract } from "./output/sample_SampleTactContract";
import { prepareTactDeployment } from "@tact-lang/deployer";

dotenv.config();

(async (): Promise<void> => {
    let mnemonic = process.env.MNEMONIC;
    if (!mnemonic) {
        console.error("❌ MNEMONIC environment variable is not set!");
        console.log("Make sure your .env file contains:");
        console.log('MNEMONIC="your mnemonic phrase here"');
        process.exit(1);
    }

    console.log("🔑 Deriving wallet address from mnemonic...");
    let keyPair = await mnemonicToWalletKey(mnemonic.split(" "));
    let wallet = WalletContractV4.create({ publicKey: keyPair.publicKey, workchain: 0 });
    let owner = wallet.address;

    console.log("✅ Owner address derived:", owner.toString({ testOnly: true }));

    // Parameters
    let testnet = true;
    let packageName = "sample_SampleTactContract.pkg";
    let init = await SampleTactContract.init(owner, 0n);

    // Load required data
    let address = contractAddress(0, init);
    let data = init.data.toBoc();
    let pkg = fs.readFileSync(path.resolve(__dirname, "output", packageName));

    // Preparing
    console.log("📦 Uploading package...");
    let prepare = await prepareTactDeployment({ pkg, data, testnet });

    // Deploying
    console.log("============================================================================================");
    console.log("Contract Information");
    console.log("============================================================================================");
    console.log("Owner Address (from mnemonic):", owner.toString({ testOnly: testnet }));
    console.log("Contract Address:", address.toString({ testOnly: testnet }));
    console.log();
    console.log("============================================================================================");
    console.log("Deployment Link");
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
    console.log("Next Steps:");
    console.log("1. Click the deployment link above");
    console.log("2. Connect your wallet with the same mnemonic");
    console.log("3. Confirm the deployment transaction");
    console.log("4. Wait for confirmation");
    console.log("============================================================================================");
})();
