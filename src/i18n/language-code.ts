export type LanguageCode =
  // Afrikaans
  | 'af'
  // Afrikaans - South Africa
  | 'af-ZA'
  // Arabic
  | 'ar'
  // Arabic - United Arab Emirates
  | 'ar-AE'
  // Arabic - Bahrain
  | 'ar-BH'
  // Arabic - Algeria
  | 'ar-DZ'
  // Arabic - Egypt
  | 'ar-EG'
  // Arabic - Iraq
  | 'ar-IQ'
  // Arabic - Jordan
  | 'ar-JO'
  // Arabic - Kuwait
  | 'ar-KW'
  // Arabic - Lebanon
  | 'ar-LB'
  // Arabic - Libya
  | 'ar-LY'
  // Arabic - Morocco
  | 'ar-MA'
  // Arabic - Oman
  | 'ar-OM'
  // Arabic - Qatar
  | 'ar-QA'
  // Arabic - Saudi Arabia
  | 'ar-SA'
  // Arabic - Syria
  | 'ar-SY'
  // Arabic - Tunisia
  | 'ar-TN'
  // Arabic - Yemen
  | 'ar-YE'
  // Azeri
  | 'az'
  // Cyrl Azeri (Cyrillic) - Azerbaijan
  | 'az-AZ'
  // Azeri (Latin) - Azerbaijan
  | 'az-AZ-Latn'
  // Belarusian
  | 'be'
  // Belarusian - Belarus
  | 'be-BY'
  // Bulgarian
  | 'bg'
  // Bulgarian - Bulgaria
  | 'bg-BG'
  // Catalan
  | 'ca'
  // Catalan - Catalan
  | 'ca-ES'
  // Czech
  | 'cs'
  // Czech - Czech Republic
  | 'cs-CZ'
  // Danish
  | 'da'
  // Danish - Denmark
  | 'da-DK'
  // German
  | 'de'
  // German - Austria
  | 'de-AT'
  // German - Switzerland
  | 'de-CH'
  // German - Germany
  | 'de-DE'
  // German - Liechtenstein
  | 'de-LI'
  // German - Luxembourg
  | 'de-LU'
  // Dhivehi
  | 'div'
  // Dhivehi - Maldives
  | 'div-MV'
  // Greek
  | 'el'
  // Greek - Greece
  | 'el-GR'
  // English
  | 'en'
  // English - Australia
  | 'en-AU'
  // English - Belize
  | 'en-BZ'
  // English - Canada
  | 'en-CA'
  // English - Caribbean
  | 'en-CB'
  // English - United Kingdom
  | 'en-GB'
  // English - Ireland
  | 'en-IE'
  // English - Jamaica
  | 'en-JM'
  // English - New Zealand
  | 'en-NZ'
  // English - Philippines
  | 'en-PH'
  // English - Trinidad and Tobago
  | 'en-TT'
  // English - United States
  | 'en-US'
  // English - South Africa
  | 'en-ZA'
  // English - Zimbabwe
  | 'en-ZW'
  // Spanish
  | 'es'
  // Spanish - Argentina
  | 'es-AR'
  // Spanish - Bolivia
  | 'es-BO'
  // Spanish - Chile
  | 'es-CLe'
  // Spanish - Colombia
  | 'es-CO'
  // Spanish - Costa Rica
  | 'es-CR'
  // Spanish - Dominican Republic
  | 'es-DO'
  // Spanish - Ecuador
  | 'es-EC'
  // Spanish - Spain
  | 'es-ES'
  // Spanish - Guatemala
  | 'es-GT'
  // Spanish - Honduras
  | 'es-HN'
  // Spanish - Mexico
  | 'es-MX'
  // Spanish - Nicaragua
  | 'es-NI Spanish'
  // Spanish - Panama
  | 'es-PA'
  // Spanish - Peru
  | 'es-PE'
  // Spanish - Puerto Rico
  | 'es-PR'
  // Spanish - Paraguay
  | 'es-PY'
  // Spanish - El Salvador
  | 'es-SV'
  // Spanish - Uruguay
  | 'es-UY'
  // Spanish - Venezuela
  | 'es-VE'
  // Estonian
  | 'et'
  // Estonian - Estonia
  | 'et-EE'
  // Basque
  | 'eu'
  // Basque - Basque
  | 'eu-ES'
  // Farsi
  | 'fa'
  // Farsi - Iran
  | 'fa-IR'
  // Finnish
  | 'fi'
  // Finnish - Finland
  | 'fi-FI'
  // Faroese
  | 'fo'
  // Faroese - Faroe Islands
  | 'fo-FO'
  // French
  | 'fr'
  // French - Belgium
  | 'fr-BE'
  // French - Canada
  | 'fr-CA'
  // French - Switzerland
  | 'fr-CH'
  // French - France
  | 'fr-FR'
  // French - Luxembourg
  | 'fr-LU'
  // French - Monaco
  | 'fr-MC'
  // Galician
  | 'gl'
  // Galician - Galician
  | 'gl-ES'
  // Gujarati
  | 'gu'
  // Gujarati - India
  | 'gu-IN'
  // Hebrew
  | 'he'
  // Hebrew - Israel
  | 'he-IL'
  // Hindi
  | 'hi'
  // Hindi - India
  | 'hi-IN'
  // Croatian
  | 'hr'
  // Croatian - Croatia
  | 'hr-HR'
  // Hungarian
  | 'hu'
  // Hungarian - Hungary
  | 'hu-HU'
  // Armenian
  | 'hy'
  // Armenian - Armenia
  | 'hy-AM'
  // Indonesian
  | 'id'
  // Indonesian - Indonesia
  | 'id-ID'
  // Icelandic
  | 'is'
  // Icelandic - Iceland
  | 'is-IS'
  // Italian
  | 'it'
  // Italian - Switzerland
  | 'it-CH Italian'
  // Italian - Italy
  | 'it-IT'
  // Japanese
  | 'ja'
  // Japanese - Japan
  | 'ja-JP'
  // Georgian
  | 'ka'
  // Georgian - Georgia
  | 'ka-GE'
  // Kazakh
  | 'kk'
  // Kazakh - Kazakhstan
  | 'kk-KZ'
  // Kannada
  | 'kn'
  // Kannada - India
  | 'kn-IN'
  // Korean
  | 'ko'
  // Konkani
  | 'kok'
  // Konkani - India
  | 'kok-IN'
  // Korean - Korea
  | 'ko-KR'
  // Kyrgyz
  | 'ky'
  // Kyrgyz - Kyrgyzstan
  | 'ky-KG'
  // Lithuanian
  | 'lt'
  // Lithuanian - Lithuania
  | 'lt-LT'
  // Latvian
  | 'lv'
  // Latvian - Latvia
  | 'lv-LV'
  // Macedonian
  | 'mk'
  // Macedonian - Former Yugoslav Republic of Macedonia
  | 'mk-MK'
  // Mongolian
  | 'mn'
  // Mongolian - Mongolia
  | 'mn-MN'
  // Marathi
  | 'mr'
  // Marathi - India
  | 'mr-IN'
  // Malay
  | 'ms'
  // Malay - Brunei
  | 'ms-BN'
  // Malay - Malaysia
  | 'ms-MY'
  // Norwegian (Bokm?l) - Norway
  | 'nb-NO'
  // Dutch
  | 'nl'
  // Dutch - Belgium
  | 'nl-BE'
  // Dutch - The Netherlands
  | 'nl-NL'
  // Norwegian (Nynorsk) - Norway
  | 'nn-NO'
  // Norwegian
  | 'no'
  // Punjabi
  | 'pa'
  // Punjabi - India
  | 'pa-IN'
  // Polish
  | 'pl'
  // Polish - Poland
  | 'pl-PL'
  // Portuguese
  | 'pt'
  // Portuguese - Brazil
  | 'pt-BR'
  // Portuguese - Portugal
  | 'pt-PT'
  // Romanian
  | 'ro'
  // Romanian - Romania
  | 'ro-RO'
  // Russian
  | 'ru'
  // Russian - Russia
  | 'ru-RU'
  // Sanskrit
  | 'sa'
  // Sanskrit - India
  | 'sa-IN'
  // Slovak
  | 'sk'
  // Slovak - Slovakia
  | 'sk-SK'
  // Slovenian
  | 'sl'
  // Slovenian - Slovenia
  | 'sl-SI'
  // Albanian
  | 'sq'
  // Albanian - Albania
  | 'sq-AL'
  // Serbian (Cyrillic) - Serbia
  | 'sr-SP-Cyrl'
  // Serbian (Latin) - Serbia
  | 'sr-SP-Latn'
  // Swedish
  | 'sv'
  // Swedish - Finland
  | 'sv-FI'
  // Swedish - Sweden
  | 'sv-SE'
  // Swahili
  | 'sw'
  // Swahili - Kenya
  | 'sw-KE'
  // Syriac
  | 'syr'
  // Syriac - Syria
  | 'syr-SY'
  // Tamil
  | 'ta'
  // Tamil - India
  | 'ta-IN'
  // Telugu
  | 'te'
  // Telugu - India
  | 'te-IN'
  // Thai
  | 'th'
  // Thai - Thailand
  | 'th-TH'
  // Turkish
  | 'tr'
  // Turkish - Turkey
  | 'tr-TR'
  // Tatar
  | 'tt'
  // Tatar - Russia
  | 'tt-RU'
  // Ukrainian
  | 'uk'
  // Ukrainian - Ukraine
  | 'uk-UA'
  // Urdu
  | 'ur'
  // Urdu - Pakistan
  | 'ur-PK'
  // Uzbek
  | 'uz'
  // Uzbek (Cyrillic) - Uzbekistan
  | 'uz-UZ-Cyrl'
  // Uzbek (Latin) - Uzbekistan
  | 'uz-UZ-Latn'
  // Vietnamese
  | 'vi'
  // Chinese (Traditional)
  | 'zh-CHT'
  // Chinese (Simplified)
  | 'zh-CHS'
  // Chinese - China
  | 'zh-CN'
  // Chinese - Hong Kong SAR
  | 'zh-HK'
  // Chinese - Macao SAR
  | 'zh-MO'
  // Chinese - Singapore
  | 'zh-SG'
  // Chinese - Taiwan
  | 'zh-TW';
