import { ReactComponent as SearchIcon } from 'images/search.svg';

type Props = {
  text: string;
  setText: (value: string) => void;
};

export default function SearchBox({ text, setText }: Props) {
  return (
    <div className="SearchBox">
      <SearchIcon className="SearchBox__icon" width="16px" height="16px" />
      <input
        type="text"
        className="SearchBox__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
