import { UserZodSchema } from "@/schema/user.schema";
import { user } from "@/types/user.types";
import { Schema, model , models } from "mongoose";
import z from "zod";




const userSchema = new Schema<user>({
    username: {
        type : String,
        require: true,

    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true
    }
}, {
timestamps: true
})


type User = z.infer<typeof UserZodSchema>;

export const User = models.User ||  model<user>("User",userSchema)