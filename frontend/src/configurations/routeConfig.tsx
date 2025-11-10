import {Paths, Roles, type RouteType} from "../types/quiz-types.ts";

import QuizSelectionPage_lang
    from "../components/TestsUI/QuizSelectionPage_lang";
import QuizPage_lang from "../components/TestsUI/QuizPage_lang";
import Login from "../servicePages/Login";
import Logout from "../servicePages/Logout";
import Registration from "../servicePages/Registration";
import ErrorPage from "../servicePages/ErrorPage";
import Options from "../servicePages/Options";
import LecturesPage from "../components/LecturesUI/LecturesPage";
import {ScorePageLang} from "../components/TestsUI/ScorePage_lang";
import TeethPage from "../components/Anatomy/TeethPage.tsx";
import {ToothPage} from "../components/Anatomy/ToothPage.tsx";
import {ScoreTable} from "../components/StudentInfo/ScoreTable.tsx";

export const routes = [
    {path: Paths.HOME, element: <QuizSelectionPage_lang />, role: ''},
    {
        path: `${Paths.HOME}/:quizId`,
        element: <QuizPage_lang />,
        role: Roles.USER
    },
    {
        path: `${Paths.HOME}/:quizId/results`,
        element: <ScorePageLang questions={[]} score={0} answers={[]} onClick={function(): void {
            throw new Error("Function not implemented.");
        } } />,
        role: Roles.USER
    },
    {path: Paths.LOGIN, element: <Login />, role: ''},
    {path: Paths.LOGOUT, element: <Logout />, role: Roles.USER},
    {path: Paths.REGISTER, element: <Registration />, role: ''},
    {path: Paths.LECTURES, element: <LecturesPage />, role: ''},
    {path: Paths.ANATOMY, element: <TeethPage />, role: ''},
    {
        path: `${Paths.ANATOMY}/:id`,
        element: <ToothPage />,
        role: Roles.USER
    },

    {path: Paths.OPTIONS, element: <Options />, role: ''},
    {path: Paths.MY_PAGE, element: <ScoreTable />, role: Roles.USER},
    {path: Paths.ALL_USERS, element: <ScoreTable />, role: Roles.USER},
    {path: Paths.ERROR, element: <ErrorPage />, role: ''},
] as const;

export const errorItem: RouteType[] = [
    {path: Paths.ERROR, title: 'Error'},
]