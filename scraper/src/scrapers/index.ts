type Scraper<TWord, TInfo> = {
  menu: () => Promise<TInfo>;
  retrieve: (info: TInfo) => Promise<TWord>;
};

export { Scraper };
