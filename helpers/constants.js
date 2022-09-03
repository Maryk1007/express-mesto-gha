const regexURL = /^https?:\/\/[-a-zA-Z\d]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/i;
const SALT_ROUNDS = 10;

module.exports = { regexURL, SALT_ROUNDS };
