goog.provide('openmultimedia.externals.twitter.TweetCache');

openmultimedia.externals.twitter.TweetCache = function(opt_options) {
  this.setOptions(opt_options);

  this.tweetsByScreenName_ = {};
  this.tweetsById_ = {};
};

openmultimedia.externals.twitter.TweetCache.prototype.options_ = {
  'timeout': 60 * 5
}

openmultimedia.externals.twitter.tweetsByScreenName_ = null;

openmultimedia.externals.twitter.tweetsById_ = null;

openmultimedia.externals.twitter.TweetCache.prototype.getTweets = function (key) {};

openmultimedia.externals.twitter.TweetCache.prototype.setTweets = function(key, tweets) {
  
}