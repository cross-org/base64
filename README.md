## Cross-runtime base64/base64url library for Deno, Bun, and Node.js

[![JSR Version](https://jsr.io/badges/@cross/base64)](https://jsr.io/@cross/base64) [![JSR Score](https://jsr.io/badges/@cross/base64/score)](https://jsr.io/@cross/base64/score)

Based on [@hexagon/base64](https://github.com/hexagon/base64) but adapted to TypeScript and jsr.io, dropping all the legacy tooling.

**NOTE:** If not bound to any of the specific features of this library (like validation, or decoding directly to a string), you might be better off using
[https://jsr.io/@std/encoding](https://jsr.io/@std/encoding).

**Key Features:**

- **Cross-Platform Power:** Effortlessly encode and decode Base64 data in Deno, Node.js, Bun, and your favorite browsers.
- **Format Flexibility:** Works with both regular Base64 and Base64url.
- **Data Versatility:** Smoothly convert between strings and ArrayBuffers.
- **Validation:** Conveniently check the validity of Base64 and Base64url strings.
- **TypeScript Support:** Enhanced development experience with included TypeScript typings.

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
