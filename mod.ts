/* ------------------------------------------------------------------------------------

  @cross/base64 - MIT License - Hexagon <hexagon@56k.guru>

  ------------------------------------------------------------------------------------

  License:

	Copyright (c) 2024 Hexagon <hexagon@56k.guru>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.

  ------------------------------------------------------------------------------------  */

/** A string containing standard base64 characters */
const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** A string containing base64url characters */
const charsUrl: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

/**
 * Function type for generating a lookup table
 * @param target The target string of characters
 * @returns A Uint8Array lookup table
 */
const genLookup: (target: string) => Uint8Array = (target: string) => {
  const lookupTemp = new Uint8Array(256);

  for (let i = 0; i < target.length; i++) {
    lookupTemp[target.charCodeAt(i)] = i;
  }
  return lookupTemp;
};

/** Lookup table for standard base64 characters */
const lookup: Uint8Array = genLookup(chars);

/** Lookup table for base64url characters */
const lookupUrl: Uint8Array = genLookup(charsUrl);

// Regular Expressions
const base64UrlPattern = /^[-A-Za-z0-9\-_]*$/;
const base64Pattern = /^[-A-Za-z0-9+/]*={0,3}$/;

/**
 * Converts a base64 encoded string to an ArrayBuffer
 * @param data Base64 encoded string
 * @param urlMode If true, expects a base64url encoded string
 * @returns The decoded data as an ArrayBuffer.
 */
export const toArrayBuffer = (
  data: string,
  urlMode: boolean = false,
): ArrayBuffer => {
  const len = data.length;
  let bufferLength = data.length * 0.75;
  let i, p = 0;
  let encoded1, encoded2, encoded3, encoded4;

  if (data[data.length - 1] === "=") {
    bufferLength--;
    if (data[data.length - 2] === "=") {
      bufferLength--;
    }
  }

  const arraybuffer = new ArrayBuffer(bufferLength);
  const bytes = new Uint8Array(arraybuffer);
  const target = urlMode ? lookupUrl : lookup;

  for (i = 0; i < len; i += 4) {
    encoded1 = target[data.charCodeAt(i)];
    encoded2 = target[data.charCodeAt(i + 1)];
    encoded3 = target[data.charCodeAt(i + 2)];
    encoded4 = target[data.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arraybuffer;
};

/**
 * Decodes a base64 or base64url encoded ArrayBuffer into a regular string.
 *
 * @param arrBuf - The ArrayBuffer containing the encoded data.
 * @param urlMode - (Optional) Determines decoding mode:
 *    * `true`: Expects base64url encoding.
 *    * `false` (Default): Expects standard base64 encoding.
 * @returns The decoded string representation of the input data.
 */
export const fromArrayBuffer = (
  arrBuf: ArrayBuffer,
  urlMode: boolean = false,
): string => {
  const bytes = new Uint8Array(arrBuf);
  let i,
    result = "";

  const len = bytes.length,
    target = urlMode ? charsUrl : chars;

  for (i = 0; i < len; i += 3) {
    result += target[bytes[i] >> 2];
    result += target[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    result += target[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    result += target[bytes[i + 2] & 63];
  }

  const remainder = len % 3;
  if (remainder === 2) {
    result = result.substring(0, result.length - 1) + (urlMode ? "" : "=");
  } else if (remainder === 1) {
    result = result.substring(0, result.length - 2) + (urlMode ? "" : "==");
  }

  return result;
};

/**
 * Converts a base64 or base64url encoded string into a decoded text string.
 *
 * @param str - The base64/base64url encoded string to decode.
 * @param urlMode - (Optional) Determines decoding mode:
 *   * `true`: Expects base64url encoding.
 *   * `false` (Default): Expects standard base64 encoding.
 * @returns The decoded text string.
 */
export const toString = (str: string, urlMode: boolean = false): string => {
  return new TextDecoder().decode(toArrayBuffer(str, urlMode));
};

/**
 * Encodes a regular text string into a base64 or base64url representation.
 *
 * @param str - The text string to encode.
 * @param urlMode - (Optional) Determines encoding mode:
 *   * `true`: Produces base64url encoded output.
 *   * `false` (Default): Produces standard base64 encoded output.
 * @returns The base64/base64url encoded string.
 */
export const fromString = (str: string, urlMode: boolean = false): string => {
  return fromArrayBuffer(new TextEncoder().encode(str), urlMode);
};

/**
 * Checks whether a given string is valid base64 or base64url encoded data.
 *
 * @param encoded - The string to validate.
 * @param urlMode - (Optional) Determines validation mode:
 *   * `true`: Validates against base64url format.
 *   * `false` (Default): Validates against standard base64 format.
 * @returns `true` if the string is valid base64/base64url, `false` otherwise.
 */
export const validate = (
  encoded: string,
  urlMode: boolean = false,
): boolean => {
  // Bail out if not string
  if (!(typeof encoded === "string")) {
    return false;
  }

  // Go on validate
  try {
    return urlMode ? base64UrlPattern.test(encoded) : base64Pattern.test(encoded);
  } catch (_e) {
    return false;
  }
};
