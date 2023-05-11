import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  FlatList,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import api from '../../ApiService/api';
import MyButton from '../../Components/MyButton/Index';
import LinkButton from '../../Components/LinkButton/Index';
import colors from '../../styles/colors';
//import Loading from '../../Components/Loading/Index';
import { SafeAreaView } from 'react-native-safe-area-context';

const eye = 'eye';
const eyeOff = 'eye-off';



export default function NewUser() {
  const [flShowPass, setShowPass] = useState(false);
  const [iconPass, setIconPass] = useState(eye);
  const [flOpcaoAluno, setOpcaoAluno] = useState(true);
  const [txtName, setName] = useState('');
  const [txtDocument, setDocument] = useState('');
  const [txtEmail, setEmail] = useState('');
  const [txtPassword, setPassword] = useState('');
  const [txtPasswordConfirm, setPasswordConfirm] = useState('');
  const [txtRA, setRA] = useState('');
  const [txtMateria, setMateria] = useState('');
  const navigation = useNavigation();
  const [listErrors, setListErrors] = useState([]);

    

  function handleChangeIcon() {
    let icone = iconPass == eye ? eyeOff : eye;
    let flShowPassAux = !flShowPass;
    setShowPass(flShowPassAux);
    setIconPass(icone);
  }

  function handleChangeIconConfirm() {
    let icone = iconPass == eye ? eyeOff : eye;
    let flShowPassAux = !flShowPass;
    setShowPass(flShowPassAux);
    setIconPass(icone);
  }

  function validateForm(){
    if(flOpcaoAluno) return handlePostNewStudent();
    return handlePostNewTeacher();
  }

  async function handlePostNewStudent() {
    if (camposPrenchidos()) {
      let objNewStudent = {
        Nome: txtName,
        senha: txtPassword,
        Documento: txtDocument,
        Email: txtEmail,
        RA: txtRA
      };

      const response = await api.post(`/Pessoa`, objNewStudent);
      alert('Aluno Criado!');
    }
  }

  async function handlePostNewTeacher() {
    if (camposPrenchidos()) {
      let objNewTeacher = {
        Nome: txtName,
        senha: txtPassword,
        Documento: txtDocument,
        Email: txtEmail,
        Materia: txtMateria
      };

      const response = await api.post(`/Pessoa`, objNewTeacher);
      alert('Professor Criado!');
    }
  }

  function camposPrenchidos() {
    let validacoes = [];
    let retorno = true;
    if (txtName.trim() === '') {
      validacoes.push('Campo Nome é obrigatório');
      retorno = false;
    }
      if (txtDocument.trim() === '') {
        validacoes.push('Campo Documento é obrigatório');
        retorno = false;
    }
    if (txtEmail.trim() === '') {
      validacoes.push('Campo Email é obrigatório');
      retorno = false;
    }
    if (
      !txtEmail.includes('gmail.com') &&
      !txtEmail.includes('bol.com') &&
      !txtEmail.includes('hotmail.com') &&
      !txtEmail.includes('uniaraxa.edu.br')
    ) {
      validacoes.push('Digite um email válido');
      retorno = false;
    }
    if (
      !txtPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)
    )
    {
        validacoes.push(
        'Senha inválida! Sua senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.'
        );
        retorno = false;
        }
        if (txtPassword !== txtPasswordConfirm) {
        validacoes.push('Senhas não conferem');
        retorno = false;
        }
        if (flOpcaoAluno && txtRA.trim() === '') {
        validacoes.push('Campo RA é obrigatório');
        retorno = false;
        }
        if (!flOpcaoAluno && txtMateria.trim() === '') {
        validacoes.push('Campo Matéria é obrigatório');
        retorno = false;
        }
        setListErrors(validacoes);
        return retorno;
        }
        
        function renderError(error) {
        return <Text style={styles.error}>{error}</Text>;
        }
        
        return (
        <SafeAreaView style={styles.container}>
        {flOpcaoAluno && (<Text style={styles.textTitle}>Novo Aluno</Text>)}
        {!flOpcaoAluno && (<Text style={styles.textTitle}>Novo Professor</Text>)}   
            <Switch
            trackColor={{ false: colors.lightGray, true: colors.primary }}
            thumbColor={flOpcaoAluno ? colors.white : colors.primary}
            ios_backgroundColor={colors.lightGray}
            onValueChange={() => setOpcaoAluno(!flOpcaoAluno)}
            value={flOpcaoAluno}
            />
        
        <TextInput
        style={styles.textInput}
        placeholder="Nome"
        placeholderTextColor={colors.placeholder}
        value={txtName}
        onChangeText={(value) => setName(value)}
        />
        <TextInput
        style={styles.textInput}
        placeholder="Documento (CPF)"
        placeholderTextColor={colors.placeholder}
        value={txtDocument}
        onChangeText={(value) => setDocument(value)}
        />
        <TextInput
        style={styles.textInput}
        placeholder="E-mail"
        placeholderTextColor={colors.placeholder}
        value={txtEmail}
        onChangeText={(value) => setEmail(value)}
     />
 
    
        <View style={styles.passwordContainer}>
        <TextInput
        style={styles.passwordInput}
        placeholder="Senha"
        placeholderTextColor={colors.placeholder}
        secureTextEntry={!flShowPass}
        value={txtPassword}
        onChangeText={(value) => setPassword(value)}
        />
        <Feather
                 name={iconPass}
                 size={24}
                 color={colors.lightGray}
                 style={styles.icon}
                 onPress={handleChangeIcon}
               />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
        style={styles.passwordInput}
        placeholder="Confirmar senha"
        placeholderTextColor={colors.placeholder}
        secureTextEntry={!flShowPass}
        value={txtPasswordConfirm}
        onChangeText={(value) => setPasswordConfirm(value)}
        />
        <Feather
                 name={iconPass}
                 size={24}
                 color={colors.lightGray}
                 style={styles.icon}
                 onPress={handleChangeIconConfirm}
               />
        </View>
      
     
        {flOpcaoAluno && (
        <TextInput
        style={styles.textInput}
        placeholder="RA"
        placeholderTextColor={colors.placeholder}
        value={txtRA}
        onChangeText={(value) => setRA(value)}
        />
        )}
        {!flOpcaoAluno && (
        <TextInput
        style={styles.textInput}
        placeholder="Matéria"
        placeholderTextColor={colors.placeholder}
        value={txtMateria}
        onChangeText={(value) => setMateria(value)}
        />
        )}
        {listErrors.length > 0 && (
        <View style={styles.errorsContainer}>
        {listErrors.map((error) => renderError(error))}
        </View>
        )}
       
        <MyButton
        title="Salvar"
        onPress={() => validateForm()}
        />
          <LinkButton
        title="Voltar"
        onPress={() => navigation.goBack()}
        />
       
   
    </SafeAreaView> 
    );
}
 
 
 const styles = StyleSheet.create({
 container: {
 flex: 1,
 backgroundColor: colors.background,
 alignItems: 'center',
 justifyContent: 'center'
 },
 textTitle: {
 color: 'red',
 fontSize: 24,
 marginBottom: 8,
 width:'100%',
 textAlign: 'center'

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
 textInputPassword: {
  height: 40,
  borderWidth: 0,
  width: '70%',
  marginBottom: 16,
  paddingHorizontal: 8
},
errorsContainer :{
  textAlign: 'center'
},
error: {
  color: colors.red,
  textAlign: 'center'
}
 });