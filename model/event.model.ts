import { Schema, model, models, Document } from "mongoose";
import mongoose from "mongoose";

export interface iEvent extends Document {
  eventName: string;
  image: string;
  description: string;
  feature: boolean;
  club: mongoose.Schema.Types.ObjectId;
  organizer: string;
  approved: boolean;
  date: Date|undefined;
  seats: number;
}

const EventSchema = new Schema<iEvent>(
  {
    eventName: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    feature: { type: Boolean, required: true },
    club: { type: mongoose.Types.ObjectId, ref: 'Club', required: true },
    organizer: { type: String, required: true },
    approved: { type: Boolean, required: true },
    date: { type: Date, required: true },
    seats: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Event = models.Event || model<iEvent>("Event", EventSchema);

export default Event;
