import React, { memo, ReactNode, useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";

import DrawerContent from "@/components/DrawerContent";

import { setDrawerRef } from "@/utils/DrawerController";

const screenWidth = Dimensions.get("window").width;
const DRAWER_WIDTH = screenWidth * 0.75;

interface CustomDrawerLayoutProps {
  children: ReactNode;
}

function CustomDrawerLayout({ children }: CustomDrawerLayoutProps) {
  const drawerRef = useRef<DrawerLayoutMethods>(null);

  useEffect(() => {
    setDrawerRef({
      openDrawer: () => {
        drawerRef.current?.openDrawer({
          animationSpeed: 1,
          initialVelocity: 0,
        });
      },
      closeDrawer: () => {
        drawerRef.current?.closeDrawer();
      },
    });
  }, []);

  return (
    <ReanimatedDrawerLayout
      ref={drawerRef}
      drawerWidth={DRAWER_WIDTH}
      drawerPosition={DrawerPosition.LEFT}
      drawerType={DrawerType.FRONT}
      renderNavigationView={() => <DrawerContent />}
      hideStatusBar={false}
      overlayColor="rgba(0, 0, 0, 0.5)"
      animationSpeed={1}
      edgeWidth={0}>
      {children}
    </ReanimatedDrawerLayout>
  );
}

export default memo(CustomDrawerLayout);
