// 多言語化の中核（adr/0004）。
// - UI チコル（nav・フォーム・doc の定型文）はこの辞書で共通化する。
// - ランディング／規約の本文は locale 別のページファイル側に持つ（長文は辞書に入れない）。

export const defaultLang = 'ja';
export const locales = ['ja', 'en'] as const;
export type Lang = (typeof locales)[number];

/** 言語スイッチャに出す各言語の呼称。 */
export const languageName: Record<Lang, string> = {
  ja: '日本語',
  en: 'English',
};

/** アプリ表示名（locale 別）。ブランド LinkMint は共通。 */
export const appName = {
  koura: { ja: 'こうら日記', en: 'Koura Diary' },
  linkmint: { ja: 'LinkMint', en: 'LinkMint' },
} as const;

// 共有レイアウト（BaseLayout / DocLayout）が両 locale を 1 ファイルから描画するための最小辞書。
// ランディング・問い合わせ・規約は locale 別ページに本文を持つため辞書には入れない。
// `{app}` プレースホルダは利用側で置換する。
export const ui = {
  ja: {
    'nav.home': 'Home',
    'nav.koura': 'こうら日記',
    'nav.linkmint': 'LinkMint',
    'meta.siteDescription': '7ofu の個人サイト',
    'doc.updated': '最終更新:',
    'doc.back': '← {app}トップにもどる',
  },
  en: {
    'nav.home': 'Home',
    'nav.koura': 'Koura Diary',
    'nav.linkmint': 'LinkMint',
    'meta.siteDescription': "7ofu's personal site",
    'doc.updated': 'Last updated:',
    'doc.back': '← Back to {app}',
  },
} as const;

export type UIKey = keyof (typeof ui)['ja'];

/** URL から現在の locale を判定する（/en/... なら en、その他は ja）。 */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return seg === 'en' ? 'en' : 'ja';
}

/** 指定 locale の翻訳関数を返す。未定義キーは ja にフォールバック。 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** /en 接頭辞を外して ja（ルート）基準の正規パスにする。 */
function toBasePath(pathname: string): string {
  if (pathname === '/en' || pathname === '/en/') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3);
  return pathname;
}

/**
 * ja 基準のパス（例 '/linkmint/terms'）を指定 locale の実パスに変換する。
 * ja はそのまま、en は '/en' を前置（ルートは '/en/'）。
 */
export function localizePath(basePath: string, lang: Lang): string {
  if (lang === 'ja') return basePath;
  return basePath === '/' ? '/en/' : '/en' + basePath;
}

/** 現在のパスに対応する、別 locale の同一ページのパスを返す（言語スイッチャ・hreflang 用）。 */
export function alternatePath(currentPathname: string, lang: Lang): string {
  return localizePath(toBasePath(currentPathname), lang);
}
