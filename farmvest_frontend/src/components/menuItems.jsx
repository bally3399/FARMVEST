// eslint-disable-next-line react/prop-types
const MenuItem = ({ id, img, label, activeIndex, setActiveIndex }) => {
    return (
        <div
            className={`flex gap-6 items-center cursor-pointer px-3 py-2 rounded-xl ${
                activeIndex === id ? "bg-nav_color" : "bg-transparent"
            }`}
            onClick={() => setActiveIndex(id)}
        >
            <img className="w-[20px] h-[20px]" src={img} alt={label} />
            <p className="text-xl font-bold font-sans">{label}</p>
        </div>
    );
};

export default MenuItem;
