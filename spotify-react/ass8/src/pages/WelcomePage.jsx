import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {Link} from 'react-router-dom'
import background from '../assets/welcome_background.webp';
import welcome_img from '../assets/welcome.jpg';

function WelcomePage() {
    const location = useLocation();
    const navigate = useNavigate();
  
    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
  
      if (token) {
        localStorage.setItem('spotify_token', token);
      }
    }, [location, navigate]);
  
    return (
      <div style={{
        backgroundImage: `url(${background})`,
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="window" style={{
          width: '400px',
          height: '323px',
          position: 'absolute',
          top: '10%',
          left: 'calc(50% - 200px)'          
        }}>
          <div className="title-bar">
            <div className="title-bar-text">Spotify Stat</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>
          <img 
                src={welcome_img}
                style={{
                  width: '400px',
                  height: 'auto',
                }} 
              />
        </div>

        <div className="window" style={{
          width: '300px',
          height: '100px',
          position: 'absolute',
          top: 'calc(10% + 260px)',
          left: '50%'
        }}>
          <div className="title-bar">
            <div className="title-bar-text">Spotify Stat</div>
            <div className="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
        </div>
        <div className="window-body">
          <p>Login with Spotify!</p>
        </div>
        <div className="field-row" style={{ justifyContent: "center" }}>
          <a href="https://9bdc-128-193-154-133.ngrok-free.app/login">
            <button>Login</button>
          </a>
          </div>
      </div>

      <div className="window" style={{
          width: '300px',
          height: '150px',
          position: 'absolute',
          top: 'calc(10% + 400px)',
          left: 'calc(50% - 150px)'
        }}>
        <div className="title-bar">
          <div className="title-bar-text">Spotify Stat</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body">
          <p>Have some fun with Spotify Statistics! <br></br><br></br>
            Generate a cute statistics sheet to share with all of your friends!
            <br></br><br></br>
            **New!! Option to see Music Mood!!
          </p>
        </div>
      </div>
    </div>
    );
  }
export default WelcomePage;