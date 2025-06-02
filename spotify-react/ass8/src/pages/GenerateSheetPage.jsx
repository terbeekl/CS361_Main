import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { fetchMoodData } from "../utils/moodFetcher";

import back_arrow from "../assets/back_arrow.png";
import forward_arrow from "../assets/forward_arrow.png";
import home_icon from "../assets/home_icon.png";

export const GenerateSheetPage = () => {
  const [artists, setArtists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [username, setUsername] = useState(null);
  const [statsHTML, setStatsHTML] = useState('');
  const navigate = useNavigate();
  const [boxValue, setBoxValue] = useState(1);
  const [showMood, setShowMood] = useState(1);
  const [moodData, setMoodData] = useState({
    topGenre: null,
    tracks: [],
    mood: null,
    imageUrl: null
  })
  const [timeRange, setTimeRange] = useState("short_term");

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) {
      navigate("/");
      return;
    }
    fetchEverything();
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

  const fetchEverything = async () => {
    fetchTopArtists();
    fetchTopTracks();
    fetchUsername();
    fetchStats();
    setShowMood(boxValue);
  };

  const handleChange = (event) => {
    setBoxValue(event.target.checked ? 1 : 0);
  }

  const fetchTopArtists = async () => {
      const token = localStorage.getItem("spotify_access_token")
      try {
        // get artists
        let response = await axios.get(
          `https://api.spotify.com/v1/me/top/artists?limit=5&time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArtists(response.data.items);

        // get tracks
        response = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTracks(response.data.items);
      } catch (error) {
        console.error("Error fetching top artists:", error);
      }
    };

    const fetchTopTracks = async () => {
    const token = localStorage.getItem("spotify_access_token");  
    try {
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTracks(response.data.items);
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };

    const fetchUsername = async () => {
        const token = localStorage.getItem("spotify_access_token");
        try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });
        setUsername(response.data.display_name || response.data.id);
        } catch (error) {
        console.error("Error fetching user profile:", error);
        }
    }

    const fetchStats = async () => {
        try {
            console.log({username});
            const response = await axios.post(
            'https://3744-2601-1c0-8081-9de0-6128-a1de-895b-90d4.ngrok-free.app/stats-html',
            {
                username: username,
                topTracks: tracks,
                topArtists: artists,
                topGenre: moodData.topGenre,
                showMood: showMood,
                moodData: moodData
            },
            {  
                headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
                }
            } 
            ); 
            setStatsHTML(response.data.html);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

  return (
    <div>
      <div className="window" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '98vw',
        minHeight: '100',
        zIndex: 1
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
      See YOUR Cool Stat Sheet
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
            <Link to="/top-artists" style={{textDecoration: 'none'}}><button role="tab" >Top Artists</button></Link>
            <Link to="/top-tracks" style={{textDecoration: 'none'}}><button role="tab">Top Tracks</button></Link>
            <Link to="/top-genres" style={{textDecoration: 'none'}}><button role="tab">Top Genres</button></Link>
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
          <div>
            <input type="checkbox" id="moodCheck" checked={boxValue === 1} onChange={handleChange}></input>
            <label htmlFor="moodCheck">Incorporate Mood</label>
          </div>
          <br></br>
          <button onClick={fetchEverything}>Submit</button>
        </fieldset>
      </article>
    </div>
  
    </div>

    <div>
        <div className="window" style={{
        position: 'absolute',
        top: '300px',
        minHeight: '100'
        }}>
            <div className="title-bar">
                <div className="title-bar-text">Spotify Stat Sheet</div>
                <div className="title-bar-controls">
                    <Link to="/callback"><button aria-label="Minimize"></button></Link>
                    <button aria-label="Maximize"></button>
                    <Link to="/callback"><button aria-label="Close"></button></Link>
                </div>
            </div>

            <p style={{
                paddingLeft: '20px',
                paddingRight: '20px',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: 'bold'
            }}>
            {username}'s Stats!</p>
            <div className="window-body">
                <div style={{display: 'flex', gap: '5px'}}>
                    <article role="tabpanel" style={{width: '250px', maxWidth: '50%px'}}>
                        <p style={{
                            textAlign: 'center', 
                            fontWeight: 'bold', 
                            fontSize: '150%'
                        }}>Top Artists</p>
                        <div style={{
                            display: 'flex',
                            gap: '5px', 
                            justifyContent: 'center', 
                            flexWrap: 'wrap'
                        }}>
                        {artists.map((artist) => (
                            <div 
                                key={artist.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '80px'
                                }}
                            >
                                {artist.images[0]?.url && (
                                    <img
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        style={{
                                            width: '75px',
                                            height: '75px',
                                            objectFit: 'cover',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                            marginBottom: '8px'
                                        }}
                                    />
                                )}
                                <span style={{
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    lineHeight: '1.3',
                                    wordBreak: 'break-word'
                                }}>
                                    {artist.name}
                                </span>
                            </div>
                        ))}
                        </div>
                    </article>

                    <article role="tabpanel">
                        <p style={{
                            textAlign: 'center', 
                            fontWeight: 'bold', 
                            fontSize: '150%'
                        }}>Top Tracks</p>
                        <div style={{
                            display: 'flex',
                            gap: '5px',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <ol style={{ paddingLeft: '1em'}}>
                                {tracks.map((track, index) => (
                                <li
                                    key={track.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '12px',
                                        gap: '12px',
                                    }}
                                >
                                <span style={{ width: '20px', textAlign: 'right' }}>{index + 1}.</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span>
                                        <b>{track.name}</b> by {track.artists.map((a) => a.name).join(", ")}
                                    </span>
                                </div>
                                </li>
                                ))}
                            </ol>
                        </div>
                    </article>
                </div>

                {showMood === 1 && (
                    <div style={{display: 'flex', gap: '5px'}}>
                        <article role="tabpanel" style={{width: '250px', maxWidth: '50%'}}>
                            <div>{username}'s Overall Top Genre:</div>
                            <br></br>
                            <div style={{fontWeight: 'bold', fontSize: '150%'}}>{moodData.topGenre} </div>
                            <br></br>
                            <div>{username}'s Music Mood:</div>
                            <br></br>
                            <div style={{fontWeight: 'bold', fontSize: '150%'}}>{moodData.mood} </div>
                        </article>
                        <article role="tabpanel" style={{maxWidth: '48%'}}>
                            <div><img src={moodData.imageUrl} style={{width: '300px', maxWidth: '100%', height: '250px', objectFit: 'cover', boxShadow: '2px 2px 3px #d3d3d3'}}/></div>
                        </article>
                    </div>
                )}
            </div>

        </div>
      
    </div>
     
      <div 
        dangerouslySetInnerHTML={{ __html: statsHTML }}
        style={{ marginTop: '20px' }}
      />
     
    </div>
    
  );
};

export default GenerateSheetPage;