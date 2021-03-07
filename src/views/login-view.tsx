import { login } from 'api';
import { useI18n } from 'i18n';
import md5 from 'md5';
import { useRef, useCallback, useState } from 'react';

type Props = {
  setIsLoggedIn: (value: boolean) => void;
};

export default function LoginView({ setIsLoggedIn }: Props) {
  const accountRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { $t } = useI18n();
  const [isBusy, setIsBusy] = useState(false);
  const handleLogin = useCallback(async () => {
    if (accountRef.current && passwordRef.current) {
      const account = accountRef.current.value;
      const password = passwordRef.current.value;

      // TODO: 完善验证机制。
      if (!account || !password) return;

      setIsBusy(true);
      try {
        const response = await login(account, md5(password));
        if (response.code === 200) {
          localStorage.setItem('jwt-token', response.content.token);
          setIsLoggedIn(true);
        }
      } finally {
          setIsBusy(false);
      }
    }
  }, [setIsLoggedIn]);

  return (
    <div className="LoginView">
      <div className="LoginView__loginBox">
        <span className="LoginView__title text title">{$t('loginView.title')}</span>
        <input
          ref={accountRef}
          type="text"
          className="LoginDialog__account"
          placeholder={$t('input.placeholder.inputAccount')}
          disabled={isBusy}
        />
        <input
          ref={passwordRef}
          type="password"
          className="LoginDialog__password"
          placeholder={$t('input.placeholder.inputPassword')}
          disabled={isBusy}
        />
        <button
          className="LoginDialog__btnConfirm button-primary"
          onClick={handleLogin}
          disabled={isBusy}
        >
          {$t('button.confirm')}
        </button>
      </div>
    </div>
  );
}
