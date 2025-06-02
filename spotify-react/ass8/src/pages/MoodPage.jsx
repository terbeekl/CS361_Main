import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import back_arrow from "../assets/back_arrow.png";
import forward_arrow from "../assets/forward_arrow.png";
import home_icon from "../assets/home_icon.png";
import { fetchMoodData } from "../utils/moodFetcher";

export const MoodPage = () => {
  const [topGenre, setTopGenre] = useState(null);
  const [trackData, setTrackData] = useState([]);
  const [mood, setMood] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();  
  const [moodData, setMoodData] = useState({
    topGenre: null,
    tracks: [],
    mood: null,
    imageUrl: null
  })


   useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        const data = await fetchMoodData();
        setMoodData(data);

      } catch (error) {
        console.error("Error: ", error);
      }
    };
    loadData();
  }, [navigate]);

  


  return (
    <div>
      <div className="window" style={{
        position: 'absolute',        // Sticks to viewport
        top: 0,
        left: 0,
        width: '98vw',           // Full viewport width
        minHeight: '100',          // Full viewport height
        zIndex: -1             // Behind other content
      }}>
        <div className="title-bar">
          <div className="title-bar-text">Spotify Stat</div>
          <div className="title-bar-controls">
            <Link to="/callback"><button aria-label="Minimize"></button></Link>
            <button aria-label="Maximize"></button>
            <Link to="/callback"><button aria-label="Close"></button></Link>
      </div>
    </div>
    
    <div className="window-body" >
    <article
  role="tabpanel"
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 10px',
  }}
>
  {/* Left group: arrows and text */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}
  >
    <img
      src={back_arrow}
      style={{
        width: '30px',
        height: 'auto',
      }}
      onClick={() => navigate(-1)}
    />
    <img
      src={forward_arrow}
      style={{
        width: '30px',
        height: 'auto',
      }}
      onClick={() => navigate(1)}
    />
    <div>
      Click on Generate Stat Sheet at the bottom to Generate a Statistics Sheet
    </div>
  </div>

  {/* Right-aligned home icon */}
  <Link to="/callback"><img
    src={home_icon}
    style={{
      width: '40px',
      height: 'auto',
    }}
  /></Link>
</article>

            
    
        <menu role="tablist">
            <Link to="/top-artists" style={{textDecoration: 'none'}}><button role="tab">Top Artists</button></Link>
            <Link to="/top-tracks" style={{textDecoration: 'none'}}><button role="tab">Top Tracks</button></Link>
            <Link to="/top-genres" style={{textDecoration: 'none'}}><button role="tab">Top Genres</button></Link>
            <Link to="/mood" style={{textDecoration: 'none', paddingTop: '2px'}}><button role="tab" aria-selected="true">Mood</button></Link>
        </menu>
        <article role="tabpanel">
        <fieldset>
          <legend>Your Mood</legend>
          <div>Mood is calculated from various Spotify Stats</div>
        </fieldset>
            <br></br>
            <div>Your music mood:</div>
            <br></br>
            <div style={{fontWeight: 'bold', fontSize: '200%'}}>{moodData.mood}</div>
            <br></br>
            <div><img src={moodData.imageUrl} style={{width: '300px', maxWidth: '300px', height: '300px', objectFit: 'cover', boxShadow: '2px 2px 3px #d3d3d3'}}/></div>
            <br></br>
        <Link to="/generate"><button>Generate Statistics Sheet</button></Link>
      </article>
    </div>
  
    </div>
      
    </div>
  );
};

export default MoodPage;
