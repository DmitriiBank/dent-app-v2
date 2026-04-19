import type {Quiz} from "../../types/quiz-types.ts";
import { resolveAssetUrl } from "../../utils/resolveAssetUrl.ts";

type Props = {
    quiz: Quiz,
    onClick: (id: string) => void,
    isCompleted: boolean,
    score?: string | null
}

export const QuizBlockLang = ({ quiz, onClick, isCompleted, score }: Props) => {

    return (
        <div
            className={`quiz-card ${isCompleted ? 'completed' : 'available'}`}
            onClick={() => onClick(quiz.id)}
        >
            <img
                src={resolveAssetUrl(quiz.icon)}
                alt={quiz.title}
                loading="lazy"
                className="quiz-icon"
                width="200" height="200"
            />
            <h2>{quiz.title}</h2>
            <p className="quiz-description">
                {quiz.description}
            </p>

            {/* Статус теста */}
            <div className="quiz-status">
                {isCompleted ? (
                    <div className="completed-badge">
                        <div className="status-text">
                            ✓ Уже пройден
                        </div>
                        {score && (
                            <div className="score-text">
                               Результат: {score}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="available-badge">
                        Доступен
                    </div>
                )}
            </div>

        </div>
    );
};
