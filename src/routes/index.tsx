import {RouterProvider, createBrowserRouter, useNavigate, createHashRouter} from "react-router-dom";
import {useAuth} from "@/provider/authProvider";
import Layout from "@/layout/layout.tsx";
import LoginForm from "@components/login/loginForm.tsx";
import HomePage from "@/pages/HomePage.tsx";
import ViewPage, {loader as viewLoader} from "@/pages/ViewPage.tsx";

const Routes = () => {

    // 路由配置
    const routesForPublic = [
        {
            path: "/",
            element: <LoginForm/>,
        },
        {
            path: "/login",
            element: <LoginForm/>,
        },
    ];

    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <Layout/>,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
                {
                    path: "/view/:id",
                    element: <ViewPage />,
                    loader: viewLoader,
                },
                // {
                //     path: "/logout",
                //     element: <Logout />,
                // },
            ],
        },
        // {
        //     path: "/login",
        //     element: <LoginForm/>,
        // },
    ];

    const routesForNotAuthenticatedOnly = [
    ];

    const router = createBrowserRouter([
    // const router = createHashRouter([
        ...routesForPublic,
        // ...(!token ? routesForNotAuthenticatedOnly : []),
        ...routesForAuthenticatedOnly,
    ]);

    return <RouterProvider router={router}/>;

};

export default Routes;

