import path from 'node:path';
import { fileURLToPath } from 'node:url';

// bot/ là project Node riêng (Mezon bot): không chạy eslint/prettier của web lên đó.
// ESLint 8 báo warning "File ignored" khi nhận file trong .eslintignore, làm --max-warnings=0 fail.
const botDir =
  path.join(path.dirname(fileURLToPath(import.meta.url)), 'bot') + path.sep;
const quote = (files) => files.map((f) => JSON.stringify(f)).join(' ');

export default {
  '*.{js,ts,jsx,tsx}': (files) => {
    const webFiles = files.filter((f) => !path.resolve(f).startsWith(botDir));
    if (webFiles.length === 0) return [];
    return [
      `eslint --fix --max-warnings=0 ${quote(webFiles)}`,
      `prettier --write ${quote(webFiles)}`,
    ];
  },
};
