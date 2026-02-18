import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const moods = ["Fine", "Not Fine", "Productive", "Exhausted", "Romantic", "Unmotivated", "Peaceful", "Overthinking", "Inspired"];

  useEffect(() => {
    fetchEntries();
    fetchEmojis();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select(`*, emojis ( symbol )`)
      .order("created_at", { ascending: false });
    setEntries(data || []);
  };

  const fetchEmojis = async () => {
    const { data } = await supabase.from("emojis").select("*");
    setEmojis(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmoji) return alert("Pick an emoji to set the mood!");

    await supabase.from("journal_entries").insert([
      { mood: selectedMood, description, emoji_id: selectedEmoji }
    ]);

    setSelectedMood("");
    setDescription("");
    setSelectedEmoji(null);
    fetchEntries();
  };

  return (
    <div className="app-container">
      
      <header className="hero-header">
        <h1 className="hero-title">MEMORY ARCHIVE</h1>
        <p className="hero-subtitle">Chronicle your cinematic journey</p>
      </header>

      <main className="glass-wrapper">
        <form className="journal-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label>Current Vibe</label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              required
            >
              <option value="">Select Mood</option>
              {moods.map((mood) => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>The Narrative</label>
            <textarea
              placeholder="Write your story..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Visual Identity</label>
            <div className="emoji-selector">
              {emojis.map((emoji) => (
                <span
                  key={emoji.id}
                  className={`emoji-btn ${selectedEmoji === emoji.id ? "active" : ""}`}
                  onClick={() => setSelectedEmoji(emoji.id)}
                >
                  {emoji.symbol}
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="save-btn">Capture Moment</button>
        </form>
      </main>

      <section className="archive-section">
        <h2 className="archive-title">Recent Records</h2>
        <div className="entries-grid">
          {entries.map((entry) => (
            <div key={entry.id} className="memory-card">
              <div className="card-top">
                <span className="emoji-display">
                  {entry.emojis?.symbol}
                </span>
                <span className="timestamp">
                  {new Date(entry.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h3>{entry.mood}</h3>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </section>

      <button
        className="theme-switch"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "☀" : "🌙"}
      </button>

    </div>
  );
}

export default App;