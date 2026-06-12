# PrepRoute Test Manager

A modern test management application for creating, managing, and publishing practice tests, PYQs, and mock tests.

## Features

- **Authentication**: Secure login with JWT tokens
- **Dashboard**: View all tests with filters and pagination
- **Test Creation**: 
  - Create tests with custom subjects, topics, and subtopics
  - Set difficulty level and marking scheme
  - Configure total time and total marks
- **Question Management**:
  - Add multiple choice questions (MCQs)
  - Rich text editor for question text
  - Add explanations for correct answers
  - Optional media URL support
- **Preview & Publish**:
  - Preview complete test before publishing
  - Publish tests to make them live
- **Test Tracking**: (Coming Soon) Track test performance and analytics

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Rich Text Editor**: TipTap
- **Icons**: React Icons (Fi)
- **Notifications**: Sonner
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

## Usage

1. **Login**: Use your credentials to log in
2. **Create a Test**: Go to Test Creation and fill in the test details
3. **Add Questions**: Add MCQs with correct answers and explanations
4. **Preview & Publish**: Review your test and publish it
5. **View in Dashboard**: See your published tests on the dashboard

## Project Structure

```
src/
├── api/              # API service functions
├── assets/           # Images, icons, and other static assets
├── components/       # Reusable components
├── layouts/          # Page layout components
├── pages/            # Page components
├── routes/           # Routing configuration
├── services/         # Utility services
├── store/            # Zustand state management
├── types/            # TypeScript type definitions
└── utils/            # Helper functions and constants
```

## License

MIT
