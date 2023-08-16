import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Actionsheet, Avatar, Box, Button, Heading, HStack, Icon, Modal, Spinner, Stack, Text, useDisclose, View, VStack } from "native-base";
import React, { memo } from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDpmById, getLevelById } from "../config/data";
import { auth, db, storage } from "../config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Styled } from "../styled";
import { AntDesign, Foundation, MaterialIcons, Entypo } from "@expo/vector-icons";
import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from 'expo-image-picker';
import { Buffer } from "buffer";
import { updateProfile } from "firebase/auth";
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
    const { isOpen, onOpen, onClose } = useDisclose();
    const [type, setType] = React.useState(CameraType.back);
    const [data, setData] = React.useState<any>();
    const [showModal, setShowModal] = React.useState(false);
    const [isUploading, setUploading] = React.useState<boolean>(false);
    const [camera, setCamera] = React.useState<any>(null);
    const [image, setImage] = React.useState<any>(auth?.currentUser?.photoURL as any);
    const [base64, setBase64] = React.useState<any>('');
    const [permission, requestPermission] = Camera.useCameraPermissions();
    React.useLayoutEffect(() => {
        loadData();
    }, [navigation]);
    const loadData = async () => {
        setData(await users());
        setTimeout(() => {
            setImage(auth?.currentUser?.photoURL as any);
        }, 0);
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true
        });
        if (!result.cancelled) {
            setImage(result.uri);
            await saveImage(result.uri, data.email);
            setBase64(result.uri);
            onClose();
        }
    };

    function toggleCameraType() {
        setType((current) => (
            current === CameraType.back ? CameraType.front : CameraType.back
        ));
    }
    const takePicture = () => {
        setShowModal(true);
        onClose();
    }

    const takePictureAsync = async () => {
        if (camera) {
            const result = await camera.takePictureAsync({ base64: true });
            setImage(result.uri);
            setBase64(result.base64);
            await saveImage(result.uri, data.email);
            setUploading(false);
        }
        setShowModal(false);
    }
    const saveImage = async (file: any, id: string) => {
        setUploading(true);
        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', file, true);
            xhr.send(null);
        });
        const imageUrl = `${Math.random().toString(36).substring(2, 64)}${Math.random().toString(36).substring(2, 64)}.jpg`;
        const storageRef = ref(storage, imageUrl);
        // uploadBytes(storageRef, blob).then((snapshot) => {
        //     console.log('Uploaded a blob or file!');
        // });
        const uploadTask = uploadBytesResumable(storageRef, blob);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log('Handle unsuccessful uploads');
                setUploading(false);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    update(id, downloadURL);
                    setUploading(false);
                });
            }
        );
    }
    const update = async (id: any, avatar: string) => {
        const userRef = doc(db, "users", id);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            await updateDoc(userRef, {
                avatar: avatar
            })
            updateProfile(auth?.currentUser as any, {
                displayName: `${data?.lastName} ${data?.firstName}`, photoURL: avatar
            }).then(() => {
                // Profile updated!
                // ...
            }).catch((error) => {
                // An error occurred
                // ...
            });
        } else {
            console.log("No such document! " + id);
        }

    }
    return (
        <React.Fragment>
            <SafeAreaView style={Styled.content}>
                <VStack space={5} mt={1}>
                    <HStack px={3} justifyContent={'space-between'} alignContent={'center'} alignItems={'center'} justifyItems={'center'}>
                        {image && <Avatar source={{ uri: image }} size={'lg'} />}
                        <TouchableOpacity onPress={onOpen}>
                            <AntDesign name="edit" size={24} color="black" />
                        </TouchableOpacity>
                    </HStack>
                    {isUploading && <HStack space={2} alignItems="center">
                        <Spinner accessibilityLabel="Uploading" />
                        <Heading color="primary.500" fontSize="xs">
                            Uploading..
                        </Heading>
                    </HStack>}
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
                <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
                    <Actionsheet.Content>
                        <Stack px={3} style={[Styled.dFlex, Styled.dColumn, Styled.w100]} justifyContent={'flex-start'}>
                            <Heading>Select</Heading>
                        </Stack>
                        <Actionsheet.Item onPress={pickImage} startIcon={<Icon as={<Foundation name="photo" />} color="muted.500" mr={3} />}>
                            Choose Photo
                        </Actionsheet.Item>
                        <Actionsheet.Item onPress={takePicture} startIcon={<Icon as={<Entypo name="camera" />} color="muted.500" mr={3} />}>
                            Take Photo
                        </Actionsheet.Item>
                    </Actionsheet.Content>
                </Actionsheet>
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="full">
                    <Modal.Content minH={'5/6'}>
                        <Modal.CloseButton />
                        <Modal.Body>
                            <Box mt={5}>
                                {(permission && permission?.granted) &&
                                    <View style={{ flex: 1, flexDirection: 'row', height: 400 }} mt={5}>
                                        <Camera ref={ref => setCamera(ref)} style={{ flex: 1 }} type={type} ratio={'1:1'} />
                                    </View>
                                }
                                {!permission?.granted &&
                                    <View px={3} style={{ flex: 1, justifyContent: 'center', height: 200, flexDirection: 'column' }}>
                                        <Text style={{ textAlign: 'center' }}>
                                            We need your permission to show the camera
                                        </Text>
                                        <Button onPress={requestPermission}>Grant Permission</Button>
                                    </View>
                                }
                            </Box>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button colorScheme="danger" onPress={() => {
                                    setShowModal(false);
                                }}>
                                    Close
                                </Button>
                                <Button onPress={toggleCameraType} variant="ghost" colorScheme="blueGray">
                                    Flip Camera
                                </Button>
                                <Button onPress={takePictureAsync}>
                                    Take Picture
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </SafeAreaView>
        </React.Fragment>
    )
}
export default memo(ProfileScreen);