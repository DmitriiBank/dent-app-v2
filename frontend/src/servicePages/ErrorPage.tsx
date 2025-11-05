import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {Paths} from "../types/quiz-types.ts";

const ErrorPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const navType = performance.getEntriesByType("navigation")[0];
        if (navType && (navType as PerformanceNavigationTiming).type === "reload") {
            navigate(Paths.HOME, { replace: true });
        }
    }, [navigate]);

    return (
        <div>
            <h1>Error 404 page not found</h1>
        </div>
    );
};

export default ErrorPage;
