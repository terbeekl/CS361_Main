import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import back_arrow from "../assets/back_arrow.png";
import forward_arrow from "../assets/forward_arrow.png";
import home_icon from "../assets/home_icon.png";

export const TopGenresPage = () => {
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("short_term");
  

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    } else {
      fetchTopGenres();
    }
  }, [navigate]);

  const fetchTopGenres = async () => {
      const token = localStorage.getItem("spotify_access_token")
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/artists?limit=50&time_range=${timeRange}`,
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

    useEffect(() => {
        if (artists.length === 0) return;
        const allGenres = artists.flatMap(artist => artist.genres);

        const genreCounts = {};
        allGenres.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });

        const sortedGenres = Object.entries(genreCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
        setGenres(sortedGenres);
    }, [artists]);

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
            <Link to="/top-genres" style={{textDecoration: 'none', paddingTop: '2px'}}><button role="tab" aria-selected="true">Top Genres</button></Link>
            <Link to="/mood" style={{textDecoration: 'none'}}><button role="tab">Mood</button></Link>
        </menu>
        <article role="tabpanel">
        <fieldset>
          <label>Time Period - view statistics from the selected time period</label>
          <div className="field-row">
            <select name="time_range" id="time_range" value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}>
                <option value="short_term">4 weeks</option>
                <option value="medium_term">6 months</option>
                <option value="long_term">1 year</option>
            </select>
          </div>
          <br></br>
          <button onClick={fetchTopGenres}>Submit</button>
        </fieldset>
        <ol style={{ paddingLeft: '1em' }}>
        {genres.slice(0, 10).map((genre, index) => (
            <li
            key={genre.name}
            style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                gap: '12px',
            }}
            >
            <span style={{ width: '20px', textAlign: 'right' }}>{index + 1}.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style ={{minWidth: '110px'}}>{genre.name}</div> 
                <span>{genre.count}%</span>
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

export default TopGenresPage;
