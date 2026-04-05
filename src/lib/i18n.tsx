import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "zh";

export const translations = {
  en: {
    kpi: {
      totalCapacity: "Total Capacity",
      plantCount: "Plant Count",
      countries: "Countries",
    },
    filters: {
      energyType: "Energy Type",
      capacity: "Capacity",
      country: "Country",
      searchCountries: "Search countries...",
      noMatch: "No match",
      min: "Min",
      max: "Max",
    },
    view: {
      scatter: "Scatter",
      heatmap: "Heatmap",
      light: "Light",
      dark: "Dark",
      voyager: "Voyager",
    },
    loading: "Loading...",
    error: "Failed to load data. Please refresh.",
    tooltip: {
      capacity: "MW",
    },
  },
  zh: {
    kpi: {
      totalCapacity: "总装机容量",
      plantCount: "电厂数量",
      countries: "国家数量",
    },
    filters: {
      energyType: "能源类型",
      capacity: "装机容量",
      country: "国家",
      searchCountries: "搜索国家...",
      noMatch: "无匹配",
      min: "最小",
      max: "最大",
    },
    view: {
      scatter: "散点图",
      heatmap: "热力图",
      light: "亮色",
      dark: "暗色",
      voyager: "地图",
    },
    loading: "加载中...",
    error: "数据加载失败，请刷新页面重试。",
    tooltip: {
      capacity: "兆瓦",
    },
  },
} as const;

type Translations = {
  kpi: {
    totalCapacity: string;
    plantCount: string;
    countries: string;
  };
  filters: {
    energyType: string;
    capacity: string;
    country: string;
    searchCountries: string;
    noMatch: string;
    min: string;
    max: string;
  };
  view: {
    scatter: string;
    heatmap: string;
    light: string;
    dark: string;
    voyager: string;
  };
  loading: string;
  error: string;
  tooltip: {
    capacity: string;
  };
};

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
