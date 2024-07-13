import { Schema, model, models, Document } from "mongoose";

export interface IClub extends Document {
    clubName: string;
    studentRepName: string;
    studentRepEmail: string;
    studentRepUid: string;
}

const ClubSchema = new Schema<IClub>(
    {
        clubName: { type: String, required: true },
        studentRepName: { type: String, required: true },
        studentRepEmail: { type: String, required: true },
        studentRepUid: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: true } }
);

const Club = models.Club || model<IClub>("Club", ClubSchema);

export default Club;
