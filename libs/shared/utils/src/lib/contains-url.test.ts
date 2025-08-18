import { containsURL } from './contains-url.util';

// nx run shared/utils:test --testFile=src/lib/contains-url.test.ts --watch

const cases = [
    // Safe
    { msg: 'Just some random text', expected: false },
    { msg: '127.0.0.1 is localhost', expected: false },
    { msg: 'dot dot dot', expected: false },
    { msg: 'com on', expected: false },
    { msg: 't h i s i s o k a y', expected: false },
    { msg: 'D O T', expected: false },

    // Blocked
    { msg: 'http://example.com', expected: true },
    { msg: 'https://example.com', expected: true },
    { msg: 'https://example.com/page', expected: true },
    { msg: 'https://example.com/page?userId=1234', expected: true },
    { msg: 'HTTP://EXAMPLE.COM', expected: true },
    { msg: 'HTTP://EXAMPLE.COM/page', expected: true },
    { msg: 'HTTP://EXAMPLE.COM/page?userId=123', expected: true },
    { msg: 'www.example.com', expected: true },
    { msg: 'example.com', expected: true },
    { msg: 'example.au', expected: true },
    { msg: 'example.co.au', expected: true },
    { msg: 'example.org', expected: true },
    { msg: 'example.io', expected: true },
    { msg: 'example.dev', expected: true },
    { msg: 'https://bit.ly/xyz123', expected: true },
    { msg: 'https://t.co/shorty', expected: true },
    { msg: 'a.co/shorty', expected: true },
    { msg: 'https://youtu.be/dQw4w9WgXcQ', expected: true },
    { msg: 'sub.domain.co.au/page', expected: true },
    { msg: 'ftp://files.example.com', expected: true },
    { msg: 'ftp://example.org', expected: true },
    { msg: 'bit.ly/abc123', expected: true },
    { msg: 't.co/xyz', expected: true },
    { msg: "<a href='https://example.com'>link</a>", expected: true },
    { msg: '[example](https://example.com)', expected: true },
    { msg: '![image](https://example.com/pic.jpg)', expected: true },
    { msg: "<img src='https://example.com/pic.jpg'>", expected: true },

    // Emails
    { msg: 'test@example.com', expected: true },
    { msg: 'someone@gmail.com', expected: true },
    { msg: 'mailto:someone@example.com', expected: true },
];

const casesNormal = [
    ...cases,
    // Not Blocked by normal but is blocked by strict
    { msg: 'example . anything', expected: false },
    { msg: 'example dot anything', expected: false },
    { msg: 'example d o t anything', expected: false },
    { msg: 'EXAMPLE D O T A N Y T H I N G', expected: false },
    { msg: 'example[dot]anything', expected: false },
    { msg: 'example(dot)anything', expected: false },
    { msg: 'EXAMPLE DOT ANYTHING', expected: false },
    { msg: 'example d o t c o m', expected: false },
    { msg: 'EXAMPLE D O T C O M', expected: false },
    { msg: 'EXAMPLE D O T com', expected: false },
    { msg: 't i n y u r l [dot] com', expected: false },
    { msg: 'subdomain dot example dot co dot au', expected: false },
];

const casesStrict = [
    ...cases,
    { msg: 'example . anything', expected: true },
    { msg: 'example dot anything', expected: true },
    { msg: 'example d o t anything', expected: true },
    { msg: 'EXAMPLE D O T A N Y T H I N G', expected: true },
    { msg: 'example[dot]anything', expected: true },
    { msg: 'example(dot)anything', expected: true },
    { msg: 'EXAMPLE DOT ANYTHING', expected: true },
    { msg: 'example d o t c o m', expected: true },
    { msg: 'EXAMPLE D O T C O M', expected: true },
    { msg: 'EXAMPLE D O T com', expected: true },
    { msg: 't i n y u r l [dot] com', expected: true },
    { msg: 'subdomain dot example dot co dot au', expected: true },
];

// const cleanedTextCases = [
//     {
//         msg: 'Check out https://example.com and also www.google.com for more info',
//         level: 0,
//         expected: true,
//         cleanedText: 'Check out [LINK REMOVED] and also [LINK REMOVED] for more info'
//     },
//     {
//         msg: 'Contact me at john@example.com or visit example.org',
//         level: 0,
//         expected: true,
//         cleanedText: 'Contact me at [LINK REMOVED] or visit [LINK REMOVED]'
//     },
//     {
//         msg: 'Visit example dot com and also check github dot io',
//         level: 1,
//         expected: true,
//         cleanedText: 'Visit [LINK REMOVED] and also check [LINK REMOVED]'
//     },
//     {
//         msg: 'Text before https://example.com and text after',
//         level: 0,
//         expected: true,
//         cleanedText: 'Text before [LINK REMOVED] and text after'
//     }
// ];

describe('blockURLs', () => {
    describe('normal - blocks obvious links: http(s), www., plain domains like example.com', () => {
        casesNormal.forEach(({ msg, expected }) => {
            it(`"${msg}" → ${expected}`, () => {
                const result = containsURL(msg, 0);
                expect(result.hasURL).toBe(expected);
            });
        });
    });

    describe("strict - additionaly blocks obfuscated domains like 'example dot com' or 'example[dot]com'", () => {
        casesStrict.forEach(({ msg, expected }) => {
            it(`"${msg}" → ${expected}`, () => {
                const result = containsURL(msg, 1);
                expect(result.hasURL).toBe(expected);
            });
        });
    });

    // describe("strict - additionally blocks obfuscated domains like 'example dot com' or 'example[dot]com'", () => {
    //   cleanedTextCases.forEach(({ msg, expected, cleanedText }) => {
    //       it(`"${msg}" → hasURL: ${expected}`, () => {
    //           const result = containsURL(msg, 1);
    //           expect(result.hasURL).toBe(expected);
    //       });

    //       it(`"${msg}" → cleanedMessage: "${cleanedText}"`, () => {
    //           const result = containsURL(msg, 1);
    //           expect(result.cleanedText).toBe(cleanedText);
    //       });
    //   });
    // });

    // describe('return type validation', () => {
    //   it('should return an object with hasURL and cleanedText properties', () => {
    //         const result = containsURL('test message', 0);
    //         expect(result).toHaveProperty('hasURL');
    //         expect(result).toHaveProperty('cleanedText');
    //         expect(typeof result.hasURL).toBe('boolean');
    //         expect(typeof result.cleanedText).toBe('string');
    //     });
    // });
});
