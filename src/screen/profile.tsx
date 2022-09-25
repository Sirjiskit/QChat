import { doc, getDoc } from "firebase/firestore";
import { Avatar, Heading, HStack, Stack, Text, VStack } from "native-base";
import React, { memo } from "react";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../app/hooks";
import { getDpmById, getLevelById } from "../config/data";
import { auth, db } from "../config/firebase";
import { Styled } from "../styled";
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
const ProfileScreen = ({ navigation }: any) => {
    const [data, setData] = React.useState<any>();
    const logInfo = useAppSelector((state) => state.auth.currentUser);
    React.useLayoutEffect(() => {
        loadData();
    }, [navigation]);
    const loadData = async () => {
        setData(await users());
    }
    return (
        <React.Fragment>
            <SafeAreaView style={Styled.content}>
                <VStack space={5}>
                    <HStack px={3}>
                        <Avatar source={{ uri: data?.avatar }} size={'lg'} />
                    </HStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>First Name</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={data?.firstName} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Last Name</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={data?.lastName} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Email address</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={data?.email} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Phone number</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={data?.phoneNumber} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Department</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput multiline={true} editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={getDpmById(data?.dpm_id as any)} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Level</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput multiline={true} editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={getLevelById(data?.level as any)} />
                        </Stack>
                    </VStack>
                </VStack>
            </SafeAreaView>
        </React.Fragment>
    )
}
export default memo(ProfileScreen);