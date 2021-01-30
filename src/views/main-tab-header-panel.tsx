import { ReactNode } from 'react';

type MainTabHeaderPanelProps = {
  topHeaders: ReadonlyArray<ReactNode>;
  bottomHeaders?: ReadonlyArray<ReactNode>;
};

export default function MainTabHeaderPanel({ topHeaders, bottomHeaders }: MainTabHeaderPanelProps) {
  return (
    <div className="MainTabHeaderPanel">
      <div className="MainTabHeaderPanel__tabHeaderContainer top">{topHeaders}</div>
      <div className="MainTabHeaderPanel__tabHeaderContainer bottom">{bottomHeaders}</div>
    </div>
  );
}
