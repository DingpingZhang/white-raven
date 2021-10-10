import {
  DEFAULT_LOCAL_VALUE,
  getValueFromLocalStorage,
  LOCAL_STORAGE_KEY,
} from 'api/local-storage';
import { ComboBox, ComboBoxItem } from 'components/combo-box';
import { LanguageCode, useI18n } from 'i18n';
import { ThemeType, useCulture, useTheme } from 'models/global-context';
import { ReactElement, useEffect, useMemo, useRef } from 'react';
import BaseDialog from './base-dialog';

type SettingItemProps = {
  text: string;
  children: ReactElement;
};

function SettingItem({ text, children }: SettingItemProps) {
  return (
    <div className="SettingItem">
      <span className="SettingItem__text">{text}</span>
      <div className="SettingItem__editor">{children}</div>
    </div>
  );
}

type Props = {
  close: () => void;
  isLoggedIn?: boolean;
};

export function buildSettingsDialog(close: () => void, isLoggedIn?: boolean) {
  return <SettingsDialog close={close} isLoggedIn={isLoggedIn} />;
}

export default function SettingsDialog({ close, isLoggedIn }: Props) {
  const { $t } = useI18n();
  const cultures = useMemo<ComboBoxItem<LanguageCode>[]>(
    () => [
      { label: '简体中文', value: 'zh-CN' },
      { label: 'English', value: 'en-US' },
    ],
    []
  );
  const themes = useMemo<ComboBoxItem<ThemeType>[]>(
    () => [
      { label: $t('theme.dark'), value: 'theme-dark' },
      { label: $t('theme.light'), value: 'theme-light' },
    ],
    [$t]
  );
  const [culture, setCulture] = useCulture();
  const [theme, setTheme] = useTheme();
  const httpHostInputRef = useRef<HTMLInputElement>(null);
  const wsHostInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (httpHostInputRef.current) {
      httpHostInputRef.current.value = getValueFromLocalStorage(
        LOCAL_STORAGE_KEY.HTTP_HOST,
        DEFAULT_LOCAL_VALUE.HTTP_HOST
      );
    }

    if (wsHostInputRef.current) {
      wsHostInputRef.current.value = getValueFromLocalStorage(
        LOCAL_STORAGE_KEY.WEBSOCKET_HOST,
        DEFAULT_LOCAL_VALUE.WEBSOCKET_HOST
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY.CULTURE, culture);
    localStorage.setItem(LOCAL_STORAGE_KEY.THEME, theme);
  }, [culture, theme]);

  return (
    <BaseDialog title={$t('dialog.title.settings')} close={close}>
      <div className="SettingsDialog">
        <SettingItem text={$t('dialog.settings.language')}>
          <ComboBox
            itemsSource={cultures}
            selectedItem={cultures.find(item => item.value === culture)!}
            setSelectedItem={item => setCulture(item.value)}
          />
        </SettingItem>
        <SettingItem text={$t('dialog.settings.theme')}>
          <ComboBox
            itemsSource={themes}
            selectedItem={themes.find(item => item.value === theme)!}
            setSelectedItem={item => setTheme(item.value)}
          />
        </SettingItem>
        <SettingItem text={$t('dialog.settings.httpHost')}>
          <input className="SettingsDialog__input" ref={httpHostInputRef} />
        </SettingItem>
        <SettingItem text={$t('dialog.settings.wsHost')}>
          <input className="SettingsDialog__input" ref={wsHostInputRef} />
        </SettingItem>
        <button
          className="SettingsDialog__btnSignOut button-primary"
          onClick={() => {
            const httpHost = httpHostInputRef.current?.value;
            if (httpHost) {
              localStorage.setItem(LOCAL_STORAGE_KEY.HTTP_HOST, httpHost);
            } else {
              localStorage.removeItem(LOCAL_STORAGE_KEY.HTTP_HOST);
            }

            const wsHost = wsHostInputRef.current?.value;
            if (wsHost) {
              localStorage.setItem(LOCAL_STORAGE_KEY.WEBSOCKET_HOST, wsHost);
            } else {
              localStorage.removeItem(LOCAL_STORAGE_KEY.WEBSOCKET_HOST);
            }

            window.location.reload();
          }}
        >
          {$t('button.confirm')}
        </button>
        {isLoggedIn ? (
          <button
            className="SettingsDialog__btnSignOut button-darger"
            onClick={() => {
              localStorage.removeItem(LOCAL_STORAGE_KEY.JWT_TOKEN);
              window.location.reload();
            }}
          >
            {$t('button.signOut')}
          </button>
        ) : null}
      </div>
    </BaseDialog>
  );
}
