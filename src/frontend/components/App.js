
import logo from './logo.png';
import './App.css';
import { useState } from 'react';
 
function App() {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([
    {
      id: 1,
      name: "Today's Top Hits",
      imageUrl: '/top-hits.jpg'
    },
    {
      id: 2,
      name: 'Pop Party',
      imageUrl: '/pop-party.jpg'
    },
    {
      id: 3,
      name: 'Dinner Party',
      imageUrl: '/dinner-party.jpg'
    }
  ]);
  const [newReleases, setNewReleases] = useState([
    {
      id: 1,
      name: 'Map of the Soul: 7',
      imageUrl: '/map-of-the-soul-7.jpg'
    },
    {
      id: 2,
      name: 'Fine Line',
      imageUrl: '/fine-line.jpg'
    },
    {
      id: 3,
      name: 'Folklore',
      imageUrl: '/folklore.jpg'
    }
  ]);

  return (
    <div>
      <header>
        <img src="/logo.png" alt="Spotify logo" />
        <nav>
          <a href="/browse">Browse</a>
          <a href="/search">Search</a>
          <a href="/your-library">Your Library</a>
        </nav>
      </header>
      <main>
        <section>
          <h2>Featured Playlists</h2>
          {featuredPlaylists.map(playlist => (
            <div key={playlist.id}>
              <img src={playlist.imageUrl} alt={playlist.name} />
              <p>{playlist.name}</p>
            </div>
          ))}
        </section>
        <section>
          <h2>New Releases</h2>
          {newReleases.map(release => (
            <div key={release.id}>
              <img src={release.imageUrl} alt={release.name} />
              <p>{release.name}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
