import React, {useState, useEffect} from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text,TouchableOpacity,useColorScheme,View,Alert, Platform, Button , NativeEventEmitter, NativeModules} from 'react-native';
import Voice from '@react-native-voice/voice'
import RNFS from 'react-native-fs';
import {PorcupineManager, BuiltInKeywords, Porcupine} from '@picovoice/porcupine-react-native';
import Tts from 'react-native-tts'
import BackgroundJob from 'react-native-background-actions';
import RNFetchBlob from 'rn-fetch-blob';

let detectionCallback = async (keywordIndex) => {
  if (keywordIndex === 0) {
    Tts.speak('Я вас слушаю!', {
      androidParams: {
        KEY_PARAM_PAN: -1,
        KEY_PARAM_VOLUME: 0.9,
        KEY_PARAM_STREAM: 'STREAM_MUSIC',
      },
    }),


    await porcupineManager.stop().then(()=>{
    console.log('Porcupine heard JARVIS')

    })
  } else if (keywordIndex === 1) {
    // detected `bumblebee`
  }
}
const documentDir = RNFetchBlob.fs.dirs.DocumentDir
const documentDir1 = RNFetchBlob.fs.asset('hello-marry_en_android_v2_2_0.ppn')
const KEYWORD_FILE_NAME = 'hello-marry_en_android_v2_2_0.ppn';
const JARVIS_FILE_NAME = 'jarvis.ppn';
const MODEL_FILE_NAME = 'porcupine_params.pv';
const filePath = `${documentDir}/${KEYWORD_FILE_NAME}`;
const modelPath = `${documentDir}/${MODEL_FILE_NAME}`
console.log(documentDir);
console.log(documentDir1)
console.log(modelPath);

const assetFilePath = 'hello-marry_en_android_v2_2_0.ppn';
const destFilePath = `${RNFS.DocumentDirectoryPath}/${assetFilePath}`;

RNFS.copyFileAssets(assetFilePath, destFilePath)
  .then(() => {
    console.log('File copied successfully.');
    // You can now use the copied file at destFilePath
  })
  .catch((error) => {
    console.log(`Error copying file: ${error}`);
  });

RNFetchBlob.fs.exists(filePath)
.then((exist) => {
    console.log(`file ${exist ? '' : 'not'} exists`)
})
.catch(() => { })

RNFetchBlob.fs.exists(modelPath)
.then((exist) => {
    console.log(`model ${exist ? '' : 'not'} exists`)
})
.catch(() => { })

RNFetchBlob.fs.ls(documentDir)
.then(files => console.log(`Files in directory: ${files}`))
.catch(error => console.log(`Error: ${error}`));


let porcupineManager: PorcupineManager;

const initializePorcupine = async () => {
  porcupineManager =  await PorcupineManager.fromKeywordPaths(
    "BHBnzIoOKHqjHm5h1SU5Px+QL7RRodB4iL6t9A3fcwpIRRLUMzgXQQ==",
    [filePath],
    detectionCallback,
    processErrorCallback
  );

  console.log('Porcupine Jarvis Listener Initialised')
}
  const porcupineStarter = async () => await porcupineManager.start();
  const porcupineStopper = async () => await porcupineManager.stop();

  initializePorcupine();


BackgroundJob.on('expiration', () => {
  console.log('iOS: I am being closed')
})


const startRecording = async () => {

    console.log('RN-Voice/Voice starting')
   
  await BackgroundJob.stop()

  try {
    console.log('rus')
    await Voice.start('ru-RU').then(()=> console.log('Started Voice'))
    
  } catch (error) {
    console.log(error)
  }
}

const processErrorCallback = (error) => {
  console.error(error);
};




    const sleep = time => new Promise(resolve => setTimeout ( () => resolve() , time)) 

    const taskRandom = async taskData => {
      if (Platform.OS === 'ios') {
        console.warn('WARNED')
      } 
      console.log('Stated Tasking')
      await porcupineManager.start()
      
      await new Promise( async resolve => {
        const {delay} = taskData
        console.log(BackgroundJob.isRunning(), delay)
        for (let i=0; BackgroundJob.isRunning(); i++) {
          console.log('Runned ->', i);
          // await BackgroundJob.updateNotification({
          //   taskDesc: 'Runned -> ' + i,
          //   progressBar: 2,
          // })
          await sleep(delay)
        }
      })
      }


      const options = {
        taskName: 'Мэрри',
        taskTitle: 'Мэрри',
        taskDesc: 'Мэрри, голосовой менеджер',
        taskIcon: {
            name: 'ic_launcher',
            type: 'mipmap',
        },
        color: '#ff00ff',
        linkingURI: 'exampleScheme://chat/jane', // See Deep Linking for more info
        parameters: {
            delay: 1000,
        },
        };


    

    const runStartBackground = async () => {

      
      
      if(!BackgroundJob.isRunning()) {
        try {
          console.log('TRYEING TO START');
          await BackgroundJob.start(taskRandom,options).then(() =>console.log('Successful start'));
          
        } catch (e) {
          console.log('Error', e);
          
        }
      } else {
        
        await BackgroundJob.stop().then(()=> console.log('Stop background service'))
      }
  
  
    }







   
  


