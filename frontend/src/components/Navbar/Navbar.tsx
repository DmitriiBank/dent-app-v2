import {useAppSelector} from "../../redux/hooks.ts";
import {useNavigate} from "react-router-dom";
import type {RootState} from "../../redux/store.ts";
import {Paths} from "../../types/quiz-types.ts";

export const Navbar = () => {
    const {email, name} = useAppSelector(state => state.auth);
    console.log(email, name)
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
                onClick={() => navigate('/lectures')}
            >
                {lang === 'ru' ? 'Лекции' : 'רצאות'}
            </button>
            <button
                onClick={() => navigate('/options')}
            >
                {lang === 'ru' ? 'Настройки' : 'רצאות'}
            </button>

        </div>
    );
};

