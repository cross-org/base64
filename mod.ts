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

// Constants (Note: these can be defined within the `base64` namespace if preferred)
const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const charsUrl: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

// Define a reusable type for (target: string) => Uint8Array
const genLookup: (target: string) => Uint8Array = (target: string) => {
  const lookupTemp = new Uint8Array(256);

  for (let i = 0; i < target.length; i++) {
    lookupTemp[target.charCodeAt(i)] = i;
  }
  return lookupTemp;
};

const lookup: Uint8Array = genLookup(chars);
const lookupUrl: Uint8Array = genLookup(charsUrl);

// Regular Expressions
const base64UrlPattern = /^[-A-Za-z0-9\-_]*$/;
const base64Pattern = /^[-A-Za-z0-9+/]*={0,3}$/;

// The base64 Namespace
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

export const toString = (str: string, urlMode: boolean = false): string => {
  return new TextDecoder().decode(toArrayBuffer(str, urlMode));
};

export const fromString = (str: string, urlMode: boolean = false): string => {
  return fromArrayBuffer(new TextEncoder().encode(str), urlMode);
};

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
