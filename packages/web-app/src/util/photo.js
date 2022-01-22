import md5 from "md5"

export function getDefaultProductPhoto(id) {
    return `/api/products/${id}/photos/0`;
}

export function getDefaultRecipePhoto(id) {
    return `/api/recipes/${id}/photos/0`
}

export function getPlaceholderPhotoUrl(photosCount, photoKey, text) {
    const color = generateColor(text, 50, 5)
    return `https://craftypixels.com/placeholder-image/400x200/${color}/fff&text=${text}`;
}

export function randomPlaceholderGenerator() {
    return function getPlaceholderUrl(text) {
        return getPlaceholderPhotoUrl(200, Math.random() * 200, text);
    }
}

function hexdec(s) {
    var i, j, digits = [0], carry;
    for (i = 0; i < s.length; i += 1) {
        carry = parseInt(s.charAt(i), 16);
        for (j = 0; j < digits.length; j += 1) {
            digits[j] = digits[j] * 16 + carry;
            carry = digits[j] / 10 | 0;
            digits[j] %= 10;
        }
        while (carry > 0) {
            digits.push(carry % 10);
            carry = carry / 10 | 0;
        }
    }
    return digits.reverse().join('');
}

function sum(items) {
    return items.reduce((acc, item) => acc + item)
}

export function generateColor(text, minBrightness, spec) {
    if (spec < 2 || spec > 10) throw new Error("spec is out of range");
    if (minBrightness < 0 || minBrightness > 255) throw new Error("$min_brightness is out of range");


    const hash = md5(text);  //Gen hash of text
    const colors = [];

    for (let i = 0; i < 3; i++) {
        const a = hash.slice(spec * i, spec * i + spec)
        const b = hexdec(a)
        const c1 = ''.padEnd(spec, 'F')
        const c = hexdec(c1)
        colors[i] = Math.max(Math.round((b / c) * 255), minBrightness); //convert hash into 3 decimal values between 0 and 255
    }

    if (minBrightness > 0)  //only check brightness requirements if min_brightness is about 100
        while (sum(colors) / 3 < minBrightness)  //loop until brightness is above or equal to min_brightness
            for (let i = 0; i < 3; i++)
                colors[i] += 10;	//increase each color by 10

    let output = '';

    for (let i = 0; i < 3; i++) {
        const dec = parseInt(colors[i], 16).toString()
        output += dec.padStart(2, '0');  //convert each color to hex and append to output
    }

    return output;
}