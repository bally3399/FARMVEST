import { useState } from "react";
import { useUserRole } from "./useRoleContext.jsx";
// @ts-ignore
import googleImg from '../assets/Google Play logo.svg';
import { useNavigate } from "react-router-dom";
import { Transaction } from "@mysten/sui/transactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
// @ts-ignore
import path from "path";
import {homedir} from "os";
import {readFileSync} from "fs";
import {execSync} from "child_process";



type Network = "mainnet" | "testnet" | "devnet" | "localnet";
const PACKAGE_ID = process.env.PACKAGE_ID;
const MODULE_NAME = "farmvest";
const FARMER_TABLE_ID = process.env.FARMER_TABLE_ID;
const INVESTOR_TABLE_ID= process.env.INVESTOR_TABLE_ID
const ACTIVE_NETWORK: Network ="testnet";
const SUI_BIN = "sui";


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
const Login = () => {
    const { setRole } = useUserRole();
    const navigate = useNavigate();

    const [isInvestor, setIsInvestor] = useState(false);
    const [isFarmer, setIsFarmer] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const account = useCurrentAccount();

    const registerFarmer = async (name, email, password) => {
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
    const registerInvestor = async (name, email, password, address) => {
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

    const handleButtonClick = async () => {
        if (!isAgreed) {
            setShowWarning(true);
            return;
        }
        setShowWarning(false);

        if (!account) {
            alert("Please connect your wallet first.");
            return;
        }

        if (!name || !email || !password) {
            alert("Please fill in all registration fields.");
            return;
        }

        setLoading(true);
        try {
            if (isInvestor) {
                await registerInvestor(name, email, password, account.address);
                setRole("investor");
                navigate("/investor");
            } else if (isFarmer) {
                await registerFarmer(name, email, password);
                setRole("farmer");
                navigate("/dashboard");
            }
        } catch (err) {
            alert("Registration failed: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center w-full min-h-screen bg-background1 text-white">
            <div className="flex flex-col w-[90%] md:w-[60%] rounded-md bg-background lg:w-[30%] px-4 py-6 border-2 border-white items-center gap-3">
                <p className="font-bold text-2xl">Login</p>
                <p className="font-semibold text-sm font-sans">
                    Unlock opportunities by investing and earning - all in one place.
                </p>
                <div className="flex gap-2 self-start">
                    <input
                        type="checkbox"
                        className="bg-green-900"
                        checked={isInvestor}
                        onChange={() => {
                            setIsInvestor(!isInvestor);
                            if (!isInvestor) setIsFarmer(false);
                        }}
                    />
                    <p className="font-semibold text-sm font-sans">Sign in as an investor</p>
                </div>
                <div className="flex gap-2 self-start">
                    <input
                        type="checkbox"
                        className="bg-green-900"
                        checked={isFarmer}
                        onChange={() => {
                            setIsFarmer(!isFarmer);
                            if (!isFarmer) setIsInvestor(false);
                        }}
                    />
                    <p className="font-semibold text-sm font-sans">Sign in as a farmer</p>
                </div>
                {/* Registration fields */}
                <input
                    type="text"
                    placeholder="Name"
                    className="text-black p-2 rounded w-full"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="text-black p-2 rounded w-full"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="text-black p-2 rounded w-full"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div
                    className={`flex gap-2 items-center justify-center py-2 w-full border-2 rounded-md border-white ${
                        isInvestor || isFarmer ? "hover:px-2 hover:py-2.5 hover:bg-green-700 transition-all duration-300" : "opacity-50 cursor-not-allowed"
                    }`}
                >
                    <img src={googleImg} alt="Google" />
                    <button
                        onClick={handleButtonClick}
                        disabled={!(isInvestor || isFarmer) || loading}
                        className="text-white bg-transparent"
                    >
                        {loading ? "Registering..." : "Sign in with Google"}
                    </button>
                </div>
                <div className="flex gap-2 self-start">
                    <input
                        type="checkbox"
                        className="bg-green-900"
                        checked={isAgreed}
                        onChange={() => setIsAgreed(!isAgreed)}
                    />
                    <p className="font-semibold text-sm font-sans">
                        I agree to Terms of Service and Privacy Policy
                    </p>
                </div>
                {showWarning && !isAgreed && (
                    <p className="text-red-500 text-sm font-semibold">
                        You must agree to the Terms of Service and Privacy Policy.
                    </p>
                )}
            </div>
        </main>
    );
};

export default Login;
