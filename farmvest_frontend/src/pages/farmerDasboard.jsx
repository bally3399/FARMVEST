import PropTypes from "prop-types";

const FarmerDashboard = ({ item, transaction }) => {
    return (
        <>
            <div className="flex flex-col gap-2 rounded-2xl bg-background py-2">
                <p className="font-bold text-3xl font-sans">Welcome Bejamin!!</p>
                <p className="font-medium text-xl font-sans text-center lg:text-start md:text-start">
                    You can Invest, track and manage your farms
                </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-12 bg-background1">
                {item.map((item) => (
                    <div
                        className="flex flex-col w-[90%] lg:w-[30%] h-[180px] border-2 border-white rounded-2xl items-center justify-between py-2 px-2"
                        key={item.id}
                    >
                        <p className="font-semibold text-2xl">{item.label}</p>
                        <p className="font-extra text-6xl">{item.number}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-6 rounded-2xl bg-background1 items-center py-2">
                <div className="flex items-center justify-between px-3 py-2 w-full font-light lg:font-bold font-sans">
                    <p className="font-bold font-sans text-yellow-600">Title</p>
                    <p className="font-bold font-sans text-yellow-600">Date Created</p>
                    <p className="font-bold font-sans text-yellow-600">Date Invested</p>
                    <p className="font-bold font-sans text-yellow-600">Amount Invested</p>
                    <p className="font-bold font-sans text-yellow-600">Profit</p>
                </div>
                {transaction.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between px-3 py-2 w-full font-light lg:font-bold font-sans"
                    >
                        <div className="flex gap-3 items-center">
                            <img
                                className="w-[30px] h-[30px] rounded-full"
                                src={item.img}
                                alt={"Profile"}
                            />
                            <p className="md:text-sm">{item.title}</p>
                        </div>
                        <p className="md:text-sm">{item.dateCreated}</p>
                        <p className="hidden lg:block md:text-sm">{item.dateInvested}</p>
                        <p>{item.expectedProfit}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

FarmerDashboard.propTypes = {
    item: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string.isRequired,
            number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
    ).isRequired,
    transaction: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            img: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            dateCreated: PropTypes.string.isRequired,
            dateInvested: PropTypes.string,
            expectedProfit: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
        })
    ).isRequired,
};

export default FarmerDashboard;
