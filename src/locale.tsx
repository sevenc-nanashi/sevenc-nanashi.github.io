import {createContext} from "solid-js";

export const Locale = createContext<() => ("ja" | "en")>(() => "en" as const);
