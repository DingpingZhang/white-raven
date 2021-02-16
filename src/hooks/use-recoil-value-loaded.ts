import { RecoilValue, useRecoilValueLoadable } from 'recoil';

export default function useRecoilValueLoaded<T>(recoilValue: RecoilValue<T>, fallback: T) {
  const loadable = useRecoilValueLoadable(recoilValue);
  return loadable.state === 'hasValue' ? loadable.contents : fallback;
}
