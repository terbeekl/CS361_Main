import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import background from '../assets/welcome_background.webp';
import Navigation from '../components/Navigation';

function HomePage() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('spotify_access_token', token);
    }
  }, [searchParams]);
  
  return (
    <div>
      {/* Background Image */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>
  
      {/* Foreground content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
          //height: '100vh',
          //paddingTop: '60px', // space from top
        }}
        >
          <Navigation/>
        <div className="window" style={{
        width: '500px',
        height: '200px',
        position: 'relative',
        top: '20px',
        //left: '-100px'
      }}>
        <div className="title-bar">
          <div className="title-bar-text">Spotify Stat</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
      </div>
    </div>
    <div className="window-body" >
      <p>Click on a folder to view your top statistics for that item <br></br>
         Click on the file to see your music mood <br></br>
         Click on the generate button to make a statistics summary sheet
      </p>
      <p style={{
        display: 'flex',
        position: 'absolute',
        bottom: '10px',
        left: '90px'
      }}>Questions? Please contact us at statshelp@gmail.com</p>
    </div>
  
    </div>
        
      </div>
    </div>
  );
  }
export default HomePage;