# Firebase Authentication Migration Guide

This document explains the migration from NextAuth to Firebase Authentication in the VideoConf application.

## Overview

The authentication system has been migrated from NextAuth to Firebase Authentication to provide more flexibility and direct access to user information.

## Changes Made

1. **Firebase Configuration**
   - Added Firebase configuration in `src/firebase/config.ts`
   - Created an authentication context provider in `src/firebase/auth.tsx`
   - Updated environment variables to use Firebase credentials

2. **Authentication Flow**
   - Replaced NextAuth SessionProvider with Firebase AuthProvider
   - Migrated sign-in functionality to use Firebase authentication
   - Added dedicated sign-in page at `/auth/signin`
   - Implemented proper loading states and error handling

3. **User Data Access**
   - Updated components to access user data from Firebase Auth instead of NextAuth
   - Modified room access control to use Firebase user information
   - Updated UI components to display user information from Firebase

## Using Firebase Authentication

### Current Authentication Methods

- Google Sign-in
- GitHub Sign-in

### How to Access User Data

```tsx
// Import the auth hook
import { useAuth } from '@/firebase/auth';

function MyComponent() {
  // Access user data and auth methods
  const { user, loading, signInWithGoogle, signInWithGithub, signOut } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <div>Not signed in</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user.displayName}</p>
      <img src={user.photoURL} alt="Profile" />
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Authentication Functions

- `signInWithGoogle()`: Sign in with Google OAuth
- `signInWithGithub()`: Sign in with GitHub OAuth
- `signOut()`: Sign out the current user

All authentication functions return a structured response with success/error information:

```typescript
{
  success: boolean;
  error?: string;
}
```

## Legacy NextAuth Resources (Removed)

The following NextAuth resources have been removed:

- NextAuth API routes under `/pages/api/auth/[...nextauth].ts`
- NextAuth dependencies in package.json
- Legacy environment variables related to NextAuth
