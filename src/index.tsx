import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import MyStack from './components/navigation/my.stack';

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

