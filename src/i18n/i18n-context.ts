import { createContext } from 'react';
import { LanguageCode } from './language-code';

export const I18nContext = createContext<LanguageCode>('en-US');
