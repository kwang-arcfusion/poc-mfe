// hosts/knowesis/remotes.config.js

// 1. Read values directly from process.env
const remoteUrls = {
  ask_ai: process.env.REMOTE_URL_ASK_AI,
  // home: process.env.REMOTE_URL_HOME, // 🗑️ ลบออก
  stories: process.env.REMOTE_URL_STORIES,
  overview: process.env.REMOTE_URL_OVERVIEW,
};

/**
 * example
 * ask_ai@localhost:3001/remoteEntry.js
 */
const remotes = Object.keys(remoteUrls).reduce((acc, key) => {
  acc[key] = `${key}@${remoteUrls[key]}/remoteEntry.js`;
  return acc;
}, {});

module.exports = remotes;
