import { useCallback } from 'react';
import { useI18nBuilder, TranslatorType } from 'hooks';

import uiStrings_en_US from './ui-strings.en-US.json';
import uiStrings_zh_CN from './ui-strings.zh-CN.json';

export * from './language-code';
export * from './i18n-context';

export type UiStringsKeys = keyof typeof uiStrings_en_US;

export type UiStringTranslator = TranslatorType<UiStringsKeys>;
export const useI18n = () =>
  useI18nBuilder(
    useCallback(
      () => [
        { culture: 'en-US', resource: uiStrings_en_US },
        { culture: 'zh-CN', resource: uiStrings_zh_CN },
      ],
      []
    )
  );
