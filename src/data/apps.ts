// Home の見開き（Spread）とアプリ LP の Hero が共有するアプリデータ（adr/0008）。
// コピー・ストア URL・状態がページ間でずれる事故を防ぐため、ここに一元化する。

import type { Lang } from '../i18n/ui';

export type AppSlug = 'koura' | 'schemely' | 'kamekoro';
/** Home での扱い。'spread' は見開き、'note' は巻末手前の余白メモ（adr/0008 追記2）。 */
export type HomeLayout = 'spread' | 'note';

export interface AppShot {
  src: string;
  alt: string;
}

export interface AppStores {
  ios?: string;
  android?: string;
}

interface AppSpecimen {
  subject: string;
  habitat: string;
  status: string;
}

interface AppShotSource {
  /** `/shots/<app>/<lang>-<name>.webp` の `<name>` 部分。 */
  name: string;
  alt: string;
}

interface AppCopy {
  name: string;
  tagline: string;
  specimen: AppSpecimen;
  features: readonly [string, string, string];
  shots: readonly AppShotSource[];
}

interface AppEntry {
  slug: AppSlug;
  /** 見開きの通し番号。余白メモ（Schemely）は番号を持たない。 */
  no?: string;
  homeLayout: HomeLayout;
  icon: string;
  accentVar: string;
  tintVar: string;
  stores: AppStores;
  hubPath: string;
  ja: AppCopy;
  en: AppCopy;
}

/** Spread / LP Hero が実際に受け取る、locale で解決済みのビュー。 */
export interface AppView {
  slug: AppSlug;
  no?: string;
  homeLayout: HomeLayout;
  icon: string;
  accentVar: string;
  tintVar: string;
  stores: AppStores;
  hubPath: string;
  name: string;
  tagline: string;
  specimen: AppSpecimen;
  features: readonly [string, string, string];
  shots: AppShot[];
}

