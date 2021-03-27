export const LOCAL_STORAGE_KEY = {
  JWT_TOKEN: 'jwt-token',
  HTTP_PORT: 'http-port',
  WEBSOCKET_PORT: 'websocket-port',
};

export function getValueFromLocalStorage(key: string): string | undefined;
export function getValueFromLocalStorage(key: string, fallbackValue: string): string;
export function getValueFromLocalStorage(key: string, fallbackValue?: string) {
  const value = localStorage.getItem(key);

  return value ? value : fallbackValue;
}
