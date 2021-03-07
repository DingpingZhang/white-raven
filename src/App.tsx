import { ThemeType, useTheme } from 'models/store';
import { useEffect, useState } from 'react';
import LoginView from 'views/login-view';
import WindowView from './views/window-view';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [theme] = useTheme();
  useEffect(() => {
    const classList = document.body.classList;
    const prevTheme: ThemeType = theme === 'theme-light' ? 'theme-dark' : 'theme-light';
    classList.remove(prevTheme);
    classList.add(theme);
  }, [theme]);

  return isLoggedIn ? <WindowView /> : <LoginView setIsLoggedIn={setIsLoggedIn} />;
}

export default App;
