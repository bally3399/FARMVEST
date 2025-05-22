import StatisticsPanel from "./statisticsPanel.jsx";
import InvestmentTable from "./investmentTable.jsx";

const TransactionHistory = () => {
    return (
        <div  className="flex bg-black w-full min-h-screen text-white py-0 gap-12 px-0">
            <div className="flex flex-col gap-5 lg:gap-12  bg-background w-full  text-white py-5 px-6 ml-auto">
                <div className="flex flex-col lg:flex-row gap-6">
                    <InvestmentTable/>
                    <StatisticsPanel/>
                </div>
            </div>

        </div>
    );
};


export default TransactionHistory;