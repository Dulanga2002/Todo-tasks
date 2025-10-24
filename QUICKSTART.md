# Quick Start Guide - Todo Task Manager

## 🚀 Option 1: Run with Docker (Recommended - Easiest)

### Prerequisites
- Docker Desktop installed and running
- Git

### Steps

1. **Clone and navigate:**
```powershell
git clone https://github.com/Dulanga2002/Todo-tasks.git
cd Todo-tasks
git checkout task
```

2. **Start all services:**
```powershell
docker-compose up --build
```

Wait for all services to start (this will take 2-3 minutes on first run)

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/tasks
- Health Check: http://localhost:4000/api/health

4. **Stop services:**
```powershell
# Stop containers
docker-compose down

# Stop and remove data
docker-compose down -v
```

---

## 💻 Option 2: Run Locally (For Development)

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0 installed and running
- Git

### Backend Setup

1. **Install MySQL** (if not already installed):
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use: `winget install Oracle.MySQL`

2. **Create database:**
```powershell
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE todo_db;
exit;
```

Or import the schema directly:
```powershell
mysql -u root -p < database\schema.sql
```

3. **Setup backend:**
```powershell
cd backend
npm install
cp .env.example .env
```

Edit `.env` if needed (update DB password):
```
DB_PASSWORD=your_mysql_password
```

4. **Start backend:**
```powershell
npm run dev
```

Backend will run on http://localhost:4000

### Frontend Setup

1. **Open new terminal and setup frontend:**
```powershell
cd frontend
npm install
```

2. **Start frontend:**
```powershell
npm run dev
```

Frontend will run on http://localhost:5173

---

## 🧪 Running Tests

### Backend Tests

```powershell
cd backend
npm test
```

Run with coverage:
```powershell
npm test -- --coverage
```

### Frontend Tests

```powershell
cd frontend
npm test
```

Run with coverage:
```powershell
npm run test:coverage
```

---

## 📝 Testing the Application

1. **Create a task:**
   - Open http://localhost:3000 (or :5173 for local dev)
   - Enter a title (e.g., "Buy groceries")
   - Enter a description (optional)
   - Click "Create Task"

2. **View tasks:**
   - Tasks appear below the form
   - Only the 5 most recent incomplete tasks are shown

3. **Complete a task:**
   - Click the "Done" button on any task
   - The task disappears from the list (marked as completed)

4. **Test API directly:**
```powershell
# Get tasks
curl http://localhost:4000/api/tasks

# Create task
curl -X POST http://localhost:4000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Test Task\",\"description\":\"Test Description\"}"

# Complete task (replace 1 with actual task ID)
curl -X PATCH http://localhost:4000/api/tasks/1/complete
```

---

## 🐛 Common Issues & Solutions

### Issue: Port already in use
**Solution:**
```powershell
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :3306

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue: MySQL connection failed
**Solution:**
- Ensure MySQL service is running
- Check username/password in backend/.env
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Issue: Docker containers won't start
**Solution:**
```powershell
# Clean up everything
docker-compose down -v
docker system prune -a

# Restart Docker Desktop, then:
docker-compose up --build
```

### Issue: Frontend can't connect to backend
**Solution:**
- Check backend is running: http://localhost:4000/api/health
- Verify VITE_API_URL in frontend/.env is set to http://localhost:4000/api
- Check browser console for CORS errors

---

## 📊 Project Statistics

- **Backend Files:** 8 core files + tests
- **Frontend Files:** 10 components + tests
- **Test Coverage Target:** >80%
- **Docker Services:** 3 (frontend, backend, database)
- **API Endpoints:** 4 (GET, POST, PATCH, health)

---

## 🎯 Assignment Requirements Checklist

- ✅ Create tasks with title and description
- ✅ Show 5 most recent incomplete tasks
- ✅ Mark tasks as completed (hides from UI)
- ✅ REST API backend
- ✅ React SPA frontend
- ✅ MySQL database
- ✅ Docker containerization for all components
- ✅ Unit tests for backend
- ✅ Integration tests for backend
- ✅ Component tests for frontend
- ✅ Comprehensive README
- ✅ Clean code principles
- ✅ SOLID principles

---

## 📞 Need Help?

Check the main README.md for more detailed documentation, API examples, and architecture diagrams.
