import {useState} from "react";
import RestorePasswordForm from "../templates/RestorePasswordForm.tsx";
import {forgotPassword} from "../services/authApi.ts";

const RestorePass = () => {
    const [errorCode, setErrorCode] = useState<string | null>(null);


    const handleRestorePas = async (email: string): Promise<void> => {
        try {
            const res = await forgotPassword(email);
            if (!res) throw new Error('Данные почты не переданы');
        } catch {
            setErrorCode('default');
        }
    };

    return (
        <div>
            <RestorePasswordForm
                submitFunc={handleRestorePas}
                serverErrorKey={errorCode}
            />
        </div>
    );
};

export default RestorePass;
