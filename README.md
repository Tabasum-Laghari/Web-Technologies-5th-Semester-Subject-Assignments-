# HTML5 Form - Full Stack (Node.js, Express, MongoDB)

## Run it
1. Install Node.js 18+ and MongoDB (or create a free MongoDB Atlas cluster).
2. In this folder run: `npm install`
3. Edit `.env` if your MongoDB address differs (Atlas: paste your connection string into MONGO_URI).
4. Start: `npm start` (or `npm run dev` for auto-reload)
5. Open http://localhost:3000

## API
| Method | URL                    | What it does               |
|--------|------------------------|----------------------------|
| POST   | /api/submissions       | Save a form (multipart)    |
| GET    | /api/submissions       | List all submissions       |
| GET    | /api/submissions/:id   | Get one submission         |
| DELETE | /api/submissions/:id   | Delete it and its file     |

## Structure
- server.js          Express server, routes, file upload
- models/Submission.js  Mongoose schema
- public/            index.html, style.css, script.js
- uploads/           Uploaded files
