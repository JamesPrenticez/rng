import { useState } from 'react';
// import md5 from 'md5'; // Install md5 for hashing
import multiavatar from '@multiavatar/multiavatar';

interface ContactImageProps {
  src?: string;
  alt?: string;
  email?: string;
  size?: number;
}

export const ContactImage = ({
  src,
  alt = 'Avatar',
  email = '',
  size = 100,
}: ContactImageProps) => {
  const [imageError, setImageError] = useState(false);

  // Generate a DiceBear avatar URL if the image is missing
  const base64Avatar = `data:image/svg+xml;base64,${btoa(
    multiavatar(email ?? '')
  )}`;

  return (
    <img
      src={imageError || !src ? base64Avatar : src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setImageError(true)}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
    />
  );
};
