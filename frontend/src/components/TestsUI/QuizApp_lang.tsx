import {useEffect, useState} from 'react';
import '../../styles/style.css';
import {
    Paths,
    type Question,
    type SaveResultResponse
} from "../../types/quiz-types.ts";
import {ProgressBar} from "../progressBar/ProgressBar.tsx";
import {AnswersList} from "./AnswersList.tsx";
import {ScorePageLang} from "./ScorePage_lang.tsx";
import {useNavigate, useParams} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../redux/hooks.ts';
import {ImageItem} from "./ImageItem.tsx";
import {saveTestResult} from "../../services/quizApi.ts";
import type {RootState} from "../../redux/store.ts";
import {CircularProgress} from "@mui/material";
import {loginAction} from '../../redux/slices/authSlice.ts';

const QuizAppLang = ({ questions }: { questions: Question[] }) => {
    const { quizId } = useParams<{ quizId: string }>();
    const user = useAppSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [current, setCurrent] = useState(0);
    const [imgLoading, setImgLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [finished, setFinished] = useState(false);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!questions?.length) {
            console.warn("⚠️ Нет вопросов для теста");
        }
    }, [questions]);

    const handleAnswer = (index: number) => {
        setSelected(index);
    };

    const handleNext = async () => {
        const isCorrect = selected === questions[current].answer;
        const newScore = isCorrect ? score + 1 : score;
        setScore(newScore);
        const newAnswers = [...answers, selected];
        setAnswers(newAnswers);

        if (current + 1 >= questions.length) {
            setFinished(true);

            if (user._id && quizId) {
                setSaving(true);
                try {
                    const res = await saveTestResult(quizId, newScore, questions.length) as SaveResultResponse;
                    const newResult = res.data.testResult;

                    dispatch(
                        loginAction({
                            ...user,
                            testResults: [
                                ...(user.testResults?.filter(t => t.quiz !== quizId) || []),
                                newResult,
                            ],
                        })
                    );

                    console.log("🔄 Пользователь обновлён после теста");
                } catch (e) {
                    console.error("❌ Ошибка при сохранении результата:", e);
                } finally {
                    setSaving(false);
                }
            }
        } else {
            setCurrent(prev => prev + 1);
        }

        setSelected(null);
    };
    const handleBackToSelection = () => {
        navigate(Paths.HOME);
    };

    if (!questions?.length) {
        return (
            <div className="error-container">
                <h2>Ошибка загрузки теста</h2>
                <p>Вопросы не найдены</p>
                <button className="back-button" onClick={handleBackToSelection}>
                    Вернуться назад
                </button>
            </div>
        );
    }

    if (finished) {
        return (
            <div>
                {saving && (
                    <div className="saving-indicator">Сохранение результата...</div>
                )}
                <ScorePageLang
                    questions={questions}
                    score={score}
                    answers={answers}
                    onClick={handleBackToSelection}
                />
            </div>
        );
    }

    const q = questions[current];

    if (!q?.question) {
        return (
            <div className="error-container">
                <h2>Ошибка</h2>
                <p>Некорректные данные вопроса</p>
                <button className="back-button" onClick={handleBackToSelection}>
                    Вернуться назад
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="question">
                <div className="question-text">{q.question}</div>
                {q.image && (
                    <>
                        {imgLoading && (
                            <div style={{ textAlign: 'center', margin: '20px 0' }}>
                                <CircularProgress size={32} color="inherit" />
                            </div>
                        )}
                        <ImageItem image={q.image} onLoad={() => setImgLoading(false)} />
                    </>
                )}
                <AnswersList
                    options={q.options}
                    selected={selected}
                    onClick={handleAnswer}
                />
            </div>
            <button
                className="next-button"
                onClick={handleNext}
                disabled={selected === null}
            >
                {current + 1 >= questions.length ? "Завершить тест" : "Далее"}
            </button>
            <ProgressBar
                currentQuestion={current + 1}
                questionsLength={questions.length}
            />
        </div>
    );
};

export default QuizAppLang;
