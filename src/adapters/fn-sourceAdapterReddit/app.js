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
        const subreddit = await r.getSubreddit('AskReddit');
        const newPosts = await subreddit.getNew({limit : 1});

        let data = [];

        console.log(JSON.stringify(newPosts))

        newPosts.forEach((post) => {
            data.push({
              text: post.title
            })
          });

        console.log(data[0].text);
        var params = {
            Entries: [
                {
                    Detail: JSON.stringify({ text: data[0].text }),
                    DetailType: 'New post',
                    EventBusName: 'Kaasje-htf-2021-reddit',
                    Resources: [
                        'arn:aws:events:eu-west-1:128894441789:event-bus/Kaasje-htf-2021-reddit'
                    ],
                    Source: 'com.reddit.listing',
                    Time: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789
                }

            ]
        }
        // STEP 2: Publish Reddit events to EventBridges with Source: 'com.reddit.listing'
        var res = await eventbridge.putEvents(params).promise();
        console.log(res)
        return "succesfully finished"
    } catch (err) {
        console.log(err);
        throw err
    }
};
