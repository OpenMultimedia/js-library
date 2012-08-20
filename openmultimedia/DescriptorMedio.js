goog.provide('openmultimedia.DescriptorMedio')

/**
 * Descriptor de una cadena localizable de la forma:
 * var cadena = {'es': 'Cadena', 'en: 'String' }
 * @typedef {string|Object.<string, string>}
 */
var CadenaLocalizable

/**
 * @typedef {atom: CadenaLocalizable|undefined, rss2: CadenaLocalizable|undefined}
 */
var GrupoFeeds

/**
 * @typedef {slug: string, nombre: CadenaLocalizable}
 */
var DescriptorLenguaje

/**
 * @typedef {titulo: CadenaLocalizable, url: CadenaLocalizable, feeds: GrupoFeeds|undefined}
 */
var DescriptorLink

/**
 * @typedef {titulo: CadenaLocalizable, url: CadenaLocalizable}
 */
var DescriptorApi

/**
 * @typedef {port: number, manifest: CadenaLocalizable|undefined, playlist: CadenaLocalizable|undefined}
 */
var DescriptorStreamingProtocolWowza

/**
 * Tipo siempre es "wowza"
 * @typedef {nombre: CadenaLocalizable, tipo: string, host: CadenaLocalizable, streams: Object.<string, CadenaLocalizable>, protocols: Object.<string, DescriptorStreamingProtocolWowza>}
 */
var DescriptorStreamingWowza

/**
 * @typedef {streamer: CadenaLocalizable, file: CadenaLocalizable}
 */
var DescriptorStreamingProtocolJwplayer

/**
 * Tipo siempre es "jwplayer"
 * @typedef {nombre: CadenaLocalizable, tipo: string, protocols: Object.<string, DescriptorStreamingProtocolJwplayer>}
 */
var DescriptorStreamingJwplayer

/**
 *  @typedef {DescriptorStreamingWowza|DescriptorStreamingJwplayer}
 */
var DescriptorStreaming

/**
 * Descriptor del Medio según se define en:
 * https://gist.github.com/f02c142902f154e20290
 * @typedef {slug: string, lenguajes: Array.<openmultimedia.DescriptorLenguaje>, nombre: openmultimedia.DescriptorCadenaLocalizable, links: Object.<string, DescriptorLink>, apis: Object.<string, DescriptorApi>, streaming: Object.<string, DescriptorStreaming>}
 */
openmultimedia.DescriptorMedio
