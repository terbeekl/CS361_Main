import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import back_arrow from "../assets/back_arrow.png";
import forward_arrow from "../assets/forward_arrow.png";
import home_icon from "../assets/home_icon.png";

export const TopTracksPage = () => {
  const [tracks, setTracks] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleMakePlaylist = () => {
    setShowConfirm(true);
  };

  const confirmCreatePlaylist = async () => {
    setShowConfirm(false);
    await makePlaylist();
  };

  const cancelCreatePlaylist = () => {
    setShowConfirm(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");

    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    const fetchTopTracks = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
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

    fetchTopTracks();

  }, [navigate]);

  const makePlaylist = async () => {
    const token = localStorage.getItem("spotify_access_token");
    // if (!token) {
    //     navigate("/");
    //     return;
    // }
    // try {
    //     const userResponse = await axios.get("https://api.spotify.com/v1/me", {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         }
    //     });
    //     const userId = userResponse.data.id;

    //     const playlistResponse = await axios.post(
    //         `https://api.spotify.com/v1/users/${userId}/playlists`,
    //         {
    //             name: "Top Tracks - Spotify Stat",
    //             description: "Your top 10 tracks from the past 4 weeks!!",
    //             public: false
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             }
    //         }
    //     );
    //     const playlistId = playlistResponse.data.id;
    //     const uris = tracks.map((track) => track.uri);

    //     await axios.post(
    //         `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    //         {
    //             uris: uris
    //         },
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json"
    //             }
    //         }
    //     );
    //     alert("Playlist created and top tracks added!");
    // } catch (error) {
    //     console.error("Error creating playlist:", error);
    // }
  };

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
                <Link to="/top-artists" style={{textDecoration: 'none', }}><button role="tab">Top Artists</button></Link>
                <Link to="/top-tracks" style={{textDecoration: 'none', paddingTop: '2px'}}><button role="tab" aria-selected="true">Top Tracks</button></Link>
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
              <label>Display - view top 10 or top 50 tracks</label>
              <div className="field-row">
                <select>
                    <option>Top 10</option>
                    <option>Top 50</option>
                </select>
              </div>
              <br></br>
              <button>Submit</button>
            </fieldset>
            
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
                    <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    width="75"
                    style={{ boxShadow: '2px 2px 3px #d3d3d3' }}
                    />
                    <span>
                    {track.name} by {track.artists.map((a) => a.name).join(", ")}
                    </span>
                </div>
                </li>
            ))}
            </ol>

            <Link to="/generate"><button>Generate Statistics Sheet</button></Link>
            <button onClick={handleMakePlaylist} style={{marginLeft: '10px'}}>Make Playlist</button>
            {showConfirm && (
                <div className="window" style={{
                    width: '300px',
                    height: '140px',
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
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
                    <p>Are you sure you want to create a playlist?</p>
                    <p>(You will have to go into your Spotify account to delete unwanted playlists)</p>
                  </div>
                  <div className="field-row" style={{ justifyContent: "center" }}>
                      <button onClick={confirmCreatePlaylist}>Yes</button>
                      <button onClick={cancelCreatePlaylist}>Cancel</button>
                    </div>
                </div>
            )}
          
          </article>
        </div>
        </div>
        </div>
  );
};

export default TopTracksPage;
