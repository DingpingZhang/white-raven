import { GlobalContextRoot } from 'models/global-context';
import { useEffect } from 'react';
import { DialogHost } from './components/dialog';
import { SwitchHost } from './components/switch-host';
import WindowView from './views/window-view';

function App() {
  useEffect(() => {
    document.body.classList.add('theme-dark');
  }, []);

  return (
    <GlobalContextRoot>
      <DialogHost>
        <SwitchHost>
          <WindowView />
        </SwitchHost>
      </DialogHost>
    </GlobalContextRoot>
  );
}

export default App;
