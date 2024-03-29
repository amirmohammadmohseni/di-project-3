import mongoose from 'mongoose'
import Promise from 'bluebird'

import UserSchema from './User'
import AnswerSchema from './Answer'
import CommentSchema from './Comment'
import NotificationSchema from './Notification'
import QuestionSchema from './Question'
import QuestionTopicSchema from './QuestionTopic'
import TopicSchema from './Topic'
import VoteSchema from './Vote'

mongoose.Promise = Promise
mongoose.set('useCreateIndex', true)
mongoose.connect('mongodb://mongo:27017/quora', { useNewUrlParser: true })

export const Comment = mongoose.model('Comment', CommentSchema)
export const Vote = mongoose.model('Vote', VoteSchema)
export const Topic = mongoose.model('Topic', TopicSchema)
export const QuestionTopic = mongoose.model('QuestionTopic', QuestionTopicSchema)
export const Question = mongoose.model('Question', QuestionSchema)
export const Notification = mongoose.model('Notification', NotificationSchema)
export const Answer = mongoose.model('Answer', AnswerSchema)
export const User = mongoose.model('User', UserSchema)
