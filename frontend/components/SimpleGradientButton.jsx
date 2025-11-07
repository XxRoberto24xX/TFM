import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, TouchableOpacity, Text} from "react-native";


const SimpleGradientButton = ({onPress, text}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
            <LinearGradient
                style={styles.gradient}
                colors={['#FFB053', '#FA00AC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                
                <Text style={styles.buttonText}>{text}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        width: '56%',
        alignItems: 'center',
        borderRadius: 30,
        marginTop: 45,
        shadowColor: '#000',
        elevation: 5,
    },
    gradient: {
        width: '100%',
        borderRadius: 30,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SimpleGradientButton;

