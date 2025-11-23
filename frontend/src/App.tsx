import {Route, Routes} from "react-router-dom";
import {routes} from './configurations/routeConfig.tsx'
import {Layout} from "./Layout.tsx"
import PrivateRoute from "./redux/PrivateRoute.tsx";


function App() {
    // const dispatch = useAppDispatch();

    // useEffect(() => {
    //     async function checkAuth() {
    //         const hasToken = document.cookie.includes("jwt=");
    //         if (!hasToken) return;
    //
    //         try {
    //             const user = await dispatch(fetchCurrentUser()).unwrap();
    //             console.log("User is logged in", user);
    //         } catch {
    //             console.log("Error fetching user");
    //         }
    //     }
    //
    //     checkAuth();
    // }, [dispatch]);

    return (

            <Routes>
                <Route path="/" element={<Layout />}>
                    {routes.map(({path, element, allowedRoles}) =>
                        <Route
                            key={path}
                            path={path}
                            element={
                               allowedRoles?.length
                                    ? <PrivateRoute>{element}</PrivateRoute>
                                    : element
                            }
                        />
                    )}
                </Route>
            </Routes>

    );
}

export default App;
