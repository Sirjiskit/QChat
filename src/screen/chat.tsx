import { addDoc, collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Avatar, HStack, Text, View } from "native-base";
import React, { memo } from "react";
import { ImageBackground, StatusBar } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Colors } from "../config";
import { auth, db } from "../config/firebase";
import { getDocs } from "firebase/firestore";
const ChatScreen = ({ navigation, route }: any) => {
    const { data } = route.params;
    const [messages, setMessages] = React.useState<any>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [isTyping, setTyping] = React.useState<boolean>(true);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <HStack style={{ marginLeft: 0 }} justifyContent={'center'} fontWeight={'bold'} fontSize={'lg'} alignItems={'center'} space={3}>
                    <Avatar size={10} source={{ uri: data.avatar as any }}
                    />
                    <Text numberOfLines={1}>{`${data.lastName} ${data.firstName}`}</Text>
                </HStack>
            ),
        });
    }, [navigation]);
    React.useLayoutEffect(() => {
        // const q = query(collection(db, 'chats'),
        //     where('chatId', '==', `${auth.currentUser?.email}${data.email}`));
        const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
            const chats: any = [];
            snapshot.docs.forEach((doc) => {
                if (doc.data().chatId == `${auth.currentUser?.email}${data.email}` || doc.data().chatId == `${data.email}${auth.currentUser?.email}`) {
                    chats.push({
                        _id: doc.data()._id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        // user: doc.data().user
                        user: {
                            _id: doc.data().sender == auth?.currentUser?.email ? auth?.currentUser?.email : data.email,
                            avatar: doc.data().sender == auth?.currentUser?.email ? auth?.currentUser?.photoURL : data.avatar,
                            name: doc.data().sender == auth?.currentUser?.email ? auth?.currentUser?.displayName : `${data.lastName} ${data.firstName}`
                        },
                    });
                }
            });
            setMessages(chats);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
        // setMessages([
        //     {
        //         _id: 1,
        //         text: 'Hello developer',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'React Native',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     },
        // ])
    }, []);
    const onChange = (text: string) => {
        if (text) {
            setTyping(true);
        }
        else {
            setTyping(false);
        }
    };
    const onSend = React.useCallback((messages = []) => {
        // setMessages((previousMessages: never[] | undefined) => GiftedChat.append(previousMessages, messages))
        const { _id, createdAt, text, user, } = messages[0];
        const chatId = `${auth.currentUser?.email}${data.email}`;
        const chatId2 = `${data.email}${auth.currentUser?.email}`;
        const userId = data.email;
        setChatList(chatId, chatId2, userId);
        const chatRef = collection(db, "chats");
        addDoc(collection(db, 'chats'), {
            _id,
            chatId: chatId,
            createdAt,
            text,
            sender: auth.currentUser?.email,
            receiver: data.email,
            read: false
        });
        setTyping(false);
    }, []);
    const setChatList = async (chatId: string, chatId2: string, userId: string) => {
        const q = query(collection(db, "ChatList"), where("chatId", "in", [chatId, chatId2]));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            addDoc(collection(db, 'ChatList'), {
                chatId: chatId,
                userId: userId,
                myId: auth.currentUser?.email,
            });
        }
        querySnapshot.forEach((doc: { id: any; data: () => any; }) => {
            console.log(doc.id, " => ", doc.data());
        });
    };
    const img = require('./../../assets/bg.png');
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
                // parsePatterns={(linkStyle) => [
                //     { type: 'phone', style: linkStyle, onPress: this.onPressPhoneNumber },
                //     { pattern: /#(\w+)/, style: { ...linkStyle, styles.hashtag }, onPress: this.onPressHashtag },
                //   ]}
                />
                {/* {
                Platform.OS === 'android' &&
                <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} />
            } */}
            </View>
        </ImageBackground>

    )
}
export default memo(ChatScreen);