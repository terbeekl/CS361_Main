import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import back_arrow from "../assets/back_arrow.png";
import forward_arrow from "../assets/forward_arrow.png";
import home_icon from "../assets/home_icon.png";

export const TopArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");

    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    const fetchTopArtists = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/artists?limit=10&time_range=short_term",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArtists(response.data.items);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    fetchTopArtists();
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
            <Link to="/top-artists" style={{textDecoration: 'none', paddingTop: '2px'}}><button role="tab" aria-selected="true">Top Artists</button></Link>
            <Link to="/top-tracks" style={{textDecoration: 'none', }}><button role="tab">Top Tracks</button></Link>
            <Link to="/top-genres" style={{textDecoration: 'none'}}><button role="tab">Top Genres</button></Link>
            <Link to="/mood" style={{textDecoration: 'none'}}><button role="tab">Mood</button></Link>
        </menu>
        <article role="tabpanel">
        <fieldset>
          <legend></legend>
          <label>Time Period - view statistics from the selected time period</label>
          <div className="field-row">
            <select>
                <option>4 weeks</option>
                <option>6 months</option>
                <option>1 year</option>
            </select>
          </div>
          <br></br>
          <label>Display - view top 10 or top 50 artists</label>
          <div className="field-row">
            <select>
                <option>Top 10</option>
                <option>Top 50</option>
            </select>
          </div>
          <br></br>
          <button>Submit</button>
        </fieldset>
        <ol style={{ paddingLeft: '1em' }}>
        {artists.map((artist, index) => (
            <li
            key={artist.id}
            style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                gap: '12px',
            }}
            >
            <span style={{ width: '20px', textAlign: 'right' }}>{index + 1}.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                src={artist.images[0]?.url}
                alt={artist.name}
                width="75"
                style={{ boxShadow: '2px 2px 3px #d3d3d3' }}
                />
                {artist.name}
            </div>
            </li>
        ))}
        </ol>


        <Link to="/generate"><button>Generate Statistics Sheet</button></Link>
      </article>
    </div>
  
    </div>
      
    </div>
  );
};

export default TopArtistsPage;
