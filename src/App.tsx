import GlobalContextRoot from 'models/global-context';
import { DialogHost } from './components/dialog';
import { SwitchHost } from './components/switch-host';
import WindowView from './views/window-view';

function App() {
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
