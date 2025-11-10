import {useEffect} from "react";
import QuizAppLang from "./QuizApp_lang.tsx";
import "../../styles/style.css";
import { useAppDispatch, useAppSelector } from "../../redux/hooks.ts";
import { fetchQuiz } from "../../redux/slices/quizSlice.ts";
import { useParams } from "react-router-dom";
import type {RootState} from "../../redux/store.ts";

const QuizPageLang = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const dispatch = useAppDispatch();

    const { data: currentQuiz, loading} = useAppSelector((state: RootState) => state.quiz);
    const user = useAppSelector((state: RootState) => state.user.data);

    useEffect(() => {
        if (quizId) dispatch(fetchQuiz(quizId));
    }, [dispatch, quizId, user]);

    if (loading) return <p>Загрузка теста...</p>;
    if (!currentQuiz) return <p>Тест не найден</p>;

    return (
        <div className="quiz-selection-container">
            <h2>
                {currentQuiz.title}: {currentQuiz.description}
            </h2>
            <QuizAppLang questions={currentQuiz.questions ?? []}  />
        </div>
    );
};

export default QuizPageLang;
