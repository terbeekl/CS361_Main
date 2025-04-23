const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const app = express();

const CLIENT_ID = '22b535e0cb5441e3ae789c10dec32291';
const CLIENT_SECRET = 'd19a3e8cb7c943b689b125d0f727b93b';
const REDIRECT_URI = 'https://75ba-128-193-154-133.ngrok-free.app/callback';

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
      `);
      
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
        params: { limit: 10, time_range: 'medium_term' }
      });
      
      res.json(response.data.items);
    } catch (error) {
      console.error('Error fetching top artists:', error.response?.data || error.message);
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
  console.log('Listening on https://75ba-128-193-154-133.ngrok-free.app');
});
