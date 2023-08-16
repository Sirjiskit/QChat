import { addDoc, collection,onSnapshot, orderBy, query } from "firebase/firestore";
import { Avatar, HStack, Text, VStack } from "native-base";
import React, { memo } from "react";
import { ImageBackground, StatusBar, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Colors } from "../config";
import { auth, db } from "../config/firebase";

const GroupChatScreen = ({ navigation, route }: any) => {
    const [isTyping, setTyping] = React.useState<boolean>(true);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const { data } = route.params;
    const [messages, setMessages] = React.useState<any>([]);
    const img = require('./../../assets/bg.png');
    const avatar = 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x';
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <HStack style={{ marginLeft: 0 }} justifyContent={'center'} fontWeight={'bold'} fontSize={'lg'} alignItems={'center'} space={3}>
                    <Avatar size={10} source={{ uri: avatar }}
                    />
                    <VStack justifyContent={'center'}>
                        <Text numberOfLines={1}>{data?.dpm}</Text>
                        <Text>{data?.level}</Text>
                    </VStack>
                </HStack>
            ),
        });
    }, [navigation]);
    React.useLayoutEffect(() => {
        const q = query(collection(db, 'groupChats'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
            const chats: any = [];
            snapshot.docs.forEach((doc) => {
                if (doc.data().chatId == data?.chatId) {
                    chats.push({
                        _id: doc.data()._id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        user: doc.data().user
                    });
                }
            });
            setMessages(chats);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    const onChange = (text: string) => {
        if (text) {
            setTyping(true);
        }
        else {
            setTyping(false);
        }
    }
    const onSend = React.useCallback((messages = []) => {
        const { _id, createdAt, text, user, } = messages[0];
        const chatRef = collection(db, "groupChats");
        addDoc(collection(db, 'groupChats'), {
            _id,
            chatId: data?.chatId,
            createdAt,
            text,
            user,
            read: false
        });
        setTyping(false);
    }, []);
    return (
        <ImageBackground source={img} style={{ flex: 1 }}>
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
                    isLoadingEarlier={isLoading}
                    onInputTextChanged={
                        (text) => onChange(text)
                    }
                    isTyping={isTyping}

                />
            </View>
        </ImageBackground>

    )
}
export default memo(GroupChatScreen);