

LearnWithEase is a fullstack MERN EdTech platform where students can create accounts, select their education/course, enroll in subjects, study chapter content, mark chapters complete, and track user-specific progress from a dashboard and profile.

env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/learnwithease
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development


Seed the database:

npm run seed



Frontend default URL: `http://localhost:5173`
Backend default URL: `http://localhost:5000`

 API routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/education`
- `GET /api/courses/education/:educationId`
- `GET /api/subjects`
- `GET /api/subjects/:id`
- `GET /api/chapters/subject/:subjectId`
- `GET /api/chapters/:id`
- `POST /api/enrollments`
- `GET /api/enrollments`
- `GET /api/enrollments/:subjectId`
- `POST /api/progress/chapter/:chapterId/complete`
- `POST /api/progress/chapter/:chapterId/access`
- `GET /api/progress`
- `GET /api/progress/subject/:subjectId`

