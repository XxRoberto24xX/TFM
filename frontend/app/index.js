import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, Text, View, TextInput, Dimensions, Image, ActivityIndicator} from 'react-native';
import { Link, useRouter } from 'expo-router';

import { apiRequest } from '../services/apiClient';
import ErrorMessage from '../components/ErrorMessage';
import SimpleGradientButton from '../components/SimpleGradientButton';
import PasswordInput from '../components/PasswordInput';


const { width: SCREEN_WIDTH } = Dimensions.get('window');


export default function index() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handelLogin = () => {
    setLoading(true);
    setError(null);

    apiRequest('/auth/login', 'POST', { email, password }, false)
        .then((data) => {
          if (data && data.token) {
            console.log('Token llega correctamente', data.token);
            return AsyncStorage.setItem('token', data.token).then(() => {
              console.log('Cambio de pantalla', "nos vamos a Home");
              router.push('/home');
            });
          } else {
            throw new Error('Respuesta inválida del servidor.');
          }
        })
        .catch((err) => {
          setError(err.message || 'Error al iniciar sesión');
        })
        .finally(() => {
          setLoading(false);
        });
    };


	return (
		<View style={styles.container}>
			<Image
				source={require('../assets/fondoLoginGrande.png')}
				style={styles.backgroundImage}
			/>

			<Text style={styles.title}>Bienvenido</Text>
			<Text style={styles.subtilte}>Iniciar Sesión con tu Cuenta</Text>
			
			<TextInput
				placeholder='Correo'
				placeholderTextColor={'#878787'}
        onChangeText={(text) => setEmail(text)}
				style={styles.inputCorreo}
			/>

			<PasswordInput 
				placeholder='Contraseña'
        onChangeText={(text) => setPassword(text)}
        value={password}
			/>

			<View style={styles.horizontaLayoutContrasena}>
        {loading ? <ErrorMessage message={error}/> : null}
        <Link asChild href="/restorePassword">
            <Text style={styles.linkPassword}>¿Olvidaste la contraseña?</Text>
        </Link>
			</View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <SimpleGradientButton
            text="Iniciar Sesión"
            onPress={handelLogin}
        />
      )}

			<View style={styles.horizontaLayoutCuenta}>
				<Text style={styles.linkNewAccount}>¿No tienes cuenta?</Text>
				<Link asChild href="/register">
            <Text style={styles.linkPassword}>Creala</Text>
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
    height: SCREEN_WIDTH * 0.80,
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
  horizontaLayoutContrasena: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	width: '80%',
	marginTop: 20 ,
  },
  horizontaLayoutCuenta: {
	flexDirection: 'row',
	alignItems: 'center',
	justifyContent: 'center',
	width: '80%',
	marginVertical: 'auto',
  },
  errorText: {
	fontSize: 12,
	color: '#FA0019',
	marginLeft: 5,
	marginRight: 15,
  },
  linkPassword: {
	fontSize: 12,
	fontWeight: 'bold',
	color: '#000',
	textDecorationLine: 'underline',
  },
  linkNewAccount: {
    fontSize: 12,
    fontWeight: 'regular',
    color: '#000',
	marginRight: 5,
  },
});

/*
 * -Trabajar con la imagen de fondo sin tener que usar proporciones fijas.
 * -Agregar funcionalidad de error en las credenciales
 * -Mirar como trabajar con las zonas seguras inferiores y superiores (midudev)
 * -Mirar como trabajar con las zonas seguras al utilizar el teclado
 */ 
