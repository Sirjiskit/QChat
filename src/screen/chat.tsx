import { Avatar, Button, HStack, IconButton, Text, View } from "native-base";
import React, { memo } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Colors } from "../config";
import { auth } from "../config/firebase";
import { Styled } from "../styled";
const ChatScreen = ({ navigation, route }: any) => {
    const { data } = route.params;
    const [messages, setMessages] = React.useState<any>([]);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <HStack style={{ marginLeft: 0 }} justifyContent={'center'} fontWeight={'bold'} fontSize={'lg'} alignItems={'center'} space={3}>
                    <Avatar source={{ uri: data.avatar as any }}
                    />
                    <Text numberOfLines={1}>{`${data.lastName} ${data.firstName}`}</Text>
                </HStack>
            ),
        });
    }, [navigation]);
    React.useLayoutEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, []);
    const onSend = React.useCallback((messages = []) => {
        setMessages((previousMessages: never[] | undefined) => GiftedChat.append(previousMessages, messages))
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
            <GiftedChat
                messages={messages}
                showAvatarForEveryMessage={true}
                onSend={messages => onSend(messages as any)}
                user={{
                    _id: auth?.currentUser?.email as any,
                    name: auth?.currentUser?.displayName as any,
                    avatar: auth?.currentUser?.photoURL as any
                }}
            />
            {/* {
                Platform.OS === 'android' &&
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} />
            } */}
        </View>
    )
}
export default memo(ChatScreen);