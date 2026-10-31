# Personal Health Tracker

A multi-user web app for tracking medication refills, prescription status and lab results.

I built this because managing one long-term prescription meant juggling three separate sites: one for doctor appointments, one for the pharmacy, and one for lab results. This app brings that information into a single account: it works out when each prescription is running low, flags lab results outside their reference range, and keeps every user's data separate.

> **Status:** in progress. The backend API, authentication and database are working. The frontend, tests and deployment are next.

## Features

**Built**
- Sign up and log in, with passwords hashed using bcrypt
- JWT access tokens, sent in the `Authorization` header and verified on every protected request
- Protected routes: users can only access their own data
- SQLite database with foreign keys and unique constraints
- Per-user data isolation: every query is scoped to the logged-in user
- Refill alerts: calculates when the current supply runs low, and whether to contact the pharmacy or make the doctor's appointment
- Lab results: stores test values and checks them against reference ranges

**Planned**
- Frontend in React: login, dashboard and lab history
- Automated tests, including a test that one user can't see another user's data
- CI with GitHub Actions
- Deployment with PostgreSQL

## Tech stack

- **Backend:** Python, FastAPI
- **Database:** SQLite (PostgreSQL planned for deployment)
- **Auth:** passlib (bcrypt), PyJWT
- **Validation:** Pydantic

## API endpoints

| Method | Path | Description | Auth | Status |
|---|---|---|---|---|
| GET | `/` | Health check | No | Done |
| POST | `/signup` | Create an account | No | Done |
| POST | `/login` | Log in and receive a JWT | No | Done |
| GET | `/medications` | List my medications, with refill alerts | Yes | Done |
| POST | `/medications` | Add a medication | Yes | Done |
| DELETE | `/medications/{medication_id}` | Delete one of my medications | Yes | Done |
| GET | `/labs` | List my lab results, with range checks | Yes | Done |
| POST | `/labs` | Add a lab result | Yes | Done |

## Project structure

```
main.py            FastAPI app, routes and token check
auth.py            Signup, login, password hashing, JWT
storage.py         SQLite tables and database queries
user.py            User model
med_refill.py      Medication model and refill-alert logic
refill_tracker.py  In-memory collection of a user's medications
lab_record.py      Lab result model and range check
lab_tracker.py     In-memory collection of a user's lab results
```

## Running locally

```bash
pip install fastapi uvicorn "passlib[bcrypt]" "bcrypt==3.2.2" pyjwt
uvicorn main:app --reload
```

Then open http://127.0.0.1:8000/docs to try the API. To call a protected route, log in with `POST /login`, copy the `access_token`, click **Authorize**, and paste it in.

> `bcrypt` is pinned to 3.2.2 because newer versions aren't compatible with passlib 1.7.4.

## Security notes

- Passwords are never stored in plain text, only bcrypt hashes.
- Responses never include password hashes.
- The JWT secret key is currently a development placeholder. It will move to an environment variable before deployment.
