import {Schema, model} from "mongoose";



export const tokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "UserDbModel",
        required: true
    },
    refreshToken: {
        type: String,
        required: true,
    },
})


export const TokenDbModel = model('Token', tokenSchema);
