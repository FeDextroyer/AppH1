import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../styles/colors';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const validationSchema = yup.object().shape({
    login: yup.string().required('Login é obrigatório'),
    password: yup.string().min(8, 'Senha deve conter no mínimo 8 caracteres').required('Senha é obrigatória'),
  });

export default function CodeSenha() {
    const navigation = useNavigation();
    const [txtcodigo, setcodigo] = useState('')
    let number = 0


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
    function NotificationTest() { 
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
  
    useEffect(() => {
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);
  
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <Text>Sua expo push token: {expoPushToken}</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text>Title: {notification && notification.request.content.title} </Text>
          <Text>Body: {notification && notification.request.content.body}</Text>
          <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
        </View>
        <Button
          title="Notificação Local"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
    </View>
  );
}
async function NovoCodigo(){
    number.random(/^(?=.*[a-z])(?=.*[A-Z]){4}$/)
    await Notifications.scheduleNotificationAsync({
        content: {
          title: "Mudança de senha!",
          body: `Você solicitou uma alteração na sua senha. Para realiza-lá, insira o seguinte código no campo exigido. ${number}`,
          data: { data: 'goes here' },
        },
        trigger: { seconds: 2 },
      });
}
async function navigateToReset() {
    setLoading(true);
    if (txtcodigo.trim() === '') {
        alert('Campo código é obrigatório');
        return;
    }

    let resposta = 0;
    await Notifications.get(`${number}`).then((response) => {
        //setJokesList(response.data);
        resposta = response.data.length;
        
        if(resposta != Notifications.number){
            alert('Código inserido invalido!');
            return;
        } else {
            AsyncStorage.setItem('@nameApp:userName', txtcodigo);
       //     alert('redirecionando para login');
            navigation.navigate('SemhaNova');
    
        }
    }).catch(err => alert(err));   
}
return (
    <Formik
      initialValues={{ txtcodigo: ''}}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
     {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

        <View style={styles.container}>
        <Text style={styles.textTitle}>Insira o código que lhe foi enviado!</Text>


        <TextInput
            style={styles.textInput}
            placeholder="Código"
            onChangeText={handleChange('Código')}
            value={values.txtcodigo}
            onBlur={handleBlur('Código')}
        />
        {touched.login && errors.login && <Text style={styles.errorText}>{errors.txtcodigo}</Text>}
            <Feather
                style={styles.iconEye}
                name={iconPass}
                size={28}
                color={colors.redButton}
                onPress={handleChangeIcon}
            />

    </View>
    )}
    </Formik>
)
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#D93600',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
  },
  inputContainer: {
    
    marginTop: 30,
    width: '90%',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'stretch',
    backgroundColor: '#fff',
    height: '80%'

  },
  input: {
    marginTop: 10,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 24,
    fontSize: 16,
    alignItems: 'stretch'
  },
  button: {
    marginTop: 10,
    height: 60,
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingHorizontal: 24,
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 20,
    shadowOpacity: 20,
    shadowColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textResult: {
    color: '#000',
    fontWeight: 'bold',
    textAlign : 'center'
  }
});
