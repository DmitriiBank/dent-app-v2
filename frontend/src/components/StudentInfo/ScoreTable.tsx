import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { TrashIcon, Edit } from "lucide-react";
import { type GridColDef } from "@mui/x-data-grid";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import type { RootState } from "../../redux/store";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../services/accountApi";
import type { AdminUserFormData, User, TestRecord } from "../../types/User";
import { Paths, type Quiz, Roles } from "../../types/quiz-types";
import { fetchQuizzes } from "../../redux/slices/quizSlice";
import { validateAdminUserForm } from "../../utils/adminValidators.ts";

type Row = {
    id: string;
    studentName: string;
    email?: string;
    role?: string;
    lessons: {
        [quizId: string]: { score: string; completed?: boolean };
    };
};

type FormState = {
    name: string;
    email: string;
    role: string;
    password: string;
    passwordConfirm: string;
    avatar: string;
};

const DEFAULT_FORM_STATE: FormState = {
    name: "",
    email: "",
    role: Roles.USER,
    password: "",
    passwordConfirm: "",
    avatar: "",
};

const LazyDataGrid = React.lazy(() =>
    import("@mui/x-data-grid").then((mod) => ({
        default: mod.DataGrid,
    }))
);

function mapUserToRow(u: User, allQuizzes: Quiz[]): Row {
    return {
        id: u._id,
        email: u.email,
        role: u.role,
        studentName: u.name,
        lessons: Object.fromEntries(
            allQuizzes.map((q) => {
                const res = u.testResults?.find((t: TestRecord) => String(t.quiz) === q.id);
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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state: RootState) => state.auth.data);
    const allQuizzes = useAppSelector((state: RootState) => state.quiz.list);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const { _id, role, name, testResults } = useMemo(
        () => ({
            _id: currentUser?._id,
            role: currentUser?.role,
            name: currentUser?.name ?? "",
            testResults: currentUser?.testResults ?? [],
        }),
        [currentUser]
    );

    const isAdminView = location.pathname === Paths.ADMIN_USERS;
    const isTeacherView = location.pathname === Paths.TEACHER_RESULTS;

    useEffect(() => {
        if (!allQuizzes.length) {
            void dispatch(fetchQuizzes());
        }
    }, [allQuizzes.length, dispatch]);

    useEffect(() => {
        const loadRows = async () => {
            if (!allQuizzes.length || !_id) return;

            setLoading(true);
            setError(null);

            try {
                if (isAdminView) {
                    const users = await getAllUsers();
                    setRows(users.map((u: User) => mapUserToRow(u, allQuizzes)));
                    return;
                }

                if (isTeacherView) {
                    const users = await getAllUsers({ role: Roles.USER });
                    setRows(users.map((u: User) => mapUserToRow(u, allQuizzes)));
                    return;
                }

                const results = Object.fromEntries(
                    allQuizzes.map((quiz) => {
                        const tr = testResults.find((t) => String(t.quiz) === quiz.id);
                        const score = tr ? `${tr.points}/${tr.totalQuestions}` : "0";
                        return [quiz.id, { score }];
                    })
                );

                setRows([
                    {
                        id: _id,
                        studentName: name,
                        email: currentUser?.email,
                        role,
                        lessons: results,
                    },
                ]);
            } catch (err) {
                setRows([]);
                setError(err instanceof Error ? err.message : "Не удалось загрузить данные");
            } finally {
                setLoading(false);
            }
        };

        loadRows();
    }, [_id, role, name, testResults, allQuizzes, currentUser?.email, isAdminView, isTeacherView]);

    const resetDialog = () => {
        setDialogOpen(false);
        setEditingUserId(null);
        setFormState(DEFAULT_FORM_STATE);
        setSubmitting(false);
        setError(null);
    };

    const openCreateDialog = () => {
        setEditingUserId(null);
        setFormState(DEFAULT_FORM_STATE);
        setDialogOpen(true);
        setError(null);
    };

    const openEditDialog = (row: Row) => {
        setEditingUserId(row.id);
        setFormState({
            name: row.studentName,
            email: row.email ?? "",
            role: row.role ?? Roles.USER,
            password: "",
            passwordConfirm: "",
            avatar: "",
        });
        setDialogOpen(true);
        setError(null);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteUser(id);
            setRows((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось удалить пользователя");
        }
    };

    const handleSubmit = async () => {
        const payload: AdminUserFormData = {
            name: formState.name.trim(),
            email: formState.email.trim(),
            role: formState.role,
            password: formState.password,
            passwordConfirm: formState.passwordConfirm,
            avatar: formState.avatar.trim(),
        };
        const validationError = validateAdminUserForm(payload, Boolean(editingUserId));
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            if (editingUserId) {
                const updated = await updateUser(editingUserId, {
                    name: payload.name,
                    email: payload.email,
                    role: payload.role,
                    avatar: payload.avatar,
                });

                setRows((prev) =>
                    prev.map((row) =>
                        row.id === editingUserId
                            ? {
                                  ...row,
                                  studentName: updated.name,
                                  email: updated.email,
                                  role: updated.role,
                              }
                            : row
                    )
                );
            } else {
                const created = await createUser(payload);
                setRows((prev) => [...prev, mapUserToRow(created, allQuizzes)]);
            }

            resetDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось сохранить пользователя");
            setSubmitting(false);
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
                        color={data?.score && data.score !== "0" ? "success" : "default"}
                        size="small"
                    />
                );
            },
        }));
    }, [allQuizzes]);

    const columns = useMemo<GridColDef[]>(() => {
        const baseColumns: GridColDef[] = [
            {
                field: "studentName",
                headerName: isAdminView ? "Пользователь" : "Ученик",
                minWidth: 180,
                flex: 1,
            },
            {
                field: "email",
                headerName: "Email",
                minWidth: 220,
                flex: 1,
            },
        ];

        if (isAdminView) {
            baseColumns.push({
                field: "role",
                headerName: "Роль",
                minWidth: 140,
                renderCell: (params) => (
                    <Chip label={params.value ?? Roles.USER} size="small" variant="outlined" />
                ),
            });
        }

        const adminActions: GridColDef[] = isAdminView
            ? [
                  {
                      field: "actions",
                      headerName: "Действия",
                      width: 120,
                      sortable: false,
                      filterable: false,
                      renderCell: (params) => (
                          <Box sx={{ display: "flex", gap: 1 }}>
                              <Edit
                                  size={18}
                                  color="#666"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => openEditDialog(params.row)}
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
              ]
            : [];

        return [...baseColumns, ...lessonCols, ...adminActions];
    }, [isAdminView, lessonCols]);

    const title = isAdminView
        ? "Управление пользователями"
        : isTeacherView
            ? "Итоги учеников"
            : "Мои оценки";

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    mb: 2,
                    gap: 2,
                }}
            >
                <Typography variant="h5">{title}</Typography>
                {isAdminView && (
                    <Button variant="contained" onClick={openCreateDialog} sx={{ width: { xs: "100%", sm: "auto" } }}>
                        Добавить пользователя
                    </Button>
                )}
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <Box sx={{ minWidth: isMobile ? 860 : 0 }}>
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
                            hideFooter={!isAdminView && !isTeacherView && rows.length <= 1}
                        />
                    </React.Suspense>
                </Box>
            </Box>

            <Dialog open={dialogOpen} onClose={resetDialog} fullWidth maxWidth="sm" fullScreen={isMobile}>
                <DialogTitle>{editingUserId ? "Редактировать пользователя" : "Создать пользователя"}</DialogTitle>
                <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
                    <TextField
                        label="Имя"
                        value={formState.name}
                        onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        type="email"
                        value={formState.email}
                        onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Роль"
                        select
                        value={formState.role}
                        onChange={(e) => setFormState((prev) => ({ ...prev, role: e.target.value }))}
                        fullWidth
                    >
                        <MenuItem value={Roles.USER}>user</MenuItem>
                        <MenuItem value={Roles.TEACHER}>teacher</MenuItem>
                        <MenuItem value={Roles.ADMIN}>admin</MenuItem>
                    </TextField>
                    {editingUserId && (
                        <TextField
                            label="Avatar URL"
                            value={formState.avatar}
                            onChange={(e) => setFormState((prev) => ({ ...prev, avatar: e.target.value }))}
                            fullWidth
                        />
                    )}
                    {!editingUserId && (
                        <>
                            <TextField
                                label="Пароль"
                                type="password"
                                value={formState.password}
                                onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
                                fullWidth
                            />
                            <TextField
                                label="Подтверждение пароля"
                                type="password"
                                value={formState.passwordConfirm}
                                onChange={(e) => setFormState((prev) => ({ ...prev, passwordConfirm: e.target.value }))}
                                fullWidth
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetDialog}>Отмена</Button>
                    <Button onClick={handleSubmit} disabled={submitting} variant="contained">
                        {editingUserId ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
