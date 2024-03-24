import { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
import type { TUser } from 'librechat-data-provider';

type UseAvatarResult = string | undefined;

const useAvatar = (user: TUser | undefined): UseAvatarResult => {
  const [avatarSrc, setAvatarSrc] = useState<UseAvatarResult>(() => {
    if (user?.avatar) {
      return user.avatar;
    }
    if (!user?.username) {
      return undefined;
    }
    return '';
  });

  useEffect(() => {
    if (avatarSrc || !user?.username) {
      return;
    }

    const generateAvatar = async () => {
      if (!user) {
        return;
      }

      const { username } = user;

      const avatar = createAvatar(initials, {
        seed: username,
        fontFamily: ['Verdana'],
        fontSize: 36,
      });

      try {
        const avatarDataUri = await avatar.toDataUri();
        setAvatarSrc(avatarDataUri);
      } catch (error) {
        console.error('Failed to generate avatar:', error);
        setAvatarSrc('');
      }
    };

    generateAvatar();
  }, [user, avatarSrc]);

  return avatarSrc;
};

export default useAvatar;
