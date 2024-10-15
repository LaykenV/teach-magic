'use client';

import React, { use, useEffect } from 'react';
import { useSlideContext } from '@/context/SlideContext';
import { User } from '@/drizzle/schema';

interface SetUserContextProps {
  user: User;
}

const SetUserContext: React.FC<SetUserContextProps> = ({ user }) => {
  const { setUser } = useSlideContext();

  useEffect(() => {
    if (!user) {
      return;
    }
    setUser(user);
  }, [user, setUser]);

  return null; // This component doesn't render anything
};

export default SetUserContext;