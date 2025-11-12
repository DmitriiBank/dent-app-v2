import {User} from "../model/User";

export interface AccountService {
      updatePassword:  (userId: string, passwordCurrent: string, newPassword: string, newPasswordConfirm: string) => Promise<User>;
    }