import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import path from "path";
import { fileURLToPath } from "url";

type Network = "mainnet" | "testnet" | "devnet" | "localnet";
const ACTIVE_NETWORK: Network = "testnet";
const SUI_BIN = "sui";

const PROJECT_DIR = "C:/Users/DELL/OneDrive/Desktop/farmvest/farmvest";
const MODULE_NAME = "farmvest";

const PACKAGE_ID = process.env.PACKAGE_ID || "0x86e644576cb3f78fa6563dc16fc7ad9b27782e7ff60a277a1f11092ba7f0dc1c";
const IDEA_TABLE_ID = process.env.IDEA_TABLE_ID || "0x920d897ac78eea7c01c15b4914476662aaa1d034a4de50437043b85ca07d0dbe";
const INVESTMENT_TABLE_ID = process.env.INVESTMENT_TABLE_ID || "0x6b57f70b8ac1f4cd989b24d525a4c360b78960b04011a7dd39aa0dfa08988fe4";
const FARMER_TABLE_ID = process.env.FARMER_TABLE_ID || "0xfa7ce07d0360fb6d0f8f38597371ca517bfa7d5eaa819ced055da9ee6a85d5b1";
const INVESTOR_TABLE_ID = process.env.INVESTOR_TABLE_ID || "0xb60a914c59b55946f601a2552e89689e7dcb2ea585aff7254fc633a53d5de386";

const client = new SuiClient({ url: getFullnodeUrl(ACTIVE_NETWORK) });

const getActiveAddress = (command: string): string => {
    try {
        return execSync(`${SUI_BIN} client active-address`, {encoding: "utf8", shell: true}).trim();
    } catch (error) {
        throw new Error("Failed to get active address. Ensure Sui CLI is installed and configured.");
    }
};

// Get signer from keystore
const getSigner = (): Ed25519Keypair => {
    const sender = getActiveAddress();
    const keystorePath = path.join(homedir(), ".sui", "sui_config", "sui.keystore");
    const keystore = JSON.parse(readFileSync(keystorePath, "utf8"));

    for (const priv of keystore) {
        const raw = fromBase64(priv);
        if (raw[0] !== 0) continue;

        const pair = Ed25519Keypair.fromSecretKey(raw.slice(1));
        if (pair.getPublicKey().toSuiAddress() === sender) {
            return pair;
        }
    }

    throw new Error(`Keypair not found for sender: ${sender}`);
};

