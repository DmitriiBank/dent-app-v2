import { accountServiceImplMongo as service } from "../services/AccountServiceImplMongo.js";
import { HttpError } from "../errorHandler/HttpError.js";
import { convertUserDtoToUser } from "../utils/tools.js";
export const addAccount = async (req, res) => {
    const body = req.body;
    const reader = await convertUserDtoToUser(body);
    await service.addAccount(reader);
    res.status(201).send();
};
export const getAccount = async (req, res) => {
    const { userID } = req.query;
    if (!userID)
        throw new HttpError(400, "Invalid ID");
    const result = await service.getAccount(userID);
    return res.status(200).json(result);
};
export const changePassword = async (req, res) => {
    const { id, newPassword } = req.body;
    if (!id || !newPassword)
        throw new HttpError(400, "Data invalid");
    await service.changePassword(id, newPassword);
    res.status(200).send();
};
export const changeUserData = async (req, res) => {
    const { id, newUserName, newEmail, newBirthdate } = req.body;
    if (!id)
        throw new HttpError(400, "Data invalid");
    await service.changeUserData(id, newUserName, newEmail, newBirthdate);
    res.status(200).send();
};
export const changeUserRole = async (req, res) => {
    const { id, newRole } = req.body;
    if (!id)
        throw new HttpError(400, "Data invalid");
    await service.changeUserRole(id, newRole);
    res.status(200).send();
};
export const removeAccount = async (req, res) => {
    const { id } = req.query;
    if (!id)
        throw new HttpError(400, "Invalid ID");
    const result = await service.removeAccount(id);
    return res.status(200).json(result);
};
