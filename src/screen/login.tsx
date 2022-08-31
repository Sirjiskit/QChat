import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Box, Button, Heading, Icon, Link, Stack, Text, View, VStack } from "native-base";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { useAppDispatch } from "../app/hooks";
import { loadCurrentUser } from "../app/reducer/auth.reducer";
import { TextBox } from "../components/fields";
import MyStatusBar from "../components/status-bar";
import { auth, db } from "../config/firebase";
import { logoSVG } from "../config/svgs";
import { IDataSet, IUser } from "../interface";
import { Styled } from "../styled";
interface IFormData {
    email: string;
    password: string;
}
interface IUserData {
    dpm_id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
const LoginScreen = ({ navigation }: any) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [isFocused] = React.useState<boolean>(true);
    const usernameRef = React.useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();
    const {
        control,
        handleSubmit,
        reset,
        register, formState: { errors }
    } = useForm<IFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        const defaultValue: any = {
            username: '',
            password: '',
        };
        setLoading(false);
        reset({ ...defaultValue });
    }, [reset]);
    const onSubmit = async (data: IFormData) => {
        setLoading(true);
        setMessage('');
        try {
            signInWithEmailAndPassword(auth, data.email, data.password).then(async (res) => {
                const user = await users(data.email);
                const newData = res.user as any;
                const loger: IUser = {
                    uuid: newData.uid,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: data.email,
                    phoneNumber: user.phoneNumber,
                    avatar: newData.photoURL as string,
                    createdAt: newData?.createdAt,
                    department: user.dpm_id
                }
                await AsyncStorage.setItem('@UserLogger', JSON.stringify(user));
                dispatch(loadCurrentUser());
                navigation.navigate('Home');
                reset({});
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
                reset({});
                setMessage('Invalid username or password');
            });
        } catch (e) {
            setMessage('Unknown error occurred');
            setLoading(false);
        }
    }
    const users = (email: string) => {
        const docRef = doc(db, "users", email);
        return new Promise<IUserData>(async (r, j) => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                r(docSnap.data() as any);
            } else {
                j(false);
            }
        });
    };
    return (<React.Fragment>
        <MyStatusBar />
        <Box style={Styled.container}>
            <VStack alignItems={'center'} px={5} style={Styled.w100}>
                <Stack mb={5}>
                    <SvgXml xml={logoSVG} />
                </Stack>
                <Stack>
                    <Heading textAlign={'center'} size={'lg'}>Log in!</Heading>
                </Stack>
                <Stack mt={1}>
                    <Text textAlign={'center'}>Enter your account details below.</Text>
                </Stack>
                <Stack style={[Styled.dFlex, Styled.dColumn, Styled.w100]} justifyContent={'flex-start'} px={4} py={2}>
                    <TextBox
                        control={control}
                        name={"email"}
                        title={"Email"}
                        placeholder={'Enter email address'}
                        autoComplete={'username'}
                        required={true}
                        errors={
                            errors.email?.type === 'required' ? 'Enter email address' :
                                (errors.email?.type === 'pattern' ? 'Enter a valid email address' : '')
                        }
                        icon={
                            <Icon
                                as={<MaterialIcons name="person" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        returnKeyType={'next'}
                        isInvalid={errors && errors?.email ? true : false}
                        isFocused={isFocused}
                        inputRef={usernameRef}
                    />
                    <TextBox
                        control={control}
                        name={"password"}
                        title={"Password"}
                        placeholder={'Enter password'}
                        autoComplete={'password'}
                        required={true}
                        errors={
                            errors.password?.type === 'required' ? 'Password is required' :
                                (errors.password?.type === 'pattern' ? 'Enter a valid password' : '')
                        }
                        icon={
                            <Icon
                                as={<MaterialIcons name="lock" />}
                                size={5}
                                ml="2"
                                color="muted.400"
                            />
                        }
                        iconRignt={
                            <Icon
                                as={<MaterialIcons name={show ? 'visibility' : 'visibility-off'} />}
                                size={5}
                                mr="2"
                                color="muted.400"
                                onPress={() => setShow(!show)}
                            />}
                        type={show ? 'text' : 'password'}
                        returnKeyType={'go'}
                        isInvalid={errors && errors?.password ? true : false}
                        onSubmitEditing={handleSubmit(onSubmit)}
                    />
                    <View style={[Styled.w100, Styled.dFlex, Styled.dRow]} pr={1} justifyContent={'flex-end'}>
                        <TouchableOpacity
                            onPress={() => {
                                // navigation.navigate('ForgotPassword');
                            }}
                        >
                            <Text fontSize="xs" color={'primary.600'}>
                                Forgot your password?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Button
                        isLoading={loading}
                        isLoadingText="Login..."
                        onPress={handleSubmit(onSubmit)}
                        mt={8}
                    >
                        Login
                    </Button>
                    <Stack style={Styled.w100} mt={1} alignContent={'center'} alignItems={'center'}>
                        <Text color={'danger.600'}>{message}</Text>
                    </Stack>
                    <Stack mt={10} style={Styled.stackJustifyCenter}>
                        <Text style={Styled.fontFamily}>Don’t have an account?  </Text>
                        <Link textDecoration={'none'} onPress={() => navigation.navigate('Register')}>
                            <Text style={Styled.fontFamily} color={'primary.600'}>Sign up</Text>
                        </Link>
                    </Stack>
                </Stack>
            </VStack>
        </Box>
    </React.Fragment>)
}
export default memo(LoginScreen);