// Sign and execute a transaction
const signAndExecute = async (txb: Transaction, network: Network) => {
    const client = new SuiClient({ url: getFullnodeUrl(network) });
    const signer = getSigner();

    try {
        const result = await client.signAndExecuteTransaction({
            transaction: txb,
            signer,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });
        return result;
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
};

// Compile and publish the module
const publishModule = async (command: string): Promise<string> => {
    console.log("Compiling Move module...");
    try {
        const projectPath = path.resolve(PROJECT_DIR);
        execSync(`cd ${projectPath} && ${SUI_BIN} move build`, {stdio: "inherit", shell: true});
    } catch (error) {
        console.error("Compilation error:", error);
        throw new Error("Compilation failed.");
    }

    console.log(`Publishing module to ${ACTIVE_NETWORK}...`);
    try {
        const projectPath = path.resolve(PROJECT_DIR);
        const publishResult = execSync(
            `cd ${projectPath} && ${SUI_BIN} client publish --gas-budget 20000000 --json`,
            { encoding: "utf8", shell: true }
        );
        const resultJson = JSON.parse(publishResult);
        const packageId = resultJson.effects.created.find(
            (item: any) => item.owner === "Immutable"
        )?.reference.objectId;

        if (!packageId) {
            throw new Error("Failed to extract package ID.");
        }

        console.log(`Package published: ${packageId}`);
        return packageId;
    } catch (error) {
        console.error("Publish error:", error);
        throw new Error("Publish failed.");
    }
};

// Deploy and initialize tables
const deploy = async (): Promise<{
    packageId: string;
    ideaTableId: string;
    investmentTableId: string;
    farmerTableId: string;
    investorTableId: string;
}> => {
    const packageId = await publishModule();
    console.log("Initializing tables...");
    const tx = new Transaction();
    tx.moveCall({
        target: `${packageId}::${MODULE_NAME}::init`,
        arguments: [],
    });
    tx.setGasBudget(10000000);

    const result = await signAndExecute(tx, ACTIVE_NETWORK);
    const createdObjects = result.effects.created.filter(
        (item: any) => item.owner === "Shared"
    ).map((item: any) => item.reference.objectId);

    if (createdObjects.length < 4) {
        throw new Error("Failed to create all tables.");
    }

    const [farmerTableId, investorTableId, ideaTableId, investmentTableId] = createdObjects;

    console.log(`FarmerTable created: ${farmerTableId}`);
    console.log(`InvestorTable created: ${investorTableId}`);
    console.log(`IdeaTable created: ${ideaTableId}`);
    console.log(`InvestmentTable created: ${investmentTableId}`);

    const deploymentInfo = {
        packageId,
        ideaTableId,
        investmentTableId,
        farmerTableId,
        investorTableId,
        network: ACTIVE_NETWORK,
        deployerAddress: getActiveAddress(),
    };
    writeFileSync(
        path.join(path.resolve(PROJECT_DIR), "deployment_info.json"),
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("Deployment details saved to deployment_info.json");

    return deploymentInfo;
};

// Register a farmer
const registerFarmer = async (
    name: string,
    email: string,
    password: string
) => {
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::register_farmer`,
        arguments: [
            tx.object(FARMER_TABLE_ID),
            tx.pure.string(name),
            tx.pure.string(password),
            tx.pure.string(email),
        ],
    });
    tx.setGasBudget(10000000);
    const result = await signAndExecute(tx, ACTIVE_NETWORK);
    console.log("Farmer registered:", result);
    return result;
};

// Register an investor
const registerInvestor = async (
    name: string,
    email: string,
    password: string,
    address: string
) => {
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::register_investor`,
        arguments: [
            tx.object(INVESTOR_TABLE_ID),
            tx.pure.string(name),
            tx.pure.string(password),
            tx.pure.address(address),
            tx.pure.string(email),
        ],
    });
    tx.setGasBudget(10000000);
    const result = await signAndExecute(tx, ACTIVE_NETWORK);
    console.log("Investor registered:", result);
    return result;
};

// Create an idea
const createIdea = async (
    pictureUrl: string,
    title: string,
    description: string,
    fundingGoal: number,
    farmerEmail: string
) => {
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_idea`,
        arguments: [
            tx.object(IDEA_TABLE_ID),
            tx.object(FARMER_TABLE_ID),
            tx.pure.string(pictureUrl),
            tx.pure.string(title),
            tx.pure.string(description),
            tx.pure.u64(fundingGoal),
            tx.pure.string(farmerEmail),
        ],
    });
    tx.setGasBudget(10000000);
    const result = await signAndExecute(tx, ACTIVE_NETWORK);
    console.log("Idea created:", result);
    return result;
};

// Invest in an idea
const invest = async (title: string, amount: number, balance: number) => {
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::invest`,
        arguments: [
            tx.object(IDEA_TABLE_ID),
            tx.pure.string(title),
            tx.pure.u64(amount),
            tx.pure.u64(balance),
        ],
    });
    tx.setGasBudget(10000000);
    const result = await signAndExecute(tx, ACTIVE_NETWORK);
    console.log("Investment made:", result);
    return result;
};

