
import {useLocation, useNavigate} from "react-router-dom";
import {ScoreItemLang} from "./ScoreItem_lang.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";
import {Paths, type Question} from "../../types/quiz-types.ts";

interface ScoreLocationState {
    result?: {
        quizId: string;
        questions: Question[];
        answers: (number | null)[];
        score: number;
    };
}


export const ScorePageLang = () => {
    const lang = useSelector((state: RootState) => state.lang.language);
    const navigate = useNavigate();
    const location = useLocation();
    const locationResult = (location.state as ScoreLocationState | null)?.result;
    const lastResult = useSelector((state: RootState) => state.quiz.lastResult);
    const result = locationResult ?? lastResult;

    const handleBackToSelection = () => {
        navigate(Paths.HOME);
    };

    if (!result || !result.questions?.length) {
        const title = lang === 'ru' ? 'Нет данных для отображения' : 'אין נתונים להצגה';
        const button = lang === 'ru' ? 'Вернуться к тестам' : 'חזרה למבחנים';
        return (
            <div className="quiz-results">
                <h2 className="quiz-results__title">{title}</h2>
                <button className="quiz-results__restart" onClick={handleBackToSelection}>
                    {button}
                </button>
            </div>
        );
    }

    const {questions, score, answers} = result;
    const title = lang === 'ru' ? 'Результат' : 'תוצאה';
    const summary =
        lang === 'ru'
            ? `Вы ответили правильно на ${score} из ${questions.length} вопросов.`
            : `ענית נכון על ${score} מתוך ${questions.length} שאלות.`;
    const button = lang === 'ru' ? 'Вернуться к выбору теста' : 'חזרה לבחירת המבחן';

    return (
        <div className="quiz-results">
            <h2 className="quiz-results__title">{title}</h2>
            <div className="quiz-results__summary">{summary}</div>
            <ul className="quiz-results__answers">
                {questions.map((q, idx) => {
                    const answerClass = answers[idx] === q.answer
                        ? `quiz-results__answer--correct`
                        : `quiz-results__answer--incorrect`;
                    return (
                        <li
                            key={`${q.question}-${idx}`}
                            className={`quiz-results__answer ${answerClass}`}
                        >
                            <ScoreItemLang
                                quiz={q}
                                answer={answers[idx]}
                            />
                        </li>
                    )
                })}
            </ul>
            <button
                className="quiz-results__restart"
                onClick={handleBackToSelection}
            >
                {button}
            </button>
        </div>
    );
};