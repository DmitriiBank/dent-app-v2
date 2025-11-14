import {useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import type {RootState} from "../../redux/store.ts";
import {Paths} from "../../types/quiz-types.ts";

export const Navbar = () => {
   const navigate = useNavigate()
    const lang = useAppSelector((state: RootState) => state.lang.language);

    return (
        <div className={"navbar"}>
            <h3>Навигация</h3>
            <button
                onClick={() => navigate(Paths.HOME)}
            >
                {lang === 'ru' ? 'Тесты' : 'מבחנים'}
            </button>
            <button
                onClick={() => navigate(Paths.LECTURES)}
            >
                {lang === 'ru' ? 'Лекции' : 'רצאות'}
            </button>
            <button
                onClick={() => navigate(Paths.ANATOMY)}
            >
                {lang === 'ru' ? 'Анатомия' : 'אנטומיה'}
            </button>
            <button
                onClick={() => navigate(Paths.OPTIONS)}
            >
                {lang === 'ru' ? 'Настройки' : 'רצאות'}
            </button>

        </div>
    );
};

export const MobileNavbar = () => {
    return (
        <div style={{ padding: "16px" }}>
            <Navbar />
        </div>
    );
};
