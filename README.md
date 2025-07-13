# Bookmrk

A modern bookmark management application built with Next.js, Firebase, and TailwindCSS. Bookmrk allows you to organize your web resources into categories and access them from anywhere, with support for both cloud storage and local-only mode.

## Features

- **Dual Storage Options**
  - Firebase cloud storage with authentication
  - Local storage mode for offline use
  - Ability to sync local data to cloud when creating an account

- **User Authentication**
  - Email/Password login
  - Google authentication
  - "Skip Login" option for local-only usage

- **Resource Management**
  - Create and organize bookmarks by categories
  - Add, edit, and delete bookmarks
  - Archive categories
  - Rich metadata display for bookmarks

- **Modern UI/UX**
  - Responsive design
  - Clean and intuitive interface
  - Real-time updates
  - Toast notifications for actions

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account (for cloud storage features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bookmrk.git
cd bookmrk
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

- **Sign Up/Sign In**: Use email/password or Google authentication
- **Skip Login**: Click "Skip login and use locally" to use the app without an account
- **Local to Cloud**: When ready, create an account to sync local data to the cloud

### Managing Bookmarks

1. **Categories**
   - Create categories to organize your bookmarks
   - Archive unused categories
   - Switch between categories using tabs

2. **Resources**
   - Add new bookmarks with title, URL, and description
   - Edit existing bookmarks
   - Delete unwanted bookmarks
   - View resources by category

### Local Mode

- All data is stored in your browser's localStorage
- Perfect for users who prefer offline-first functionality
- Easily switch to cloud storage later by creating an account

## Tech Stack

- **Frontend**: Next.js 14, React
- **Styling**: TailwindCSS, Shadcn UI
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Notifications**: Toast notifications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
