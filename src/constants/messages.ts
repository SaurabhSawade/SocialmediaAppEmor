export const Messages = {
  // Success Messages
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  
  // Auth Success
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful. Please verify your account',
  EMAIL_VERIFIED: 'Email verified successfully',
  OTP_SENT: 'OTP sent successfully',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset instructions sent to your email',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  LOGOUT_SUCCESS: 'Logout successful',
  
  // Auth Errors
  INVALID_CREDENTIALS: 'Invalid email/phone or password',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_OTP: 'Invalid or expired OTP',
  TOKEN_EXPIRED: 'Token has expired',
  ACCOUNT_NOT_VERIFIED: 'Please verify your account first',
  ACCOUNT_DELETED: 'Account has been deleted',
  ACCOUNT_SUSPENDED: 'Account has been suspended',
  
  // User Errors
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  PHONE_ALREADY_EXISTS: 'Phone number already registered',
  USERNAME_ALREADY_EXISTS: 'Username already taken',
  
  // Profile Errors
  PROFILE_NOT_FOUND: 'Profile not found',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  
  // Validation Errors
  VALIDATION_ERROR: 'Validation error',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PHONE: 'Invalid phone number format',
  WEAK_PASSWORD: 'Password must be at least 8 characters with at least one uppercase, one lowercase, one number, and one special character',
  PASSWORD_MISMATCH: 'Passwords do not match',
  
  // OTP Errors
  OTP_EXPIRED: 'OTP has expired',
  OTP_INVALID: 'Invalid OTP',
  OTP_RATE_LIMIT: 'Too many OTP requests. Please try again later',
  
  // Server Errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database operation failed',
  
  // Rate Limit
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
} as const;