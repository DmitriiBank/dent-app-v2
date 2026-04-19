import type {Question} from "../../types/quiz-types.ts";
import {ImageItem} from "./ImageItem.tsx";

type Props = {
    quiz: Question;
    answer: number | null;
};

export const ScoreItemLang = ({quiz, answer}: Props) => {
    const statusLabel = answer === quiz.answer
        ? 'верно'
        : 'ошибка';

    return (

        <div className="quiz-score">
            <div className="quiz-score__header">
                <strong>{quiz.question}</strong>
                <span
                    className={`quiz-score__badge ${
                        answer === quiz.answer
                            ? 'quiz-score__badge--correct'
                            : 'quiz-score__badge--incorrect'
                    }`}
                >
                    {statusLabel}
                </span>
            </div>
            {quiz.image && <ImageItem image={quiz.image} alt={quiz.question} />}
            <ul className="quiz-score__options">
                {quiz.options.map((opt: string, idx) => {
                    let optionClass = 'quiz-score__option';
                    if (idx === quiz.answer) {
                        optionClass += ' quiz-score__option--correct';
                    } else if (idx === answer) {
                        optionClass += ' quiz-score__option--incorrect';
                    }

                    return (
                        <li
                            key={idx}
                            className={optionClass}
                        >
                            {opt}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
};
