import { QuizDbModel } from '../validators/quiz.schema.js';
export async function importQuizFromJson(req, res) {
    let payload;
    if (req.body?.filePath) {
        const fs = await import('node:fs/promises');
        const text = await fs.readFile(req.body.filePath, 'utf-8');
        payload = JSON.parse(text);
    }
    else {
        payload = req.body;
    }
    // Минимальная проверка
    if (!payload?.title || !Array.isArray(payload?.questions) || payload.questions.length === 0) {
        return res.status(400).json({ error: 'Invalid quiz JSON' });
    }
    // Сохраняем
    const created = await QuizDbModel.create(payload);
    // Переводим в plain и убираем ответы
    const plain = created.toObject();
    const safe = {
        ...plain,
        questions: plain.questions.map(({ answer, ...rest }) => rest)
    };
    return res.status(201).json(safe);
}
