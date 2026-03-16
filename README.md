# NuTrack - Smart Nutrition Tracking App

A comprehensive nutrition tracking application with AI-powered recipe recommendations and meal planning.

## Features

- 🥗 **Nutrition Tracking**: Monitor your daily nutritional intake
- 🍳 **Recipe Management**: Discover and save healthy recipes
- 🤖 **AI Recommendations**: Get personalized meal suggestions using AI
- 📸 **Vision Analysis**: Analyze fridge contents for meal planning
- 👤 **User Profiles**: Personalized nutrition goals and preferences

## Tech Stack

### Frontend
- React 19
- Redux for state management
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Flask (Python)
- JSON-based data storage
- CORS enabled for frontend integration
- External AI APIs (Groq & Gemini)

## Project Structure

```
NuTrack.com/
├── frontend/          # React frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/           # Flask backend API
│   ├── app.py        # Main Flask application
│   ├── data.json     # Data storage
│   └── requirements.txt # Python dependencies
├── vercel.json        # Vercel deployment configuration
├── package.json       # Root package.json with scripts
└── README.md          # This file
```

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/NuTrack.com.git
   cd NuTrack.com
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Backend environment variables
   cp backend/.env.example backend/.env
   # Edit backend/.env with your API keys
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Recipes
- `GET /api/recipes/search` - Search recipes
- `POST /api/recipes` - Add new recipe
- `GET /api/recipes/:id` - Get recipe by ID

### AI Features
- `POST /api/vision/analyze-fridge` - Analyze fridge image
- `POST /api/ai/recommendations` - Get AI recommendations

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Set up environment variables in Vercel**
   ```bash
   vercel env add GROQ_API_KEY
   vercel env add GEMINI_API_KEY
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

The application will be deployed with:
- Frontend served from the root domain
- API endpoints available at `/api/*`
- Serverless functions for backend routes

### Manual Deployment

1. **Build frontend**
   ```bash
   cd frontend && npm run build
   ```

2. **Deploy backend** (to your preferred hosting service)
   - Ensure environment variables are set
   - Configure CORS for your frontend domain

## Security Notes

- API keys are stored in environment variables
- No sensitive data is committed to version control
- CORS is configured for production domains
- Input validation and sanitization implemented

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Open an issue on GitHub
- Contact the development team

---

**Note**: Make sure to set up your API keys for Groq and Gemini services to enable AI features.
