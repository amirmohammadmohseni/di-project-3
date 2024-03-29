import bcrypt from 'bcrypt'
import { User, Question, Answer, Notification } from '../models'

async function updateUser(req, res) {
  const { name, password, favoriteTopics, masterAtTopics } = req.body
  const hash = bcrypt.hashSync(password, 10)
  const updated = await User.updateOne(
    { username },
    {
      name,
      username: username.toLowerCase(),
      password: hash,
      favoriteTopics: favoriteTopics.split(':'),
      masterAtTopics: masterAtTopics.split(':')
    },
    { new: true }
  ).lean()
  res.json(updated)
}
async function getMyProfile(req, res) {
  const questions = await Question.find({ questioner: req.user._id, type: 'PUBLIC' })
    .sort({ askedAt: -1 })
    .limit(3)
    .lean()
  const myLastQuestions = questions.map((q) => {
    const { __v, questioner, type, ...rest } = q
    return rest
  })
  const answers = await Answer.find({ answerer: req.user._id })
    .sort({ answeredAt: -1 })
    .limit(3)
    .lean()
  const myLastAnswers = answers.map((a) => {
    const { __v, question, answerer, ...rest } = a
    return rest
  })
  res.json({ name: req.user.name, myLastQuestions, myLastAnswers })
}

async function getUserInfo(req, res) {
  const { username } = req.query
  const user = await User.findOne({ username }).lean()
  if (user) {
    const { password, joinedAt, __v, _id, ...userRemainder } = user
    const questions = await Question.find({ questioner: _id, type: 'PUBLIC' })
      .sort({ upvotesCount: -1 })
      .limit(3)
    const topQuestions = questions.map((q) => {
      const { __v, questioner, type, ...rest } = q
      return rest
    })
    const answers = await Answer.find({ answerer: _id })
      .sort({ upvotesCount: -1 })
      .limit(3)
    const topAnswers = questions.map((a) => {
      const { __v, question, answerer, ...rest } = a
      return rest
    })
    res.json({ user: userRemainder, topQuestions, topAnswers })
  } else res.send('Not Found!')
}

async function getMyNotifications(req, res) {
  const notifs = await Notification.find({ destUser: req.user._id, seen: false }).sort({ createdAt: -1 })
  await Notification.updateMany({ seen: false }, { $set: { seen: true } })
  const resolvedNotifs = notifs.map((n) => {
    const r = { type: n.type }
    if (n.type === 'ANSWER_REQUEST') {
      r.question = n.question
    } else if (n.type === 'COMMENT_ON_ANSWER') {
      r.comment = n.comment
    } else if (n.type === 'ANSWER_ON_QUESTION') {
      r.answer = n.answer
    }
    r.createdAt = n.createdAt
    return r
  })
  res.json({ unseenNotifications: resolvedNotifs })
}

async function upsertSU() {
  const hash = bcrypt.hashSync('123456', 10)
  const a = await User.updateOne(
    { username: 'admin' },
    {
      name: 'Admin',
      username: 'admin',
      password: hash,
      favoriteTopics: ['science'],
      masterAtTopics: ['science']
    },
    { upsert: true, setDefaultsOnInsert: true }
  )
  return 'SU ' + JSON.stringify(a)
}

module.exports = {
  getUserInfo,
  upsertSU,
  updateUser,
  getMyProfile,
  getMyNotifications
}
