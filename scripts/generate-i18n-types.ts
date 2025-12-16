import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.resolve(__dirname, '../public/locales');
const outputFile = path.resolve(__dirname, '../src/i18nKeys.ts');

function generateKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.keys(obj).flatMap((key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return generateKeys(obj[key] as Record<string, unknown>, fullKey);
    }
    return fullKey;
  });
}

function generateI18nTypes() {
  const enTranslationPath = path.join(localesDir, 'en', 'translation.json');
  const enTranslations = JSON.parse(
    fs.readFileSync(enTranslationPath, 'utf-8')
  );

  const keys = generateKeys(enTranslations);
  const typeDefinition = `export type TranslationKey = ${keys
    .map((key) => `'${key}'`)
    .join(' | ')};`;

  fs.writeFileSync(outputFile, typeDefinition);
  console.log(`i18n types generated at ${outputFile}`);
}

generateI18nTypes();
