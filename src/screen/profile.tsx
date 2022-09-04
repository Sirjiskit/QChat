import { Avatar, Heading, HStack, Stack, Text, VStack } from "native-base";
import React, { memo } from "react";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../app/hooks";
import { getDpmById } from "../config/data";
import { Styled } from "../styled";

const ProfileScreen = ({ navigation }: any) => {
    const logInfo = useAppSelector((state) => state.auth.currentUser);
    return (
        <React.Fragment>
            <SafeAreaView style={Styled.content}>
                <VStack space={5}>
                    <HStack px={3}>
                        <Avatar source={{ uri: logInfo?.avatar }} size={'lg'} />
                    </HStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>First Name</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={logInfo?.firstName} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Last Name</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={logInfo?.lastName} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Email address</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={logInfo?.email} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Phone number</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={logInfo?.phoneNumber} />
                        </Stack>
                    </VStack>
                    <VStack>
                        <Heading px={3} size={'xs'} fontWeight={'medium'}>Department</Heading>
                        <Stack style={{ backgroundColor: 'white' }} px={3}>
                            <TextInput multiline={true} editable={false} style={{ fontWeight: '600', color: 'black', fontSize: 16 }} value={getDpmById(logInfo?.department as any)} />
                        </Stack>
                    </VStack>
                </VStack>
            </SafeAreaView>
        </React.Fragment>
    )
}
export default memo(ProfileScreen);