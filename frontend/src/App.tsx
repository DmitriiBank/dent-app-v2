
import {Route, Routes} from "react-router-dom";
import {useAppDispatch} from "./redux/hooks.ts";
import {useEffect} from "react";
import {
    fetchCurrentUser,
} from "./redux/slices/authSlice.ts";
import {routes} from './configurations/routeConfig.tsx'
import {Roles} from "./types/quiz-types.ts";
import {Layout} from "./Layout.tsx"
import PrivateRoute from "./redux/PrivateRoute.tsx";


function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch]);

    return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    {routes.map(({path, element, role}) =>
                        <Route
                            key={path}
                            path={path}
                            element={
                                role === Roles.USER || role as Roles === Roles.ADMIN
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
