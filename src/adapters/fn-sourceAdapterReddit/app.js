const AWS = require('aws-sdk')
var eventbridge = new AWS.EventBridge({apiVersion: '2015-10-07'});
const snoowrap = require('snoowrap')
/*

* https://www.reddit.com/prefs/apps
* https://github.com/reddit-archive/reddit/wiki/OAuth2-Quick-Start-Example
* https://not-an-aardvark.github.io/snoowrap/Subreddit.html#getNew__anchor

*/

const r = new snoowrap({
    
});


exports.lambdaHandler = async ( event ) => {
    try {
        console.log(JSON.stringify(event))
        // STEP 1: Poll for new reddit entries
        let newlist = r.getSubreddit('AskReddit').getNew()
        // STEP 2: Publish Reddit events to EventBridges with Source: 'com.reddit.listing'
        eventbridge.putEvents(newlist);
        return "succesfully finished"
    } catch (err) {
        console.log(err);
        throw err
    }
};
