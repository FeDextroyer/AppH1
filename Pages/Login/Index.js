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

import MyButton  from '../../Components/MyButton/Index';
import LinkButton from '../../Components/LinkButton/Index';

import colors from '../../styles/colors';
import Loading from '../../Components/Loading/index';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    login: yup.string().required('Login é obrigatório'),
    password: yup.string().min(8, 'Senha deve conter no mínimo 8 caracteres').required('Senha é obrigatória'),
  });

const eye = 'eye';
const eyeOff = 'eye-off';

export default async function Login() {

const [flShowPass, setShowPass] =  useState(false);
const [iconPass, setIconPass] =  useState(eye);
const [txtLogin, setLogin] = useState('')
const [txtSenha, setSenha] = useState('')
const navigation = useNavigation();
const [flLoading, setLoading] = useState(false)

const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();


let number = 0

function handleChangeIcon() {
  let icone = iconPass == eye ? eyeOff : eye;
  let flShowPassAux = !flShowPass;
  setShowPass(flShowPassAux);
  setIconPass(icone);
}

notification.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = notification.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = notification.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notification.removeNotificationSubscription(notificationListener.current);
      notification.removeNotificationSubscription(responseListener.current);
    };
  }, []);
/*
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
*/
async function resetSenha(){
  number.random(/^(?=.*[a-z])(?=.*[A-Z]){4}$/)
  await notification.scheduleNotificationAsync({
      content: {
        title: "Mudança de senha!",
        body: `Você solicitou uma alteração na sua senha. Para realiza-lá, insira o seguinte código no campo exigido. ${number}`,
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
}

const handleLogin = async (values) => {
        setLoading(true);
        let resposta = 0;
        
        await api.get(`/Users`).then((response) => {
        resposta = response.data.length;
        
        if(resposta == 0){
            alert('Usuario e/ou senha inválido!');
            setLoading(false);
            return;
        } else {
      
            AsyncStorage.setItem('@nameApp:userName', txtLogin);      
            navigation.navigate('HomeMenu');   
            setLoading(false);
    
        }
    
 
     }).catch(err => alert(err));

}


async function handleChangeIcon() {
    let icone = iconPass == eye ? eyeOff : eye;
    let flShowPassAux = !flShowPass;
    setShowPass(flShowPassAux);
    setIconPass(icone);
}

/*
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
    }
*/
  return (
    <Formik
      initialValues={{ login: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
     {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

        <View style={styles.container}>
        <Text style={styles.textTitle}>Seja bem vindo!</Text>


        <TextInput
            style={styles.textInput}
            placeholder="Login"
            onChangeText={handleChange('login')}
            value={values.login}
            onBlur={handleBlur('login')}
        />
        {touched.login && errors.login && <Text style={styles.errorText}>{errors.login}</Text>}

        <View style={styles.passwordContainer}>
            <TextInput
                style={styles.textInputPassword}
                placeholder="Senha"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
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
        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        <MyButton title='Entrar' onPress={handleSubmit}     />
     
        <LinkButton title='Inscrever-se'
            onPress={navigateToNewUser}
        />
        <MyButton title= 'Resetar Senha' onPress={resetSenha}/>

    </View>
   )}
   </Formik>

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
errorText: {
    color: 'red',
    marginBottom: 10,
  },
iconEye: {
    paddingHorizontal: 8,
    marginTop: 6
}
});