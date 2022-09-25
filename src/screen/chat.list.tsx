import { Avatar, Badge, Box, Divider, HStack, IconButton, Pressable, Text, VStack } from "native-base";
import React, { memo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../config";
import { IChatsList } from "../interface/chats.list";
import { myChartList } from "../app/data/list";
import { FlatList, SafeAreaView } from "react-native";
import { auth, db } from "../config/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
const ChatListScreen = ({ navigation, route }: any) => {
    const [isLoading, setLoading] = React.useState<boolean>(true);
    const [list, setList] = React.useState<Array<IChatsList>>([]);
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
        setList(await myChartList() as Array<IChatsList>);
        setLoading(false);
    }
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
                    />
                </Box>
            </SafeAreaView>
        </React.Fragment>
    )
}
export default memo(ChatListScreen);