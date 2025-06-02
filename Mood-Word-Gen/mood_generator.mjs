// mood_controller.mjs
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';

const app = express();
app.use(cors());
app.use(express.json()); // Add JSON body parsing

const MOOD_LOG_FILE = '../Image-Pull-Folder/input.txt';
const MOOD_IMAGE_FILE = '../Image-Pull-Folder/output.txt';

async function printMoodToFile(mood){
    try {
        await fs.writeFile(MOOD_LOG_FILE, `${mood}`);
        console.log("Mood logged: ", mood);
    } catch (error) {
        console.error('Error writing mood:', error);
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getImageUrl() {
    try {
       await sleep(1500);
        return await fs.readFile(MOOD_IMAGE_FILE, 'utf-8');
    } catch (error) {
        console.error('Error reading image URL:', error);
        return null;
    }
}

function generateMoodNumber({ topGenre, tracks }) {
  const stats = {
    explicitCount: tracks.filter(t => t.explicit).length,
    avgPopularity: tracks.reduce((sum, t) => sum + t.popularity, 0) / tracks.length,
    avgDuration: (tracks.reduce((sum, t) => sum + t.duration_ms, 0) / tracks.length) / 1000,
    marketAvailability: tracks.reduce((sum, t) => sum + t.available_markets, 0) / tracks.length,
    avgYearReleased: tracks.reduce((sum, t) => {
      const year = new Date(t.release_date).getFullYear();
      return sum + (isNaN(year) ? 2000 : year);
    }, 0) / tracks.length
  };
  let moodCount = 0;
  let genreCount = 0;
  //topGenre = "rock";
  
  console.log("genre: ", topGenre);
  if(/emo|hardcore|punk|alt/i.test(topGenre)) {
    moodCount += 1;
    genreCount = 1;
  } else if(/blues|jazz|gospel|classical/i.test(topGenre)) {
    moodCount += 2;
    genreCount = 2;
  } else if(/rock|classic|metal|grunge/i.test(topGenre)) {
    moodCount += 3;
    genreCount = 3;
  } else if(/indie|folk/i.test(topGenre)){
    moodCount += 4;
  } else if(/pop|techno|hip|hop|house|country|rap/i.test(topGenre)){
    moodCount += 5;
    genreCount = 5;
  } else {
    moodCount += 6;
    genreCount = 6;
  }

  console.log("count: ", genreCount);
  console.log("explicit: ", stats.explicitCount);
  if(stats.explicitCount > 30){
    return moodCount;
  }
  moodCount += (genreCount + 5);

  console.log("duration: ", stats.avgDuration);
  if(stats.avgDuration < 180){
    return moodCount;
  }
  moodCount++;
  if(stats.avgDuration > 360){
    return moodCount;
  }
  moodCount += 11;

  console.log("avg. year: ", stats.avgYearReleased);
  if(stats.avgYearReleased < 1980){
    return moodCount;
  }
  moodCount++;
  if(stats.avgYearReleased > 2018){
    return moodCount;
  }
  moodCount += ((genreCount*2) + 9);
  
  console.log("pop: ", stats.avgPopularity);
  console.log("market: ", stats.marketAvailability);
  if(stats.avgPopularity < 40){
    if(stats.marketAvailability < 170){
        return moodCount++;
    }
    return moodCount;
  }
  moodCount += 2;
  if(stats.avgPopularity > 60){
    return moodCount++;
  }
  return moodCount;
}

function generateMoodWord(moodNumber){
    console.log(moodNumber);
    let wordArray = ["animated","amused","audacious","cold","fearless","unhappy","cool",
                     "dreary","snappy","comfortable","brash","draining","decisive","dreamy",
                     "hyper","enthused","peppy","relaxed","passionate","determined","harmonious",
                     "bright","nostalgic","ambitious","affectionate","cheerful","charming",
                     "recent","yearning","triumphant","pompous","hopeless","confident","fake",
                     "imaginative","suspenseful","pleased","energetic","jealous","vengeful","bold",
                     "avid","shocked","buoyant","realistic","safe","specific","lively","accepted",
                     "basic","niche","troubled","affirming","vigorous"];

    return wordArray[moodNumber-1];
}

app.post('/mood', async (req, res) => {
  const { topGenre, tracks } = req.body;

  if (!topGenre || !tracks?.length) {
    return res.status(400).json({ error: 'Missing required data' });
  }

  try {
    const moodNumber = generateMoodNumber({
      topGenre,
      tracks: tracks.map(t => ({
        ...t,
        popularity: Number(t.popularity),
        duration_ms: Number(t.duration_ms),
        available_markets: Number(t.available_markets) || 0
      }))
    });
    console.log("mood: ", moodNumber);
    const mood = generateMoodWord(moodNumber);

    await printMoodToFile(mood);
    const imageUrl = await getImageUrl();

    res.json({ mood, imageUrl });
  } catch (error) {
    console.error('Mood calculation error:', error);
    res.status(500).json({ error: 'Mood calculation failed' });
  }
});






app.post('/stats-html', (req, res) => {
  const { username, topTracks, topArtists, topGenre, showMood, moodData } = req.body;
  const statsHTML = `
     <div>
        <div className="window" style={{
        position: 'absolute',top: '300px',minHeight: '100',}}>
        <div className="title-bar"><div className="title-bar-text">Spotify Stat Sheet</div>
        <div className="title-bar-controls"><Link to="/callback"><button aria-label="Minimize"></button></Link>            
`;

  res.json({ html: statsHTML });
});

const PORT = 3002;
app.listen(3002, () => {
  console.log(`Mood service running on port ${PORT}`);
});