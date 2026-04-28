export type AuthActionState = {
  error: string | null;
  redirectTo: string | null;
};

export const authActionInitialState: AuthActionState = {
  error: null,
  redirectTo: null,
};

export type PasswordActionState = {
  error: string | null;
  message: string | null;
  resetToken?: string | null;
};

export const passwordActionInitialState: PasswordActionState = {
  error: null,
  message: null,
  resetToken: null,
};
