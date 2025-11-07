import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, Image, Dimensions, TextInput } from "react-native";
import { Link } from "expo-router";
import PasswordInput from "../components/PasswordInput";
import ErrorIcon from "../components/ErrorIcon";
import SimpleGradientButton from "../components/SimpleGradientButton";
import ErrorMessage from '../components/ErrorMessage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function register() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/fondoLoginPequeno.png')}
                style={styles.backgroundImage}
            />

            <Text style={styles.title}>Registrarse</Text>
            <Text style={styles.subtilte}>Crea tu nueva cuenta</Text>

            <TextInput
                placeholder='Correo'
                placeholderTextColor={'#878787'}
                style={styles.inputCorreo}
            />

            <PasswordInput 
                placeholder='Contraseña'
            />

            <PasswordInput 
                placeholder='Confirmar Contraseña'
            />

            <View style={styles.errorMessage}>
                <ErrorMessage message="Las contraseñas no coinciden"/>
            </View>

            <SimpleGradientButton
				text="Crear Cuenta"
				onPress={() => {}}
			/>

            <View style={styles.horizontaLayoutCuenta}>
                <Text style={styles.textLogin}>¿Ya tienes una cuenta?</Text>
                <Link asChild href="/">
                    <Text style={styles.linkLogin}>Inicia Sesión</Text>
                </Link>
            </View>

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
        height: SCREEN_WIDTH * 0.66,
    },
    title: {
        fontSize: 52,
        fontWeight: 'bold',
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
        marginTop: 20 ,
    },
    horizontaLayoutCuenta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        marginVertical: 'auto',
    },
    linkLogin: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        textDecorationLine: 'underline',
    },
    textLogin: {
        fontSize: 12,
        fontWeight: 'regular',
        color: '#000',
        marginRight: 5,
    },
});