export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => Promise;
}
