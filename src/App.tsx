import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { DialogHost } from './components/dialog';
import { SwitchHost } from './components/switch-host';
import WindowView from './views/window-view';

function App() {
  useEffect(() => {
    document.body.classList.add('theme-dark');
  }, []);

  return (
    <RecoilRoot>
      <DialogHost>
        <SwitchHost>
          <WindowView />
        </SwitchHost>
      </DialogHost>
    </RecoilRoot>
  );
}

export default App;
