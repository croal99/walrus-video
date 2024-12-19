import {Outlet, useNavigate, useOutletContext} from "react-router-dom";
import {Toaster} from "react-hot-toast";

import AppAppBar from '@components/AppAppBar';


export default function Layout() {

    return (
        <>
            <Toaster />
            <AppAppBar />

            <Outlet />
        </>
    )
}