# Excel Analytics Platform - Client

This is the **frontend (client)** for the Excel Analytics Platform. It is built with React, Vite, and Tailwind CSS, and provides a modern UI for file upload, chart generation, AI insights, user management, and admin analytics.

---

## 🚀 Features
- Modern React UI (Vite + Tailwind)
- User authentication (JWT, context)
- File upload (Excel, CSV)
- Chart generation (2D/3D)
- AI-powered insights
- User dashboard, history, and analytics
- Admin panel (user management, platform stats, export)
- Responsive and animated design

---

## 🛠️ Setup & Installation

1. **Navigate to the client folder:**
   ```sh
   cd client
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Environment variables:**
   - Create a `.env` file in the `client` folder:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```

4. **Start the development server:**
   ```sh
   npm run dev
   ```

---

## 📁 Folder Structure

```
client/
├── public/                # Static files (index.html, images, etc.)
├── src/
│   ├── assets/            # Images, SVGs, static assets
│   ├── charts/            # Chart components (2D, 3D, selector)
│   ├── components/        # Reusable UI components
│   │   ├── layouts/       # Layout wrappers (dashboard, auth, etc.)
│   │   └── ui/            # UI primitives (button, input, etc.)
│   ├── context/           # React context (AuthContext)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components (Dashboard, Admin, etc.)
│   │   ├── Admin/         # Admin panel pages
│   │   ├── auth/          # Auth pages (Login, Register)
│   │   ├── dashboard/     # Dashboard subpages
│   │   └── features/      # Feature subpages
│   ├── redux/             # Redux slices and store
│   ├── routes/            # App routing
│   ├── services/          # API service functions
│   ├── store/             # Redux store (duplicate, for migration)
│   ├── theme/             # Theme config
│   ├── utils/             # Utility functions
│   ├── index.js           # App entry point
│   ├── index.css          # Global styles
│   └── App.js             # Main App component
├── .env                   # Environment variables (not committed)
├── .gitignore             # Git ignore rules
├── package.json           # Project metadata and scripts
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── webpack.config.js      # Webpack config (if used)
└── README.md              # This file
```

---

## 🧑‍💻 Tech Stack
- React (Vite)
- Tailwind CSS
- Redux Toolkit
- Axios
- Framer Motion (animations)
- React Router

---

## 📄 License
MIT 