import { ReactComponent as SearchIcon } from 'images/search.svg';

type Props = {
  text: string;
  setText: (value: string) => void;
};

export default function SearchWidget({ text, setText }: Props) {
  return (
    <div className="SearchWidget">
      <SearchIcon className="SearchWidget__icon" width="16px" height="16px" />
      <input
        type="text"
        className="SearchWidget__input"
        value={text}
        onChange={e => setText(e.target.value)}
      />
    </div>
  );
}
