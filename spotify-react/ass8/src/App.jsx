//import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import WelcomePage from './pages/WelcomePage'
import TopArtistsPage from './pages/TopArtistsPage'
import TopTracksPage from './pages/TopTracksPage'

function App() {

  return (
    <>
      <div className="app">
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />}></Route>
            <Route path="/callback" element={<HomePage />}></Route>
            <Route path="/top-tracks" element={<TopTracksPage />}></Route>
            <Route path="/top-artists" element={<TopArtistsPage />}></Route>
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
