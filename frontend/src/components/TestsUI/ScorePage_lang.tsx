// import { ScoreItem } from "./ScoreItem.tsx";
import type { Question } from "../../types/quiz-types.ts";
import {ScoreItemLang} from "./ScoreItem_lang.tsx";
import {useSelector} from "react-redux";
import type {RootState} from "../../redux/store.ts";

type Props = {
    questions: Question[];
    score: number;
    answers: (number | null)[];
    onClick: () => void;
};

export const ScorePageLang = ({ questions, score, answers, onClick}: Props) => {
    const lang = useSelector((state: RootState) => state.lang.language);
    const title = lang === 'ru' ? 'Результат' : 'תוצאה';
    const summary =
        lang === 'ru'
            ? `Вы ответили правильно на ${score} из ${questions.length} вопросов.`
            : `ענית נכון על ${score} מתוך ${questions.length} שאלות.`;
     const button = lang === 'ru' ? 'Вернуться к выбору теста' : 'חזרה לבחירת המבחן';
    return (
        <div className="results-container">
            <h2 className="results-title">{title}</h2>
            <div className="results-summary">{summary}</div>
            <ul className="answers-list">
                {questions.map((q, idx) => (
                    <li
                        key={idx}
                        className={`answer-item ${answers[idx] === q.answer ? 'correct' : 'incorrect'}`}
                    >
                        <ScoreItemLang quiz={q} answer={answers[idx]} />
                    </li>
                ))}
            </ul>
            <button className="restart-button" onClick={onClick}>
                {button}
            </button>
        </div>
    );
};