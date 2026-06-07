export type DrawerRef = {
  openDrawer?: () => void;
  closeDrawer?: () => void;
};

let drawerRef: DrawerRef | null = null;

export const setDrawerRef = (ref: DrawerRef) => {
  drawerRef = ref;
};

export const openDrawer = () => {
  drawerRef?.openDrawer?.();
};

export const closeDrawer = () => {
  drawerRef?.closeDrawer?.();
};

export const getDrawerRef = () => drawerRef;
