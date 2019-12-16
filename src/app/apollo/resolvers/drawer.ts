import storage from '../../helpers/storage';

export const setOpenDrawer = (
  _obj: void,
  { isOpen }: { isOpen: boolean },
  { cache }: any,
): null => {
  cache.writeData({
    data: {
      isOpenDrawer: isOpen,
    },
  });
  storage.set('isOpenDrawer', isOpen ? 'true' : 'false');
  return null;
};

export const setDrawerWidth = (
  _obj: void,
  { width }: { width: number },
  { cache }: any,
): null => {
  cache.writeData({
    data: {
      drawerWidth: width,
    },
  });
  // storage.set('drawerWidth', width);
  return null;
};
