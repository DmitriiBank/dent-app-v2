import type { Question } from "../../types/quiz-types.ts";
import {ImageItem} from "./ImageItem.tsx";

type Props = {
    quiz: Question;
    answer: number | null;
};

export const ScoreItemLang = ({ quiz, answer }: Props) => {
    const statusLabel = answer === quiz.answer
        ? 'верно'
        :  'ошибка' ;

    return (
        <div>
            <div>
                <div className="question-header">
                    <strong>{quiz.question}</strong>
                    <span className={`status-badge ${answer === quiz.answer ? 'correct' : 'incorrect'}`}>
                        {statusLabel}
                    </span>
                </div>
                {quiz.image && <ImageItem image={quiz.image}/>}
                <ul className="answer-options">
                    {quiz.options.map((opt: string, idx ) => (
                        <li
                            key={idx}
                            className={`option ${
                                idx === quiz.answer
                                    ? 'correct'
                                    : idx === answer
                                    ? 'incorrect'
                                    : ''
                            }`}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};