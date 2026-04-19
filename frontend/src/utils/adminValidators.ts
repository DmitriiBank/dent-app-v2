import type { AdminUserFormData } from "../types/User.ts";
import type { Question, Quiz } from "../types/quiz-types.ts";

const MAX_IMAGE_FILE_SIZE = 3 * 1024 * 1024;
const MAX_ASSET_LENGTH = 5 * 1024 * 1024;

export const validateAssetReference = (value?: string | null) => {
    const trimmed = value?.trim() ?? "";
    if (!trimmed) return null;

    if (trimmed.length > MAX_ASSET_LENGTH) {
        return "Изображение слишком большое";
    }

    if (/^(https?:\/\/|data:image\/|blob:|\/|[A-Za-z0-9._/-]+)/i.test(trimmed)) {
        return null;
    }

    return "Укажите корректный URL, data:image или локальный путь";
};

export const validateImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
        return "Можно загружать только изображения";
    }

    if (file.size > MAX_IMAGE_FILE_SIZE) {
        return "Файл изображения не должен превышать 3 МБ";
    }

    return null;
};

export const validateQuizForm = (data: Pick<Quiz, "title" | "description" | "icon">) => {
    if (!data.title.trim() || data.title.trim().length < 3) {
        return "Название теста должно содержать минимум 3 символа";
    }

    if (!data.description.trim() || data.description.trim().length < 10) {
        return "Описание теста должно содержать минимум 10 символов";
    }

    return validateAssetReference(data.icon);
};

export const validateQuestionForm = (data: Pick<Question, "question" | "options" | "answer" | "image">) => {
    if (!data.question.trim() || data.question.trim().length < 5) {
        return "Текст вопроса должен содержать минимум 5 символов";
    }

    if (data.options.length < 2) {
        return "Нужно указать минимум два варианта ответа";
    }

    if (data.options.some((option) => !option.trim())) {
        return "Варианты ответа не должны быть пустыми";
    }

    if (!Number.isInteger(data.answer) || data.answer < 0 || data.answer >= data.options.length) {
        return "Индекс правильного ответа должен указывать на существующий вариант";
    }

    return validateAssetReference(data.image);
};

export const validateAdminUserForm = (data: AdminUserFormData, isEdit: boolean) => {
    if (!data.name.trim() || data.name.trim().length < 2) {
        return "Имя должно содержать минимум 2 символа";
    }

    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return "Укажите корректный email";
    }

    if (!isEdit) {
        if (!data.password || data.password.length < 8) {
            return "Пароль должен содержать минимум 8 символов";
        }

        if (data.password !== data.passwordConfirm) {
            return "Пароли не совпадают";
        }
    }

    return validateAssetReference(data.avatar);
};
