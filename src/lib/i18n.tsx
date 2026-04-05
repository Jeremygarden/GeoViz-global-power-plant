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
    fuelTypes: {
      Biomass: "Biomass",
      Coal: "Coal",
      Cogeneration: "Cogeneration",
      Gas: "Gas",
      Geothermal: "Geothermal",
      Hydro: "Hydro",
      Nuclear: "Nuclear",
      Oil: "Oil",
      Other: "Other",
      Petcoke: "Petcoke",
      Solar: "Solar",
      Storage: "Storage",
      Waste: "Waste",
      "Wave and Tidal": "Wave and Tidal",
      Wind: "Wind",
    } as Record<string, string>,
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
    fuelTypes: {
      Biomass: "生物质能",
      Coal: "煤炭",
      Cogeneration: "热电联产",
      Gas: "天然气",
      Geothermal: "地热能",
      Hydro: "水力",
      Nuclear: "核能",
      Oil: "石油",
      Other: "其他",
      Petcoke: "石油焦",
      Solar: "太阳能",
      Storage: "储能",
      Waste: "废弃物",
      "Wave and Tidal": "波浪与潮汐",
      Wind: "风能",
    } as Record<string, string>,
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
  fuelTypes: Record<string, string>;
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
