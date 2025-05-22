import { useEffect, useRef, useState } from "react";
import dashboard from "../assets/Group 48099633.png";
import activeInvestment from "../assets/copy.png";
import activeFarm from "../assets/layout.png";
import transactions from "../assets/bar-chart-square-02.png";
import settings from "../assets/settings-01.png";
import logout from "../assets/upload.png";
import farm from "../assets/download (1).jpeg";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import FarmerDashboard from "./farmerDasboard.jsx";
import MyFarm from "./myFarm.jsx";
import WalletDashboard from "./walletDashboard.jsx";
import InvestedFarm from "./investedFarm.jsx";
import ActiveFarm from "./activeFarm.jsx";
import TransactionHistory from "./transactionHistory.jsx";
import CopyRight from "../components/copyRight.jsx";
import {useNavigate} from "react-router-dom";
import DashBoardHeader from "../components/dashBoardHeader.jsx";

const Dashboard = () => {
    const [activeIndex, setActiveIndex] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate()
    const menuItems = [
        { id: 1, img: dashboard, label: "Dashboard" },
        { id: 2, img: activeFarm, label: "My Farm" },
        { id: 3, img: activeInvestment, label: "Invested Farms" },
        { id: 4, img: transactions, label: "Transaction History" },
        { id: 5, img: transactions, label: "My Wallet" },
        { id: 6, img: activeFarm, label: "Active Farm" },
        { id: 7, img: settings, label: "Settings" },
        { id: 8, img: logout, label: "Log out" },
    ];

    const transaction = [
        { id: 1, img: farm, title: "Yam Farm",dateCreated: "Jan 23 2024", dateInvested: "Feb 20 2024", expectedProfit:"$78,300" },
        { id: 2, img: farm, title: "Potatoes Farm",dateCreated: "Jan 23 2024", dateInvested: "Feb 20 2024", expectedProfit:"$78,300" },
        { id: 3, img: farm, title: "Corn Farm",dateCreated: "Jan 23 2024", dateInvested: "Feb 20 2024", expectedProfit:"$78,300" },
        { id: 4, img: farm, title: "Cassava Farm",dateCreated: "Jan 23 2024", dateInvested: "Feb 20 2024", expectedProfit:"$78,300" },
        { id: 5, img: farm, title: "Mango Farm",dateCreated: "Jan 23 2024", dateInvested: "Feb 20 2024", expectedProfit:"$78,300" },
        { id: 6, img: farm, title: "Pepper Farm",dateCreated: "Jan 23 2024", dateInvested: "Feb 20 2024", expectedProfit:"$78,300" },


    ];

    const item = [
        { id: 1, label: "No of farms", number: "6" },
        { id: 2, label: "Invested Farms", number: "5" },
        { id: 3, label: "Amount Invested", number: "$432.78" },
    ];

    const componentsMap = {
        1: <FarmerDashboard item={item} transaction={transaction} />,
        2: <MyFarm />,
        3: <InvestedFarm />,
        4: <TransactionHistory />,
        5: <WalletDashboard />,
        6: <ActiveFarm />,
    };

    const handleClick = (id) => {
        if(id===8){
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
            <div>
                <DashBoardHeader/>
            </div>
            <main className="flex bg-black w-full min-h-screen gap-12 px-0 lg:px-8 py-12">
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
                    {componentsMap[activeIndex] || <FarmerDashboard item={item} transaction={transaction}/>}
                    <CopyRight/>

                </div>
            </main>
        </div>

    );
};

export default Dashboard;
