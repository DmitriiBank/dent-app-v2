import type {Quiz} from "../../types/quiz-types.ts";

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
                src={`${import.meta.env.BASE_URL}${quiz.icon}`}
                alt={quiz.title}
                className="quiz-icon"
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