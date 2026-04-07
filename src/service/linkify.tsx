import React from 'react';
import { Link } from 'react-router-dom';

export const linkify = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  /** Map the parts to create a mixed array of text and links */
  return parts.map((part, index, array) => {
    if (part.match(urlRegex)) {
      /** If the part is a URL, convert it to a clickable link */
      return (
        <Link key={index} to={part} target="_blank">
          {part}
        </Link>
      );
    } else {
      /** If it's regular text, just display it as-is */
      return <span key={index}>{part}</span>;
    }
  });
};
