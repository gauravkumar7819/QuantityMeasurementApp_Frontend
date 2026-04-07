# Quantity Measurement App - React Version

A modern React-based unit conversion and measurement application built with Vite, React Router, and Axios.

## 🚀 Features

- **Real-time Conversion**: Convert between units instantly as you type
- **Multiple Categories**: Support for length, weight, temperature, and volume
- **Comparison Tools**: Compare different quantities and perform arithmetic operations
- **User Authentication**: Secure login/signup system with protected routes
- **History Tracking**: Save and review conversion history
- **Responsive Design**: Works perfectly on all devices
- **Modern Stack**: Built with React, Vite, and modern JavaScript

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: CSS with CSS Variables
- **State Management**: React Context API
- **Backend**: JSON Server (for development)

## 📁 Project Structure

```
quantity-measurement-react/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Navbar.jsx      # Navigation component
│   │   └── ProtectedRoute.jsx # Authentication wrapper
│   ├── context/            # React Context providers
│   │   └── AuthContext.jsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Login.jsx       # Login page
│   │   ├── Signup.jsx      # Signup page
│   │   ├── Converter.jsx   # Main converter page
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── History.jsx     # Conversion history
│   │   └── About.jsx       # About page
│   ├── services/           # API services
│   │   └── api.js          # API configuration and calls
│   ├── utils/              # Utility functions
│   │   └── units.js        # Unit conversion logic
│   ├── App.jsx             # Main App component with routing
│   ├── main.jsx            # Application entry point
│   └── styles.css          # Global styles
├── public/                 # Static assets
├── .env.example           # Environment variables example
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quantity-measurement-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file if needed:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🗄️ Backend Setup

The app uses JSON Server for the backend API. To set it up:

1. **Navigate to the original project directory**
   ```bash
   cd ../QuantityMeasurementApp_Frontend
   ```

2. **Start the JSON Server**
   ```bash
   npm start
   ```
   This will start the server at `http://localhost:3000`

## 📱 Available Pages

- **/** - Home/Landing page
- **/login** - User login
- **/signup** - User registration
- **/converter** - Unit converter (public access)
- **/dashboard** - User dashboard (protected)
- **/history** - Conversion history (protected)
- **/about** - About page

## 🔐 Authentication

The app includes a complete authentication system:

- **Public Routes**: Home, Login, Signup, Converter, About
- **Protected Routes**: Dashboard, History
- **Auth Storage**: Uses localStorage for session management
- **Protected API Calls**: Automatic token handling for authenticated requests

## 🔄 Unit Conversion Features

### Supported Categories
- **Length**: meter, kilometer, centimeter, millimeter, mile, yard, foot, inch
- **Weight**: kilogram, gram, milligram, pound, ounce, ton
- **Temperature**: celsius, fahrenheit, kelvin
- **Volume**: liter, milliliter, gallon, quart, cup, fluid ounce

### Available Operations
- **Compare**: Compare two quantities
- **Convert**: Convert from one unit to another
- **Arithmetic**: Perform addition, subtraction, division on quantities

## 🎨 Styling

The app uses a modern CSS design system with:
- CSS Variables for theming
- Responsive grid layouts
- Smooth transitions and hover effects
- Professional color scheme
- Mobile-first responsive design

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

## 📦 Build & Deployment

### Building for Production

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

### Deployment Options

The app can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository and deploy automatically
- **Netlify**: Drag and drop the dist folder or connect Git
- **GitHub Pages**: Use GitHub Actions for automatic deployment
- **Firebase Hosting**: Deploy with Firebase CLI

#### Environment Variables for Production

Make sure to set the `VITE_API_URL` environment variable in your hosting platform to point to your production API endpoint.

## 🧪 Testing

The app is built with testability in mind:
- Component-based architecture
- Separation of concerns
- Mockable API services
- React Testing Library compatible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Migration from Vanilla JS

This React version provides several improvements over the vanilla JavaScript version:

### Key Improvements
- **Component-based architecture** for better code organization
- **React state management** instead of DOM manipulation
- **React Router** for client-side routing
- **Context API** for global state management
- **Axios** for better HTTP request handling
- **Protected routes** with authentication
- **Better error handling** and user feedback
- **Improved performance** with React's optimization

### Migration Benefits
- **Maintainability**: Easier to maintain and extend
- **Testability**: Components can be tested in isolation
- **Performance**: React's virtual DOM provides better performance
- **Developer Experience**: Better tooling and debugging
- **Scalability**: Easier to scale and add new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Original vanilla JavaScript version for the feature set and design inspiration
- React team for the amazing framework
- Vite team for the fast build tool
- JSON Server for easy backend mocking
