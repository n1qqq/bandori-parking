// lang.js
export default class LangManager {
  #lang;
  #table;

  constructor(langCode = "en") {
    this.#lang = langCode;
    this.#table = {};
  }

  async load(langCode) {
    this.#lang = langCode;
    this.#table = (
      await import(`./${langCode}.js`)
    ).default;
  }

  t(key) {
    return this.#table[key] ?? key;
  }

  l() {
    return this.#lang;
  }
}
