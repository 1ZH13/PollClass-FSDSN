import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    votes: { type: Number, default: 0 },
  },
  { _id: false }
);

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  options: { type: [optionSchema], required: true, validate: [(arr: unknown[]) => Array.isArray(arr) && arr.length >= 2, 'Minimum 2 options required'] },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
});

const Poll = mongoose.models.Poll || mongoose.model('Poll', pollSchema);
export default Poll;
