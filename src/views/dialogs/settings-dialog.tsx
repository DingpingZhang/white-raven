import { jwtTokenKey } from 'api';
import { ComboBox, ComboBoxItem } from 'components/combo-box';
import { LanguageCode, useI18n } from 'i18n';
import { ThemeType, useCulture, useTheme } from 'models/global-context';
import { ReactElement, useMemo } from 'react';
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
};

export function buildSettingsDialog(close: () => void) {
  return <SettingsDialog close={close} />;
}

export default function SettingsDialog({ close }: Props) {
  const { $t } = useI18n();
  const cultrues = useMemo<ComboBoxItem<LanguageCode>[]>(
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
  return (
    <BaseDialog title={$t('dialog.title.settings')} close={close}>
      <div className="SettingsDialog">
        <SettingItem text={$t('dialog.settings.language')}>
          <ComboBox
            itemsSource={cultrues}
            selectedItem={cultrues.find(item => item.value === culture)!}
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
        <button
          className="SettingsDialog__btnSignOut button-darger"
          onClick={() => {
            localStorage.removeItem(jwtTokenKey);
            window.location.reload();
          }}
        >
          {$t('button.signOut')}
        </button>
      </div>
    </BaseDialog>
  );
}
