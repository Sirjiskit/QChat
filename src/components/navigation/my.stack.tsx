import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, RegisterScreen } from "../../screen";

const MyStack = () => {
    const Stack = createStackNavigator();
    return (
        <>
            <Stack.Navigator
                initialRouteName={'Login'}
            >
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
            </Stack.Navigator>
        </>
    )
}
export default MyStack;