function App(): JSX.Element {


  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');
  const [dying, setDying] = useState(false);
  const [sleeping, setSleeping] = useState(false)
  const [porcupineState, setPorcupineState] = useState('stopped');
  const [startedInBack, setStartedInBack] = useState('stopped');



  const VoiceModule = NativeModules.VoiceModule;

  // Create a new instance of NativeEventEmitter with VoiceModule as the argument
  const eventEmitter = new NativeEventEmitter(VoiceModule);

  
  

  
// const ttsFinisher = eventEmitter.addListener('tts-finish', (event) => {

//   startRecording()
//   console.log('Speech finished' + event);
  
// });
  
  
  // Now you can add event listeners using eventEmitter.addListener() method
  eventEmitter.addListener('onSpeechResults', async (event) => {

      console.log('Speech Got');
      console.log(event.value[0])
      const ttseventEmitter = new NativeEventEmitter()
      if (event.value[0]==='отбой') {
        Voice.stop()
          Tts.speak('Перехожу в фоновый режим', {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.9,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
            
          }
        })



        try {
          console.log('TRYEING TO START');
          await BackgroundJob.start(taskRandom,options).then(() =>console.log('Successful start'));
          
        } catch (e) {
          console.log('Error', e);
          
        }

        

      } else if (event.value[0]==='умри') {

        // const ttsFinisher = eventEmitter.addListener('tts-finish', (event) => {
        //   console.log('startFinish')
        //   startRecording()
        //   console.log('Speech finished' + event);
          
        // });
        
        ttseventEmitter.removeAllListeners('tts-finish')
        Voice.stop()
          Tts.speak('умираю', {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.9,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
            
          }
        })
        

      } else if (event.value[0]==='Какие мои задачи на сегодня') {

        // const ttsFinisher = eventEmitter.addListener('tts-finish', (event) => {
        //   console.log('startFinish')
        //   startRecording()
        //   console.log('Speech finished' + event);
          
        // });
        
        Voice.stop()
          Tts.speak('Ваши задачи на сегодня такие,такие и такие', {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.9,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
            
          }
        })



      }else {
        Tts.speak(event.value[0], {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.9,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
            
          }
        })
      }

  });

  eventEmitter.addListener('onSpeechStart', (event) => {
   
    console.log('Speech Started');
    
});
// eventEmitter.addListener('tts-finish', (event) => {

//         startRecording()
//         console.log('Speech finished' + event);
        
//       })

const handleButtonClick = () => {
  const ttsStarter = eventEmitter.addListener('tts-finish', (event) => {

    startRecording()
    console.log('Speech finished' + event);
    
  });
};


  // useEffect(() => {
  //   console.log("EVEN DONT KNOW WHAT")
  //   Voice.onSpeechError = err => setError(err.error)
  //   Voice.onSpeechResults = result => {
  //       console.log('Speech Got');
        
  //     Alert.alert('Speech Result', result.value[0])
  //     Tts.speak(result.value[0], {
  //       androidParams: {
  //         KEY_PARAM_PAN: -1,
  //         KEY_PARAM_VOLUME: 0.9,
  //         KEY_PARAM_STREAM: 'STREAM_MUSIC',
  //       },
  //     })
    
  //   };
  
  //   return () => {
  //     // Remove event listeners when the component unmounts
  //     Voice.removeAllListeners();
  //   };
  // }, [])

  // useEffect(() => {
  //   console.log("EVEN DONT KNOW WHAT 2")
  //   Voice.onSpeechError = err => setError(err.error)
  //   Voice.onSpeechResults = result => {
  //       console.log('Speech Got');
        
  //     Alert.alert('Speech Result', result.value[0])
  //     Tts.speak(result.value[0], {
  //       androidParams: {
  //         KEY_PARAM_PAN: -1,
  //         KEY_PARAM_VOLUME: 0.9,
  //         KEY_PARAM_STREAM: 'STREAM_MUSIC',
  //       },
  //     })
    
  //   };
  // },[Voice._listeners])

  // useEffect(() => {
  //   BackgroundJob.on('expiration', () => {
  //     console.log('Background task expired');
  //   });

  //   return () => {
  //     BackgroundJob.removeAllListeners();
  //   };
  // }, []);


  return (
<SafeAreaView style={styles.container}>
<View style={styles.status}>
<Text style={styles.statusText}>
Porcupine State = {porcupineState}
</Text>
<Text style={styles.statusText}>
Started in Background = {startedInBack}
</Text>
</View>

  <TouchableOpacity
    onPress={() =>
      isRecording ? null : (setIsRecording(true), startRecording())
    }
    style={styles.recordButton}>
    <Text style={styles.recordButtonText}>
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </Text>
  </TouchableOpacity>

  <View style={styles.buttonRow}>
    <TouchableOpacity
      onPress={porcupineStarter}
      style={styles.button}>
      <Text style={styles.buttonText}>Start</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={porcupineStopper}
      style={styles.button}>
      <Text style={styles.buttonText}>Stop</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.buttonRow}>
    <TouchableOpacity
       onPress={() => {
    runStartBackground();
    handleButtonClick();
  }}
      style={styles.button}>
      <Text style={styles.buttonText}>Start in Background</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={async () => {
        await BackgroundJob.stop();
      }}
      style={styles.button}>
      <Text style={styles.buttonText}>Stop in Background</Text>
    </TouchableOpacity>
  </View>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  },
  status: {
  alignSelf: 'center',
  marginTop: 50,
  },
  statusText: {
  fontSize: 16,
  marginBottom: 10,
  },
  recordButton: {
  alignSelf: 'center',
  marginTop: 150,
  backgroundColor: 'lightgreen',
  height: 200,
  width: 200,
  borderRadius: 100,
  alignItems: 'center',
  justifyContent: 'center',
  },
  recordButtonText: {
  fontSize: 24,
  fontWeight: 'bold',
  },
  buttonRow: {
  flexDirection: 'row',
  width: '100%',
  justifyContent: 'space-evenly',
  marginTop: 50,
  },
  button: {
  width: '40%',
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'lightblue',
  },
  buttonText: {
  fontSize: 16,
  },
  });

export default App;
