import { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

const emotions = [
  { label: "Happy", emoji: "😊" },
  { label: "Excited", emoji: "🤩" },
  { label: "Calm", emoji: "😌" },
  { label: "Anxious", emoji: "😰" },
  { label: "Sad", emoji: "😔" },
  { label: "Angry", emoji: "😡" },
];

function App() {
  const [session, setSession] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState("");
  const [description, setDescription] = useState("");
  const [energy, setEnergy] = useState(5);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) fetchEntries();
  }, [session]);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .order("created_at", { ascending: false });

    setEntries(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("journal_entries").insert([
      {
        user_id: session.user.id,
        emotion: selectedEmotion,
        description,
        energy_level: energy,
      },
    ]);

    setDescription("");
    setSelectedEmotion("");
    setEnergy(5);
    fetchEntries();
  };

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  if (!session)
    return (
      <div className="auth-screen">
        <h1>✨ YOUR EVERYDAY RECORD ✨</h1>
        <button onClick={login}>Login with Google</button>
      </div>
    );

  return (
    <div className="app-container">
      <motion.h1
        className="title"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        ✨ YOUR EVERYDAY RECORD ✨
      </motion.h1>

      <form className="glass-card" onSubmit={handleSubmit}>
        <div className="emotion-picker">
          {emotions.map((emo) => (
            <span
              key={emo.label}
              className={`emoji ${
                selectedEmotion === emo.label ? "selected" : ""
              }`}
              onClick={() => setSelectedEmotion(emo.label)}
            >
              {emo.emoji}
            </span>
          ))}
        </div>

        <textarea
          placeholder="Describe your experience today..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Energy Level: {energy}</label>
        <input
          type="range"
          min="1"
          max="10"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
        />

        <button type="submit">Save Entry</button>
      </form>

      <div className="glass-card">
        <h2>Mood Analytics</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={entries}>
            <XAxis dataKey="emotion" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="energy_level" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="entries">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            className="entry-card"
            whileHover={{ scale: 1.05 }}
          >
            <h3>{entry.emotion}</h3>
            <p>{entry.description}</p>
            <small>Energy: {entry.energy_level}</small>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;