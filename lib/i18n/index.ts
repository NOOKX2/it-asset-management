import { en } from "./en";
import { th } from "./th";
import type { Locale, Messages } from "./types";

export const dictionaries: Record<Locale, Messages> = { en, th };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}
