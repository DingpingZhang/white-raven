import { useMemo } from 'react';
import { LanguageCode } from 'i18n';
import { stringFormat } from 'helpers';
import { useCulture } from 'models/store';

export type I18nResourcePair<T> = {
  culture: LanguageCode;
  resource: T;
};

export type TranslatorType<T> = (key: T, ...args: Array<Object>) => string;

export type TranslateType<T> = {
  readonly $t: TranslatorType<T>;
};

export function useI18nBuilder<T extends Record<string, string>>(
  resourcesProvider: () => Array<I18nResourcePair<T>>
): TranslateType<keyof T> {
  const [currentCulture] = useCulture();
  return useMemo(() => {
    const provider = resourcesProvider();
    if (!provider) {
      throw new Error(`The resources provider can not return null or empty array.`);
    }

    const resource = provider.find((item) => item.culture === currentCulture);

    const finalResource = resource?.resource ?? provider[0].resource;
    return {
      $t: (key, ...args) => stringFormat(finalResource[key], args),
    };
  }, [currentCulture, resourcesProvider]);
}
