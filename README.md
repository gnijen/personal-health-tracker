# Personal Health Tracker

A multi-user web app for tracking medication refills, prescription status and lab results.

**Live app:** https://personal-health-tracker-web.onrender.com
**API docs:** https://personal-health-tracker-igxm.onrender.com/docs

> Hosted on Render's free tier: the first sign-in after a quiet period can take up to a minute while the server wakes up.

I built this because managing one long-term prescription meant juggling three separate sites: one for doctor appointments, one for the pharmacy, and one for lab results. This app brings that information into a single account: it works out when each prescription is running low, flags lab results outside their reference range, and keeps every user's data separate.

## Features

- **Accounts:** sign up with a first name, sign in and sign out; passwords hashed with bcrypt
- **Secure by design:** JWT access tokens checked on every protected request, and every query scoped to the signed-in user, so people only ever see their own data
- **Home:** a personal greeting, summary tiles, and a "needs your attention" list of medicines due for a refill
- **Medicines:** add and remove medicines, with a supply bar showing how many days are left
- **Refill alerts:** works out when each supply runs low, and whether to call the pharmacy or book a doctor's appointment
- **Lab results:** add results and see where each one sits against its reference range
- **Designed for people managing their health:** calm colours, large text and buttons, and a layout that works on phones (tabs move to the bottom) and laptops

## Built with

- **Frontend:** React, React Router, Vite
- **Backend:** Python, FastAPI, Pydantic
- **Database:** PostgreSQL (psycopg 3)
- **Security:** bcrypt (passlib), JWT (PyJWT), CORS limited to the app's own frontend
- **Hosting:** Render (static site and web service), deployed automatically on every merge to main

## API endpoints

| Method | Path | Description | Auth |
|---|---|---|---|
| GET | `/` | Health check | No |
| POST | `/signup` | Create an account (first name, email, password) | No |
| POST | `/login` | Sign in and receive a JWT | No |
| GET | `/medications` | List my medicines, with refill alerts | Yes |
| GET | `/medications/alerts` | List my medicines that need a refill now | Yes |
| POST | `/medications` | Add a medicine | Yes |
| DELETE | `/medications/{medication_id}` | Remove one of my medicines | Yes |
| GET | `/labs` | List my lab results, with range checks | Yes |
| POST | `/labs` | Add a lab result | Yes |

## Project structure

```
main.py            FastAPI app, routes, CORS and token check
auth.py            Sign-up, sign-in, password hashing, JWT
storage.py         PostgreSQL tables and queries
user.py            User model
med_refill.py      Medicine model and refill-alert logic
lab_record.py      Lab result model and range check
frontend/          React app (Vite)
  src/api.js         One place for all API calls
  src/Layout.jsx     Header and tabs shared by every signed-in page
  src/pages/         Sign in, sign up, Home, Medicines, Lab results and the add forms
```

## Running locally

**Backend:**
1. Create a `.env` file in the project root:
   ```
   DATABASE_URL=postgresql://...
   SECRET_KEY=any-long-random-string
   ```
2. Install and start:
   ```bash
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
   API docs: http://127.0.0.1:8000/docs

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Then open http://localhost:5173.

> `bcrypt` is pinned to 3.2.2 because newer versions aren't compatible with passlib 1.7.4.

## Security notes

- Passwords are never stored in plain text, only bcrypt hashes, and responses never include them.
- The database URL and JWT secret key live in environment variables, never in the code.
- The API only accepts browser requests from the app's own frontend (CORS).
- Only a first name is collected: the app stores no more personal information than it needs.

## What's next

- Automated tests (pytest) and CI with GitHub Actions (in progress)
- Edit a medicine
- Refill history
- Install on a phone's home screen (PWA)
- Time-zone-aware refill alerts