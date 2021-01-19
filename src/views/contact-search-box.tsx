import { ReactComponent as SearchIcon } from '../images/search.svg';

export default function ContactSearchBox() {
  return (
    <div className="contact-search-box">
      <SearchIcon className="icon-search" width="16px" height="16px" style={{ fill: '#44496d' }} />
      <input type="text" className="search-box-input" />
    </div>
  );
}
