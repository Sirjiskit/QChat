import { addDoc, collection, getDoc, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { Avatar, HStack, Text, View } from "native-base";
import React, { memo } from "react";
import { ImageBackground, StatusBar } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Colors } from "../config";
import { auth, db } from "../config/firebase";
import { getDocs, doc } from "firebase/firestore";
const users = () => {
    const docRef = doc(db, "users", `${auth.currentUser?.email}`);
    return new Promise<any>(async (r, j) => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            r(docSnap.data() as any);
        } else {
            j(false);
        }
    });
};
const ChatScreen = ({ navigation, route }: any) => {
    const { data } = route.params;
    const [uData, setUData] = React.useState<any>();
    const [messages, setMessages] = React.useState<any>([]);
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [isTyping, setTyping] = React.useState<boolean>(true);
    React.useLayoutEffect(() => {
        loadUser();
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
    const loadUser = async () => {
        setUData(await users());
    }
    React.useLayoutEffect(() => {
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
                            avatar: doc.data().sender == auth?.currentUser?.email ? uData?.avatar : data.avatar,
                            name: doc.data().sender == auth?.currentUser?.email ? auth?.currentUser?.displayName : `${data.lastName} ${data.firstName}`
                        },
                    });
                    update(doc.id);
                }
            });
            setMessages(chats);
            setLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    const update = async (id: any) => {
        const chatRef = doc(db, "chats", id);
        const docSnap = await getDoc(chatRef);
        if (docSnap.exists()) {
            await updateDoc(chatRef, {
                read: true
            })
        } else {
            console.log("No such document! " + id);
        }

    }
    const onChange = (text: string) => {
        if (text) {
            setTyping(true);
        }
        else {
            setTyping(false);
        }
    };
    const onSend = React.useCallback((messages = []) => {
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
                />
            </View>
        </ImageBackground>

    )
}
export default memo(ChatScreen);