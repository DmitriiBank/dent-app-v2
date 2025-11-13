import { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { DeleteIcon, EditIcon } from "lucide-react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAppSelector } from "../../redux/hooks.ts";
import type { RootState } from "../../redux/store.ts";
import type {TestRecord, User} from "../../types/User.ts";
import { deleteUser, getAllUsers } from "../../services/accountApi.ts";
import type {Quiz} from "../../types/quiz-types.ts";

type Row = {
    id: string;
    studentName: string;
    lessons: { [key: string]: { score: string; completed?: boolean } };
};

function mapUserToRow(u: User, allQuizzes: Quiz[]): Row {
    return {
        id: u._id,
        studentName: u.name,
        lessons: Object.fromEntries(
            allQuizzes.map((q) => {
                const res = u.testResults?.find((t: TestRecord) => t.quiz === q.id);
                return [q.id, { score: res ? `${res.points}/${res.totalQuestions}` : "0" }];
            })
        ),
    };
}

export const ScoreTable = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);
    const currentUser = useAppSelector((state: RootState) => state.auth);
    const allQuizzes = useAppSelector((state: RootState) => state.quiz.list);
    // const [testScore, setTestScore] = useState<Record<string, { score?: string | null }>>({});

    useEffect(() => {
        const loadTestStatus = async () => {
            if (!allQuizzes.length || !currentUser?._id) return;

            setLoading(true);

            try {
                const results: Record<string, { score?: string }> = {};

                for (const quiz of allQuizzes) {
                    const testResult = currentUser.testResults?.find((t: TestRecord) => t.quiz === quiz.id);
                    results[quiz.id] = {
                        score:
                            testResult?.points && testResult?.totalQuestions
                                ? `${testResult.points}/${testResult.totalQuestions}`
                                : undefined,
                    };
                }

                // setTestScore(results);

                if (currentUser.role === "admin") {
                    const res = await getAllUsers();
                    const users = res.data || res; // защита от разных структур
                    const allRows = users.map((u: User) => mapUserToRow(u, allQuizzes));
                    setRows(allRows);
                } else {
                    const allRows: Row[] = [
                        {
                            id: currentUser._id,
                            studentName: currentUser.name ?? "",
                            lessons: Object.fromEntries(
                                Object.entries(results).map(([quizId, r]) => [quizId, { score: r.score ?? "0" }])
                            ),
                        },
                    ];
                    setRows(allRows);
                }
            } catch (error) {
                console.error("Ошибка при загрузке статуса тестов:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTestStatus();
    }, [currentUser?._id, currentUser.role, allQuizzes]);

    const handleEdit = (id: string) => {
        console.log("Редактировать:", id);
        // TODO
    };

    const handleDelete = async (id: string) => {
        console.log("Удалить", id);
        try {
            await deleteUser(id);
            setRows(prev => prev.filter(r => r.id !== id));
            console.log("✅ User removed successfully");
        } catch (err) {
            console.error("Ошибка при удалении:", err);
        }
    };

    const lessonCols: GridColDef<Row>[] = allQuizzes.map((quiz) => ({
        field: quiz.id,
        headerName: quiz.title,
        width: 120,
        renderCell: (params) => {
            const data = params.row.lessons[quiz.id];
            return (
                <Chip
                    label={data?.score || "—"}
                    color={data?.score ? "success" : "default"}
                    size="small"
                />
            );
        },
    }));

    const columns: GridColDef<Row>[] =
        currentUser.role === "admin"
            ? [
                { field: "studentName", headerName: "Ученик", minWidth: 180, flex: 1 },
                ...lessonCols,
                {
                    field: "actions",
                    headerName: "Действия",
                    width: 120,
                    sortable: false,
                    filterable: false,
                    renderCell: (params) => (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <EditIcon
                                size={18}
                                color="#666"
                                style={{ cursor: "pointer", margin: "2px" }}
                                onClick={() => handleEdit(params.row.id)}
                            />
                            <DeleteIcon
                                size={18}
                                color="#d32f2f"
                                style={{ cursor: "pointer", margin: "2px" }}
                                onClick={() => handleDelete(params.row.id)}
                            />
                        </Box>
                    ),
                },
            ]
            : lessonCols;

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 2,
            }}
        >
            <Typography variant="h5" sx={{ mb: 2 }}>
                {currentUser.role === "admin" ? "Таблица оценок всех студентов" : "Мои оценки"}
            </Typography>
            <DataGrid
                autoHeight
                rows={rows}
                getRowId={(r) => r.id}
                columns={columns}
                loading={loading}
                pageSizeOptions={[5, 10, 20]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                }}
                disableRowSelectionOnClick
                hideFooter={currentUser.role !== "admin" && rows.length <= 1}
            />
        </Box>
    );
};
