import { ReactComponent as SearchIcon } from 'images/search.svg';

export default function SearchBox() {
  return (
    <div className="SearchBox">
      <SearchIcon className="SearchBox__icon" width="16px" height="16px" />
      <input type="text" className="SearchBox__input" />
    </div>
  );
}
