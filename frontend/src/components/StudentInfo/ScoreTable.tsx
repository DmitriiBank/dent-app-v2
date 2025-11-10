import {useEffect, useState} from "react";
import {Box, Chip, Typography} from "@mui/material";
import {DeleteIcon, EditIcon} from "lucide-react";
import {useAppSelector} from "../../redux/hooks.ts";
import type {RootState} from "../../redux/store.ts";
import type {TestRecord} from "../../types/User.ts";
import type {GridColDef} from "@mui/x-data-grid";
import {DataGrid} from "@mui/x-data-grid";


type Row = {
    id: string;
    studentName: string;
    lessons: { [key: string]: { score: string, completed?: boolean } };
};

export const ScoreTable = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = useAppSelector((state: RootState) => state.auth);
    // const navigate = useNavigate();
    const allQuizzes = useAppSelector((state: RootState) => state.quiz.list)
    // const dispatch = useAppDispatch();
    // const [testScore, setTestScore] = useState<Record<string, {
    //     score?: string | null
    // }>>({});

    useEffect(() => {
        const loadTestStatus = async () => {
            if (!currentUser._id) {
                console.log('Гостевой режим - все тесты не доступны');
                // navigate(Paths.LOGIN, {replace: true});
                return;
            }

            setLoading(true);

            try {
                const results: Record<string, {
                    score?: string
                }> = {};


                await Promise.all(allQuizzes.map(async (quiz) => {
                    try {
                        console.log(`Проверяем тест ${quiz.id} для пользователя ${currentUser._id}`);

                        const testResult = currentUser?.testResults?.find((test: TestRecord) => test.quiz === quiz.id);


                        results[quiz.id] = {
                            score:
                                testResult?.points && testResult?.totalQuestions
                                    ? `${testResult.points}/${testResult.totalQuestions}`
                                    : undefined,
                        };

                        console.log(`Тест ${quiz.id}:  score=${testResult?.points}/${testResult?.totalQuestions}`);
                    } catch (error) {
                        console.error(`Ошибка при проверке теста ${quiz.id}:`, error);
                    }
                }));

                // setTestScore(results);
                console.log('Финальный статус тестов:', results);
                const allRows: Row[] = [{
                    id: currentUser._id,
                    studentName: currentUser.name ?? "",
                    lessons: Object.fromEntries(
                        Object.entries(results).map(([quizId, r]) => [
                            quizId,
                            { score: r.score ?? "0" },
                        ])
                    )
                }];
                setRows(allRows);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при загрузке статуса тестов:', error);
                // const fallbackStatus: Record<string, {
                //     score?: string
                // }> = {};
                // setTestScore(fallbackStatus);
            } finally {
                setLoading(false);
            }
        };

        if (allQuizzes.length) loadTestStatus();
    }, [currentUser?._id, allQuizzes]);



const lessonCols: GridColDef<Row>[] = allQuizzes.map((quiz) => {
    return {
        field: quiz.id,
        headerName: quiz.title,
        width: 120,
        renderCell: (params) => {
            const data = params.row.lessons[quiz.id];
            if (!data) return "—";
            return (
                <Chip
                    label={data.score || "—"}
                    color={data.score ? "success" : "default"}
                    size="small"
                />
            );
        },
    };
});


const columns: GridColDef<Row>[] = currentUser.role == "admin" ? [
    {field: "studentName", headerName: "Ученик", minWidth: 180, flex: 1},
    ...lessonCols,
    {
        field: "actions",
        headerName: "Действия",
        width: 120,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <Box sx={{display: "flex", gap: 1}}>
                <EditIcon
                    size={18}
                    color="#666"
                    style={{cursor: "pointer", margin: "2px"}}
                    onClick={() => handleEdit(params.row.id)}
                />
                <DeleteIcon
                    size={18}
                    color="#d32f2f"
                    style={{cursor: "pointer", margin: "2px"}}
                    onClick={() => handleDelete(params.row.id)}
                />
            </Box>
        ),
    },
] : lessonCols;

const handleEdit = (id: string) => {
    console.log("Редактировать", id);
    // TODO  модалку с редактированием
};

const handleDelete = (id: string) => {
    console.log("Удалить", id);
    //TODO запрос на удаление
};

// if (!initialLoadDone) {
//     return (
//         <Box
//             sx={{
//                 height: "100%",
//                 width: "100%",
//                 bgcolor: "background.paper",
//                 p: 2,
//                 borderRadius: 2
//             }}
//         >
//             <Typography
//                 variant="h5"
//                 sx={{mb: 2}}
//             >
//                 Инициализация...
//             </Typography>
//         </Box>
//     );
// }

return (
    <Box
        sx={{
            height: "100%",
            width: "100%",
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2
        }}
    >
        <Typography
            variant="h5"
            sx={{mb: 2}}
        >
            {currentUser.role == "admin" ? "Таблица оценок всех студентов" : "Мои оценки"}
        </Typography>
        <DataGrid
            rows={rows}
            sx={{height: "auto"}}
            getRowId={(r) => r.id}
            columns={columns}
            loading={loading}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
                pagination: {paginationModel: {pageSize: 10}},
            }}
            disableRowSelectionOnClick
            hideFooter={currentUser.role != "admin" && rows.length <= 1}
        />
    </Box>
);
}
;