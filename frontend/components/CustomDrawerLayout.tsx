import React, { useRef, ReactNode } from "react";
import { Dimensions } from "react-native";
import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import { setDrawerRef } from "@/utils/DrawerController";
import DrawerContent from "@/components/DrawerContent";

const screenWidth = Dimensions.get("window").width;
const DRAWER_WIDTH = screenWidth * 0.75;

interface CustomDrawerLayoutProps {
  children: ReactNode;
}

export const CustomDrawerLayout = ({ children }: CustomDrawerLayoutProps) => {
  const drawerRef = useRef<DrawerLayoutMethods>(null);

  React.useEffect(() => {
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
      animationSpeed={1}>
      {children}
    </ReanimatedDrawerLayout>
  );
};
