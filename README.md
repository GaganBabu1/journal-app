# Journal App 📔

Simple journal app where you can write entries, save them, and come back later to read. Made it to learn Spring Boot + MongoDB + React. Add your thoughts, edit anytime, delete if you want!

## What's Inside 📚

Core Features:

- Create journal entries with title and content
- Read all your entries
- Edit existing entries
- Delete entries you don't need
- Search entries (searching for specific posts)
- User login/signup (secure with JWT tokens)
- Each entry gets a timestamp automatically

## Tech I Used 🔧

**Backend:**
- Spring Boot 4.0 (Java)
- MongoDB (stores all entries)
- JWT Tokens (for security)
- Maven (building)

**Frontend :**
- React 18+
- Vite
- React Router
- Axios 

## How to Run It 🚀

### Backend Setup

Clone the repo:
```bash
git clone https://github.com/yourusername/journal-app.git
cd journalApp
```

Setup MongoDB locally or use MongoDB Atlas cloud:

If local MongoDB:
```bash
mongod
```

# OR MongoDB Atlas (Cloud) - Use this for production
spring.data.mongodb.uri=mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster.mongodb.net/journaldb

Update `application.properties` with your MongoDB details:
```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=journaldb
```

Run backend:
```bash
mvn clean install
mvn spring-boot:run
```

Server runs on: `http://localhost:8080`

Test it:
```bash
curl http://localhost:8080/health-check
```
Response: `ok`

### Frontend Setup:
```bash
cd frontend
npm install
npm start
```

Runs on: `http://localhost:3000`

## API Endpoints

These are the endpoints I built:

**Login/Register:**
- `POST /api/v1/auth/login` - Login with email and password, get JWT token back
- `POST /api/v1/auth/register` - Create new account

**Journal Entries:**
- `GET /api/v1/journals` - Get all your entries
- `GET /api/v1/journals/:id` - Get one specific entry
- `POST /api/v1/journals` - Create new entry
- `PUT /api/v1/journals/:id` - Edit an entry
- `DELETE /api/v1/journals/:id` - Delete an entry
- `GET /api/v1/journals/search?query=word` - Search entries

All requests need: `Authorization: Bearer <YOUR_JWT_TOKEN>` in header

## Database Schema 📊

**Journal Entry:**
```
{
  id: ObjectId,
  title: "My heading",
  content: "What I wrote",
  userId: "who wrote it",
  date: "2024-05-04T10:30:00",
  createdAt: "when created"
}
```

**User:**
```
{
  id: ObjectId,
  name: "User name",
  email: "email@example.com",
  password: "encrypted",
  createdAt: "when joined"
}
```

## Project Structure 📂

```
journalApp/
├── src/main/java/com/example/journalApp/
│   ├── controller/     → API endpoints
│   ├── service/        → Business logic
│   ├── repository/     → Database queries
│   ├── entity/         → Database models
│   ├── config/         → Configuration
│   └── exception/      → Custom error handling
└── src/main/resources/
    └── application.properties

frontend/
├── src/components/     → React pages
├── src/services/       → API calls
├── App.jsx
└── main.jsx
```

## What I Learned 💡

- How to build REST APIs with Spring Boot
- Controllers → Services → Repository pattern (separation of concerns)
- MongoDB document storage (NoSQL)
- JWT tokens for authentication (security)
- Exception handling - what happens when things go wrong
- How to connect frontend to backend (making API calls)
- Request/Response objects (DTOs)
- How to structure a backend project properly

## Future Enhancements 🚀

- Tags and categories for entries
- Share entries with specific people
- Export entries as PDF
- Dark mode toggle
- Mobile app (React Native)
- Email backup feature

## Author

Gagan Babu

GitHub: [@GaganBabu1](https://github.com/GaganBabu1)  

