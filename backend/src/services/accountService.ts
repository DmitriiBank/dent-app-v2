

import {User} from "../model/User.ts";
import mongoose from "mongoose";

export interface AccountService {
    // hireEmployee: (employee: Employee, actorId:string, actorRoles: Roles[]) => Promise<Employee>;
    // fireEmployee: (empId:string, actorId:string, actorRoles: Roles[]) => Promise<SavedFiredEmployee>;
    // updateEmployee: (empId:string , employee: EmployeeDto, actorId:string, actorRoles: Roles[]) => Promise<Employee>;
    updatePassword:  (userId: string, passwordCurrent: string, newPassword: string, newPasswordConfirm: string) => Promise<User>;
    // getEmployeeById: (id: string) => Promise<Employee>;
    // getAllEmployees: () => Promise<SavedFiredEmployee[]>;
    // setRole: (id:string, newRole:string, actorId:string, actorRoles: Roles[]) => Promise<Employee>;
}