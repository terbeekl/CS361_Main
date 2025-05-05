import 'dotenv/config';
import express from 'express';
import querystring from 'querystring';
import asyncHandler from 'express-async-handler';
import axios from 'axios';
//import * as stats from './spotify_model.mjs;'
//require('dotenv').config();

const app = express();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

app.get('/', (req, res) => {
  res.redirect(`https://948a-128-193-154-133.ngrok-free.app`);
  });

app.get('/login', (req, res) => {
  localStorage.removeItem("spotify_access_token");
  const scope = 'user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public';
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
    
    res.redirect(`https://948a-128-193-154-133.ngrok-free.app/callback?token=${access_token}`);
    
    } catch (error) {
      console.error('Error getting tokens:', error.response?.data || error.message);
      res.status(500).send('Error during authentication');
    }
});

app.listen(8080, () => {
    console.log('Listening on ' + REDIRECT_URI.substring(0, REDIRECT_URI.length - 9));
  });