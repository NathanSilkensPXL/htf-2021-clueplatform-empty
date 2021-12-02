
const AWS = require('aws-sdk')

var translate = new AWS.Translate({apiVersion: '2017-07-01'});
var comprehend = new AWS.Comprehend({apiVersion: '2017-11-27'});
var eventbridge = new AWS.EventBridge({apiVersion: '2015-10-07'});

const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ar', 'hi', 'ja', 'ko', 'zh', 'zh-TW'];

exports.lambdaHandler = async ( event ) => {

    try {

        // STEP 1: Log incoming event and environment variables
        console.log("Received event: " + JSON.stringify(event))
        console.log("IdentifiedCluesEventbusArn: " + process.env.IdentifiedCluesEventbusArn )   
        
        // STEP 2: Perform Analysis
        var analysis = await analyseText(event.text)

        // STEP 3: Create enriched event
        var identifiedclueEvent = {
            source: event.source,
            text: event.text,
            language: analysis.detectedLanguage,
            sentiment: analysis.sentiment
        }

        console.log(JSON.stringify(identifiedclueEvent))

        // STEP 4: Publish to configured EventBridge Eventbus
        var params = {
            Entries: [
                {
                    Detail: JSON.stringify(identifiedclueEvent),
                    DetailType: 'Identified clue',
                    EventBusName: 'Kaasje-htf-2021-IdentifiedClues',
                    Resources: [
                        'arn:aws:events:eu-west-1:128894441789:event-bus/Kaasje-htf-2021-IdentifiedClues'
                    ],
                    Source: 'be.i8c.htf.demo.identifiedclue',
                    Time: new Date || 'Wed Dec 31 1969 16:00:00 GMT-0800 (PST)' || 123456789
                }

            ]
        }

        var res = await eventbridge.putEvents(params).promise();
        console.log(res)
        return "succesfully finished"
    } catch (err) {
        console.log(err);
        throw err
    }
};

async function analyseText(text) {

    //  STEP 1: Detect language
    var paramsDetectLanguage =  {
        Text: text
    }
    var detectedLanguage = await comprehend.detectDominantLanguage(paramsDetectLanguage).promise()
    console.log("Detected languages: " + JSON.stringify(detectedLanguage))

    // STEP 2: Translate to english if language is not supported
    var translatedLanguage = null;

    if(supportedLanguages.indexOf(detectedLanguage) == -1){
        var params = {
            SourceLanguageCode: detectedLanguage.Languages[0].LanguageCode, 
            TargetLanguageCode: 'en', 
            Text: text
        };
        translatedLanguage = await translate.translateText(params).promise();
    };
    console.log("Translated text: " + JSON.stringify(translatedLanguage))

    // STEP 3: Detect Sentiment
    var postLanguageCode;

    if(translatedLanguage != null){
        postLanguageCode = "en";
    }else{
        postLanguageCode = detectedLanguage.Languages[0].LanguageCode;
    }
    var params = {
        LanguageCode: postLanguageCode,
        Text: text
    };

    var sentiment = await comprehend.detectSentiment(params).promise();
    console.log("Sentiment: " + JSON.stringify(sentiment))
    return {
        detectedLanguage: translatedLanguage,
        sentiment: sentiment.Sentiment
    }
}
