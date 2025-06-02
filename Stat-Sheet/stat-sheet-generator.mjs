import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: '*'
}));
app.use(express.json());

app.post('/stats-html', (req, res) => {
  const { username, topTracks, topArtists, topGenre, showMood, moodData } = req.body;
  const statsHTML = `
     <div>
        <div className="window" style={{
        position: 'absolute',
        top: '300px',
        minHeight: '100',
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
            ${username}'s Stats!</p>
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
  `;

  res.json({ html: statsHTML });
});

app.listen(3003, () => console.log('Stat service running on port 3003'));