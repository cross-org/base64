## Cross-runtime base64/base64url library for Deno, Bun, and Node.js

[![JSR Version](https://jsr.io/badges/@cross/base64?ver=bust)](https://jsr.io/@cross/base64) [![JSR Score](https://jsr.io/badges/@cross/base64/score?ver=bust)](https://jsr.io/@cross/base64/score)

Based on [@hexagon/base64](https://github.com/hexagon/base64) but adapted to TypeScript and jsr.io, dropping all the legacy tooling. Part of the @cross suite - check out our growing collection of cross-runtime tools at [github.com/cross-org](https://github.com/cross-org).

**NOTE:** If not bound to the specific features of this library (like validation, or decoding directly to a string), you might be better off using
[https://jsr.io/@std/encoding](https://jsr.io/@std/encoding).

**Key Features:**

- Encode and decode Base64 data in Deno, Node.js, Bun, and your favorite browsers.
- Works with both regular Base64 and Base64url.
- Smoothly convert between strings and ArrayBuffers.
- Check the validity of Base64 and Base64url strings.
- TypeScript typings included.

**Installation:**

See [jsr.io/@cross/base64](https://jsr.io/@cross/base64)

**Usage:**

```javascript
// See jsr.io/@cross/base64 for installation instructions
import { fromString, toString } from "jsr:@cross/base64";

// Encode string as regular base64
// - Use the second parameter to enable/disable base64url
const example1enc = fromString("Hellö Wörld, how are you doing today?!", true);
console.log(example1enc);
// > SGVsbMO2IFfDtnJsZCwgaG93IGFyZSB5b3UgZG9pbmcgdG9kYXk_IQ

// Decode string as regular base64
// - Use the second parameter to enable/disable base64url
const example1dec = toString("SGVsbMO2IFfDtnJsZCwgaG93IGFyZSB5b3UgZG9pbmcgdG9kYXk_IQ", true);
console.log(example1dec);
// > Hellö Wörld, how are you doing today?!
//
```
