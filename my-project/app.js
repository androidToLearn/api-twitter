// app.js

const express = require('express');
const app = express();
const PORT = 3000;
const querystring = require('querystring');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');
const axios = require('axios');

const { text } = require('stream/consumers');
const { stat } = require('fs');


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.get('/', (req, res) => {
    res.send('שלום מהשרת!');
});

app.get('', (req, res) => {
    const { oauth_token, oauth_verifier } = req.query;
    console.log('Twitter החזיר אותנו עם:', oauth_token, oauth_verifier);
    res.send('קיבלנו Callback מטוויטר!');
});

app.listen(PORT, () => {
    console.log(`השרת פועל בכתובת https://api-twitter-07e3.onrender.com:${PORT}`);
});



// הגדר את המפתחות שלך
const consumerKey = 'NBQW7Sxz22RhofCr5FcvzwXw3';
const consumerSecret = 'jHyUhYKoZ6sbECwpHqcAvmMhX8IMknsedhBBHZEXrl9eCEJ7yz';

const oauth = OAuth({
    consumer: { key: consumerKey, secret: consumerSecret },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    },
});


const request_data = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: {
        oauth_callback: 'https://api-twitter-07e3.onrender.com/twitter/callback/twitter/callback'  // כי האפליקציה Desktop
    }
};


const headers = oauth.toHeader(oauth.authorize(request_data));
//headers['Content-Type'] = 'application/x-www-form-urlencoded';


console.log('send to authentication...')
axios.post(request_data.url, null, { headers })
    .then(response => {
        console.log('request_token response:', response.data);
        const responseParams = querystring.parse(response.data);

        const oauth_token = responseParams.oauth_token;
        const oauth_token_secret = responseParams.oauth_token_secret;
        console.log(oauth_token)
        console.log(oauth_token_secret)

        console.log('send to twitter...')

        // מפה תוכל לחלץ את oauth_token ולהפנות את המשתמש
        tweetToTwitter("hello there! this is post from api node.js programming", oauth_token, oauth_token_secret);

    })
    .catch(error => {
        console.error('שגיאה בקבלת request_token:', error.response?.data || error.message);
    });

function tweetToTwitter(statusText, oath_token, oauth_token_secret) {
    const oauth_timestamp = Math.floor(Date.now() / 1000);
    const oauth_nonce = generateNonce();
    const api_key = 'NBQW7Sxz22RhofCr5FcvzwXw3'


    const request_data = {
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        method: 'POST',
        data: { status: 'Hello world!' },
    };

    const token = {
        key: oath_token,
        secret: oauth_token_secret,
    };

    const oauthData = oauth.authorize(request_data, token);
    console.log(oauthData)
    const oauthHeader = `OAuth ` +
        `oauth_consumer_key="${encodeURIComponent(oauthData.oauth_consumer_key)}", ` +
        `oauth_token="${encodeURIComponent(oauthData.oauth_token)}", ` +
        `oauth_signature_method="${encodeURIComponent(oauthData.oauth_signature_method)}", ` +
        `oauth_timestamp="${encodeURIComponent(oauthData.oauth_timestamp)}", ` +
        `oauth_nonce="${encodeURIComponent(oauthData.oauth_nonce)}", ` +
        `oauth_version="${encodeURIComponent(oauthData.oauth_version)}", ` +
        `oauth_signature="${encodeURIComponent(oauthData.oauth_signature)}"`;


    // מקודדים את הטקסט לצורך שימוש בגוף הבקשה (כמו HTML form)
    const body = querystring.stringify({ status: statusText });

    fetch("https://api.x.com/1.1/statuses/update.json?include_entities=true", {
        method: "POST",
        headers: {
            "Authorization": oauthHeader,
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "",
            "Connection": "close"
        },
        body: body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Tweet failed with status " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("Tweet sent:", data);
        })
        .catch(error => {
            console.error("Error tweeting:", error);
        });


}

// קריאה לדוגמה:
function getOAuthSignature(baseString, signingKey) {
    const shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.setHMACKey(signingKey, "TEXT");
    shaObj.update(baseString);
    return shaObj.getHMAC("B64");
}