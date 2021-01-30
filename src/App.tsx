import { GlobalContextRoot } from 'models/global-context';
import { useEffect } from 'react';
import { DialogHost } from './components/dialog';
import { SwitchHost } from './components/switch-host';
import WindowContent from './views/window-content';

function App() {
  useEffect(() => {
    document.body.classList.add('theme-dark');
  }, []);

  return (
    <GlobalContextRoot>
      <DialogHost>
        <SwitchHost>
          <WindowContent />
        </SwitchHost>
      </DialogHost>
    </GlobalContextRoot>
  );
}

export default App;