// View an idea
const viewIdea = async (title: string) => {
    const tx = new Transaction();
    const result = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::view_idea`,
        arguments: [tx.object(IDEA_TABLE_ID), tx.pure.string(title)],
    });
    tx.setGasBudget(10000000);
    const executedResult = await signAndExecute(tx, ACTIVE_NETWORK);
    const returnValues = executedResult.returnValues;
    if (returnValues && returnValues.length > 0) {
        const [
            pictureUrl,
            titleRet,
            description,
            fundingGoal,
            currentFunding,
            status,
            totalInvested,
            farmerEmail,
        ] = returnValues[0];
        const idea = {
            pictureUrl: Buffer.from(pictureUrl.slice(1)).toString("utf8"),
            title: Buffer.from(titleRet.slice(1)).toString("utf8"),
            description: Buffer.from(description.slice(1)).toString("utf8"),
            fundingGoal: Number(Buffer.from(fundingGoal).readBigUInt64LE()),
            currentFunding: Number(Buffer.from(currentFunding).readBigUInt64LE()),
            status:
                Number(Buffer.from(status)) === 0
                    ? "FUNDED"
                    : Number(Buffer.from(status)) === 1
                        ? "CLOSED"
                        : "OPEN",
            totalInvested: Number(Buffer.from(totalInvested).readBigUInt64LE()),
            farmerEmail: Buffer.from(farmerEmail.slice(1)).toString("utf8"),
        };
        console.log("Idea details:", idea);
        return idea;
    }
    throw new Error("Failed to retrieve idea details.");
};

// Remove an idea
const removeIdea = async (title: string) => {
    const tx = new Transaction();
    tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::remove_idea`,
        arguments: [
            tx.object(IDEA_TABLE_ID),
            tx.object(FARMER_TABLE_ID),
            tx.pure.string(title),
        ],
    });
    tx.setGasBudget(10000000);
    const result = await signAndExecute(tx, ACTIVE_NETWORK);
    console.log("Idea removed:", result);
    return result;
};

// Get all investments
const getAllInvestments = async () => {
    const tx = new Transaction();
    const result = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::get_all_investments`,
        arguments: [tx.object(INVESTMENT_TABLE_ID), tx.object(IDEA_TABLE_ID)],
    });
    tx.setGasBudget(10000000);
    const executedResult = await signAndExecute(tx, ACTIVE_NETWORK);
    const returnValues = executedResult.returnValues;
    if (returnValues && returnValues.length > 0) {
        const investments: any[] = [];
        const data = returnValues[0][0]; // Vector of InvestmentData
        const decoded = client.bcs.vector(
            client.bcs.struct("InvestmentData", {
                idea_id: client.bcs.Address,
                idea_title: client.bcs.string(),
                investor_id: client.bcs.Address,
                amount: client.bcs.u64(),
            })
        ).parse(Buffer.from(data.slice(1)));
        for (const item of decoded) {
            investments.push({
                ideaId: item.idea_id,
                ideaTitle: item.idea_title,
                investorId: item.investor_id,
                amount: Number(item.amount),
            });
        }
        console.log("All investments:", investments);
        return investments;
    }
    return [];
};

// Get owned objects (for debugging)
const getObjects = async (type: string) => {
    const owner = getActiveAddress();
    const objects = await client.getOwnedObjects({
        owner,
        filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::${type}` },
        options: { showContent: true },
    });
    console.log(`Owned ${type} objects:`, objects.data);
    return objects.data;
};

// Example usage
const main = async () => {
    // Uncomment to deploy (run only if redeploying)
    // const { packageId, ideaTableId, investmentTableId, farmerTableId, investorTableId } = await deploy();
    // console.log("Deployed:", { packageId, ideaTableId, investmentTableId, farmerTableId, investorTableId });

    await registerFarmer("Bob", "bob@example.com", "password123");
    await registerInvestor("Alice", "alice@example.com", "password456", getActiveAddress());
    await createIdea(
        "http://example.com/pic.jpg",
        "Project 1",
        "A farming project",
        1000,
        "bob@example.com"
    );
    await invest("Project 1", 100, 1000);
    await viewIdea("Project 1");
    await getAllInvestments();
    await removeIdea("Project 1");
    await getObjects("FarmerTable");
    await getObjects("InvestorTable");
    await getObjects("IdeaTable");
    await getObjects("InvestmentTable");
};

// Run main
main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
