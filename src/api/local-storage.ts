export const LOCAL_STORAGE_KEY = {
  JWT_TOKEN: 'jwt-token',
  HTTP_HOST: 'http-host',
  WEBSOCKET_HOST: 'websocket-host',
  THEME: 'theme',
  CULTURE: 'culture',
};

export const DEFAULT_LOCAL_VALUE = {
  HTTP_HOST: 'http://localhost:6900',
  WEBSOCKET_HOST: 'ws://localhost:9500',
};

export function getValueFromLocalStorage(key: string): string | undefined;
export function getValueFromLocalStorage(key: string, fallbackValue: string): string;
export function getValueFromLocalStorage(key: string, fallbackValue?: string) {
  const value = localStorage.getItem(key);

  return value ? value : fallbackValue;
}
