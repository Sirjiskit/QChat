import { StatusBar, Text } from "native-base";
import React, { memo } from "react";
import { MyTab } from "../components/navigation";
import { Colors } from "../config";

const HomeScreen = () => {
    return (
        <React.Fragment>
             <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
            <MyTab />
        </React.Fragment>
    )
}
export default memo(HomeScreen);