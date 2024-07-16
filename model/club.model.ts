import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IClub extends Document {
    clubName: string;
    studentRepName: string;
    studentRepEmail: string;
    studentRepUid: string;
    studentRepId:mongoose.Types.ObjectId;
    facultyAdvId:mongoose.Types.ObjectId;
    facultyAdvName:string;
    facultyAdvUid:string;
}

const ClubSchema = new Schema<IClub>(
    {
        clubName: { type: String, required: true },
        studentRepName: { type: String, required: true },
        studentRepEmail: { type: String, required: true },
        studentRepUid: { type: String, required: true },
        studentRepId: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
        facultyAdvId: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
        facultyAdvName: {type:String,required: true },
        facultyAdvUid: {type:String,required: true }
    },
    { timestamps: { createdAt: true, updatedAt: true } }
);

const Club = models.Club || model<IClub>("Club", ClubSchema);

export default Club;
