// ============================================
// FILE: src/services/auth.service.ts
// ============================================

import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth'

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore'

import {
  auth,
  db,
} from '@/lib/firebase/client'

// ============================================
// Types
// ============================================

export type UserRole =
  | 'admin'
  | 'salesperson'

interface CreateUserParams {
  name: string
  email: string
  password: string
  role: UserRole
}

// ============================================
// LOGIN USER
// ============================================

export async function loginUser(
  email: string,
  password: string
) {
  try {
    const response =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

    const firebaseUser =
      response.user

    // Fetch role from Firestore
    const userDocRef = doc(
      db,
      'users',
      firebaseUser.uid
    )

    const userSnapshot =
      await getDoc(userDocRef)

    if (!userSnapshot.exists()) {
      throw new Error(
        'User profile not found.'
      )
    }

    const userData =
      userSnapshot.data()

    return {
      success: true,
      user: firebaseUser,
      role: userData.role as UserRole,
    }
  } catch (error: any) {
    console.error(
      'Login Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to login.',
    }
  }
}

// ============================================
// LOGOUT USER
// ============================================

export async function logoutUser() {
  try {
    await signOut(auth)

    return {
      success: true,
    }
  } catch (error: any) {
    console.error(
      'Logout Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to logout.',
    }
  }
}

// ============================================
// CREATE USER
// ADMIN ONLY
// ============================================

export async function createUser(
  params: CreateUserParams
) {
  try {
    const {
      name,
      email,
      password,
      role,
    } = params

    // Create Firebase Auth account
    const response =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

    const firebaseUser =
      response.user

    // Create Firestore profile
    await setDoc(
      doc(
        db,
        'users',
        firebaseUser.uid
      ),
      {
        uid: firebaseUser.uid,
        name,
        email,
        role,
        createdAt:
          serverTimestamp(),
      }
    )

    return {
      success: true,
      uid: firebaseUser.uid,
    }
  } catch (error: any) {
    console.error(
      'Create User Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to create user.',
    }
  }
}

// ============================================
// GET USER ROLE
// ============================================

export async function getUserRole(
  uid: string
) {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return null
    }

    const token = await currentUser.getIdToken()
    const response = await fetch(`/api/user/role?uid=${uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const role = await response.json()
    return role as UserRole
  } catch (error) {
    console.error(
      'Get Role Error:',
      error
    )

    return null
  }
}

// ============================================
// GET SALESPERSON USERS
// ============================================

export async function getSalespersons() {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return {
        success: false,
        message: 'Not authenticated.',
        users: [],
      }
    }

    const token = await currentUser.getIdToken()
    const response = await fetch('/api/user/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Failed to fetch salespersons.',
        users: [],
      }
    }

    return {
      success: true,
      users: data.users || [],
    }
  } catch (error: any) {
    console.error('Get Salespersons Error:', error)

    return {
      success: false,
      message: error.message || 'Failed to fetch salespersons.',
      users: [],
    }
  }
}

// ============================================
// GET USER PROFILE
// ============================================

export async function getUserProfile(
  uid: string
) {
  try {
    const currentUser = auth.currentUser
    if (!currentUser) {
      return {
        success: false,
        message: 'Not authenticated.',
      }
    }

    const token = await currentUser.getIdToken()
    const response = await fetch(`/api/user/profile?uid=${uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    if (!response.ok) {
      return {
        success: false,
        message: data.error || 'Failed to fetch profile.',
      }
    }

    return data
  } catch (error: any) {
    console.error(
      'Get User Profile Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to fetch profile.',
    }
  }
}

// ============================================
// RESET PASSWORD
// ============================================

export async function resetPassword(
  email: string
) {
  try {
    await sendPasswordResetEmail(
      auth,
      email
    )

    return {
      success: true,
    }
  } catch (error: any) {
    console.error(
      'Reset Password Error:',
      error
    )

    return {
      success: false,
      message:
        error.message ||
        'Failed to reset password.',
    }
  }
}