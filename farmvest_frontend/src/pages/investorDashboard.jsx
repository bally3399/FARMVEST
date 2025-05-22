
import invest from "../assets/Group 1000002275.png";
import support from "../assets/Group 1000002275 (1).png";
import wallet from "../assets/Group 1000002276.png";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import farmImage from "../assets/download (1).jpeg";
import Farm from "../reuseables/farm.jsx";
;

const InvestorDashBoard = () => {
    const farm = [
        {id:1, img:farmImage,farmName:"Sunshine farm",location: "1b Sango Ota, Lagos", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N250,000 per day" },
        {id:2, img:farmImage,farmName:"Sunshine farm",location: "1b Magboro Ota, Ogun", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N200,000 per day" },
        {id:3, img:farmImage,farmName:"Sunshine farm",location: "1b Abeokuta, Ogun", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N350,000 per day" },
        {id:4, img:farmImage,farmName:"Sunshine farm",location: "1b Abeokuta, Ogun, Lagos", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N150,000 per day" },
        {id:5, img:farmImage,farmName:"Sunshine farm",location: "1b Sango Ota, Ogun", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N350,000 per day" },
    ]
    return (
        <main className="flex flex-col lg:flex-rol  w-full min-h-screen gap-12 bg-background">
                <div className="flex flex-col gap-2 rounded-2xl bg-background py-2">
                    <p className="font-bold text-3xl font-sans">Welcome Bejamin!!</p>
                    <p className="font-medium text-xl font-sans">
                        You can Invest, track and manage your farms
                    </p>
                </div>
                <div className="flex flex-col gap-6 rounded-2xl bg-background1 items-center py-2">
                    <p className="font-extrabold text-3xl font-sans">My Wallet</p>
                    <AccountBalanceWalletIcon sx={{ fontSize: 50, color: "green" }} />
                    <p className="font-extrabold text-3xl font-sans">$76,890.26</p>
                </div>
                <div className="flex flex-col gap-6 rounded-2xl bg-background1 items-center py-2">
                    <p className="font-extrabold text-3xl font-sans">Quick Action</p>
                    <div className="flex items-center justify-between w-[90%]">
                        <div className="flex flex-col gap-2">
                            <img src={wallet} alt={"Wallets"} />
                            <p>My Wallet</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <img src={invest} alt={"Investment"} />
                            <p>Invest</p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <img src={support} alt={"Support"} />
                            <p>Support</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-12 rounded-2xl bg-background1 items-center">
                    <p className="font-extrabold text-3xl font-sans">Investment</p>
                    <div className=" flex flex-col lg:grid  lg:grid-cols-3  gap-4 items-center justify-center px-2.5 lg:bg-background1 py-3 lg:py-6">
                        {
                            farm.map((farm)=>(
                                // eslint-disable-next-line react/jsx-key
                                <Farm farmName={farm.farmName} amountNeeded={farm.amount} width={"w-[300px]"} farmDescription={farm.description} address={farm.location} image={farm.img} />
                            ))
                        }
                    </div>
                </div>
        </main>
    );
};

export default InvestorDashBoard;


