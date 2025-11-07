import { View, StyleSheet, Text } from "react-native";
import ErrorIcon from "./ErrorIcon";

const ErrorMessage = ({ message }) => {
    return (
        <View style={styles.horizontaLayout}>
            <ErrorIcon/>
            <Text style={styles.textError}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    horizontaLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textError: {
        fontSize: 12,
        color: '#FA0019',
        marginLeft: 5,
        marginRight: 15,
    },
});

export default ErrorMessage;
