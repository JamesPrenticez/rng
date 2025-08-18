export type LinkStrictness = 0 | 1;

export const containsURL = (
    message: string,
    level: LinkStrictness = 0
): { hasURL: boolean; cleanedText: string } => {
    // Blocks obvious links: http(s), www., plain domains like example.com
    const normalPattern =
        /\b(?:https?:\/\/|www\.|[a-z0-9-]+\.[a-z]{2,})(?:\/\S*)?/gi;

    // Additionally blocks obfuscated domains like "example dot com" or "example[dot]com"
    const strictPattern =
        /\b(?:https?:\/\/|www\.|\S*\s+[a-z0-9-]+\s*(?:\.|dot|\[dot\]|\(dot\))\s*(?!dot\b)[a-z]{2,}|[a-z0-9-]+\s*(?:\.|dot|\[dot\]|\(dot\))\s*(?!dot\b)[a-z]{2,}|(?!dot\s+)(?!d\s*o\s*t\s+)[a-z0-9-]+(?:\s+[a-z0-9-]+)*\s+(?:d\s*o\s*t|\.)\s+(?:[a-z](?:\s*[a-z])+))(?:\/\S*)?/gi;

    const pattern = level === 1 ? strictPattern : normalPattern;

    // Find all matches
    const matches = message.match(pattern);

    if (matches && matches.length > 0) {
        // Clean the message by replacing URLs with [LINK REMOVED]
        let cleanedText = message;

        matches.forEach((match) => {
            cleanedText = cleanedText.replace(match, '[LINK REMOVED]');
        });

        return {
            hasURL: true,
            cleanedText: cleanedText.trim(),
        };
    }

    return {
        hasURL: false,
        cleanedText: message,
    };
};
