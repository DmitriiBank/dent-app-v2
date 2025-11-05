import {useNavigate} from 'react-router-dom';
import '../../styles/QuizSelectionPage.css';
import {QuizBlockLang} from "./QuizBlock_lang.tsx";
import type {RootState} from "../../redux/store.ts";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../redux/hooks.ts";
import {fetchQuizzes} from "../../redux/slices/quizSlice.ts";
import {canTakeTest} from "../../services/quizApi.ts";
import type {TestRecord} from "../../types/User.ts";
import {Paths} from "../../types/quiz-types.ts";

const QuizSelectionPageLang = () => {
    const navigate = useNavigate();
    const user = useAppSelector((state: RootState) => state.auth);
   const [loading, setLoading] = useState(false);
    const allQuizzes = useAppSelector((state: RootState) => state.quiz.list)
    const dispatch = useAppDispatch();
    const [testStatus, setTestStatus] = useState<Record<string, {
        canTake: boolean,
        score?: string | null
    }>>({});

    useEffect(() => {
        const loadQuizzes = async () => {
            setLoading(true);
            try {
                if (!allQuizzes.length) await dispatch(fetchQuizzes());
            } finally {
                setLoading(false);
            }
        };
        loadQuizzes();
    }, [dispatch, allQuizzes.length]);

    useEffect(() => {
        const loadTestStatus = async () => {
            if (!user._id) {
                console.log('Гостевой режим - все тесты не доступны');
                // navigate(Paths.LOGIN, {replace: true});
                return;
            }

            setLoading(true);

            try {
                const results: Record<string, {
                    canTake: boolean,
                    score?: string
                }> = {};


                await Promise.all(allQuizzes.map(async (quiz) => {
                    try {
                        console.log(`Проверяем тест ${quiz.id} для пользователя ${user._id}`);

                        let canTake = true;
                        if (user.testResults) canTake = await canTakeTest(quiz.id, user.testResults);

                        const testResult = user?.testResults?.find((test: TestRecord) => test.quiz === quiz.id);


                        results[quiz.id] = {
                            canTake,
                            score:
                                testResult?.points && testResult?.totalQuestions
                                    ? `${testResult.points}/${testResult.totalQuestions}`
                                    : undefined,
                        };

                        console.log(`Тест ${quiz.id}: canTake=${canTake}, score=${testResult?.points}/${testResult?.totalQuestions}`);
                    } catch (error) {
                        console.error(`Ошибка при проверке теста ${quiz.id}:`, error);
                        results[quiz.id] = {canTake: true};
                    }
                }));

                setTestStatus(results);
                console.log('Финальный статус тестов:', results);
            } catch (error) {
                console.error('Ошибка при загрузке статуса тестов:', error);
                const fallbackStatus: Record<string, {
                    canTake: boolean,
                    score?: string
                }> = {};
                allQuizzes.forEach(quiz => {
                    fallbackStatus[quiz.id] = {canTake: true};
                });
                setTestStatus(fallbackStatus);
            } finally {
                setLoading(false);
            }
        };

        if (allQuizzes.length) loadTestStatus();
    }, [user?._id, allQuizzes]);

    const handleSelect = async (id: string) => {
        navigate(`${Paths.HOME}/${id}`);
    };

    if (loading) {
        return (
            <div className="quiz-selection-container">
                <div className="selection-header">
                    <h2>Загрузка тестов...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-selection-container">
            <div className="selection-header">
                <h1>Выберите тест</h1>
                {!user._id && (
                    <p className="guest-notice">
                        Вы вошли как гость. Тесты вам не доступны.
                    </p>
                )}
            </div>
            <div className="quiz-categories">
                {allQuizzes.map((quiz) => {
                    const status = testStatus[quiz.id]; // может быть undefined, и это ок
                    const isCompleted = status ? !status.canTake : false;
                    return (
                        <QuizBlockLang
                            key={quiz.id}
                            quiz={quiz}
                            onClick={() => !isCompleted && handleSelect(quiz.id)}
                            isCompleted={isCompleted}
                            score={status?.score}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default QuizSelectionPageLang;