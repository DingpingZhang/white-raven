import logo from './logo.svg';
import './App.scss';
import ContactItem from './components/contact-item';

function App() {
  return (
    <div>
      <ContactItem
        messageCount={0}
        avatar="https://avatars0.githubusercontent.com/u/8541016?s=460&u=7920c831536d48ec046e6bef42393410fda4f14c&v=4"
        username="Jack Sparrow"
        lastMessage="Some common custom markup extensions for WPF."
        lastMessageTimestamp="Last seen 1 day ago"
      ></ContactItem>
      <ContactItem
        selected
        messageCount={0}
        avatar="https://avatars0.githubusercontent.com/u/8541016?s=460&u=7920c831536d48ec046e6bef42393410fda4f14c&v=4"
        username="Jack Sparrow"
        lastMessage="Some common custom markup extensions for WPF."
        lastMessageTimestamp="Last seen 1 day ago"
      ></ContactItem>
      <ContactItem
        messageCount={0}
        avatar="https://avatars0.githubusercontent.com/u/8541016?s=460&u=7920c831536d48ec046e6bef42393410fda4f14c&v=4"
        username="Jack Sparrow"
        lastMessage="Some common custom markup extensions for WPF."
        lastMessageTimestamp="Last seen 1 day ago"
      ></ContactItem>
      <ContactItem
        messageCount={0}
        avatar="https://avatars0.githubusercontent.com/u/8541016?s=460&u=7920c831536d48ec046e6bef42393410fda4f14c&v=4"
        username="Jack Sparrow"
        lastMessage="Some common custom markup extensions for WPF."
        lastMessageTimestamp="Last seen 1 day ago"
      ></ContactItem>
      <ContactItem
        messageCount={0}
        avatar="https://avatars0.githubusercontent.com/u/8541016?s=460&u=7920c831536d48ec046e6bef42393410fda4f14c&v=4"
        username="Jack Sparrow"
        lastMessage="Some common custom markup extensions for WPF."
        lastMessageTimestamp="Last seen 1 day ago"
      ></ContactItem>
    </div>
  );
}

export default App;
