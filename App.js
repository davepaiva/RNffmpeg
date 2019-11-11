import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import { RNCamera} from 'react-native-camera'
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import CameraRoll from "@react-native-community/cameraroll"


export default class App extends Component{


  state={
    recording: false,
    processing:false
  }

  isRecording=()=>{
    if(this.state.recording ===true){
        return(
          <Text> Recording </Text>

          )
      }else{

        return(
            <Text>Not Recording</Text>
          )
      }
  }

  startRecording = async()=>{
    this.setState({recording:true})
    await this.camera.recordAsync().then((videoDetails)=>{
      console.log('finished')
       console.log(videoDetails.uri, 'video uri')
       CameraRoll.saveToCameraRoll(videoDetails.uri)

    })
  }

    stopRecording = ()=>{
    this.camera.stopRecording();
    this.setState({recording:false})
    console.log('stop')
  }


  async requestExternalWritePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access write external storage ' +
            'so you can take store data.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the external');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount(){
    this.requestExternalWritePermission();


  }

render() {

    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <View
          style={{ flex: 0, flexDirection: "row", justifyContent: "center" }}
        >
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Button style={styles.capture} title='Start' onPress={()=>{
          this.startRecording().then(()=>{
            'started recording'
          }).catch((error)=>{
            console.log(error)
          })
        }} />
        <Button style={styles.capture} title='Stop' onPress={()=>{
          this.stopRecording()
        }} />
        </View>
        </View>
        <View>
        {
          this.isRecording()
        }
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center"
  },
  preview:{
    width:"100%",
    height:"90%"
  },
  capture:{
    marginTop:"5%",
    backgroundColor:"yellow",
    width:200,
    height:50

  }
})

