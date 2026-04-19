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
import GoogleSuccess from "../servicePages/GoogleSuccess.tsx";
import type {ReactNode} from "react";
import RestorePass from "../servicePages/RestorePass.tsx";
import ResetPass from "../servicePages/ResetPass.tsx";
import AdminContentPage from "../servicePages/AdminContentPage.tsx";
import { accessGroups } from "./access.ts";


type AppRoute = {
    path: string;
    element: ReactNode;
    allowedRoles?: readonly Roles[];
};

export const routes: AppRoute[]  = [
    {path: Paths.HOME, element:
            <QuizSelectionPage_lang />
        },
    {
        path: `${Paths.HOME}/:quizId`,
        element: <QuizPage_lang />,
        allowedRoles: accessGroups.quizParticipants,
    },
    {
        path: `${Paths.HOME}/:quizId/results`,
        element: <ScorePageLang />,
        allowedRoles: accessGroups.resultViewers,
    },
    {path: Paths.LOGIN, element: <Login />},
    { path: Paths.GOOGLE, element: <GoogleSuccess />},
    {path: Paths.LOGOUT, element: <Logout />, allowedRoles: accessGroups.quizParticipants,},
    {path: Paths.REGISTER, element: <Registration />},
    {path: Paths.RESTORE_PASS, element: <RestorePass />},
    {path: Paths.RESET_PASS, element: <ResetPass />},
    {path: Paths.LECTURES, element: <LecturesPage />},
    {path: Paths.ANATOMY, element: <TeethPage />},
    {
        path: `${Paths.ANATOMY}/:id`,
        element: <ToothPage />,
       allowedRoles: accessGroups.quizParticipants,
    },

    {path: Paths.OPTIONS, element: <Options />},
    {path: Paths.MY_PAGE, element: <ScoreTable />,allowedRoles: accessGroups.quizParticipants,},
    {path: Paths.ADMIN_USERS, element: <ScoreTable />,allowedRoles: accessGroups.adminOnly,},
    {path: Paths.ADMIN_CONTENT, element: <AdminContentPage />,allowedRoles: accessGroups.adminOnly,},
    {path: Paths.TEACHER_RESULTS, element: <ScoreTable />,allowedRoles: accessGroups.teacherOrAdmin,},
    {path: '/*', element: <ErrorPage />},
    {path: Paths.ERROR, element: <ErrorPage />},
] as const;

export const errorItem: RouteType[] = [
    {path: Paths.ERROR, title: 'Error'},
]
