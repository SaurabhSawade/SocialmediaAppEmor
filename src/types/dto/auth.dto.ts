// Input DTOs
export interface RegisterDTO {
  email?: string;
  phone?: string;
  password: string;
  username: string;
  fullName?: string;
}

export interface LoginDTO {
  identifier: string;
  password: string;
}

export interface VerifyOTPDTO {
  identifier: string;
  otp: string;
}

export interface ForgotPasswordDTO {
  identifier: string;
}

export interface ResetPasswordDTO {
  identifier: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

// Output DTOs (What client receives)
export interface AuthResponseDTO {
  user: {
    id: number;
    email?: string | null;
    phone?: string | null;
    username: string;
    fullName?: string | null;
    avatarUrl?: string | null;
    isVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserResponseDTO {
  id: number;
  email?: string | null;
  phone?: string | null;
  username: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  isVerified: boolean;
  createdAt: Date;
  stats?: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}