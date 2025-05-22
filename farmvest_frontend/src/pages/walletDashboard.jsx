import StatisticsPanel from "./statisticsPanel.jsx";
import InvestmentTable from "./investmentTable.jsx";
import copy from "../assets/copy.png";

import PropTypes from "prop-types";
import {useState} from "react";


const WalletDashboard = ({balance}) => {
    const [isCopied, setIsCopied] = useState(false);

    const walletAddress = "0x0wdvgtumlewuecvefewfudwperwutaqesd";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(walletAddress);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy text to clipboard: ", error);
        }
    };


    return (
        <div  className="flex bg-black w-full min-h-screen text-white py-0  gap-12 px-0 ">
            <div className="flex flex-col gap-5 lg:gap-12  bg-background w-full  text-white py-5 px-6 ml-auto">
                <div className="flex items-center justify-between bg-background1 rounded-md border-2 border-white py-8 px-2.5">
                        <div>
                            <h1 className="text-2xl font-bold mb-2 mt-4">My Wallet</h1>
                            <h2 className="text-3xl font-bold text-green-500 mb-0 pb-0">{balance ? balance : "$500,000.00"}</h2>
                        </div>
                    <div className="flex flex-col gap-3 self-end mr-5">
                        <div className="flex gap-3 items-center">
                            <p className="font-sans font-bold text-xl text-slate-400">Wallet Address</p>
                            <img className="w-[20px] h-[20px] " src={copy} alt={"Copy Address"} onClick={handleCopy}/>
                        </div>
                        <p
                            className="font-semibold text-xl text-slate-400 cursor-pointer"
                                title="Click to copy"
                            >
                                {walletAddress}
                            </p>
                            {isCopied && <span className="text-green-500 text-sm mt-1">Copied!</span>}

                    </div>

                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                    <InvestmentTable/>
                    <StatisticsPanel/>
                </div>
            </div>

        </div>
    );
};

WalletDashboard.propTypes = {
    balance: PropTypes.string,
}

export default WalletDashboard;