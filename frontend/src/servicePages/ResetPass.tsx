import {useState} from "react";
import {resetPassword} from "../services/authApi.ts";
import {useParams} from "react-router-dom";
import ResetPasswordForm from "../templates/ResetPasswordForm.tsx";

const ResetPass = () => {
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const {token} = useParams();
    if (!token) throw new Error("Broken URL");

    const handleResPas = async (password: string, passwordConfirm: string): Promise<void> => {
        try {
            const res = await resetPassword(token, password, passwordConfirm);
            if (!res) throw new Error('Данные почты не переданы');
        } catch (err) {
            console.error(err);
            setErrorCode('default');
        }
    };

    return (
        <div>
            <ResetPasswordForm
                submitFunc={handleResPas}
                serverErrorKey={errorCode}
            />
        </div>
    );
};

export default ResetPass;