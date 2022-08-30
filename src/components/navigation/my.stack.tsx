import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from "../../screen";

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
            </Stack.Navigator>
        </>
    )
}
export default MyStack;
