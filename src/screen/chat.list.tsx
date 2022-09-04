import { Button, IconButton } from "native-base";
import React, { memo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../config";
const ChatListScreen = ({ navigation, route }: any) => {
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerRight: () => (<IconButton onPress={() => navigation.navigate('Contacts')} icon={<MaterialCommunityIcons name="chat-plus" size={24} color={Colors.primary600} />} />)
        });
    }, [navigation]);
    return (
        <React.Fragment>

        </React.Fragment>
    )
}
export default memo(ChatListScreen);