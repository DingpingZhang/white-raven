import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { DialogHost } from './components/dialog';
import { SwitchHost } from './components/switch-host';
import WindowContent from './views/window-content';

function App() {
  useEffect(() => {
    document.body.classList.add('theme-dark');
  }, []);

  return (
    <RecoilRoot>
      <DialogHost>
        <SwitchHost>
          <WindowContent />
        </SwitchHost>
      </DialogHost>
    </RecoilRoot>
  );
}

export default App;
