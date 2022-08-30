import { StatusBar } from "expo-status-bar";
import { Box } from "native-base";
import React from "react";

type Props = {
    bgColor?: string;
    style?: 'light' | 'dark'
}
const MyStatusBar = ({ bgColor = '#fff', style = 'dark' }: Props) => {
    return (
        <React.Fragment>
            <StatusBar backgroundColor={bgColor} animated={true} style={style} />
            <Box safeAreaTop bg={bgColor} />
        </React.Fragment>
    );
}
export default MyStatusBar;