import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItemButton,
    ListItemText,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {
    createQuiz,
    createQuizQuestion,
    deleteQuizData,
    deleteQuizQuestion,
    getQuizQuestions,
    getAllQuizzes,
    updateQuizData,
    updateQuizQuestion,
} from "../services/quizApi.ts";
import type { Question, Quiz } from "../types/quiz-types.ts";
import { validateImageFile, validateQuestionForm, validateQuizForm } from "../utils/adminValidators.ts";
import { resolveAssetUrl } from "../utils/resolveAssetUrl.ts";

type QuizFormState = {
    title: string;
    description: string;
    iconMode: "url" | "file";
    icon: string;
};

type QuestionFormState = {
    question: string;
    options: string;
    answer: number;
    imageMode: "url" | "file";
    image: string;
};

const DEFAULT_QUIZ_FORM: QuizFormState = {
    title: "",
    description: "",
    iconMode: "url",
    icon: "",
};

const DEFAULT_QUESTION_FORM: QuestionFormState = {
    question: "",
    options: "",
    answer: 0,
    imageMode: "url",
    image: "",
};

const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
    });

export default function AdminContentPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [quizDialogOpen, setQuizDialogOpen] = useState(false);
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
    const [quizForm, setQuizForm] = useState<QuizFormState>(DEFAULT_QUIZ_FORM);
    const [questionForm, setQuestionForm] = useState<QuestionFormState>(DEFAULT_QUESTION_FORM);
    const [saving, setSaving] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const selectedQuiz = useMemo(
        () => quizzes.find((quiz) => (quiz.id ?? quiz._id) === selectedQuizId) ?? null,
        [quizzes, selectedQuizId]
    );

    const loadQuizzes = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllQuizzes();
            setQuizzes(data);
            const firstId = data[0]?.id ?? data[0]?._id ?? null;
            setSelectedQuizId((prev) => prev ?? firstId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить тесты");
        } finally {
            setLoading(false);
        }
    };

    const loadQuestions = async (quizId: string) => {
        try {
            const data = await getQuizQuestions(quizId);
            setQuestions(data);
        } catch (err) {
            setQuestions([]);
            setError(err instanceof Error ? err.message : "Не удалось загрузить вопросы");
        }
    };

    useEffect(() => {
        void loadQuizzes();
    }, []);

    useEffect(() => {
        if (selectedQuizId) {
            void loadQuestions(selectedQuizId);
        } else {
            setQuestions([]);
        }
    }, [selectedQuizId]);

    const resetQuizDialog = () => {
        setQuizDialogOpen(false);
        setEditingQuizId(null);
        setQuizForm(DEFAULT_QUIZ_FORM);
    };

    const resetQuestionDialog = () => {
        setQuestionDialogOpen(false);
        setEditingQuestionId(null);
        setQuestionForm(DEFAULT_QUESTION_FORM);
    };

    const openCreateQuizDialog = () => {
        setEditingQuizId(null);
        setQuizForm(DEFAULT_QUIZ_FORM);
        setQuizDialogOpen(true);
    };

    const openEditQuizDialog = () => {
        if (!selectedQuiz) return;
        setEditingQuizId(selectedQuiz.id ?? selectedQuiz._id ?? null);
        setQuizForm({
            title: selectedQuiz.title,
            description: selectedQuiz.description,
            iconMode: selectedQuiz.icon?.startsWith("data:") ? "file" : "url",
            icon: selectedQuiz.icon ?? "",
        });
        setQuizDialogOpen(true);
    };

    const openCreateQuestionDialog = () => {
        setEditingQuestionId(null);
        setQuestionForm(DEFAULT_QUESTION_FORM);
        setQuestionDialogOpen(true);
    };

    const openEditQuestionDialog = (question: Question) => {
        setEditingQuestionId(question._id ?? question.id ?? null);
        setQuestionForm({
            question: question.question,
            options: question.options.join("\n"),
            answer: question.answer,
            imageMode: question.image?.startsWith("data:") ? "file" : "url",
            image: question.image ?? "",
        });
        setQuestionDialogOpen(true);
    };

    const handleSaveQuiz = async () => {
        const trimmedTitle = quizForm.title.trim();
        const trimmedDescription = quizForm.description.trim();
        const trimmedIcon = quizForm.icon.trim();

        if (!trimmedTitle || !trimmedDescription) {
            setError("Название и описание теста обязательны");
            return;
        }
        const payload = {
            title: trimmedTitle,
            description: trimmedDescription,
            icon: trimmedIcon,
        };
        const validationError = validateQuizForm(payload);
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError(null);
        try {

            if (editingQuizId) {
                const updated = await updateQuizData(editingQuizId, payload);
                setQuizzes((prev) =>
                    prev.map((quiz) =>
                        (quiz.id ?? quiz._id) === editingQuizId ? { ...quiz, ...updated } : quiz
                    )
                );
            } else {
                const created = await createQuiz(payload);
                setQuizzes((prev) => [...prev, created]);
                setSelectedQuizId(created.id ?? created._id ?? null);
            }
            resetQuizDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось сохранить тест");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteQuiz = async () => {
        if (!selectedQuizId) return;
        try {
            await deleteQuizData(selectedQuizId);
            const nextQuizzes = quizzes.filter((quiz) => (quiz.id ?? quiz._id) !== selectedQuizId);
            setQuizzes(nextQuizzes);
            setSelectedQuizId(nextQuizzes[0]?.id ?? nextQuizzes[0]?._id ?? null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось удалить тест");
        }
    };

    const handleSaveQuestion = async () => {
        if (!selectedQuizId) return;
        const question = questionForm.question.trim();
        const options = questionForm.options
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);
        const answer = Number(questionForm.answer);
        const image = questionForm.image.trim() || undefined;

        if (!question || options.length < 2) {
            setError("У вопроса должен быть текст и минимум два варианта ответа");
            return;
        }

        if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) {
            setError("Индекс правильного ответа должен указывать на существующий вариант");
            return;
        }

        setSaving(true);
        setError(null);

        const payload = {
            question,
            options,
            answer,
            image,
        };
        const validationError = validateQuestionForm(payload);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            if (editingQuestionId) {
                const updated = await updateQuizQuestion(selectedQuizId, editingQuestionId, payload);
                setQuestions((prev) =>
                    prev.map((question) =>
                        (question._id ?? question.id) === editingQuestionId ? updated : question
                    )
                );
            } else {
                const created = await createQuizQuestion(selectedQuizId, payload);
                setQuestions((prev) => [...prev, created]);
            }
            resetQuestionDialog();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось сохранить вопрос");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!selectedQuizId) return;
        try {
            await deleteQuizQuestion(selectedQuizId, questionId);
            setQuestions((prev) => prev.filter((question) => (question._id ?? question.id) !== questionId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось удалить вопрос");
        }
    };

    const handleQuestionFileChange = async (file: File | null) => {
        if (!file) return;
        const validationError = validateImageFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            const image = await fileToDataUrl(file);
            setQuestionForm((prev) => ({ ...prev, image, imageMode: "file" }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить файл изображения");
        }
    };

    const handleQuizFileChange = async (file: File | null) => {
        if (!file) return;
        const validationError = validateImageFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            const icon = await fileToDataUrl(file);
            setQuizForm((prev) => ({ ...prev, icon, iconMode: "file" }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось загрузить файл иконки");
        }
    };

    return (
        <Box className="quiz-selection-container" sx={{ p: { xs: 1.5, md: 3 } }}>
            <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems="stretch">
                <Box
                    sx={{
                        width: { xs: "100%", lg: 360 },
                        flexShrink: 0,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        p: 2,
                    }}
                >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5">Тесты</Typography>
                        <Button variant="contained" onClick={openCreateQuizDialog}>
                            Добавить
                        </Button>
                    </Stack>

                    <List sx={{ maxHeight: "70vh", overflow: "auto" }}>
                        {quizzes.map((quiz) => {
                            const quizId = quiz.id ?? quiz._id ?? "";
                            return (
                                <ListItemButton
                                    key={quizId}
                                    selected={quizId === selectedQuizId}
                                    onClick={() => setSelectedQuizId(quizId)}
                                >
                                    <ListItemText primary={quiz.title} secondary={quiz.description} />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>

                <Box sx={{ flex: 1, bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} mb={2}>
                        <Box>
                            <Typography variant="h5">
                                {selectedQuiz ? selectedQuiz.title : "Выберите тест"}
                            </Typography>
                            {selectedQuiz && (
                                <Typography color="text.secondary">{selectedQuiz.description}</Typography>
                            )}
                        </Box>
                        {selectedQuiz && (
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
                                <Button variant="outlined" onClick={openEditQuizDialog} sx={{ width: { xs: "100%", sm: "auto" } }}>
                                    Редактировать тест
                                </Button>
                                <Button color="error" variant="outlined" onClick={handleDeleteQuiz} sx={{ width: { xs: "100%", sm: "auto" } }}>
                                    Удалить тест
                                </Button>
                                <Button variant="contained" onClick={openCreateQuestionDialog} sx={{ width: { xs: "100%", sm: "auto" } }}>
                                    Добавить вопрос
                                </Button>
                            </Stack>
                        )}
                    </Stack>

                    {error && (
                        <Typography color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {!selectedQuiz && !loading && (
                        <Typography color="text.secondary">Выберите тест слева или создайте новый.</Typography>
                    )}

                    {selectedQuiz && (
                        <Stack spacing={2}>
                            {questions.map((question, index) => {
                                const questionId = question._id ?? question.id ?? "";
                                return (
                                    <Box
                                        key={questionId}
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                            borderRadius: 2,
                                            p: 2,
                                        }}
                                    >
                                        <Stack
                                            direction={{ xs: "column", md: "row" }}
                                            justifyContent="space-between"
                                            spacing={2}
                                            mb={1}
                                        >
                                            <Typography fontWeight={700}>
                                                {index + 1}. {question.question}
                                            </Typography>
                                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", md: "auto" } }}>
                                                <Button size="small" onClick={() => openEditQuestionDialog(question)} sx={{ width: { xs: "100%", sm: "auto" } }}>
                                                    Изменить
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteQuestion(questionId)}
                                                    sx={{ width: { xs: "100%", sm: "auto" } }}
                                                >
                                                    Удалить
                                                </Button>
                                            </Stack>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Правильный ответ: {question.answer + 1}
                                        </Typography>
                                        <List dense>
                                            {question.options.map((option, optionIndex) => (
                                                <ListItemText
                                                    key={`${questionId}-${optionIndex}`}
                                                    primary={`${optionIndex + 1}. ${option}`}
                                                />
                                            ))}
                                        </List>
                                        {question.image && (
                                            <Box sx={{ mt: 1 }}>
                                                <img
                                                    src={resolveAssetUrl(question.image)}
                                                    alt={question.question}
                                                    style={{
                                                        display: "block",
                                                        maxWidth: "100%",
                                                        maxHeight: 220,
                                                        objectFit: "contain",
                                                        borderRadius: 12,
                                                    }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Stack>
                    )}
                </Box>
            </Stack>

            <Dialog open={quizDialogOpen} onClose={resetQuizDialog} fullWidth maxWidth="sm" fullScreen={isMobile}>
                <DialogTitle>{editingQuizId ? "Редактировать тест" : "Создать тест"}</DialogTitle>
                <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
                    <TextField
                        label="Название"
                        value={quizForm.title}
                        onChange={(e) => setQuizForm((prev) => ({ ...prev, title: e.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Описание"
                        value={quizForm.description}
                        onChange={(e) => setQuizForm((prev) => ({ ...prev, description: e.target.value }))}
                        multiline
                        minRows={3}
                        fullWidth
                    />
                    <TextField
                        label="Иконка (путь или URL)"
                        value={quizForm.iconMode === "url" ? quizForm.icon : ""}
                        onChange={(e) =>
                            setQuizForm((prev) => ({ ...prev, iconMode: "url", icon: e.target.value }))
                        }
                        fullWidth
                    />
                    <Button variant="outlined" component="label">
                        Загрузить файл иконки
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => void handleQuizFileChange(e.target.files?.[0] ?? null)}
                        />
                    </Button>
                    {quizForm.icon && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Предпросмотр иконки
                            </Typography>
                            <img
                                src={resolveAssetUrl(quizForm.icon)}
                                alt="quiz icon preview"
                                style={{
                                    display: "block",
                                    width: 160,
                                    height: 160,
                                    maxWidth: "100%",
                                    objectFit: "contain",
                                    borderRadius: 12,
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetQuizDialog}>Отмена</Button>
                    <Button onClick={handleSaveQuiz} disabled={saving} variant="contained">
                        {editingQuizId ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={questionDialogOpen} onClose={resetQuestionDialog} fullWidth maxWidth="md" fullScreen={isMobile}>
                <DialogTitle>{editingQuestionId ? "Редактировать вопрос" : "Создать вопрос"}</DialogTitle>
                <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
                    <TextField
                        label="Текст вопроса"
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm((prev) => ({ ...prev, question: e.target.value }))}
                        multiline
                        minRows={2}
                        fullWidth
                    />
                    <TextField
                        label="Варианты ответов, по одному на строку"
                        value={questionForm.options}
                        onChange={(e) => setQuestionForm((prev) => ({ ...prev, options: e.target.value }))}
                        multiline
                        minRows={4}
                        fullWidth
                    />
                    <TextField
                        label="Индекс правильного ответа"
                        type="number"
                        value={questionForm.answer}
                        onChange={(e) =>
                            setQuestionForm((prev) => ({ ...prev, answer: Number(e.target.value) || 0 }))
                        }
                        inputProps={{ min: 0 }}
                        fullWidth
                    />
                    <TextField
                        label="Картинка по ссылке"
                        value={questionForm.imageMode === "url" ? questionForm.image : ""}
                        onChange={(e) =>
                            setQuestionForm((prev) => ({ ...prev, imageMode: "url", image: e.target.value }))
                        }
                        fullWidth
                    />
                    <Button variant="outlined" component="label">
                        Загрузить файл картинки
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => void handleQuestionFileChange(e.target.files?.[0] ?? null)}
                        />
                    </Button>
                    {questionForm.image && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Предпросмотр изображения
                            </Typography>
                            <img
                                src={resolveAssetUrl(questionForm.image)}
                                alt="question preview"
                                style={{
                                    display: "block",
                                    maxWidth: "100%",
                                    maxHeight: 240,
                                    objectFit: "contain",
                                    borderRadius: 12,
                                }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetQuestionDialog}>Отмена</Button>
                    <Button onClick={handleSaveQuestion} disabled={saving} variant="contained">
                        {editingQuestionId ? "Сохранить" : "Создать"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
