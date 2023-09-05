export interface IPostAndWFH {
  userId: number | undefined;
  userName?: string | undefined;
  numOfPosts: number;
  numOfRequestWFH: number;
  index?: number;
  email?: string;
}

export interface IRender {
  rendered: string;
  protected?: boolean;
}

export interface IHref {
  href: string;
  embeddable?: boolean;
  count?: number;
  id?: number;
  taxonomy?: string;
  name?: string;
  templated?: boolean;
}

export interface IPostANT {
  userName?: string;
  id: number;
  date: string;
  date_gmt: string;
  guid: IRender;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: IRender;
  content: IRender;
  excerpt: IRender;
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    _mi_skip_tracking: false;
    _monsterinsights_sitenote_active: false;
    _monsterinsights_sitenote_note: '';
    _monsterinsights_sitenote_category: 0;
    footnotes: '';
  };
  categories: Array<number>;
  tags: Array<unknown>;
  aioseo_notices: Array<unknown>;
  _links: {
    self: Array<IHref>;
    collection: Array<IHref>;
    about: Array<IHref>;
    author: Array<IHref>;
    replies: Array<IHref>;
    'version-history': Array<IHref>;
    'predecessor-version': Array<IHref>;
    'wp:featuredmedia': Array<IHref>;
    'wp:attachment': Array<IHref>;
    'wp:term': Array<IHref>;
    curies: Array<IHref>;
  };
}

export interface IUserANT {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: unknown;
  meta: unknown[];
  simple_local_avatar: unknown;
  _links: {
    self: Array<IHref>;
    collection: Array<IHref>;
  };
}

export interface IFilterReportWFH {
  search: string;
  pages: number;
  per_page: number;
}
