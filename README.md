# EventPulse — Event Discovery & Tracking Platform

An intelligent event discovery and tracking platform built with the MERN stack. Fetches real events from Ticketmaster, supports RSVP with MongoDB persistence, friend invite/referral tracking, calendar view, and a backend-backed chat assistant.

## Architecture

```
Frontend (React + Vite + Tailwind)
        ↓ REST API (Axios)
Backend (Node.js + Express)
        ↓                  ↓
   MongoDB          Ticketmaster API
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, date-fns |
| Backend | Node.js, Express, Mongoose, Axios, nanoid |
| Database | MongoDB |
| External API | Ticketmaster Discovery API |

## Features

1. **Event Discovery** — Search events by keyword and city via Ticketmaster
2. **Event Cards** — Title, venue, date, time, image, Interested button, Friends Attending, Share
3. **RSVP System** — Backend-persisted RSVP with duplicate prevention
4. **RSVP Dashboard** — Dedicated page showing user's interested events
5. **Friend Invite (Vibe Check)** — Share link generation → click tracking → Friends Attending count
6. **Event Calendar** — Monthly grid with event date highlights and date-based filtering
7. **User Profile** — Editable name/email persisted in MongoDB
8. **Reminder Settings** — Toggle and time selection persisted in MongoDB
9. **Chat Assistant** — Deterministic intent-based event assistant using real backend data

## Folder Structure

```
chat/
├── backend/
│   └── src/
│       ├── config/db.js           # MongoDB connection
│       ├── controllers/           # Request handlers
│       ├── routes/                # Express routes
│       ├── services/              # Business logic
│       ├── models/                # Mongoose schemas
│       ├── middleware/            # Error handler, demo user
│       ├── app.js                 # Express app setup
│       └── server.js              # Entry point
├── frontend/
│   └── src/
│       ├── components/            # Reusable UI components
│       ├── pages/                 # Route pages
│       ├── services/api.js        # Axios instance
│       ├── App.jsx                # Router + layout
│       └── main.jsx               # React entry
├── .env.example
├── .gitignore
└── README.md
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/eventpulse
TICKETMASTER_API_KEY=your_ticketmaster_api_key
```

Get a free Ticketmaster API key at [developer.ticketmaster.com](https://developer.ticketmaster.com).

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas)
- Ticketmaster API key

### Backend
```bash
cd backend
npm install
npm run dev
```
Server starts on http://localhost:5000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App starts on http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/events` | Fetch events (query: keyword, city, startDateTime, endDateTime) |
| GET | `/api/events/:id` | Single event details |
| POST | `/api/rsvps` | Create RSVP |
| GET | `/api/rsvps` | Get user's RSVPs |
| DELETE | `/api/rsvps/:eventId` | Remove RSVP |
| POST | `/api/events/:eventId/share` | Generate share link |
| GET | `/api/share/:code` | Resolve share link + track click |
| GET | `/api/events/:eventId/friends-count` | Friends attending count |
| GET | `/api/users/me` | Get user profile |
| PATCH | `/api/users/me` | Update user profile |
| GET | `/api/users/me/reminders` | Get reminder settings |
| PATCH | `/api/users/me/reminders` | Update reminder settings |
| POST | `/api/chat` | Chat with event assistant |

## Key Flows

### Event Flow
```
Frontend → GET /api/events → Express → Event Service → Ticketmaster API → Normalize → Frontend
```
The Ticketmaster API key never reaches the browser.

### RSVP Flow
```
Click Interested → POST /api/rsvps → Validate → Check duplicate → MongoDB → Return state → Update UI
```
RSVPs persist across browser refreshes. Duplicates return 409 Conflict.

### Friend Invite Flow (Vibe Check)
```
RSVP → Click Share → POST /api/events/:eventId/share → Generate nanoid code → Copy link
Friend opens /share/:code → Backend resolves code → Increments click → Tracks unique visitors
Event card displays Friends Attending count from backend data
```

### Chat Flow
```
User: "Show me concerts in New York"
→ POST /api/chat → Intent parser extracts {classification: "concert", city: "New York"}
→ Queries Ticketmaster → Returns real events
```

## MongoDB Models

**User**: `{ name, email, reminderSettings: { enabled, reminderTime }, createdAt }`

**RSVP**: `{ userId, eventId, eventName, eventDate, eventVenue, eventImage, status, createdAt }`
- Unique compound index on (userId, eventId)

**ShareLink**: `{ eventId, creatorUserId, code, clicks, uniqueVisitors[], createdAt }`
- Unique index on code

## Design Decisions

- **Demo user middleware** instead of OAuth — assessment doesn't require auth. Middleware attaches userId; swappable for JWT later.
- **nanoid for share codes** — short, unique, unpredictable. Not predictable event IDs.
- **Deterministic chat** — regex/keyword intent parser. PDF explicitly allows this.
- **Custom calendar** — lightweight, no heavy library. date-fns for date math.
- **localStorage visitor ID** — simple de-duplication for share link click tracking.
- **All business logic on backend** — RSVP validation, duplicate checks, referral tracking, chat intent processing.

## Known Limitations

- Demo user only (no real authentication)
- No notification infrastructure for reminders (settings are persisted)
- Chat uses keyword matching, not NLP/LLM
- No caching of Ticketmaster responses

## Future Improvements

- JWT/OAuth authentication
- Push notifications for reminders
- LLM-powered chat assistant
- Event caching with Redis
- Social features (friend lists, activity feed)
- Event detail page with full info
