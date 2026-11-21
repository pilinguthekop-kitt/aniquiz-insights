// Original, text-only trivia questions (no copyrighted images or synopses).
// answer = index of the correct option. src = reference checked 2026-11-22
// (see outputs/2026-11-22_anime-quiz-factcheck.md).
const W = "https://en.wikipedia.org/wiki/";
window.QUESTIONS = [
  // Studios
  { id: "s1", cat: "Studios", q: "Which studio animated the first three seasons of Attack on Titan?", options: ["MAPPA", "Wit Studio", "Bones", "Kyoto Animation"], answer: 1, src: W + "Wit_Studio" },
  { id: "s2", cat: "Studios", q: "Which studio produced the Demon Slayer TV anime?", options: ["ufotable", "A-1 Pictures", "Madhouse", "Trigger"], answer: 0, src: W + "Demon_Slayer:_Kimetsu_no_Yaiba" },
  { id: "s3", cat: "Studios", q: "Which studio animated Jujutsu Kaisen?", options: ["Bones", "CloverWorks", "MAPPA", "Kyoto Animation"], answer: 2, src: W + "MAPPA" },
  { id: "s4", cat: "Studios", q: "Spirited Away was produced by which studio?", options: ["Studio Ghibli", "Studio Ponoc", "CoMix Wave Films", "Toei Animation"], answer: 0, src: "https://www.oscars.org/oscars/ceremonies/2003" },
  { id: "s5", cat: "Studios", q: "Which studio animated Mob Psycho 100?", options: ["Madhouse", "Bones", "Wit Studio", "Shaft"], answer: 1, src: W + "Bones_(studio)" },
  { id: "s6", cat: "Studios", q: "Which studio produced the 2011 Steins;Gate TV anime?", options: ["White Fox", "Sunrise", "J.C.Staff", "P.A. Works"], answer: 0, src: W + "White_Fox" },
  { id: "s7", cat: "Studios", q: "Violet Evergarden was animated by which studio?", options: ["Kyoto Animation", "ufotable", "Production I.G", "Lerche"], answer: 0, src: W + "Violet_Evergarden" },
  { id: "s8", cat: "Studios", q: "Which studio produced the original Cowboy Bebop TV series?", options: ["Gainax", "Bones", "Sunrise", "Madhouse"], answer: 2, src: W + "Cowboy_Bebop" },
  { id: "s9", cat: "Studios", q: "Which studio animated the first season of One Punch Man?", options: ["J.C.Staff", "Madhouse", "MAPPA", "Studio Pierrot"], answer: 1, src: W + "One-Punch_Man" },
  { id: "s10", cat: "Studios", q: "Fullmetal Alchemist: Brotherhood was produced by which studio?", options: ["Bones", "Sunrise", "A-1 Pictures", "Toei Animation"], answer: 0, src: W + "Fullmetal_Alchemist:_Brotherhood" },

  // Characters
  { id: "c1", cat: "Characters", q: "Levi Ackerman appears in which series?", options: ["Tokyo Ghoul", "Attack on Titan", "Vinland Saga", "Black Clover"], answer: 1, src: W + "List_of_Attack_on_Titan_characters" },
  { id: "c2", cat: "Characters", q: "Roronoa Zoro is a member of which crew?", options: ["Straw Hat Pirates (One Piece)", "Phantom Troupe (Hunter x Hunter)", "Fairy Tail Guild", "Survey Corps (Attack on Titan)"], answer: 0, src: W + "Roronoa_Zoro" },
  { id: "c3", cat: "Characters", q: "Killua Zoldyck is a main character in which series?", options: ["Naruto", "Bleach", "Hunter x Hunter", "Yu Yu Hakusho"], answer: 2, src: W + "Killua_Zoldyck" },
  { id: "c4", cat: "Characters", q: "Spike Spiegel is the protagonist of which series?", options: ["Trigun", "Cowboy Bebop", "Samurai Champloo", "Outlaw Star"], answer: 1, src: W + "Spike_Spiegel" },
  { id: "c5", cat: "Characters", q: "Light Yagami is the protagonist of which series?", options: ["Code Geass", "Psycho-Pass", "Death Note", "Monster"], answer: 2, src: W + "Light_Yagami" },
  { id: "c6", cat: "Characters", q: "Edward Elric is known as the 'Fullmetal' what?", options: ["Samurai", "Alchemist", "Knight", "Hunter"], answer: 1, src: W + "Edward_Elric" },
  { id: "c7", cat: "Characters", q: "Satoru Gojo appears in which series?", options: ["Jujutsu Kaisen", "Chainsaw Man", "Blue Lock", "Demon Slayer"], answer: 0, src: W + "Satoru_Gojo" },
  { id: "c8", cat: "Characters", q: "Anya Forger, a telepathic girl, appears in which series?", options: ["Oshi no Ko", "Spy x Family", "Frieren", "Bocchi the Rock!"], answer: 1, src: W + "Spy_%C3%97_Family" },
  { id: "c9", cat: "Characters", q: "Rintaro Okabe calls himself a 'mad scientist' in which series?", options: ["Steins;Gate", "Dr. Stone", "Erased", "Serial Experiments Lain"], answer: 0, src: W + "Steins;Gate_(TV_series)" },
  { id: "c10", cat: "Characters", q: "Shinji Ikari pilots Unit-01 in which series?", options: ["Gurren Lagann", "Code Geass", "Neon Genesis Evangelion", "Darling in the Franxx"], answer: 2, src: W + "Shinji_Ikari" },

  // History & Creators
  { id: "h1", cat: "History & Creators", q: "In which year was the Academy Awards ceremony held at which Spirited Away won Best Animated Feature?", options: ["2001", "2002", "2003", "2005"], answer: 2, src: "https://www.oscars.org/oscars/ceremonies/2003" },
  { id: "h2", cat: "History & Creators", q: "In which year did Neon Genesis Evangelion first air on TV?", options: ["1993", "1995", "1997", "1999"], answer: 1, src: "https://www.imdb.com/title/tt0112159/releaseinfo" },
  { id: "h3", cat: "History & Creators", q: "In which year did Cowboy Bebop first air?", options: ["1996", "1998", "2000", "2002"], answer: 1, src: W + "Cowboy_Bebop" },
  { id: "h4", cat: "History & Creators", q: "In which year did the Death Note anime premiere?", options: ["2004", "2006", "2008", "2010"], answer: 1, src: W + "List_of_Death_Note_episodes" },
  { id: "h5", cat: "History & Creators", q: "In which year did the Attack on Titan anime premiere?", options: ["2011", "2012", "2013", "2015"], answer: 2, src: W + "Attack_on_Titan_(TV_series)" },
  { id: "h6", cat: "History & Creators", q: "Which film became the highest-grossing film at the Japanese box office after its 2020 release?", options: ["Your Name", "Demon Slayer: Mugen Train", "Spirited Away", "Jujutsu Kaisen 0"], answer: 1, src: "https://www.nippon.com/en/japan-data/h02537/" },
  { id: "h7", cat: "History & Creators", q: "Who directed the film Your Name (2016)?", options: ["Mamoru Hosoda", "Hayao Miyazaki", "Makoto Shinkai", "Satoshi Kon"], answer: 2, src: W + "Your_Name" },
  { id: "h8", cat: "History & Creators", q: "In which year was the film Akira released?", options: ["1984", "1988", "1991", "1995"], answer: 1, src: W + "Akira_(1988_film)" },
  { id: "h9", cat: "History & Creators", q: "Who created the One Piece manga?", options: ["Masashi Kishimoto", "Eiichiro Oda", "Akira Toriyama", "Tite Kubo"], answer: 1, src: W + "Eiichiro_Oda" },
  { id: "h10", cat: "History & Creators", q: "Who created the Hunter x Hunter manga?", options: ["Yoshihiro Togashi", "Hiromu Arakawa", "Kentaro Miura", "Naoko Takeuchi"], answer: 0, src: W + "Yoshihiro_Togashi" }
];
