import { Avatar, Badge, Box, Divider, HStack, IconButton, Pressable, Text, VStack } from "native-base";
import React, { memo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../config";
import { IChatsList } from "../interface/chats.list";
import { myChartList } from "../app/data/list";
import { FlatList, SafeAreaView } from "react-native";
import { auth, db } from "../config/firebase";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDpmById, getLevelById } from "../config/data";
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
const ChatListScreen = ({ navigation, route }: any) => {
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Array<IChatsList>>([]);
    const [data, setData] = React.useState<any>();
    React.useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerRight: () => (<IconButton onPress={() => navigation.navigate('Contacts')} icon={<MaterialCommunityIcons name="chat-plus" size={24} color={Colors.primary600} />} />)
        });
        const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
            loadData();
        });
        return () => {
            unsubscribe();
        };
    }, [navigation]);
    const loadData = async () => {
        setData(await users());
        setList(await myChartList() as Array<IChatsList>);
        setLoading(false);
    }
    const avatar = 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x';
    return (
        <React.Fragment>
            <SafeAreaView>
                <Box px={3} mt={3}>
                    <FlatList
                        data={list}
                        renderItem={({ item }) =>
                            <Pressable onPress={() => navigation.navigate('Chats', { data: item })}>
                                <HStack space={5} my={2}>
                                    <Avatar source={{ uri: item.avatar }} />
                                    <HStack style={{ width: '80%' }} justifyContent={'space-between'} alignContent={'center'} alignItems={'center'} alignSelf={'center'}>
                                        <VStack justifyContent={'center'}>
                                            <Text fontWeight={'semibold'} fontSize={'lg'}>{`${item.lastName} ${item.firstName}`}</Text>
                                            <Text>{item.email}</Text>
                                        </VStack>
                                        {item.unread > 0 && <Badge // bg="red.400"
                                            colorScheme="danger" rounded="full" variant="solid" _text={{
                                                fontSize: 12
                                            }}>
                                            {item.unread}
                                        </Badge>
                                        }
                                    </HStack>
                                </HStack>
                            </Pressable>
                        }
                        keyExtractor={item => item.chatId}
                        ItemSeparatorComponent={() => <Divider />}
                        ListHeaderComponent={() =>
                            <Pressable onPress={() =>
                                navigation.navigate('GroupChats', {
                                    data: { chatId: `${data?.dpm_id}${data?.level}`, dpm: `${getDpmById(data?.dpm_id)}`, level: `${getLevelById(data?.level)}` }
                                })}>
                                <VStack>
                                    <HStack space={5} my={2}>
                                        <Avatar source={{ uri: avatar }} />
                                        <VStack justifyContent={'center'}>
                                            <Text numberOfLines={1} fontWeight={'semibold'} fontSize={'lg'}>{getDpmById(data?.dpm_id)}</Text>
                                            <Text>{getLevelById(data?.level)}</Text>
                                        </VStack>
                                    </HStack>
                                    <Divider />
                                </VStack>
                            </Pressable>
                        }
                    />
                </Box>
            </SafeAreaView>
        </React.Fragment>
    )
}
export default memo(ChatListScreen);