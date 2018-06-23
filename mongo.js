const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/habr_blockhain_notifier');
const db = mongoose.connection;

db.on('error', e => console.error('Сonnection error:', e.message));
db.once('open', () => console.info('Connected to DB!'));

const FeedItem = new mongoose.Schema({
  link: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

const FeedItemModel = mongoose.model('FeedItem', FeedItem);

function isAlreadyPosted(link) {
  return FeedItemModel.find({ link }).then(r => !!r.length);
}

function setIsPosted(link) {
  console.log('save link', link);
  return new FeedItemModel({ link }).save();
}

module.exports = {
  isAlreadyPosted,
  setIsPosted,
};
