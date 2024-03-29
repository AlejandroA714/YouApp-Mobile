/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {loginStyles, modalStyles} from '@src/styles/General';
import InputBox from '@src/styles/InputBox';
import {Icon} from 'react-native-elements';
import colors from '@src/styles/Colors';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {YouAppPrincipal} from '@src/app/models/YouAppPrincipal';
import {WebClient} from '../web-client/WebClient';

export default function RegisterScreen(props: any) {
  const web_client = new WebClient();
  const [state, setState] = useState([
    {filePath: ''},
    {fileData: '../resource/img/user.png'},
    {fileUri: ''},
  ]);
  const [datevisiblity, setDatevisibility] = useState(false);
  //Datos a enviar
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [passwordC, setPasswordC] = useState('');
  const [fecha, setFecha] = useState('');
  const [base64Photo, setBase64Photo] = useState('');
  const {navigation} = props;
  const [foto, setFoto] = useState(false);
  const [profile, setProfile] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(false);

  const showFoto = () => {
    setFoto(true);
  };
  const hideFoto = () => {
    setFoto(false);
  };
  const showModal = () => {
    setDatevisibility(true);
  };
  const hideModal = () => {
    setDatevisibility(false);
  };
  const confirmarFecha = (date: any) => {
    setFecha(date.toISOString().split('T')[0]);
    hideModal();
  };

  const register = () => {
    let payload: YouAppPrincipal = {
      nombres: nombre,
      apellidos: apellido,
      email: correo,
      birthday: fecha,
      password: password,
      photo: selectedPhoto === true ? base64Photo : '',
      username: user,
    };
    web_client
      .post('/v1/auth/register', JSON.stringify(payload))
      .then(response => {
        console.log(response);
        ToastAndroid.show(
          'Se ha enviado un correo de confirmacion',
          ToastAndroid.LONG,
        );
        navigation.replace('Login');
      })
      .catch(e => {
        ToastAndroid.show(e.message, ToastAndroid.LONG);
      });
  };

  const cameraLaunch = () => {
    let options: CameraOptions = {
      mediaType: 'photo',
      includeBase64: true,
      saveToPhotos: true,
      cameraType: 'front',
      quality: 0.5,
      maxWidth: 200,
      maxHeight: 200,
    };

    launchCamera(options, res => {
      if (res.didCancel) {
        console.warn('Image capture has been cancelled');
      } else {
        setState({
          filePath: res.assets[0].fileName,
          base64: res.assets[0].base64,
          fileUri: res.assets[0].uri,
        });
        setBase64Photo(res.assets[0].base64);
        setProfile(true);
      }
    });
  };

  const imageGalleryLaunch = () => {
    let options: ImageLibraryOptions = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
      maxWidth: 200,
      maxHeight: 200,
    };

    launchImageLibrary(options, res => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else {
        setState({
          filePath: res.assets[0].fileName,
          base64: res.assets[0].base64,
          fileUri: res.assets[0].uri,
        });
        setBase64Photo(res.assets[0].base64);
        setProfile(true);
      }
    });
  };

  const profileFoto = () => {
    if (!selectedPhoto) {
      return (
        <Icon
          name="user-circle"
          color={colors.ACCENT}
          type="font-awesome"
          size={100}
        />
      );
    } else {
      return (
        <Image
          source={{uri: state.fileUri}}
          style={{width: 100, height: 100, borderRadius: 100}}
        />
      );
    }
  };

  const chosseFoto = () => {
    if (!profile) {
      return (
        <Icon
          name="user-circle"
          color={colors.ACCENT}
          type="font-awesome"
          size={200}
        />
      );
    } else {
      return (
        <Image
          source={{uri: state.fileUri}}
          style={{width: 200, height: 200, borderRadius: 100}}
        />
      );
    }
  };

  const start = {x: 0, y: 0};
  const end = {x: 1, y: 0};

  return (
    <>
      <Modal transparent={true} animationType="slide" visible={foto}>
        <View style={modalStyles.vistaModal}>
          <View style={modalStyles.Modal}>
            <Text style={modalStyles.titulo}>Cambiar foto de perfil</Text>
            <View style={{alignItems: 'center', margin: 25, width: 200}}>
              {chosseFoto()}
            </View>
            <TouchableOpacity onPress={cameraLaunch} style={modalStyles.button}>
              <Text style={modalStyles.buttonText}>Tomar una foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={imageGalleryLaunch}
              style={modalStyles.button}>
              <Text style={modalStyles.buttonText}>
                Escoger una imagen de la galeria
              </Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={hideFoto} style={modalStyles.button2}>
                <Text style={modalStyles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPhoto(true);
                  hideFoto();
                }}
                style={modalStyles.button3}>
                <Text style={modalStyles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={[loginStyles.container, {padding: 50, height: 1000}]}>
          <Text style={{color: colors.PRIMARY, fontSize: 25, marginBottom: 25}}>
            Crea una cuenta...
          </Text>
          <TouchableOpacity onPress={showFoto}>
            <View>{profileFoto()}</View>
          </TouchableOpacity>
          <InputBox
            keyboardType="default"
            placeholder="Nombre"
            image="user"
            value={nombre}
            onChangeText={(name: string) => setNombre(name)}
          />
          <InputBox
            keyboardType="default"
            placeholder="Apellido"
            image="user"
            value={apellido}
            onChangeText={(lastname: string) => setApellido(lastname)}
          />
          <InputBox
            keyboardType="email-address"
            placeholder="Correo"
            image="envelope-o"
            value={correo}
            onChangeText={(email: string) => setCorreo(email)}
          />
          <InputBox
            keyboardType="default"
            placeholder="Nombre de usuario"
            image="user-circle-o"
            value={user}
            onChangeText={(userName: string) => setUser(userName)}
          />
          <InputBox
            keyboardType={null}
            placeholder="Ingrese su contraseña"
            image="lock"
            secureTextEntry={true}
            value={password}
            onChangeText={(pass: string) => setPassword(pass)}
          />
          <InputBox
            keyboardType={null}
            placeholder="Confirme contraseña"
            image="lock"
            secureTextEntry={true}
            value={passwordC}
            onChangeText={(pass2: string) => setPasswordC(pass2)}
          />
          <TouchableOpacity style={{width: 300}} onPress={showModal}>
            <InputBox
              editable={false}
              placeholder="Fecha de nacimiento"
              image="calendar"
              value={fecha}
            />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={datevisiblity}
            mode="date"
            onConfirm={confirmarFecha}
            onCancel={hideModal}
            locale="es_ES"
          />
          <View style={loginStyles.btnMain}>
            <TouchableOpacity onPress={register}>
              <LinearGradient
                start={start}
                end={end}
                style={{
                  flexDirection: 'row',
                  padding: 15,
                  borderRadius: 60,
                }}
                colors={colors.LINEARGRADIENT1}>
                <Image
                  source={require('@assets/add.png')}
                  tintColor={colors.GRAY5}
                  style={{
                    width: 32,
                    height: 32,
                    marginLeft: 40,
                  }}
                />
                <Text style={loginStyles.btntxt}>Registrarse</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
