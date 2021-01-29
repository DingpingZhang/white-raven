import { atom, selector } from 'recoil';
import { getSessions, getUserInfo, PersonInfo, Session } from 'api';

export const userInfoState = atom<PersonInfo>({
  key: 'userInfoState',
  default: (async () => {
    const response = await getUserInfo();
    if (response.code === 200) {
      return response.content;
    }
    throw new Error('Connot fetch the user info.');
  })(),
});

export const sessionListState = atom<Session[]>({
  key: 'sessionListState',
  default: (async () => {
    const response = await getSessions();
    if (response.code === 200) {
      return [...response.content];
    }

    return [];
  })(),
});

const innerSelectedSessionState = atom<Session | null>({
  key: 'innerSelectedSessionState',
  default: null,
});

export const selectedSessionState = selector<Session | null>({
  key: 'selectedSessionState',
  get: ({ get }) => {
    const session = get(innerSelectedSessionState);
    if (session) {
      return session;
    }

    const sessionList = get(sessionListState);
    if (sessionList.length > 0) {
      return sessionList[0];
    }

    return null;
  },
  set: ({ set }, value) => {
    set(innerSelectedSessionState, value);
  },
});
