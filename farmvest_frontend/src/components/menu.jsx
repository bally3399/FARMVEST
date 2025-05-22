import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";

import MenuItem from "./menuItems.jsx";

const Menu = ({ menuItems, activeIndex, setActiveIndex, isMenuOpen, setIsMenuOpen, menuRef }) => {
    return (
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
                <MenuItem
                    key={item.id}
                    id={item.id}
                    img={item.img}
                    label={item.label}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                />
            ))}
        </div>
    );
};



Menu.propTypes = {
    menuItems: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeIndex: PropTypes.number.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    isMenuOpen: PropTypes.bool.isRequired,
    setIsMenuOpen: PropTypes.func.isRequired,
    menuRef: PropTypes.shape({current: PropTypes.any}),
};

export default Menu;
