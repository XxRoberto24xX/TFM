import React, { memo, ReactNode, RefObject } from "react";
import { StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import BottomSheet, { BottomSheetBackgroundProps, BottomSheetProps } from "@gorhom/bottom-sheet";

import { Colors } from "@/constants/colors";

interface Props extends BottomSheetProps {
  children: ReactNode;
  ref?: RefObject<BottomSheet | null>;
}

const customBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <LinearGradient
      style={style}
      colors={[Colors.primaryOrange, Colors.primaryPink]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );
};

const BottomSheetThemed = ({ children, ref, ...bottomSheetProps }: Props) => {
  return (
    <BottomSheet
      ref={ref}
      style={styles.bottomSheet}
      enableDynamicSizing={false}
      enableOverDrag={false}
      handleIndicatorStyle={styles.handlerIndicator}
      backgroundComponent={customBackground}
      {...bottomSheetProps}>
      {children}
    </BottomSheet>
  );
};

export default memo(BottomSheetThemed);

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  handlerIndicator: {
    backgroundColor: "white",
  },
});
