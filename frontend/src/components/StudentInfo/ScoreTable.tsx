import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { TrashIcon, Edit } from "lucide-react";
import { type GridColDef } from "@mui/x-data-grid";
import { useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { deleteUser, getAllUsers } from "../../services/accountApi";
import type { User, TestRecord } from "../../types/User";
import type { Quiz } from "../../types/quiz-types";

type Row = {
    id: string;
    studentName: string;
    lessons: {
        [quizId: string]: { score: string; completed?: boolean };
    };
};

const LazyDataGrid = React.lazy(() =>
    import("@mui/x-data-grid").then((mod) => ({
        default: mod.DataGrid,
    }))
);


function mapUserToRow(u: User, allQuizzes: Quiz[]): Row {
    return {
        id: u._id,
        studentName: u.name,
        lessons: Object.fromEntries(
            allQuizzes.map((q) => {
                const res = u.testResults?.find((t: TestRecord) => t.quiz === q.id);
                return [
                    q.id,
                    {
                        score: res ? `${res.points}/${res.totalQuestions}` : "0",
                    },
                ];
            })
        ),
    };
}

export const ScoreTable = () => {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(true);

    const currentUser = useAppSelector((state: RootState) => state.auth);
    const allQuizzes = useAppSelector((state: RootState) => state.quiz.list);

    const { _id, role, name, testResults } = useMemo(
        () => ({
            _id: currentUser?._id,
            role: currentUser?.role ?? "guest",
            name: currentUser?.name ?? "",
            testResults: currentUser?.testResults ?? [],
        }),
        [currentUser]
    );

    useEffect(() => {
        const loadTestStatus = async () => {
            if (!allQuizzes.length || !_id) return;

            setLoading(true);

            try {
                if (role === "admin") {
                    const res = await getAllUsers();
                    const users = res.data || res;
                    const allRows = users.map((u: User) => mapUserToRow(u, allQuizzes));
                    setRows(allRows);
                } else {
                    const results = Object.fromEntries(
                        allQuizzes.map((quiz) => {
                            const tr = testResults.find((t) => t.quiz === quiz.id);
                            const score = tr ? `${tr.points}/${tr.totalQuestions}` : "0";
                            return [quiz.id, { score }];
                        })
                    );

                    setRows([
                        {
                            id: _id,
                            studentName: name ?? "",
                            lessons: results,
                        },
                    ]);
                }
            } catch (error) {
                console.error("Ошибка при загрузке статуса тестов:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTestStatus();
    }, [_id, role, name, testResults, allQuizzes]);

    const handleEdit = (id: string) => {
        console.log("Редактировать:", id);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setRows((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Ошибка при удалении:", err);
        }
    };


    const lessonCols = useMemo<GridColDef[]>(() => {
        return allQuizzes.map((quiz) => ({
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
    }, [allQuizzes]);

    const columns = useMemo<GridColDef[]>(() => {
        if (role !== "admin") return lessonCols;

        return [
            {
                field: "studentName",
                headerName: "Ученик",
                minWidth: 180,
                flex: 1,
            },
            ...lessonCols,
            {
                field: "actions",
                headerName: "Действия",
                width: 120,
                sortable: false,
                filterable: false,
                renderCell: (params) =>  (
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Edit
                            size={18}
                            color="#666"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEdit(params.row.id)}
                        />
                        <TrashIcon
                            size={18}
                            color="#d32f2f"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDelete(params.row.id)}
                        />
                    </Box>
                ),
            },
        ];
    }, [lessonCols, role]);

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
                {role === "admin" ? "Таблица оценок всех студентов" : "Мои оценки"}
            </Typography>

            <React.Suspense fallback={<Typography>Загрузка таблицы…</Typography>}>
                <LazyDataGrid
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
                    hideFooter={role !== "admin" && rows.length <= 1}
                />
            </React.Suspense>
        </Box>
    );
};
