## @cross/base64

**The Base64 Library for Deno, Node, Bun, and Browsers**

Based on [https://github.com/hexagon/base64](@hexagon/base64) but adapted to jsr.io, dropping all the legacy.

**Key Features:**

* **Cross-Platform Power:** Effortlessly encode and decode Base64 data in Deno, Node.js, Bun, and your favorite browsers.
* **Format Flexibility:**  Works with both regular Base64 and Base64url.
* **Data Versatility:** Smoothly convert between strings and ArrayBuffers.
* **Validation:** Conveniently check the validity of Base64 and Base64url strings.
* **TypeScript Support:** Enhanced development experience with included TypeScript typings.

**Installation:**

See [https://jsr.io/@cross/base64](jsr.io/@cross/base64)

**Usage:**

```javascript
import base64 from "jsr:@cross/base64@latest"; // jsr.io example

// Encode string as regular base64
const example1enc = base64.fromString("Hellö Wörld, how are you doing today?!");
console.log(example1enc);
// > SGVsbMO2IFfDtnJsZCwgaG93IGFyZSB5b3UgZG9pbmcgdG9kYXk/IQ==

// Decode string as regular base64
const example1dec = base64.toString("SGVsbMO2IFfDtnJsZCwgaG93IGFyZSB5b3UgZG9pbmcgdG9kYXk/IQ==");
console.log(example1dec);
// > Hellö Wörld, how are you doing today?!
// 
```