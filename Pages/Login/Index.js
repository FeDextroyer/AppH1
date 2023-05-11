import React, {useState} from 'react';
import {
    TextInput,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import api from '../../ApiService/api';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import MyButton  from '../../Components/MyButton/Index';
import LinkButton from '../../Components/LinkButton/Index';

import colors from '../../styles/colors';
import Loading from '../../Components/Loading/index';

import AsyncStorage from '@react-native-async-storage/async-storage';

const eye = 'eye';
const eyeOff = 'eye-off';

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

export default function Login() {

const [flShowPass, setShowPass] =  useState(false);
const [iconPass, setIconPass] =  useState(eye);
const [txtLogin, setLogin] = useState('')
const [txtSenha, setSenha] = useState('')
const navigation = useNavigation();
const [flLoading, setLoading] = useState(false)
let number = 0

function handleChangeIcon() {
    let icone = iconPass == eye ? eyeOff : eye;
    let flShowPassAux = !flShowPass;
    setShowPass(flShowPassAux);
    setIconPass(icone);
}

async function resetSenha(){
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

async function navigateToHome() {
    setLoading(true);
    if (txtLogin.trim() === '') {
        alert('Campo login é obrigatório');
        setLoading(false);
        return;
    }
    if (txtSenha.trim() === '') {
        alert('Campo senha é obrigatório');
        setLoading(false);
        return;
    }

    let resposta = 0;
    await api.get(`/Users`).then((response) => {
        //setJokesList(response.data);
        resposta = response.data.length;
        
        if(resposta == 0){
            alert('Usuario e/ou senha inválido!');
            setLoading(false);
            return;
        } else {
            AsyncStorage.setItem('@nameApp:userName', txtLogin);
       //     alert('redirecionando para login');
            navigation.navigate('HomeMenu');   
            setLoading(false);
    
        }
    
 
     }).catch(err => alert(err));

  /*  wait api.get(`/Users?name=${txtLogin}&password=${txtSenha}`).then((response) => {
        //setJokesList(response.data);
        resposta = response.data.length;
        alert(response.data.length);
     }).catch(err => alert(err));*/

   
}

function navigateToNewUser() {
    navigation.navigate('NewUser');
}
if (flLoading) {
    return (<Loading />);
}

return (
    <View style={styles.container}>
        <Text style={styles.textTitle}>Seja bem vindo!</Text>
        <TextInput
            style={styles.textInput}
            placeholder="Login"
            onChangeText={text => setLogin(text)}
            value={txtLogin}
        
        />
        <View style={styles.passwordContainer}>
            <TextInput
                style={styles.textInputPassword}
                placeholder="Senha"
                onChangeText={text => setSenha(text)}
                value={txtSenha}
                secureTextEntry={flShowPass}
            />
            <Feather
                style={styles.iconEye}
                name={iconPass}
                size={28}
                color={colors.redButton}
                onPress={handleChangeIcon}
            />
        </View>

        <MyButton title='Entrar' onPress={navigateToHome}

        />

        <LinkButton title='Inscrever-se'
            onPress={navigateToNewUser}
        />
        <notaTeste title= 'Resetar Senha' onPress={resetSenha}
        />

    </View>

);
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
},
textTitle: {
    color: 'red',
    fontSize: 28,
    marginBottom: 8
},
textInput: {
    height: 40,
    borderColor: colors.gray,
    borderRadius: 8,
    borderWidth: 1,
    width: '70%',
    marginBottom: 16,
    paddingHorizontal: 8
},
textInputPassword: {
    height: 40,
    borderWidth: 0,
    width: '70%',
    marginBottom: 16,
    paddingHorizontal: 8
},
buttonIn: {
    backgroundColor: colors.redButton,
    borderRadius: 8,
    height: 50,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center'
},
buttonTextIn: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold'
},
passwordContainer: {
    marginBottom: 16,
    height: 40,
    borderColor: '#dcdce6',
    borderRadius: 8,
    borderWidth: 1,
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between'
},
iconEye: {
    paddingHorizontal: 8,
    marginTop: 6
},
});