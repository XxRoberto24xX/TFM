import {useState} from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PasswordInput = ({placeholder, onChangeText, value}) => {

    const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	}

    return (
        <View style={styles.inputPlaceholder}>
				<TextInput
					placeholder={placeholder}
					placeholderTextColor={'#878787'}
                    onChangeText={onChangeText}
                    value={value}
					style={styles.inputPassword}
					secureTextEntry={!showPassword}
				/>
				<TouchableOpacity 
					style={styles.eyeButton}
					onPress={togglePasswordVisibility}>
						<Ionicons 
							name={showPassword ? "eye-off" : "eye"} 
							size={24} 
							color="#878787" 
						/>
				</TouchableOpacity>
			</View>
    );
}

const styles = StyleSheet.create({
    inputPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
        width: '80%',
    },
    inputPassword: {
        flex: 1,
        fontSize: 16,
        borderRadius: 30,
        paddingHorizontal: 25,
        backgroundColor: '#FFF',
        shadowColor: '#000',
        elevation: 5,
    },
    eyeButton: {
        paddingHorizontal: 15,
    },
});

export default PasswordInput;