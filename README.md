# MERN Task Manager App

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). Features include user authentication, task CRUD operations, drag-and-drop Kanban board, and task filtering.

## Features

- User authentication (Register/Login) with JWT
- Create, read, update, and delete tasks
- Drag-and-drop Kanban board with three columns (Pending, In Progress, Completed)
- Task table view with filtering options
- Task status management
- Due date tracking
- Responsive UI built with Ant Design
- Secure password hashing with bcrypt
- Protected API routes with JWT middleware

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Ant Design** - UI component library
- **TanStack Query (React Query)** - Data fetching and state management
- **Axios** - HTTP client
- **@hello-pangea/dnd** - Drag and drop functionality
- **Day.js** - Date manipulation

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB installation)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MERNTaskManagerApp
```

### 2. Backend Setup

#### 2.1. Navigate to the server directory

```bash
cd server
```

#### 2.2. Install dependencies

```bash
npm install
```

#### 2.3. Configure environment variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
CLIENT_URL=http://localhost:5173
PORT=5000
```

**Environment Variables Explained:**
- `MONGO_URI` - Your MongoDB connection string (from MongoDB Atlas or local instance)
- `JWT_SECRET` - Secret key for signing JWT tokens (use a strong random string in production)
- `CLIENT_URL` - Frontend URL for CORS configuration
- `PORT` - Port number for the backend server (default: 5000)

#### 2.4. Start the backend server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000` by default.

### 3. Frontend Setup

#### 3.1. Open a new terminal and navigate to the client directory

```bash
cd client
```

#### 3.2. Install dependencies

```bash
npm install
```

#### 3.3. Configure environment variables (Optional)

If your backend runs on a different URL, create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

**Note:** By default, the client will connect to `http://localhost:5000/api` if this variable is not set.

#### 3.4. Start the frontend development server

```bash
npm run dev
```

The client will run on `http://localhost:5173` by default.

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
MERNTaskManagerApp/
├── client/                      # Frontend React application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── api/                 # API client configuration
│   │   │   └── client.ts        # Axios instance with interceptors
│   │   ├── components/          # React components
│   │   │   ├── KanbanBoard.tsx  # Drag-and-drop Kanban board
│   │   │   ├── TaskModal.tsx    # Task create/edit modal
│   │   │   └── TaskTable.tsx    # Task table view
│   │   ├── context/             # React context providers
│   │   │   └── AuthContext.tsx  # Authentication context
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useTasks.ts      # Task management hook
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx    # Main dashboard with Kanban/Table views
│   │   │   ├── Login.tsx        # Login page
│   │   │   └── Register.tsx     # Registration page
│   │   ├── types.ts             # TypeScript type definitions
│   │   ├── App.tsx              # Main app component with routing
│   │   └── main.tsx             # Application entry point
│   ├── package.json
│   ├── vite.config.ts           # Vite configuration
│   └── tsconfig.json            # TypeScript configuration
│
├── server/                      # Backend Node.js application
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── Task.js          # Task Mongoose model
│   │   │   └── User.js          # User Mongoose model
│   │   ├── routes/
│   │   │   ├── auth.js          # Auth routes (register, login, me)
│   │   │   └── tasks.js         # Task routes (CRUD, reorder)
│   │   └── index.js             # Server entry point
│   ├── .env.example             # Example environment variables
│   ├── .env                     # Environment variables (create this)
│   └── package.json
│
└── README.md                    # This file
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Task Routes (`/api/tasks`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all tasks (with optional filters) | Yes |
| POST | `/api/tasks` | Create a new task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |
| PATCH | `/api/tasks/:id/complete` | Mark task as completed | Yes |
| PATCH | `/api/tasks/reorder` | Reorder tasks (for Kanban) | Yes |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Server health check | No |

## Usage

1. **Register a new account** at `/register`
2. **Login** with your credentials at `/login`
3. **Create tasks** using the "New Task" button on the dashboard
4. **Switch between views** using the Kanban Board and Table tabs
5. **Drag and drop tasks** in the Kanban view to change their status
6. **Edit or delete tasks** by clicking on task cards or using action buttons
7. **Filter tasks** in the table view by status or due date

## Available Scripts

### Backend (server/)
- `npm run dev` - Start development server with nodemon (auto-reload)
- `npm start` - Start production server
- `npm test` - Run tests (not yet implemented)

### Frontend (client/)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  timestamps: true
}
```

### Task Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  description: String,
  dueDate: Date,
  status: String (enum: ['pending', 'in_progress', 'completed']),
  order: Number (for Kanban ordering),
  timestamps: true
}
```

## Security Features

- Password hashing using bcryptjs (10 salt rounds)
- JWT-based authentication with 7-day token expiration
- Protected API routes with authentication middleware
- CORS configuration for cross-origin requests
- HTTP-only token storage recommendation
- Input validation on all endpoints

## Troubleshooting

### Backend Issues

**MongoDB connection error:**
- Verify your `MONGO_URI` is correct in the `.env` file
- Check if your IP address is whitelisted in MongoDB Atlas
- Ensure your MongoDB cluster is running

**Port already in use:**
- Change the `PORT` in the `.env` file to a different port
- Kill the process using the port: `npx kill-port 5000`

**JWT errors:**
- Ensure `JWT_SECRET` is set in the `.env` file
- Clear browser localStorage and try logging in again

### Frontend Issues

**Cannot connect to backend:**
- Verify the backend server is running on port 5000
- Check if `VITE_API_URL` is correctly set (if custom)
- Check browser console for CORS errors

**Build errors:**
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

## Development Tips

- Use the Morgan logger in the backend to debug API requests
- React Query DevTools can be added for debugging queries
- Check browser console and Network tab for frontend issues
- Use MongoDB Compass to view and debug database records

## Future Enhancements

- Task priority levels
- Task tags/labels
- Task assignments and collaboration
- Email notifications for due dates
- Dark mode support
- Mobile app (React Native)
- Task comments and attachments
- Advanced filtering and search
- Task templates
- Export tasks to CSV/PDF

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

For questions or support, please open an issue in the repository.
