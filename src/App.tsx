import { jwtTokenKey } from 'api';
import LoggedInContextRoot from 'models/logged-in-context';
import { ThemeType, useTheme } from 'models/store';
import { useEffect, useState } from 'react';
import LoginView from 'views/login-view';
import WindowView from './views/window-view';

const hasBeenLoggedIn = !!localStorage.getItem(jwtTokenKey);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasBeenLoggedIn);
  const [theme] = useTheme();
  useEffect(() => {
    const classList = document.body.classList;
    const prevTheme: ThemeType = theme === 'theme-light' ? 'theme-dark' : 'theme-light';
    classList.remove(prevTheme);
    classList.add(theme);
  }, [theme]);

  return isLoggedIn ? (
    <LoggedInContextRoot>
      <WindowView />
    </LoggedInContextRoot>
  ) : (
    <LoginView setIsLoggedIn={setIsLoggedIn} />
  );
}

export default App;
