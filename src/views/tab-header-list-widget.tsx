import { ReactNode } from 'react';

type Props = {
  topHeaders: ReadonlyArray<ReactNode>;
  bottomHeaders?: ReadonlyArray<ReactNode>;
};

export default function TabHeaderListWidget({
  topHeaders,
  bottomHeaders,
}: Props) {
  return (
    <div className="TabHeaderListWidget">
      <div className="TabHeaderListWidget__tabHeaderContainer top">{topHeaders}</div>
      <div className="TabHeaderListWidget__tabHeaderContainer bottom">{bottomHeaders}</div>
    </div>
  );
}
