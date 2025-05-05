const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read';
  res.redirect(
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      show_dialog: true
    })
  );
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const error = req.query.error;

  if (error) {
    console.error('Spotify Auth Error:', error);
    return res.send(`Authentication failed: ${error}`);
  }

  try {
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
      }),
      headers: {
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const tokenResponse = await axios(authOptions);
    const { access_token, refresh_token } = tokenResponse.data;

    res.send(`
        <h1>Authentication Successful!</h1>
        <p>Access Token: ${access_token}</p>
        <p>Refresh Token: ${refresh_token}</p>
        <a href="/top-artists?token=${access_token}">View Top Artists</a>
        <a href="/top-tracks?token=${access_token}">View Top Tracks</a>
      `);
    //res.redirect(REDIRECT_URI /*+ '?token=${access_token}'*/);
    //console.log("Uri: " + REDIRECT_URI);
    
    } catch (error) {
      console.error('Error getting tokens:', error.response?.data || error.message);
      res.status(500).send('Error during authentication');
    }
});

app.get('/top-artists', async (req, res) => {
    const token = req.query.token;
    
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { limit: 10, time_range: 'short_term' }
      });
      
      res.json(response.data.items);
    } catch (error) {
      console.error('Error fetching top artists:', error.response?.data || error.message);
      res.status(500).send('Error fetching data');
    }
  });

  app.get('/top-tracks', async (req, res) => {
    const token = req.query.token;

    try {
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { limit: 10, time_range: 'short_term' }
      });
      
      res.json(response.data.items);
    } catch (error) {
      console.error('Error fetching top tracks:', error.response?.data || error.message);
      res.status(500).send('Error fetching data');
    }
  });
  
  app.get('/', (req, res) => {
    res.send(`
      <h1>Spotify Stats App</h1>
      <a href="/login">Login with Spotify</a>
    `);
  });

app.listen(8080, () => {
  console.log('Listening on ' + REDIRECT_URI.substring(0, REDIRECT_URI.length - 9));
});