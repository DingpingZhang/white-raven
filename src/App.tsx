import { useEffect } from 'react';
import { DialogHost } from './components/dialog';
import { SwitchHost } from './components/switch-host';
import WindowContent from './views/window-content';

function App() {
  useEffect(() => {
    document.body.classList.add('theme-dark');
  }, []);

  return (
    <DialogHost>
      <SwitchHost>
        <WindowContent />
      </SwitchHost>
    </DialogHost>
  );
}

export default App;
