import { useRoutes} from "react-router-dom";
import HomePage from "./pages/home.jsx";
import Dashboard from "./pages/dashboard.jsx";
import MyFarm from "./pages/myFarm.jsx";
import CreateFarm from "./pages/createFarm.tsx";
import Login from "./pages/login.tsx";
import WalletDashboard from "./pages/walletDashboard.jsx";
import Investor from "./pages/investor.jsx";

export default function App() {
    const ROUTES = [
        {path:'/', element:<HomePage/>},
        {path:'/investor', element:<Investor/>},
        {path:'/dashboard', element:<Dashboard/>},
        {path:'/myFarm', element:<MyFarm/>},
        {path:'/createFarm', element:<CreateFarm/>},
        {path:'/wallet', element:<WalletDashboard/>},
        {path:'/wallet', element:<WalletDashboard/>},
        {path:'/login', element:<Login/>},

    ]
  return (
      useRoutes(ROUTES)
  )
}