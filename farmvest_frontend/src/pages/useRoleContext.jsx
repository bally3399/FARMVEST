
import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
    const [role, setRole] = useState(null);

    return (
        <UserRoleContext.Provider value={{ role, setRole }}>
            {children}
        </UserRoleContext.Provider>
    );
};

UserRoleProvider.propTypes={
    children: PropTypes.node.isRequired,
}

export const useUserRole = () => useContext(UserRoleContext);
