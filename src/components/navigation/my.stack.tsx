import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { ChatScreen, GroupChatScreen, HomeScreen, LoginScreen, RegisterScreen } from "../../screen";
import { useAppSelector } from "../../app/hooks";
import * as SplashScreen from 'expo-splash-screen';
import ContactsScreen from "../../screen/contacts";
const MyStack = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const logInfo = useAppSelector((state) => state.auth);
    const [isAuth, setAuth] = React.useState<boolean>(false);
    const Stack = createStackNavigator();
    React.useLayoutEffect(() => {
        setAuth(logInfo.isAuth);
        setLoading(false)
    }, []);
    const removeSplashScreen = async () => {
        if (!loading) {
            await SplashScreen.hideAsync();
        }
    }
    if (!loading) {
        removeSplashScreen();
        return (
            <Stack.Navigator
                initialRouteName={isAuth ? 'Home' : 'Login'}
            >
                <Stack.Group navigationKey={isAuth ? 'user' : 'guest'}>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Contacts"
                        component={ContactsScreen}
                        options={{ headerShown: true, title: 'Contacts' }}
                    />
                    <Stack.Screen
                        name="Chats"
                        component={ChatScreen}
                        options={{ headerShown: true, title: 'Chat' }}
                    />
                     <Stack.Screen
                        name="GroupChats"
                        component={GroupChatScreen}
                        options={{ headerShown: true, title: 'Chat' }}
                    />
                </Stack.Group>
                <Stack.Group navigationKey={'guest'}>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            headerShown: false
                        }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ headerShown: false }}
                    />
                </Stack.Group>

            </Stack.Navigator>
        );
    } else {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
}
export default MyStack;
