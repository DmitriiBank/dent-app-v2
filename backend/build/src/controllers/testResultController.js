import { TestResult } from "../validators/testResult.schema.js";
export const saveTestResult = async (req, res, next) => {
    if (!req.body.tour)
        req.body.quiz = req.params.quizId;
    if (!req.body.user)
        req.body.user = req.user.id;
    const testResults = await TestResult.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            testResults,
        },
    });
};
