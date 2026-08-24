import React from 'react';

export const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  /** Map the parts to create a mixed array of text and links */
  return parts.map((part, index, array) => {
    if (part.match(urlRegex)) {
      /** If the part is a URL, convert it to a clickable link.
          Always an absolute external URL, so a plain <a> is correct
          regardless of which router (if any) the consuming app uses. */
      return (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    } else {
      /** If it's regular text, just display it as-is */
      return <span key={index}>{part}</span>;
    }
  });
};
