
import {Route, Routes} from "react-router-dom";
import {useAppDispatch} from "./redux/hooks.ts";
import {useEffect} from "react";
import {
    fetchCurrentUser,
} from "./redux/slices/authSlice.ts";
import {routes} from './configurations/routeConfig.tsx'
import PrivateRoute from "./redux/PrivateRoute.tsx";
import {Roles} from "./types/quiz-types.ts";


function App() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        // <div className={'app'}>
        //     <Routes>
        //         {routes.map(({ path, element}) =>
        //             <Route key={path} path={path} element={element} />
        //         )}
        //     </Routes>
        // </div>
        <div className={'app'}>
            <Routes>
                {routes.map(({path, element, role}) =>
                    role as Roles === Roles.USER || role as Roles === Roles.ADMIN ? (
                        <Route
                            key={path}
                            element={<PrivateRoute />}
                        >
                            <Route
                                path={path}
                                element={element}
                            />
                        </Route>
                    ) : (
                        <Route
                            key={path}
                            path={path}
                            element={element}
                        />
                    )
                )}
            </Routes>
        </div>
    );
}

export default App;
