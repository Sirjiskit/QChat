import { StyleSheet } from "react-native";
import { Colors } from "../config";
const Styled = StyleSheet.create({
    dialog: {
        flex: 1,
        backgroundColor: Colors.backdrop,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1
    },
    dialogContent: {
        width: 340,
        height: 340,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 36
    },
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        backgroundColor: Colors.white
    },
    stackJustifyCenter: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    w100: {
        width: '100%'
    },
    w50: {
        width: '50%'
    },
    dFlex: {
        display: 'flex'
    },
    dRow: {
        flexDirection: 'row'
    },
    dColumn: {
        flexDirection: 'column'
    },
    fontFamily: {
        fontFamily: 'Poppins'
    },
    bgPrimary: {
        flex: 1,
        backgroundColor: Colors.primary600
    },
    header: {
        width: '100%',
        // height: 46,
        // borderRadius: 5,
        // backgroundColor: Colors.placeholderRGBA,
        // opacity:0.2,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        // color: '#000000',
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        position: 'absolute',
        top: 50
    },
    button: {
        width: '50%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        color: Colors.white
    },
    item: {
        padding: 20,
        marginTop: 5,
        fontSize: 15,
        fontFamily: 'Poppins'
    },
    flatList: {
        flex: 1,
        marginTop: 5,
        fontSize: 30
    },
    border: {
        borderColor: 'gray',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    buttonCircle: {
        width: 40,
        height: 40,
        backgroundColor: 'rgb(217, 174, 0)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftItem: {
        flex: 1,
    },
    rightItem: {
        flex: 1,
        alignItems: 'flex-end',
        alignContent: 'flex-end'
    },
    headerItem: {
        flex: 1,
    }
});
export default Styled;