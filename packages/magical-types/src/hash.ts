// https://github.com/jungomi/xxhash-wasm but changed because this needs to be synchronous
const wasmBytes = new Uint8Array([
  0,
  97,
  115,
  109,
  1,
  0,
  0,
  0,
  1,
  32,
  5,
  96,
  3,
  127,
  127,
  127,
  1,
  127,
  96,
  2,
  127,
  127,
  1,
  127,
  96,
  3,
  127,
  127,
  126,
  1,
  126,
  96,
  2,
  126,
  126,
  1,
  126,
  96,
  2,
  127,
  127,
  0,
  3,
  5,
  4,
  0,
  2,
  3,
  4,
  5,
  3,
  1,
  0,
  1,
  6,
  113,
  10,
  127,
  0,
  65,
  177,
  243,
  221,
  241,
  121,
  11,
  127,
  0,
  65,
  247,
  148,
  175,
  175,
  120,
  11,
  127,
  0,
  65,
  189,
  220,
  202,
  149,
  124,
  11,
  127,
  0,
  65,
  175,
  214,
  211,
  190,
  2,
  11,
  127,
  0,
  65,
  177,
  207,
  217,
  178,
  1,
  11,
  126,
  0,
  66,
  135,
  149,
  175,
  175,
  152,
  182,
  222,
  155,
  158,
  127,
  11,
  126,
  0,
  66,
  207,
  214,
  211,
  190,
  210,
  199,
  171,
  217,
  66,
  11,
  126,
  0,
  66,
  249,
  243,
  221,
  241,
  153,
  246,
  153,
  171,
  22,
  11,
  126,
  0,
  66,
  227,
  220,
  202,
  149,
  252,
  206,
  242,
  245,
  133,
  127,
  11,
  126,
  0,
  66,
  197,
  207,
  217,
  178,
  241,
  229,
  186,
  234,
  39,
  11,
  7,
  23,
  3,
  3,
  109,
  101,
  109,
  2,
  0,
  5,
  120,
  120,
  104,
  51,
  50,
  0,
  0,
  5,
  120,
  120,
  104,
  54,
  52,
  0,
  3,
  10,
  146,
  6,
  4,
  183,
  2,
  1,
  5,
  127,
  32,
  0,
  32,
  1,
  106,
  33,
  3,
  32,
  1,
  65,
  16,
  79,
  4,
  127,
  32,
  3,
  65,
  16,
  107,
  33,
  7,
  32,
  2,
  35,
  0,
  106,
  35,
  1,
  106,
  33,
  4,
  32,
  2,
  35,
  1,
  106,
  33,
  5,
  32,
  2,
  33,
  6,
  32,
  2,
  35,
  0,
  107,
  33,
  2,
  3,
  64,
  32,
  4,
  32,
  0,
  40,
  2,
  0,
  35,
  1,
  108,
  106,
  65,
  13,
  119,
  35,
  0,
  108,
  33,
  4,
  32,
  5,
  32,
  0,
  65,
  4,
  106,
  34,
  0,
  40,
  2,
  0,
  35,
  1,
  108,
  106,
  65,
  13,
  119,
  35,
  0,
  108,
  33,
  5,
  32,
  6,
  32,
  0,
  65,
  4,
  106,
  34,
  0,
  40,
  2,
  0,
  35,
  1,
  108,
  106,
  65,
  13,
  119,
  35,
  0,
  108,
  33,
  6,
  32,
  2,
  32,
  0,
  65,
  4,
  106,
  34,
  0,
  40,
  2,
  0,
  35,
  1,
  108,
  106,
  65,
  13,
  119,
  35,
  0,
  108,
  33,
  2,
  32,
  0,
  65,
  4,
  106,
  34,
  0,
  32,
  7,
  77,
  13,
  0,
  11,
  32,
  4,
  65,
  1,
  119,
  32,
  5,
  65,
  7,
  119,
  32,
  6,
  65,
  12,
  119,
  32,
  2,
  65,
  18,
  119,
  106,
  106,
  106,
  5,
  32,
  2,
  35,
  4,
  106,
  11,
  32,
  1,
  106,
  33,
  2,
  2,
  64,
  3,
  64,
  32,
  0,
  65,
  4,
  106,
  32,
  3,
  75,
  13,
  1,
  32,
  2,
  32,
  0,
  40,
  2,
  0,
  35,
  2,
  108,
  106,
  65,
  17,
  119,
  35,
  3,
  108,
  33,
  2,
  32,
  0,
  65,
  4,
  106,
  33,
  0,
  12,
  0,
  11,
  0,
  11,
  2,
  64,
  3,
  64,
  32,
  0,
  32,
  3,
  79,
  13,
  1,
  32,
  2,
  32,
  0,
  45,
  0,
  0,
  35,
  4,
  108,
  106,
  65,
  11,
  119,
  35,
  0,
  108,
  33,
  2,
  32,
  0,
  65,
  1,
  106,
  33,
  0,
  12,
  0,
  11,
  0,
  11,
  32,
  2,
  32,
  2,
  65,
  15,
  118,
  115,
  35,
  1,
  108,
  34,
  2,
  32,
  2,
  65,
  13,
  118,
  115,
  35,
  2,
  108,
  34,
  2,
  32,
  2,
  65,
  16,
  118,
  115,
  11,
  131,
  3,
  2,
  2,
  127,
  3,
  126,
  32,
  0,
  32,
  1,
  106,
  33,
  3,
  32,
  1,
  65,
  32,
  79,
  4,
  126,
  32,
  3,
  65,
  32,
  107,
  33,
  4,
  32,
  2,
  35,
  5,
  124,
  35,
  6,
  124,
  33,
  5,
  32,
  2,
  35,
  6,
  124,
  33,
  6,
  32,
  2,
  66,
  0,
  124,
  33,
  7,
  32,
  2,
  35,
  5,
  125,
  33,
  2,
  3,
  64,
  32,
  5,
  32,
  0,
  41,
  3,
  0,
  35,
  6,
  126,
  124,
  66,
  31,
  137,
  35,
  5,
  126,
  33,
  5,
  32,
  6,
  32,
  0,
  65,
  8,
  106,
  34,
  0,
  41,
  3,
  0,
  35,
  6,
  126,
  124,
  66,
  31,
  137,
  35,
  5,
  126,
  33,
  6,
  32,
  7,
  32,
  0,
  65,
  8,
  106,
  34,
  0,
  41,
  3,
  0,
  35,
  6,
  126,
  124,
  66,
  31,
  137,
  35,
  5,
  126,
  33,
  7,
  32,
  2,
  32,
  0,
  65,
  8,
  106,
  34,
  0,
  41,
  3,
  0,
  35,
  6,
  126,
  124,
  66,
  31,
  137,
  35,
  5,
  126,
  33,
  2,
  32,
  0,
  65,
  8,
  106,
  34,
  0,
  32,
  4,
  77,
  13,
  0,
  11,
  32,
  5,
  66,
  1,
  137,
  32,
  6,
  66,
  7,
  137,
  32,
  7,
  66,
  12,
  137,
  32,
  2,
  66,
  18,
  137,
  124,
  124,
  124,
  32,
  5,
  16,
  2,
  32,
  6,
  16,
  2,
  32,
  7,
  16,
  2,
  32,
  2,
  16,
  2,
  5,
  32,
  2,
  35,
  9,
  124,
  11,
  32,
  1,
  173,
  124,
  33,
  2,
  2,
  64,
  3,
  64,
  32,
  0,
  65,
  8,
  106,
  32,
  3,
  75,
  13,
  1,
  32,
  2,
  66,
  0,
  32,
  0,
  41,
  3,
  0,
  34,
  2,
  35,
  6,
  126,
  124,
  66,
  31,
  137,
  35,
  5,
  126,
  133,
  66,
  27,
  137,
  35,
  5,
  126,
  35,
  8,
  124,
  33,
  2,
  32,
  0,
  65,
  8,
  106,
  33,
  0,
  12,
  0,
  11,
  0,
  11,
  32,
  0,
  65,
  4,
  106,
  32,
  3,
  77,
  4,
  64,
  32,
  2,
  32,
  0,
  53,
  2,
  0,
  35,
  5,
  126,
  133,
  66,
  23,
  137,
  35,
  6,
  126,
  35,
  7,
  124,
  33,
  2,
  32,
  0,
  65,
  4,
  106,
  33,
  0,
  11,
  2,
  64,
  3,
  64,
  32,
  0,
  32,
  3,
  79,
  13,
  1,
  32,
  2,
  32,
  0,
  49,
  0,
  0,
  35,
  9,
  126,
  133,
  66,
  11,
  137,
  35,
  5,
  126,
  33,
  2,
  32,
  0,
  65,
  1,
  106,
  33,
  0,
  12,
  0,
  11,
  0,
  11,
  32,
  2,
  32,
  2,
  66,
  33,
  136,
  133,
  35,
  6,
  126,
  34,
  2,
  32,
  2,
  66,
  29,
  136,
  133,
  35,
  7,
  126,
  34,
  2,
  32,
  2,
  66,
  32,
  136,
  133,
  11,
  25,
  0,
  32,
  0,
  66,
  0,
  32,
  1,
  35,
  6,
  126,
  124,
  66,
  31,
  137,
  35,
  5,
  126,
  133,
  35,
  5,
  126,
  35,
  8,
  124,
  11,
  56,
  2,
  1,
  127,
  1,
  126,
  32,
  0,
  34,
  2,
  32,
  0,
  65,
  8,
  106,
  32,
  1,
  32,
  0,
  53,
  2,
  0,
  66,
  32,
  134,
  32,
  0,
  65,
  4,
  106,
  53,
  2,
  0,
  132,
  34,
  3,
  16,
  1,
  34,
  3,
  66,
  32,
  136,
  62,
  2,
  0,
  32,
  2,
  65,
  4,
  106,
  32,
  3,
  62,
  2,
  0,
  11
]);

