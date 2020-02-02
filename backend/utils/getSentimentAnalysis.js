require("dotenv").config();
const getSentimentAnalysis = async text => {
  // Imports the Google Cloud client library
  const language = require("@google-cloud/language");

  // Instantiates a client
  const client = new language.LanguageServiceClient();

  const document = {
    content: text,
    type: "PLAIN_TEXT"
  };

  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({ document: document });
  const sentiment = result.documentSentiment;

  return { score: sentiment.score, magnitude: sentiment.magnitude };
};

module.exports = getSentimentAnalysis;
