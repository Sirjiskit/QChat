import { useFonts } from 'expo-font';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React from 'react';
import App from './src';
import 'react-native-gesture-handler';
export default function Main() {
  const [loaded] = useFonts({
    Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
  });
  const theme = extendTheme({
    colors: {
      primary: {
        50: '#b5ffff',
        100: '#6bffff',
        200: '#21ffff',
        300: '#00d6d6',
        400: '#008c8c',
        500: '#003b3b',
        600: '#003535',
        700: '#002e2e',
        800: '#002828',
        900: '#002121',
      },
      amber: {
        400: '#d97706',
      },
    },
    fonts: {
      heading: 'Poppins',
      body: 'Poppins',
      mono: 'Poppins',
    },
    Heading: {
      baseStyle: () => {
        return {
          fontFamily: 'Poppins'
        };
      },
    },
    Text: {
      baseStyle: () => {
        return {
          fontFamily: 'Poppins'
        };
      },
    }
  });
  if (!loaded) {
    return null;
  } else {
    return (
      <NativeBaseProvider theme={theme}>
        <App />
      </NativeBaseProvider>
    );
  }
}

