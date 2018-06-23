const feed = require('feed-read');
const c = require('./config.json');
const { IncomingWebhook } = require('@slack/client');
const R = require('ramda');
const {
  isAlreadyPosted,
  setIsPosted,
} = require('./mongo');

const webhook = new IncomingWebhook(c.SLACK_HOOK_URL, {
  unfurl_links: true,
  channel: c.CHANNEL,
});

function send(link) {
  return new Promise((resolve, reject) => {
    webhook.send(link, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(link);
      }
    });
  });
}


setInterval(() => {
  Promise.all(c.KEYWORDS.map(word => new Promise((resolve) => {
    feed(`${c.BASE_RSS_PATH}?q=${word}`, (err, list) => {
      if (err) {
        console.error(err);
        resolve([]);
        return;
      }
      resolve(list.map(l => l.link.split('?')[0]));
    });
  }))).then(R.pipe(R.flatten, R.uniq)).then((links) => {
    links.forEach(link => isAlreadyPosted(link).then((isPosted) => {
      if (!isPosted) {
        send(link).then(setIsPosted).catch(console.error);
      }
    }));
  });
}, c.INTERVAL);

