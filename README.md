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

## Technical Decisions

### 1. Framework & Build Tool: React 18 + TypeScript + Vite
- **React 18**: Modern, widely-adopted, with great tooling and community support
- **TypeScript**: Ensures type safety, reduces runtime errors, improves code maintainability
- **Vite**: Fast dev server and build times, optimized for modern frontend development

### 2. Styling: Tailwind CSS
- **Utility-first CSS**: Rapid development, no custom CSS needed for most cases
- **Responsive design built-in**: Tailwind's utility classes handle responsiveness out-of-the-box
- **Consistency**: Enforces consistent styling across the app

### 3. State Management: Zustand
- **Lightweight**: Simple API, minimal boilerplate
- **Simplicity**: No complex setup, avoids over-engineering for a small-to-medium app
- **Persistence-ready**: Easy to persist state (like JWT token)

### 4. Rich Text Editor: Tiptap
- **Headless UI**: Flexible, can customize the UI as needed
- **ProseMirror power**: Built on ProseMirror, robust for complex text editor
- **Extensions support**: Plugins for images, text alignment, links, etc.

### 5. CSV Parsing: Papa Parse
- **Reliable**: Handles edge cases in CSV files
- **Client-side only**: No server dependency, fast parsing
- **Good documentation and community support

### 6. Routing: React Router DOM
- **Industry standard**: Well-known, robust routing for React apps
- **Dynamic routing**: For nested routes, dynamic params (e.g., /edit-test/:id)
- **Nested layouts**: Easy to implement nested layouts like DashboardLayout

### 7. Notifications: Sonner
- **Clean UI**: Beautiful, good-looking, non-intrusive notifications
- **Simple API**: easy to use and customize
- **No dependencies**: Lightweight, fast to integrate

## License

MIT
