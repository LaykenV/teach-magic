// dataLoader.ts
import data from '../public/assets/comCreations.json';
import { Creation } from '@/types/types';

export const getData = (): Creation[] => {
  return data.map(item => ({
    ...item,
    created_at: new Date(item.created_at)
  })) as Creation[];
};