
import farmImage from "../assets/download (1).jpeg";

import Farm from "../components/singleFarm.jsx";
import {useNavigate} from "react-router-dom";

const MyFarm = () => {
    const navigate = useNavigate();

    const farm = [
        {id:1, img:farmImage,farmName:"Sunshine farm",location: "1b Sango Ota, Lagos", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N250,000 per day" },
        {id:2, img:farmImage,farmName:"Sunshine farm",location: "1b Magboro Ota, Ogun", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N200,000 per day" },
        {id:3, img:farmImage,farmName:"Sunshine farm",location: "1b Abeokuta, Ogun", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N350,000 per day" },
        {id:4, img:farmImage,farmName:"Sunshine farm",location: "1b Abeokuta, Ogun, Lagos", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N150,000 per day" },
        {id:5, img:farmImage,farmName:"Sunshine farm",location: "1b Sango Ota, Ogun", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N350,000 per day" },
        {id:6, img:farmImage,farmName:"Sunshine farm",location: "1b Oke Fia , Osogbo", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N200,000 per day" },
        {id:7, img:farmImage,farmName:"Sunshine farm",location: "1b Ogo-Oluwa , Osun State", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N230,000 per day" },
        {id:8, img:farmImage,farmName:"Sunshine farm",location: "2b  Sango Ota, Ogun", description:"Luxury, Comfort, Serenity at its peak!!! Are you looking for a place to call hom...", amount: "N220,000 per day" },
    ]

    return (
        <main className="flex bg-black w-full min-h-screen">

            <div
                className="flex flex-col gap-12  bg-background w-full  text-white py-5 px-6 ml-auto">
                <div className="flex items-center flex-col lg:flex-row justify-between px-3">
                    <div className="flex flex-col gap-2 rounded-2xl bg-background py-2">
                        <p className="font-bold text-3xl font-sans">My Farm!!</p>
                        <p className="font-medium text-xl font-sans">
                            Create, track and manage your farm
                        </p>
                    </div>
                    <button
                        onClick={()=>navigate('/createFarm')}
                        className="px-3  py-2 bg-green-700 rounded-md font-semibold hover:bg-green-900 hover:py-3 hover:px-4 transition-all duration-300">Create
                        Farm
                    </button>
                </div>


                <div
                    className=" flex flex-col lg:grid  lg:grid-cols-3  gap-4 items-center justify-center px-2.5 lg:bg-background1 py-3 lg:py-6">
                    {
                        farm.map((farm) => (
                            // eslint-disable-next-line react/jsx-key
                            <Farm  address={farm.location} farmName={farm.farmName} amountNeeded={farm.amount} farmDescription={farm.description} image={farm.img} />
                        ))
                    }
                </div>
            </div>
        </main>
    );
};

export default MyFarm;


