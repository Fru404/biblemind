"use client";
import { useState } from "react";
import Link from "next/link";

interface Prayer {
  title: string;
  latin: string;
  english: string;
}

interface Mystery {
  name: string;
  prayers: string[];
  prayersLatin: string[];
}

export default function DevotionsPage() {
  const [language, setLanguage] = useState<"latin" | "english">("english");

  const rosaryPrayers: Prayer[] = [
    {
      title: "Sign of the Cross",
      latin: "In nomine Patris, et Filii, et Spiritus Sancti. Amen.",
      english:
        "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
    },
    {
      title: "Apostles' Creed",
      latin: `Credo in Deum, Patrem omnipoténtem, Creatórem cæli et terræ...`,
      english: `I believe in God, the Father Almighty, Creator of heaven and earth...`,
    },
    {
      title: "Our Father",
      latin: "Pater noster, qui es in cælis, sanctificétur nomen tuum...",
      english: "Our Father, who art in heaven, hallowed be thy name...",
    },
    {
      title: "Hail Mary",
      latin: "Ave María, grátia plena, Dóminus tecum...",
      english: "Hail Mary, full of grace, the Lord is with thee...",
    },
    {
      title: "Glory Be",
      latin: "Glória Patri, et Fílio, et Spirítui Sancto...",
      english:
        "Glory be to the Father, and to the Son, and to the Holy Spirit...",
    },
  ];

  const mysteries: Mystery[] = [
    {
      name: "Joyful Mysteries",
      prayers: [
        "The Annunciation",
        "The Visitation",
        "The Nativity of Our Lord",
        "The Presentation in the Temple",
        "The Finding in the Temple",
      ],
      prayersLatin: [
        "Annuntiatio",
        "Visitatio",
        "Nativitas Domini",
        "Praesentatio in Templo",
        "Inventio in Templo",
      ],
    },
    {
      name: "Sorrowful Mysteries",
      prayers: [
        "The Agony in the Garden",
        "The Scourging at the Pillar",
        "The Crowning with Thorns",
        "The Carrying of the Cross",
        "The Crucifixion",
      ],
      prayersLatin: [
        "Agonia in Horto",
        "Flagellatio ad Columnam",
        "Coronatio Spineae",
        "Bajulatio Crucis",
        "Crucifixio",
      ],
    },
    {
      name: "Glorious Mysteries",
      prayers: [
        "The Resurrection",
        "The Ascension",
        "The Descent of the Holy Spirit",
        "The Assumption of the Blessed Virgin Mary",
        "The Coronation of the Blessed Virgin Mary",
      ],
      prayersLatin: [
        "Resurrectio",
        "Ascensio",
        "Descensus Spiritus Sancti",
        "Assumptio Beatae Mariae Virginis",
        "Coronatio Beatae Mariae Virginis",
      ],
    },
    {
      name: "Luminous Mysteries",
      prayers: [
        "The Baptism of Our Lord",
        "The Wedding at Cana",
        "The Proclamation of the Kingdom",
        "The Transfiguration",
        "The Institution of the Eucharist",
      ],
      prayersLatin: [
        "Baptismus Domini",
        "Nuptiae Canae Galilaeae",
        "Proclamatio Regni Dei",
        "Transfiguratio",
        "Institutio Eucharistiae",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#8B0000] text-white px-6 py-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Rosary</h1>
        <Link href="/" className="hover:text-gray-300 transition">
          Back to Home
        </Link>
      </nav>

      {/* Language Selector */}
      <div className="flex justify-center mt-6">
        <div className="bg-white shadow-md rounded p-2 flex gap-2">
          <button
            onClick={() => setLanguage("english")}
            className={`px-4 py-2 rounded ${
              language === "english"
                ? "bg-[#8B0000] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("latin")}
            className={`px-4 py-2 rounded ${
              language === "latin"
                ? "bg-[#8B0000] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Latin
          </button>
        </div>
      </div>

      <main className="flex-grow px-4 py-6 md:px-12">
        {/* Rosary Prayers */}
        <section className="bg-white rounded shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#8B0000] mb-4">
            Holy Rosary Prayers
          </h2>
          <p className="text-gray-600 mb-6">
            Prayers of the Rosary in{" "}
            {language === "latin" ? "Latin" : "English"}.
          </p>
          <div className="space-y-6">
            {rosaryPrayers.map((prayer, idx) => (
              <div key={idx} className="border-b pb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {prayer.title}
                </h3>
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {language === "latin" ? prayer.latin : prayer.english}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Mysteries */}
        <section className="bg-white rounded shadow-md p-6">
          <h2 className="text-2xl font-semibold text-[#8B0000] mb-4">
            Mysteries of the Rosary
          </h2>
          <p className="text-gray-600 mb-6">
            The {language === "latin" ? "Mysteria" : "Mysteries"} grouped by
            days of the week.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mysteries.map((mystery, idx) => (
              <div
                key={idx}
                className="border rounded p-4 shadow-sm bg-gray-50"
              >
                <h3 className="text-lg font-bold text-[#8B0000] mb-3">
                  {language === "latin"
                    ? mystery.name.replace(/Mysteries/, "Mysteria")
                    : mystery.name}
                </h3>
                <ol className="list-decimal list-inside space-y-1">
                  {(language === "latin"
                    ? mystery.prayersLatin
                    : mystery.prayers
                  ).map((pr, i) => (
                    <li key={i} className="text-gray-700">
                      {pr}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-600 bg-white border-t">
        BibleMind. All rights reserved.
      </footer>
    </div>
  );
}
