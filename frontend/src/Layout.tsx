import { Outlet } from "react-router-dom";
import { Header } from "./components/Navbar/Header";
import { Navbar } from "./components/Navbar/Navbar";

export const Layout = () => {
    return (
        <>
            <Header />
            <div className="main">
                <div className="navbar--static">
                    <Navbar />
                </div>
                <div className="__right-block">
                    <Outlet />
                </div>
            </div>
        </>
    );
};
