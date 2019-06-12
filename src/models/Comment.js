import { Schema } from 'mongoose'

const schema = new Schema({
  commenter: { type: Schema.Types.ObjectId, required: true },
  commentOn: { type: String, required: true, enum: ['Q', 'A'] },
  replyTo: { type: Schema.Types.ObjectId, required: true, index: true },
  replyToComment: { type: Schema.Types.ObjectId },
  upvotesCount: { type: Number, default: 0 },
  commentedAt: { type: Date, default: Date.now }
})

module.exports = schema