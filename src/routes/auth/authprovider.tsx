import { useContext, createContext, useState, useEffect } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  token: string | null;
  user: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);


  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    const username = localStorage.getItem("user")
    if (username){
      setUser(username)
    }
  }, []);

  const login = (newToken: string,name:string) => {
    console.log(newToken,name)
    setToken(newToken);
    setUser(name)
    setIsAuthenticated(true);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user",name)
  };

  const logout = () => {
    setToken(null);
    setUser(null)
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

