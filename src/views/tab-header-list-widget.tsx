import { ReactNode } from 'react';

type TabHeaderListWidgetProps = {
  topHeaders: ReadonlyArray<ReactNode>;
  bottomHeaders?: ReadonlyArray<ReactNode>;
};

export default function TabHeaderListWidget({
  topHeaders,
  bottomHeaders,
}: TabHeaderListWidgetProps) {
  return (
    <div className="TabHeaderListWidget">
      <div className="TabHeaderListWidget__tabHeaderContainer top">{topHeaders}</div>
      <div className="TabHeaderListWidget__tabHeaderContainer bottom">{bottomHeaders}</div>
    </div>
  );
}
