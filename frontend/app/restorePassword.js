import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Image, Dimensions, Text, TextInput } from "react-native";
import ErrorMessage from "../components/ErrorMessage";
import SimpleGradientButton from "../components/SimpleGradientButton";
import { Link } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function restorePassword() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/fondoLoginGrande.png')}
                style={styles.backgroundImage}
            />

            <Text style={styles.title}>Recuperación de Contraseña</Text>
            <Text style={styles.subtilte}>Enviaremos un correo de recuperación</Text>

            <TextInput
                placeholder='Correo'
                placeholderTextColor={'#878787'}
                style={styles.inputCorreo}
            />

            <View style={styles.errorMessage}>
                <ErrorMessage message="Dirección de correo no registrada"/>
            </View>

            <SimpleGradientButton
                text="Enviar Correo"
                onPress={() => {}}
            />

            <Link asChild href="/">
                <Text style={styles.textLogin}>Volver al inicio de Sesión</Text>
            </Link>

            <StatusBar style="auto" />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
        alignItems: 'center',
        justifyContent: 'top',
    },
    backgroundImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.80,
    },
    title: {
        fontSize: 52,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginHorizontal: 20,
        marginTop: 20,
    },
    subtilte: {
        fontSize: 16,
        color: '#000',
        marginTop: 5,
        marginBottom: 25,
    },
    inputCorreo: {
        width: '80%',
        fontSize: 16,
        borderRadius: 30,
        paddingHorizontal: 25,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        elevation: 5,
    },
    errorMessage: {
        justifyContent: 'center',
        marginTop: 20 ,
    },
    textLogin: {
        marginVertical: "auto",
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textDecorationLine: 'underline',
        },
});