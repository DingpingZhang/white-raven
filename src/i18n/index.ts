import { useCallback } from 'react';
import { useI18nBuilder, TranslatorType } from '../hooks';

export * from './language-code';
export * from './i18n-context';

// export type UiStringsKeys = keyof typeof uiStrings_en_US;

// export type UiStringTranslator = TranslatorType<UiStringsKeys>;
// export const useI18n = () =>
//   useI18nBuilder(
//     useCallback(
//       () => [
//         { culture: 'en-US', resource: uiStrings_en_US },
//         { culture: 'zh-CN', resource: uiStrings_zh_CN },
//       ],
//       []
//     )
//   );
