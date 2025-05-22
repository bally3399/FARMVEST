import PropTypes from "prop-types";

const StatCard = ({ label, number }) => (
    <div className="flex flex-col w-[90%] lg:w-[30%] h-[180px] border-2 border-white rounded-2xl items-center justify-between py-2 px-2">
        <p className="font-semibold text-2xl">{label}</p>
        <p className="font-extrabold text-6xl">{number}</p>
    </div>
);
StatCard.propTypes = {
    label: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired
}
export default StatCard;