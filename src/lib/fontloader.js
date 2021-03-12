export default class FontLoader {
  static async load (url, family, weight, style) {
    const font = new FontFace(family, `url(${url})`, {
      family, style, weight,
    })
    await font.load()
    document.fonts.add(font)
  }
}
