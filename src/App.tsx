import { IdType } from 'api';
import { useLazyRef } from 'hooks';
import MessageList from 'models/message-list';
import { MessageListContext } from 'models/use-message';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { DialogHost } from './components/dialog';
import { SwitchHost } from './components/switch-host';
import WindowView from './views/window-view';

function App() {
  useEffect(() => {
    document.body.classList.add('theme-dark');
  }, []);

  const messageListStore = useLazyRef(() => new Map<IdType, MessageList>());

  return (
    <RecoilRoot>
      <MessageListContext.Provider value={messageListStore}>
        <DialogHost>
          <SwitchHost>
            <WindowView />
          </SwitchHost>
        </DialogHost>
      </MessageListContext.Provider>
    </RecoilRoot>
  );
}

export default App;
