
import {useSelector} from "react-redux";
import type {RootState} from "../redux/store.ts";
import {LangSwitcher} from "../components/Switchers/LangSwitcher.tsx";
import {ThemeSwitcher} from "../components/Switchers/ThemeSwitcher.tsx";

const Options = () => {
    // const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.lang.language);

    return (
        <div className="quiz-selection-container" >
            <div className="selection-header">
                <h2>{lang === 'ru' ? 'Язык' : 'שפה'}</h2>
                <LangSwitcher/>
                <h2>{lang === 'ru' ? 'Тема' : 'נושא'}</h2>
                <ThemeSwitcher/>
            </div>
        </div>
    );
};

export default Options
