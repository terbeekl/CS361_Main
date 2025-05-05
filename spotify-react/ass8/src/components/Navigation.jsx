import {Link, useLocation} from 'react-router-dom'
import folder from '../assets/folder_icon.png';
import mood from '../assets/mood_icon.png';
import generate from '../assets/generate_icon.png';

function Navigation(){
    const location = useLocation();

    if(location.pathname === '/') return null;

    if(location.pathname === '/callback') {

        return (
            <nav className="app-nav">
                <h2 style={{
                    color: 'white', // or whatever contrasts your background
                    textShadow: '1px 1px 2px black', // optional: improves visibility
        }}>Spotify Stats</h2>
        <div className="nav-links">
            <Link to="/top-artists">
                <img
                    src={folder}
                    style={{ width: '75px', cursor: 'pointer' }}
                />
                <p style={{ position: 'relative', left: '-5px', fontSize: '14px'}}>Top_Artists</p>
            </Link>
            <Link to="/top-tracks">
                <img
                    src={folder}
                    style={{ width: '75px', cursor: 'pointer' }}
                />
                <p style={{ position: 'relative', left: '-5px', fontSize: '14px'}}>Top_Tracks</p>
            </Link>
            <Link to="/top-genres">
                <img
                    src={folder}
                    style={{ width: '75px', cursor: 'pointer' }}
                />
                <p style={{ position: 'relative', left: '-5px', fontSize: '14px'}}>Top_Genres</p>
            </Link>
            <Link to="/mood">
                <img
                    src={mood}
                    style={{ width: '75px', cursor: 'pointer' }}
                />
                <p style={{ position: 'relative', left: '-5px', fontSize: '14px'}}>Mood</p>
            </Link>
            <Link to="/generate">
                <img
                    src={generate}
                    style={{ width: '75px', cursor: 'pointer' }}
                />
                <p style={{ position: 'relative', left: '-5px', fontSize: '14px'}}>Generate_Sheet</p>
            </Link>
            
            </div>
            </nav>
        );
    }

    return (
        <nav className="app-nav">
            <Link to="/callback">Home</Link>
            <> ☆ </>
            <Link to="/top-artists">Top Artists</Link>
            <> ☆ </>
            <Link to="/top-tracks">Top Tracks</Link>
        </nav>
    )
}

export default Navigation;