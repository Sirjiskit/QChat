import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Avatar, Box, CheckIcon, HStack, Pressable, Select, Stack, Text, VStack } from "native-base";
import React from "react";
import { SafeAreaView, SectionList, StatusBar } from "react-native";
import { Colors } from "../config";
import { DepartmentsList } from "../config/data";
import { db } from "../config/firebase";
import { IComboBox, IUser } from "../interface";
import { Styled } from "../styled";
interface IData {
    title: string;
    data: Array<IUser>
}
const ContactsScreen = ({ navigation }: any) => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [users, setUsers] = React.useState<IUser[]>([]);
    const [data, setData] = React.useState<IData[]>([]);
    const [department, setDepartment] = React.useState<any>(null);
    React.useLayoutEffect(() => {
        loadData();
    }, []);
    const loadData = async (dpm_id = null) => {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "users"));
        const newUsers: Array<IUser> = await fmtData(snapshot, dpm_id);
        const newData: Array<IData> = await getData(newUsers);
        setLoading(false);
        setUsers(newUsers);
        setData(newData);
    };
    const fmtData = (snapshot: any, dpm_id = null) => {
        return new Promise<IUser[]>((resolve, reject) => {
            if (snapshot.size <= 0) {
                resolve([]);
            }
            let i = 0;
            const users: Array<IUser> = [];
            snapshot.forEach((doc: { data: () => any; }) => {
                const data = doc.data();
                if (dpm_id) {
                    if (dpm_id && +data.dpm_id == +dpm_id) {
                        users.push({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            email: data.email,
                            phoneNumber: data.phoneNumber,
                            avatar: data.avatar,
                            uuid: "",
                            createdAt: data?.createdAt,
                            department: data.dpm_id
                        })
                    }
                } else {
                    users.push({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        phoneNumber: data.phoneNumber,
                        avatar: data.avatar,
                        uuid: "",
                        createdAt: data?.createdAt,
                        department: data.dpm_id
                    })
                }

                i++;
                if (i == snapshot.size) {
                    resolve(users);
                }
            });
        });
    }
    const getData = (users: Array<IUser>) => {
        let contactArr: Array<IData> = [];
        let aCode = 'A'.charCodeAt(0);
        return new Promise<Array<IData>>((resolve, reject) => {
            for (let i = 0; i < 26; i++) {
                const curChar = String.fromCharCode(aCode + i);
                const obj: IData = { title: curChar, data: [] };
                const curData = users.filter(user => { return user.lastName[0].toUpperCase() === curChar; });
                if (curData.length > 0) {
                    curData.sort((a, b) => a.lastName.localeCompare(b.lastName));
                    obj.data = curData;
                    contactArr.push(obj);
                }
            }
            resolve(contactArr);
        });
    };
    const onSelect = (value: any) => {
        loadData(value);
    }
    const onRefresh = () => {
        setData([]);
        loadData();
    };
    const scrollToLocation = (params: any) => {

    }
    return (
        <React.Fragment>
            <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
            <SafeAreaView style={[Styled.content, { backgroundColor: Colors.white }]}>
                <Box px={3} pt={5}>
                    <VStack>
                        <Select onValueChange={onSelect}
                            minWidth="200" accessibilityLabel={'Filter by department'} placeholder={'Filter by department'} _selectedItem={{
                                endIcon: <CheckIcon size={5} />
                            }} mt="1">
                            <Select.Item label={'All departments'} value={null as any} />
                            {DepartmentsList.map((x: IComboBox, index: number) => (
                                <Select.Item key={index} label={x.label} value={x.value} />
                            ))}
                        </Select>
                        <Stack pt={5}>
                            <SectionList
                                sections={data}
                                keyExtractor={(item) => item.email}
                                renderItem={({ item }) =>
                                    <Pressable onPress={() => navigation.navigate('Chats', { data: item })}>
                                        <HStack space={5}>
                                            <Avatar source={{ uri: item.avatar }} />
                                            <VStack justifyContent={'center'}>
                                                <Text fontWeight={'semibold'} fontSize={'lg'}>{`${item.lastName} ${item.firstName}`}</Text>
                                                <Text>{item.email}</Text>
                                            </VStack>
                                        </HStack>
                                    </Pressable>
                                }
                                renderSectionHeader={({ section: { title } }) => (
                                    <Stack py={2}><Text>{title}</Text></Stack>
                                )}
                                onRefresh={onRefresh}
                                refreshing={loading}
                                stickySectionHeadersEnabled={true}
                            />
                        </Stack>
                    </VStack>
                </Box>
            </SafeAreaView>
        </React.Fragment>
    )
}
export default ContactsScreen;