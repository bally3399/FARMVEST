import { useEffect, useRef, useState } from "react";
import dashboard from "../assets/Group 48099633.png";
import activeInvestment from "../assets/copy.png";
import activeFarm from "../assets/layout.png";
import transactions from "../assets/bar-chart-square-02.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import WalletDashboard from "./walletDashboard.jsx";
import InvestedFarm from "./investedFarm.jsx";
import ActiveFarm from "./activeFarm.jsx";
import TransactionHistory from "./transactionHistory.jsx";
import CopyRight from "../components/copyRight.jsx";
import {useNavigate} from "react-router-dom";
import DashBoardHeader from "../components/dashBoardHeader.jsx";
import InvestorDashboard from "./investorDashboard.jsx";

const Investor = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate()
    const menuItems = [
        { id: 1, img: dashboard, label: "Dashboard" },
        { id: 2, img: transactions, label: "My Wallet" },
        { id: 3, img: activeInvestment, label: "Invested Farms" },
        { id: 4, img: activeFarm, label: "Active Farms" },
        { id: 5, img: transactions, label: "Transaction History" },
    ];




    const componentsMap = {
        1: <InvestorDashboard />,
        2: <WalletDashboard />,
        3: <InvestedFarm />,
        4: <ActiveFarm />,
        5: <TransactionHistory />,
    };

    const handleClick = (id) => {
        if(id===7){
            navigate('/login');
            setActiveIndex(1);
        }
        else  setActiveIndex(id);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col w-[100%]">
            <div >
                <DashBoardHeader/>
            </div>
            <main className="flex bg-black  min-h-screen gap-12 px-0 py-12 md:gap-0">
                <div
                    ref={menuRef}
                    className={`fixed top-0 left-0 h-full bg-black text-white z-50 transition-transform transform ${
                        isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 lg:relative lg:flex lg:flex-col lg:gap-5 lg:w-1/4`}
                >
                    <div className="lg:hidden p-4">
                        <CloseIcon
                            onClick={() => setIsMenuOpen(false)}
                            className="cursor-pointer text-white text-3xl"
                        />
                    </div>

                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className={`flex gap-6 items-center cursor-pointer px-3 py-2 rounded-xl ${
                                activeIndex === item.id ? "bg-nav_color" : "bg-transparent"
                            }`}
                            onClick={() => handleClick(item.id)}
                        >
                            <img className="w-[20px] h-[20px]" src={item.img} alt={item.label}/>
                            <p className="text-xl font-bold font-sans">{item.label}</p>
                        </div>
                    ))}
                </div>


                <div className="absolute top-2 left-4 z-50 lg:hidden md:pl-6">
                    {!isMenuOpen && (
                        <MenuIcon
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="cursor-pointer text-white text-3xl mb-5"
                        />
                    )}
                </div>
                <div
                    className="flex flex-col gap-6 lg:rounded-2xl bg-background w-full lg:w-3/4 text-white py-5 px-6 ml-auto">
                    {componentsMap[activeIndex] || <InvestorDashboard/>}
                    <CopyRight/>

                </div>
            </main>
        </div>

    );
};

export default Investor;
