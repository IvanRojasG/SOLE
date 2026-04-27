export type AuthActionState = {
  error: string | null;
  redirectTo: string | null;
};

export const authActionInitialState: AuthActionState = {
  error: null,
  redirectTo: null,
};
