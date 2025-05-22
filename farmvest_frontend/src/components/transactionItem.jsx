import PropTypes from "prop-types";

const TransactionItem = ({ img, title, dateCreated, dateInvested, expectedProfit }) => (
    <div className="flex items-center justify-between px-3 py-2 w-full font-light lg:font-bold font-sans">
        <div className="flex gap-3 items-center">
            <img className="w-[30px] h-[30px] rounded-full" src={img} alt="Profile" />
            <p className="md:text-sm">{title}</p>
        </div>
        <p className="md:text-sm">{dateCreated}</p>
        <p className="hidden lg:block md:text-sm">{dateInvested}</p>
        <p>{expectedProfit}</p>
    </div>
);

TransactionItem.propTypes={
    img: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateInvested: PropTypes.string.isRequired,
    expectedProfit: PropTypes.string.isRequired,
}

export default TransactionItem;