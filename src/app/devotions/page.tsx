"use client";

import { useEffect, useState } from "react";

interface DevotionEntry {
  id: string;
  title: string;
  content: string;
  date: string;
}

export default function Devotions() {
  const [devotions, setDevotions] = useState<DevotionEntry[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem("devotions-cache");
    if (cached) setDevotions(JSON.parse(cached));

    fetch("https://biblemind-api-cw-gpycraft.onrender.com/devotions")
      .then((res) => res.json())
      .then((data) => {
        setDevotions(data);
        localStorage.setItem("devotions-cache", JSON.stringify(data));
      })
      .catch(() => {
        // offline, fallback to cached data
      });
  }, []);

  return (
    <div>
      <h1>Devotions</h1>
      {devotions.length === 0 && <p>Loading devotions...</p>}
      {devotions.map((dev) => (
        <article key={dev.id}>
          <h2>{dev.title}</h2>
          <p>{dev.content}</p>
          <small>{dev.date}</small>
        </article>
      ))}
    </div>
  );
}
