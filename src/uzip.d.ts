/**
 * Object with `key:property` pairs, where `key` is a file path, and `property` is an Uint8Array of its contents
 */
interface UZIPFiles {
  [name: string]: Uint8Array;
}

interface UZIPSizeInfo {
  [name: string]: { usize: number; csize: number };
}

/**
 * Set compression level (0-9)
 */
interface UZIPOptions {
  level: number;
}

declare module "uzip" {
  /**
   * @param buf ArrayBuffer of the ZIP file
   * @param onlyNames If `true`, returns file sizes instead of contents.
   * */
  function parse(buf: ArrayBuffer, onlyNames?: boolean): UZIPFiles;
  function parse(buf: ArrayBuffer, onlyNames: true): UZIPSizeInfo;

  /**
   *
   * @param obj Object with `key:property` pairs, where `key` is a file path, and `property` is an Uint8Array of its contents
   * @param noCmpr Disable ZIP compression
   */
  function encode(obj: UZIPFiles, noCmpr?: boolean): ArrayBuffer;

  /**
   * Compress buffer. Returns an `Uint8Array` of DEFLATE stream
   * @param data Buffer to be compressed
   * @param options Optional object specifying level of compression
   */
  function deflateRaw(data: Uint8Array, options?: UZIPOptions): Uint8Array;

  /**
   * Compress buffer. Returns an `Uint8Array` of ZLIB stream (2 byte header + DEFLATE stream + 4 byte checksum)
   * @param data Buffer to be compressed
   * @param options Optional object specifying level of compression
   */
  function deflate(data: Uint8Array, options?: UZIPOptions): Uint8Array;

  /**
   * Decompress buffer. Returns Uint8Array with decompressed bytes
   * @param file Buffer containing a ZLIB stream _(2 byte header + DEFLATE stream + 4 byte checksum)_ to be decompressed.
   * @param outputBuffer Optional additional buffer.
   *
   * More details at https://github.com/photopea/uzip.js
   */
  function inflate(file: Uint8Array, outputBuffer?: Uint8Array): Uint8Array;

  /**
   * Decompress buffer. Returns Uint8Array with decompressed bytes
   * @param file Buffer to be decompressed, containing a Deflate stream
   * @param outputBuffer Optional additional buffer
   *
   * More details at https://github.com/photopea/uzip.js
   */
  function inflateRaw(file: Uint8Array, outputBuffer?: Uint8Array): Uint8Array;
}
