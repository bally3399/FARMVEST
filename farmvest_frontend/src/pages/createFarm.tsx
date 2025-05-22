import { useState } from "react";
// @ts-ignore
import edit from "../assets/edit-03.png";
// @ts-ignore
import image from "../assets/Vector1.png";
import { Copyright } from "@mui/icons-material";
import { Transaction } from "@mysten/sui/transactions";
import {execSync} from "child_process";
// @ts-ignore
import path from "path";
import {homedir} from "os";
import {readFileSync} from "fs";
import { fromBase64 } from "@mysten/sui/utils";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";



const PACKAGE_ID = process.env.PACKAGE_ID;
const MODULE_NAME = "farmvest";
const IDEA_TABLE_ID = process.env.IDEA_TABLE_ID;
const SUI_BIN= "sui";
type Network = "mainnet" | "testnet" | "devnet" | "localnet";
const ACTIVE_NETWORK: Network ="testnet";
const FARMER_TABLE_ID = process.env.FARMER_TABLE_ID;



const getActiveAddress = (command: string): string => {
    try {
        return execSync(`${SUI_BIN} client active-address`, {encoding: "utf8", shell: true}).trim();
    } catch (error) {
        throw new Error("Failed to get active address. Ensure Sui CLI is installed and configured.");
    }
};

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
}
const CreateFarm = () => {
    const [pictureUrl, setPictureUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [fundingGoal, setFundingGoal] = useState("");
    const [farmerEmail, setFarmerEmail] = useState("");
    const [loading, setLoading] = useState(false);


    const handleCreateFarm = async () => {
        if (!title || !description || !location || !fundingGoal || !farmerEmail) {
            alert("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        try {
            // You can combine location into description or add as a separate field if your Move contract supports it
            const result = await createIdea(
                pictureUrl,
                title,
                description + " Location: " + location,
                Number(fundingGoal),
                farmerEmail
            );
            alert("Farm idea created!");
        } catch (err) {
            // @ts-ignore
            alert("Failed to create farm idea: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    // Move contract call
    const createIdea = async (
        pictureUrl: string,
        title: string,
        description: string,
        fundingGoal: string | number | bigint,
        farmerEmail: string
    ) => {
        const tx = new Transaction();
        tx.moveCall({
            target: `${PACKAGE_ID}::${MODULE_NAME}::create_idea`,
            arguments: [
                // @ts-ignore
                tx.object(IDEA_TABLE_ID),
                // @ts-ignore
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

    return (
        <div className="flex items-center justify-center w-full bg-background1 min-h-screen py-8">
            <div className="flex flex-col w-[95%] lg:w-[40%] py-8 rounded-xl border-2 border-white items-center justify-center text-white gap-3 bg-background bg-opacity-80">
                <div
                    className="relative flex items-center flex-col justify-center gap-2 rounded-full h-[120px] w-[120px] border-2 border-white ">
                    <div className="gap-3 flex flex-col items-center justify-center ">
                        <img className="self-center" src={image} alt={"img"} />
                        <p className="font-bold text-sm">add image</p>
                    </div>
                    <img className="absolute right-3 bottom-0" src={edit} alt={"img"} />
                </div>
                <div className="flex flex-col w-full px-3 gap-8 lg:gap-12 ">
                    <div className="w-[100%] ml-3">
                        <p>Name <span className="text-red-700 font-extrabold">*</span></p>
                        <input
                            className="px-3 py-3  w-[90%] bg-transparent border-2 border-white rounded-md"
                            type="text"
                            placeholder="Farm Name"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="w-[100%] ml-3">
                        <p>Description <span className="text-red-700 font-extrabold">*</span></p>
                        <input
                            className="px-3 h-[120px] w-[90%] py-3 bg-transparent border-2 border-white rounded-md placeholder:font-bold placeholder-adjust"
                            placeholder="Farm Description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="w-[100%] ml-3">
                        <p>Location<span className="text-red-700 font-extrabold">*</span></p>
                        <input
                            type="text"
                            className="px-3 py-3  w-[90%] bg-transparent border-2 border-white rounded-md placeholder:font-bold "
                            placeholder="Location"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>

                    <div className="w-[100%] ml-3">
                        <p>Amount Needed<span className="text-red-700 font-extrabold">*</span></p>
                        <input
                            type="number"
                            className=" self-center  px-3 py-3  w-[90%] bg-transparent border-2 border-white rounded-md placeholder:font-bold "
                            placeholder="$ Amount Needed for Investment"
                            value={fundingGoal}
                            onChange={e => setFundingGoal(e.target.value)}
                        />
                    </div>
                    <div className="w-[100%] ml-3">
                        <p>Your Email<span className="text-red-700 font-extrabold">*</span></p>
                        <input
                            type="email"
                            className=" self-center  px-3 py-3  w-[90%] bg-transparent border-2 border-white rounded-md placeholder:font-bold "
                            placeholder="Your Email"
                            value={farmerEmail}
                            onChange={e => setFarmerEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex gap-3 self-end mr-16">
                    <button
                        className="px-3 py-2 bg-transparent  font-semibold hover:border-y-green-700 hover:border-white hover:rounded-md hover:border-2  transition-all duration-300"
                        disabled={loading}
                        onClick={() => {
                            // Optionally reset form or navigate elsewhere on cancel
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-2 bg-green-700 rounded-md font-semibold hover:bg-green-900 hover:py-3 hover:px-4 transition-all duration-300"
                        disabled={loading}
                        onClick={handleCreateFarm}
                    >
                        {loading ? "Creating..." : "Create Farm"}
                    </button>
                </div>
            </div>
            <Copyright />
        </div>
    );
};

export default CreateFarm;
