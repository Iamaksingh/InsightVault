Here's how to set this up 

1️⃣ Clone the Repository
git clone https://github.com/yourusername/[InsightVault.git](https://github.com/Iamaksingh/InsightVault)
cd InsightVault

2️⃣ Backend Setup
cd backend
npm i
# since this is just for an assignment i have added .env in the repository itself so as the user does not have to setup anything. 
npm run dev

3️⃣ Frontend Setup
cd front
npm i
npm run dev

🧩 API Endpoints
I have attached postman requests along with this repository 

🎨 Theming Logic
The app uses shadcn/ui’s theme provider with a custom hook for theme persistence.User’s selected mode (light/dark) and accent color are stored in localStorage. On reload, the preferred theme is automatically applied.


TECHNOLOGIES USED
Database : Mongo Db atlas.
backend: node.js , express.js.
frontend: React with typescript.


IMPLEMENTATION : InsightVault is a full-stack MERN application designed to help users organize their knowledge by storing and categorizing notes, ideas, and links in a clean, modern interface built with shadcn/ui.
The application is divided into two layers:
1. Frontend (React + shadcn/ui + Tailwind)
    Built with React for component-based architecture and seamless state management.
    Utilizes shadcn/ui components (Card, Dialog, Input, theme switchers) to ensure a polished and responsive user experience.
    Implements Light and Dark Mode and accent colors toggling with persistent theme preference stored in localStorage.
    Provides a user-friendly dashboard to create, edit, delete, and filter entries based on categories or tags.
2. Backend (Node.js + Express + MongoDB)
    RESTful APIs handle CRUD operations for entries.
    Data (title, description, category, and timestamps) is stored in a MongoDB Atlas database.
    The backend is lightweight and modular, designed with route separation and Mongoose models for scalability.

Postman Documentation for testing : https://documenter.getpostman.com/view/47011916/2sB3WpSMbx

Demo URL: insightvaults.netlify.app
