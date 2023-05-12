/**
 * Create HTML from an message object
 * @param {Object} message
 * @param {Boolean} isSelf
 * @returns
 */

export function messageToHtml(message, isSelf) {
  console.log(message, isSelf);
  return `
        <p class="message__user">${isSelf ? "U" : message.username}</p>
        <p class="message__content">${message.message}</p>
        <p class="message__date">${message.date}</p>`;
}

/**
 * Replace the avatar image source or to an emoji
 * @param {String | String[]} avatar
 * @param {Element} avatarImg
 */
export function createAvatar(avatar, avatarImg) {
  if (avatar.startsWith(`https://`) || avatar.startsWith(`http://`)) {
    avatarImg.src = avatar;
  } else {
    const parsedEmoji = JSON.parse(avatar.replaceAll(`'`, `"`));
    const emoji = parsedEmoji[Math.floor(Math.random() * parsedEmoji.length)];
    avatarImg.parentElement.replaceChild(
      Object.assign(document.createElement("div"), {
        classList: avatarImg.classList,
        innerHTML: emoji,
      }),
      avatarImg
    );
  }
}