import { TextEncoder } from "util";

const encoder = new TextEncoder();

function writeBufferToMemory(buffer: any, memory: any, offset: any) {
  if (memory.buffer.byteLength < buffer.byteLength + offset) {
    const extraPages = Math.ceil(
      (buffer.byteLength + offset - memory.buffer.byteLength) / (64 * 1024)
    );
    memory.grow(extraPages);
  }
  const u8memory = new Uint8Array(memory.buffer, offset);
  u8memory.set(buffer);
}

const {
  exports: { mem, xxh32, xxh64 }
} = new WebAssembly.Instance(new WebAssembly.Module(wasmBytes));

export function h32(str: string, seed = 0) {
  const strBuffer = encoder.encode(str);
  writeBufferToMemory(strBuffer, mem, 0);
  // Logical shift right makes it an u32, otherwise it's interpreted as
  // an i32.
  const h32 = xxh32(0, strBuffer.byteLength, seed) >>> 0;
  return h32.toString(16);
}
export function h64(str: string, seedHigh = 0, seedLow = 0) {
  const strBuffer = encoder.encode(str);
  writeBufferToMemory(strBuffer, mem, 8);
  // The first word (64-bit) is used to communicate an u64 between
  // JavaScript and WebAssembly. First the seed will be set from
  // JavaScript and afterwards the result will be set from WebAssembly.
  const dataView = new DataView(mem.buffer);
  dataView.setUint32(0, seedHigh, true);
  dataView.setUint32(4, seedLow, true);
  xxh64(0, strBuffer.byteLength);
  const h64 =
    dataView.getUint32(0, true).toString(16) +
    dataView.getUint32(4, true).toString(16);
  return h64;
}