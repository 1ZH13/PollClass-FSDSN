import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true, index: true },
  optionIndex: { type: Number, required: true },
  voterEmail: { type: String, required: true, trim: true, lowercase: true },
  voterName: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

voteSchema.index({ pollId: 1, voterEmail: 1 }, { unique: true });

const Vote = mongoose.models.Vote || mongoose.model('Vote', voteSchema);
export default Vote;
