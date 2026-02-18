import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [emotion, setEmotion] = useState("");
  const [description, setDescription] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const emojis = ["🔥", "🌙", "💭", "✨", "🖤", "🌸", "⚡", "😶‍🌫️"];

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    setEntries(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("journal_entries").insert([
      { emotion, description },
    ]);

    setEmotion("");
    setDescription("");
    fetchEntries();
  };

  return (
    <div className="overlay">
      <div className="container">

        <h1 className="hero">
          MEMORY ARCHIVE
        </h1>

        <form className="journal-box" onSubmit={handleSubmit}>

          <div className="emoji-picker">
            {emojis.map((emoji) => (
              <span
                key={emoji}
                className={`emoji ${emotion === emoji ? "selected" : ""}`}
                onClick={() => setEmotion(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write something cinematic..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button type="submit">Save Memory</button>
        </form>

        <div className="grid">
          {entries.map((entry) => (
            <div key={entry.id} className="card">
              <div className="card-header">
                <span className="tag">{entry.emotion}</span>
                <span className="time">
                  {new Date(entry.created_at).toLocaleString()}
                </span>
              </div>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>

        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

      </div>
    </div>
  );
}

export default App;