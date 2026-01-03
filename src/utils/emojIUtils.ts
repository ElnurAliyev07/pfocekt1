export const isOnlyEmojis = (text: string): boolean => {
    const emojiRegex = /^[\p{Emoji}\s]+$/u; // Emojiler ve boşlukları kontrol eden regex
    return emojiRegex.test(text);
  };