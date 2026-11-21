# AniQuiz Insights

A static anime trivia quiz with a built-in personal analytics dashboard. It is a non-commercial portfolio project.

**Live site:** https://pilinguthekop-kitt.github.io/aniquiz-insights/

## Features
- A daily challenge (the same 10 questions for everyone, seeded by date), plus mixed and per-category quizzes
- A response timer for every question
- A stats dashboard (Chart.js) showing accuracy by category, a response-time histogram and a learning curve
- Item analysis that computes each question's difficulty index (p) and average response time, an idea taken from test design and quality control
- CSV export of every attempt

## Data and copyright
All questions are original text, and each one links to a reference source (checked on 2026-11-22). The site hosts no official images, audio or synopses, and it is not affiliated with any studio, AniList or MyAnimeList. Results are stored only in the browser's localStorage.

## Run locally
```
python -m http.server 8123
```