const entries: AppEntry[] = [
  {
    slug: 'koura',
    no: '01',
    homeLayout: 'spread',
    icon: '/koura-diary.svg',
    accentVar: '--acc-koura',
    tintVar: '--tint-koura',
    stores: {
      ios: 'https://apps.apple.com/app/id6783813983',
      android: 'https://play.google.com/store/apps/details?id=com.togawa.tortoise_log',
    },
    hubPath: '/koura-diary/',
    ja: {
      name: 'こうら日記',
      tagline: 'リクガメの毎日を、写真と体重グラフで記録するフィールドノート。',
      specimen: {
        subject: 'リクガメ（陸生種）',
        habitat: 'iPhone / iPad / Android',
        status: '生息中・App Store / Google Play で配布中',
      },
      features: ['写真つきの毎日の記録', '体重グラフとカレンダー', '家族と共有・みんなのこうら'],
      shots: [
        { name: 'home', alt: 'こうら日記のホーム画面。今日の記録と最近の様子が並ぶ' },
        { name: 'graph', alt: 'こうら日記の体重グラフ画面。成長の推移をカレンダーと折れ線で確認できる' },
        { name: 'album', alt: 'こうら日記のアルバム画面。記録した写真が一覧で並ぶ' },
      ],
    },
    en: {
      name: 'Koura Diary',
      tagline: 'A field notebook for your tortoise — daily photos and a weight graph.',
      specimen: {
        subject: 'Tortoises (terrestrial species)',
        habitat: 'iPhone / iPad / Android',
        status: 'In the wild — on the App Store / Google Play',
      },
      features: [
        'Daily logs with photos',
        'Weight graph and calendar',
        "Share with family — everyone's tortoise",
      ],
      shots: [
        { name: 'home', alt: "Koura Diary home screen showing today's log and recent activity" },
        { name: 'graph', alt: 'Koura Diary weight graph screen with calendar and line chart' },
        { name: 'album', alt: 'Koura Diary album screen listing logged photos' },
      ],
    },
  },
  {
    slug: 'schemely',
    homeLayout: 'note',
    icon: '/schemely.svg',
    accentVar: '--acc-schemely',
    tintVar: '--tint-schemely',
    stores: {
      ios: 'https://apps.apple.com/app/id6788003083',
    },
    hubPath: '/schemely/',
    ja: {
      name: 'Schemely',
      tagline: '任意の URL をタップできるリンクに変え、Deep Link の挙動を確かめる検証ノート。',
      specimen: {
        subject: 'Deep Link（URL スキーム / Universal Link）',
        habitat: 'iPhone・iOS 18 以降',
        status: '生息中・App Store で配布中',
      },
      features: [
        '任意の URL をタップできるリンクに',
        'URL スキーム・Universal Link の挙動確認',
        'QR 生成と履歴',
      ],
      shots: [
        { name: 'input', alt: 'Schemely のリンク入力画面。任意の URL をタップできるリンクに変換できる' },
        { name: 'qr', alt: 'Schemely の QR 生成画面。生成した QR コードと履歴が並ぶ' },
      ],
    },
    en: {
      name: 'Schemely',
      tagline: 'Turn any URL into a tappable link and observe how deep links really behave.',
      specimen: {
        subject: 'Deep links (URL schemes / Universal Links)',
        habitat: 'iPhone · iOS 18 or later',
        status: 'In the wild — on the App Store',
      },
      features: [
        'Turn any URL into a tappable link',
        'Check URL scheme & Universal Link behavior',
        'Generate QR codes and keep a history',
      ],
      shots: [
        { name: 'input', alt: 'Schemely link input screen turning any URL into a tappable link' },
        { name: 'qr', alt: 'Schemely QR generation screen listing generated codes and history' },
      ],
    },
  },
  {
    slug: 'kamekoro',
    no: '02',
    homeLayout: 'spread',
    icon: '/kamekoro.png',
    accentVar: '--acc-kamekoro',
    tintVar: '--tint-kamekoro',
    stores: {
      ios: 'https://apps.apple.com/jp/app/%E3%82%AB%E3%83%A1%E3%82%B3%E3%83%AD/id6789081791',
    },
    hubPath: '/kamekoro/',
    ja: {
      name: 'カメコロ',
      tagline: '爬虫類たちに餌をあげる、コンボ狙いの給餌パズル観察日記。',
      specimen: {
        subject: '爬虫類たち（給餌パズル）',
        habitat: 'iPhone',
        status: '生息中・App Store で配布中',
      },
      features: ['給餌パズル', 'コンボでハイスコア', '世界ランキング'],
      shots: [
        { name: 'combo', alt: 'カメコロのコンボ画面。給餌パズルでコンボを決めてハイスコアを狙う' },
      ],
    },
    en: {
      name: 'Kamekoro',
      tagline: 'A feeding puzzle diary for reptiles — chain combos for a high score.',
      specimen: {
        subject: 'Reptiles (feeding puzzle)',
        habitat: 'iPhone',
        status: 'In the wild — on the App Store',
      },
      features: ['Feeding puzzle gameplay', 'Chain combos for a high score', 'Compete on the world ranking'],
      shots: [
        { name: 'combo', alt: 'Kamekoro combo screen — chain feeding combos for a high score' },
      ],
    },
  },
];

function toView(entry: AppEntry, lang: Lang): AppView {
  const copy = entry[lang];
  return {
    slug: entry.slug,
    no: entry.no,
    homeLayout: entry.homeLayout,
    icon: entry.icon,
    accentVar: entry.accentVar,
    tintVar: entry.tintVar,
    stores: entry.stores,
    hubPath: entry.hubPath,
    name: copy.name,
    tagline: copy.tagline,
    specimen: copy.specimen,
    features: copy.features,
    shots: copy.shots.map((shot) => ({
      src: `/shots/${entry.slug}/${lang}-${shot.name}.webp`,
      alt: shot.alt,
    })),
  };
}

/** 表示順（Home の見開き順・nav 順）で全アプリを指定 locale で解決して返す。 */
export function getApps(lang: Lang): AppView[] {
  return entries.map((entry) => toView(entry, lang));
}

/** 1 アプリを指定 locale で解決して返す（LP Hero 用）。未知の slug はエラーにする。 */
export function getApp(slug: AppSlug, lang: Lang): AppView {
  const entry = entries.find((e) => e.slug === slug);
  if (!entry) {
    throw new Error(`unknown app slug: ${slug}`);
  }
  return toView(entry, lang);
}
