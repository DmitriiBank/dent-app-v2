import {Route, Routes} from "react-router-dom";
import {routes} from './configurations/routeConfig.tsx'
import {Layout} from "./Layout.tsx"
import PrivateRoute from "./redux/PrivateRoute.tsx";

function App() {

    return (

            <Routes>
                <Route path="/" element={<Layout />}>
                    {routes.map(({path, element, allowedRoles}) =>
                        <Route
                            key={path}
                            path={path}
                            element={
                               allowedRoles?.length
                                    ? <PrivateRoute allowedRoles={allowedRoles}>{element}</PrivateRoute>
                                    : element
                            }
                        />
                    )}
                </Route>
            </Routes>

    );
}

export default App;
