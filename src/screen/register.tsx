import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { Box, Button, Heading, Icon, Link, ScrollView, Stack, Text, VStack } from "native-base";
import React, { memo } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import { SvgXml } from "react-native-svg";
import { ComboBox, TextBox } from "../components/fields";
import MyStatusBar from "../components/status-bar";
import { DepartmentsList } from "../config/data";
import { auth, db } from "../config/firebase";
import { logoSVG } from "../config/svgs";
import { Styled } from "../styled";
interface IFormData {
    id?: any;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dpm_id: any;
    password: string;
    avatar: string;
}
const RegisterScreen = ({ navigation }: any) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [show, setShow] = React.useState(false);
    const {
        control,
        handleSubmit,
        reset,
        register, formState: { errors }
    } = useForm<IFormData>({
        defaultValues: {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            email: '',
            dpm_id: '',
            password: '',
            avatar: ''
        },
    });
    React.useEffect(() => {
        const defaultValue: any = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            dpm_id: '',
            password: '',
            avatar: ''
        };
        reset({ ...defaultValue });
    }, [reset]);
    const onSubmit = async (data: IFormData) => {
        setLoading(true);
        try {
            const sign = await SignUp(data.email, data.password, data.avatar, `${data.lastName} ${data.firstName}`);
            if (!sign) {
                Alert.alert('Error!', 'Registration failed');
                setLoading(false);
                return false;
            }
            const userRef = collection(db, "users");
            await setDoc(doc(userRef, data.email), {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                dpm_id: data.dpm_id,
            });

            if (userRef && userRef.id) {
                Alert.alert('Success!', 'Registration successful');
                reset({});
                setLoading(false);
            } else {
                Alert.alert('Error!', 'Registration failed');
                setLoading(false);
            }

        } catch (e) {
            Alert.alert('Error!', 'Registration failed');
            setLoading(false);
        }

    }
    const SignUp = (email: string, password: string, avatar: any, name: string) => {
        return new Promise<boolean>((r) => {
            createUserWithEmailAndPassword(auth, email, password).then((userCredential: any) => {
                const user = userCredential.user;
                updateProfile(user, {
                    displayName: name,
                    photoURL: avatar ? avatar : 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
                })
                    .then(() => {
                        setMessage('Your registration successful');
                        r(true);
                    })
                    .catch((error) => {
                        setMessage(error.message);
                        r(false);
                    })
            }).catch((error) => {
                setMessage(error.message);
                r(false);
            })
        })
    }
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const phonePattern = /^(080|091|090|070|081)+[0-9]{8}$/;
    return (
        <React.Fragment>
            <MyStatusBar />
            <Box style={Styled.container}>
                <ScrollView style={Styled.w100} py={5}>
                    <VStack alignItems={'center'} px={5} style={Styled.w100}>
                        <Stack my={5}>
                            <SvgXml xml={logoSVG} />
                        </Stack>
                        <Stack>
                            <Heading textAlign={'center'} size={'lg'}>Sign up</Heading>
                        </Stack>
                        <Stack style={[Styled.dFlex, Styled.dColumn, Styled.w100]} justifyContent={'flex-start'} px={4} py={2}>
                            <TextBox
                                control={control}
                                name={"firstName"}
                                title={"First Name"}
                                placeholder={'Enter first name'}
                                autoComplete={'name-given'}
                                required={true}
                                errors={
                                    errors.firstName?.type === 'required' ? 'First name is required' :
                                        (errors.firstName?.type === 'pattern' ? 'Enter a valid name' : '')
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
                                isInvalid={errors && errors?.firstName ? true : false}
                            // isFocused={isFocused}
                            // inputRef={usernameRef}
                            />
                            <TextBox
                                control={control}
                                name={"lastName"}
                                title={"Last Name"}
                                placeholder={'Enter last name'}
                                autoComplete={'name-family'}
                                required={true}
                                errors={
                                    errors.lastName?.type === 'required' ? 'Last name is required' :
                                        (errors.lastName?.type === 'pattern' ? 'Enter a valid name' : '')
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
                                isInvalid={errors && errors?.lastName ? true : false}
                            // isFocused={isFocused}
                            // inputRef={usernameRef}
                            />
                            <TextBox
                                control={control}
                                name={"email"}
                                title={"Email addess"}
                                placeholder={'Enter email address'}
                                autoComplete={'email'}
                                required={true}
                                errors={
                                    errors.email?.type === 'required' ? 'Email address is required' :
                                        (errors.email?.type === 'pattern' ? 'Enter a valid email address' : '')
                                }
                                icon={
                                    <Icon
                                        as={<MaterialIcons name="email" />}
                                        size={5}
                                        ml="2"
                                        color="muted.400"
                                    />
                                }
                                returnKeyType={'next'}
                                isInvalid={errors && errors?.email ? true : false}
                                pattern={emailPattern}
                            // isFocused={isFocused}
                            // inputRef={usernameRef}
                            />
                            <TextBox
                                control={control}
                                name={"phoneNumber"}
                                title={"Phone Number"}
                                placeholder={'Enter phone number'}
                                autoComplete={'tel'}
                                required={true}
                                errors={
                                    errors.phoneNumber?.type === 'required' ? 'Phone number is required' :
                                        (errors.phoneNumber?.type === 'pattern' ? 'Enter a valid phone number' : '')
                                }
                                icon={
                                    <Icon
                                        as={<Ionicons name="call" />}
                                        size={5}
                                        ml="2"
                                        color="muted.400"
                                    />
                                }
                                returnKeyType={'next'}
                                isInvalid={errors && errors?.phoneNumber ? true : false}
                                pattern={phonePattern}
                            // isFocused={isFocused}
                            // inputRef={usernameRef}
                            />
                            <ComboBox title={"Department"}
                                control={control}
                                name={"dpm_id"}
                                placeholder={'Select one'}
                                required={true}
                                data={DepartmentsList}
                                // onChange={onSelect}
                                isInvalid={errors && errors?.dpm_id ? true : false}
                                errors={
                                    errors.dpm_id?.type === 'required' ? 'Please select department' : ''
                                }
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
                        </Stack>
                        <Stack style={Styled.w100} px={4} mt={5}>
                            <Button
                                isLoading={loading}
                                isLoadingText="Please wait..."
                                onPress={handleSubmit(onSubmit)}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                        {/* <Stack style={Styled.w100} mt={1} alignContent={'center'} alignItems={'center'}>
                            <Text color={Colors.danger}>{message}</Text>
                        </Stack> */}
                        <Stack mt={5} style={Styled.stackJustifyCenter} mb={12}>
                            <Text style={Styled.fontFamily}>Already have an account?  </Text>
                            <Link textDecoration={'none'} onPress={() => navigation.navigate('Login')}>
                                <Text style={Styled.fontFamily} color={'primary.600'}>Sign in</Text>
                            </Link>
                        </Stack>
                    </VStack>
                </ScrollView>
            </Box>
        </React.Fragment>
    )
}
export default memo(RegisterScreen);