import React from 'react';
import {SafeAreaView,StyleSheet,Text,TouchableOpacity,View,PermissionsAndroid, NativeEventEmitter, NativeModules, Alert, } from 'react-native';
import Voice from '@react-native-voice/voice'
import RNFS from 'react-native-fs';
import {PorcupineManager} from '@picovoice/porcupine-react-native';
import Tts from 'react-native-tts'
import BackgroundJob from 'react-native-background-actions';
import RNFetchBlob from 'rn-fetch-blob';
import { startRecordingRedux, stopRecordingRedux, isRecordingRedux } from './redux/reduxHelper';
import { useSelector} from 'react-redux';
import axios from 'axios';
import { createUserRecord, getAllUsers, deleteAllUsers, deleteUserRecord, updateUserRecord,createUserTask, getTasks, deleteUserTask, moveTask, getAllBufferTasks, updateBufferTask, destroyAllBufferTasks, getEqualToBufferTasks} from './RealmDB/Actions';
import TaskRouter from './TaskRouter';
import Log from 'react-native-android-log'
import Realm from 'realm';
import {User, Task} from './RealmDB/UserModel';
import {BufferTask, TaskBuffer} from './RealmDB/BufferTaskModel';
import NumParser from './utils/NumParser';

const AndroidParams = {
  KEY_PARAM_PAN: -1,
  KEY_PARAM_VOLUME: 0.9,
  KEY_PARAM_STREAM: 'STREAM_MUSIC',
}




const realmConfig = {
  schema: [BufferTask, TaskBuffer, User, Task],
};

const realm = new Realm(realmConfig);

const numRegex = /\d+/
const numRegexArr = (i) => i.match(/\b\d+\b/g);
const numbers = ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
const wordRegexArr = (i) => i.match(/\b(?:один)\b/g)


Log.setLevel(__DEV__ ? Log.VERBOSE : Log.WARN)

const VoiceModule = NativeModules.VoiceModule;
const eventEmitter = new NativeEventEmitter(VoiceModule);
const ttsEventEmitter = new NativeEventEmitter()
const { MicrophoneModule } = NativeModules
const eventAudioFocusEmitter = new NativeEventEmitter(NativeModules.RCTDeviceEventEmitter);



    
  

const documentDir = RNFetchBlob.fs.dirs.DocumentDir
const documentDir1 = RNFetchBlob.fs.asset('hello-marry_en_android_v2_2_0.ppn')
const KEYWORD_FILE_NAME = 'Привет-Э-ни_ru_android_v2_2_0.ppn'   
const KEYWORD_MOL4AT_FILE_NAME = 'молчать_ru_android_v2_2_0.ppn';   
const KEYWORD_VPERED_FILE_NAME = 'вперед_ru_android_v2_2_0.ppn';   
const KEYWORD_NAZAD_FILE_NAME = 'назад_ru_android_v2_2_0.ppn';

const MODEL_FILE_NAME = 'porcupine_params_ru.pv';
const filePath = `${documentDir}/${KEYWORD_FILE_NAME}`;
const mol4atPath = `${documentDir}/${KEYWORD_MOL4AT_FILE_NAME}`;
const vperedPath = `${documentDir}/${KEYWORD_VPERED_FILE_NAME}`;
const nazadPath = `${documentDir}/${KEYWORD_NAZAD_FILE_NAME}`;
const modelPath = `${documentDir}/${MODEL_FILE_NAME}`
console.log(documentDir);
console.log(documentDir1)
console.log(modelPath);
console.log(mol4atPath);
console.log(vperedPath)
console.log(nazadPath);

const documentDir2 = RNFS.DocumentDirectoryPath; // Эта строка была пропущена в вашем исходном коде

const fileNames = [
  'Привет-Э-ни_ru_android_v2_2_0.ppn',
  'молчать_ru_android_v2_2_0.ppn',
  'вперед_ru_android_v2_2_0.ppn',
  'назад_ru_android_v2_2_0.ppn',
  'porcupine_params_ru.pv'
];

fileNames.forEach(fileName => {
  const filePath = `${documentDir2}/${fileName}`;
  console.log(filePath);

  RNFS.copyFileAssets(fileName, filePath)
    .then(() => {
      console.log('File copied successfully.');
    })
    .catch(error => {
      console.log(`Error copying file: ${error}`);
    });
})

    // const assetFilePath = 'Привет-Э-ни_ru_android_v2_2_0.ppn';
    // const destFilePath = `${RNFS.DocumentDirectoryPath}/${assetFilePath}`;

    // const mol4atFilePath = 'молчать_ru_android_v2_2_0.ppn';
    // const destMol4atPath = `${RNFS.DocumentDirectoryPath}/${mol4atFilePath}`;

    // const vperedFilePath = 'вперед_ru_android_v2_2_0.ppn';
    // const destVperedPath = `${RNFS.DocumentDirectoryPath}/${vperedFilePath}`;

    // const nazadFilePath = 'назад_ru_android_v2_2_0.ppn';
    // const destNazadPath = `${RNFS.DocumentDirectoryPath}/${nazadFilePath}`;

    // const modelFilePath = 'porcupine_params_ru.pv';
    // const destModelPath = `${RNFS.DocumentDirectoryPath}/${modelFilePath}`;

    // RNFS.copyFileAssets(assetFilePath, destFilePath)
    // .then(() => {
    //   console.log('File copied successfully.');
    //   // You can now use the copied file at destFilePath
    // })
    // .catch((error) => {
    //   console.log(`Error copying file: ${error}`);
    // });

    // RNFS.copyFileAssets(mol4atFilePath, destMol4atPath)
    // .then(() => {
    //   console.log('File copied successfully.');
    //   // You can now use the copied file at destFilePath
    // })
    // .catch((error) => {
    //   console.log(`Error copying file: ${error}`);
    // });
  
    // RNFS.copyFileAssets(vperedFilePath, destVperedPath)
    // .then(() => {
    //   console.log('File copied successfully.');
    //   // You can now use the copied file at destFilePath
    // })
    // .catch((error) => {
    //   console.log(`Error copying file: ${error}`);
    // });
  
    // RNFS.copyFileAssets(nazadFilePath, destNazadPath)
    // .then(() => {
    //   console.log('File copied successfully.');
    //   // You can now use the copied file at destFilePath
    // })
    // .catch((error) => {
    //   console.log(`Error copying file: ${error}`);
    // });
  
    // RNFS.copyFileAssets(modelFilePath, destModelPath)
    // .then(() => {
    //   console.log('Model copied successfully.');
    //   // You can now use the copied file at destFilePath
    // })
    // .catch((error) => {
    //   console.log(`Error copying file: ${error}`);
    // });
  

RNFetchBlob.fs.ls(documentDir)
    .then(files => console.log(`Files in directory: ${files}`))
    .catch(error => console.log(`Error: ${error}`));

const requestMicrophonePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'App needs access to your microphone.',
              buttonPositive: 'OK',
              buttonNegative: 'Cancel',
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted.');
          // Выполняйте необходимые действия, когда разрешение предоставлено
          // ...
        } else {
          console.log('Microphone permission denied.');
          // Обработайте случай, когда разрешение не предоставлено
          // ...
        }
      } catch (error) {
        console.log('Error while requesting microphone permission:', error);
      }
};

requestMicrophonePermission()

    // const requestForegroundServicePermission = async () => {
    //   if (Platform.OS === 'android') {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE,
    //         {
    //           title: 'Foreground Service Permission',
    //           message: 'This app requires permission to run in the foreground.',
    //           buttonPositive: 'OK',
    //         },
    //       );
    
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         // Permission granted, start the foreground service
    //         startForegroundService();
    //       } else {
    //         // Permission denied, handle the situation accordingly
    //       }
    //     } catch (error) {
    //       // Handle permission request error
    //     }
    //   } else {
    //     // Platform is not Android, handle accordingly
    //   }
    // };

    // requestForegroundServicePermission()

let shouldContinueSpeaking = true;  
let currentSentenceIndex = 0;
let sentencesToSpeak = []

async function speakSentences(sentences, index = 0) {
  if (index >= 0 && index < sentences.length && shouldContinueSpeaking) {
    Tts.speak(sentences[index]).then(() => {
      currentSentenceIndex = index; // Обновляем текущий индекс предложения
      setTimeout(() => {
        if (shouldContinueSpeaking) {
          speakSentences(sentences, index + 1);
        }
      }, 3000);
    }).catch((error) => {
      console.error("Error in TTS: ", error);
    });
  } else {
    // В этом месте цикл завершен, и вы можете добавить свой обработчик событий
    eventEmitter.addListener('tts-finish', (event) => {
      startRecording()
      console.log('Speech finished' + event);
    })
  }
}


async function skipToNextSentence() {
  console.log(currentSentenceIndex);
  console.log(sentencesToSpeak);
  shouldContinueSpeaking = true;
  if (currentSentenceIndex < sentencesToSpeak.length) {
    await  porcupineManager.start().then(() => {
      Tts.stop();
      speakSentences(sentencesToSpeak,currentSentenceIndex + 1);
    })
  }
}

async function skipToPreviousSentence() {
  console.log(currentSentenceIndex);
  console.log(sentencesToSpeak);
  shouldContinueSpeaking = true;
  if (currentSentenceIndex > 0) {
    await porcupineManager.start().then(() => {
      Tts.stop();
      speakSentences(sentencesToSpeak,currentSentenceIndex - 1);
    })
  }
}
    
let detectionCallback = async (keywordIndex) => {
    await porcupineManager.stop().then(()=>{
        if (keywordIndex === 0) {
          eventAudioFocusEmitter.removeAllListeners('audioFocusChange')
          Tts.speak('Слушаю!', { androidParams: AndroidParams})
          console.log('Porcupine heard HELLO MARRY')
        } else if (keywordIndex === 1){
          shouldContinueSpeaking = false
          Tts.stop()
          eventAudioFocusEmitter.removeAllListeners('audioFocusChange')
          eventEmitter.addListener('tts-finish', (event) => {
            startRecording()
            console.log('Speech finished' + event);
          })
          Tts.speak('Слушаю!', { androidParams: AndroidParams})
          console.log('Porcupine heard MOL4AT')
        } else if (keywordIndex === 2){
          shouldContinueSpeaking = false
          skipToNextSentence()
          console.log('Porcupine heard VPERED')
          console.log(sentencesToSpeak);
        } else if (keywordIndex === 3){
          shouldContinueSpeaking = false
          skipToPreviousSentence()
          console.log('Porcupine heard NAZAD')
          console.log(sentencesToSpeak);
        }

    })
};

const tasks = [
    { id: 1, description: 'Task 1' },
    { id: 2, description: 'Task 2' },
];
    



const processErrorCallback = (error) => {
  console.error(error);
};

    
              //  Инициализация picovoice porcupine слова активации, внутри функции активации 
              //  вызываются слушатели событий  tts-finish и onSpeechResults, и их выключатели
              //  в функциях обработки команд, позволяя перезагружать слушатели при каждом
              //  включении фонового процеса.


let porcupineManager



async function TTS_Speaker(sentences) {
  shouldContinueSpeaking = true;
  eventEmitter.removeAllListeners('tts-finish')

  sentencesToSpeak = sentences;

  // startRecording()
  await porcupineManager.start().then(() => {
    console.log(118)
    speakSentences(sentencesToSpeak);
  })
}


const initializePorcupine = async () => {
    porcupineManager =  await PorcupineManager.fromKeywordPaths(
        "m0n4N3F/wvLzBb6zlDmpNd1wDsedpywKWv0ifuiDx2JUWiuaIWjkzg==",
        [filePath,mol4atPath,vperedPath,nazadPath],
        detectionCallback,
        processErrorCallback,
        modelPath,
        [0.3,1,1,1]
    );

                  // О Б Р А Б О Т К А      У С Л Ы Ш А Н Н О Г О      Т Е К С Т А

    const ttsStarter = ttsEventEmitter.addListener('tts-finish', (event) => {
      startRecording()
        console.log('Speech finished' + event);
    });

      

      eventEmitter.addListener('onSpeechError', async (event) => {
        try {
          console.log('TRYEING TO START on ERROR');
      
          await new Promise((resolve) => {
            // Simulate a delay or any necessary asynchronous task
            setTimeout(() => {
              resolve();
            }, 100); // Adjust the delay as needed
          });
          // eventEmitter.removeAllListeners('onSpeechError')
          // console.log('DD')

          await porcupineManager.start()
          
          console.log('Successful start')
        } catch (e) {
          console.log('Error', e);
        }
      })





      eventEmitter.addListener('onSpeechResults', async (event) => {
        console.log(event.value[0]);
        if (event.value[0].length = 0) {
          Alert.alert('Speech No Words')
        } else if (event.value[0]==='отбой') {
          ttsEventEmitter.removeAllListeners('tts-finish')
          Voice.stop()
          eventAudioFocusEmitter.removeAllListeners('audioFocusChange')
          eventAudioFocusEmitter.addListener('audioFocusChange', async (focusChange) => {
            console.log(typeof focusChange);
            console.log(focusChange);
  
            if (focusChange === 'AUDIOFOCUS_LOSS') {
              await porcupineManager.stop();
              console.log('hello marry Finished LOSS');
              const checkMicrophone = () => {
                console.log('CHECKING_MICROPHONE');
                MicrophoneModule.isMicrophoneOn(async (isMicOn) => {
                  console.log(isMicOn)
                  
                  if (isMicOn) {
                      setTimeout(checkMicrophone, 5000);
                  } else {
                      await porcupineManager.start().then(()=> console.log('started micro'))
                  }
  
                });
              };
                
              setTimeout(async () => {
                console.log('LoopingStartFunction');
                checkMicrophone();
              }, 5000);
            } 
  
            else if (focusChange === "AUDIOFOCUS_LOSS_TRANSIENT") {
              await porcupineManager.stop()
              console.log('hello marry Finished LOSS_TRANSIENT ')
            } 
              
            else if (focusChange === "AUDIOFOCUS_GAIN") {
              await porcupineManager.start()
              console.log('AUFIOFOCUS_GAIN Start')
            } 
  
            else if (focusChange === "AUDIOFOCUS_GAIN_TRANSIENT") {
                await porcupineManager.start()
                  console.log('AUDIOFOCUS_GAIN_TRANSIENT')
  
            } else {
                await porcupineManager.start()
                console.log('hello marry start')
            }
          });

          Tts.speak('Ушла на задний план', { androidParams: AndroidParams})
          eventEmitter.addListener('tts-finish', (event) => {
            eventEmitter.removeAllListeners('tts-finish')
            eventEmitter.addListener('tts-finish', (event) => {
              startRecording()
              console.log('Speech finished' + event);
            })
          })
          try {
            console.log('TRYEING TO START');
            await porcupineManager.start().then(() =>console.log('Successful start'));
          } catch (e) {
            console.log('Error', e);
          }

        } else if (['удали все задачи'].some(str => event.value[0].toLowerCase().includes(str))) {
       
            deleteAllUsers()
            const buffTasks = getAllBufferTasks()
            if (buffTasks.length > 0) {
                destroyAllBufferTasks()
            }
           
            Tts.speak('Все задачи удалены.', { androidParams: AndroidParams })

    
        } else if (['удали все эти задачи', 'удали эти задачи', 'удали их'].some(str => event.value[0].toLowerCase().includes(str))) {
       
          const BufferTasks = getEqualToBufferTasks()

          if (BufferTasks.length > 0) {
            realm.write(() => {
              realm.delete(BufferTasks)
            });
            destroyAllBufferTasks()
            Tts.speak(`${buffTasks.length} задач${buffTasks.length === 1 ? 'а' : buffTasks.length > 1 && buffTasks.length < 5 ? 'и' : ''} удален${buffTasks.length === 1 ? 'а' : 'о'}`, { androidParams: AndroidParams });
          } else {
            Tts.speak('нет задач для удаления', { androidParams: AndroidParams })
          }
  
      } else if (['измени','исправь','поменяй','корректир','извин'].some(str => event.value[0].toLowerCase().includes(str))&& ['приоритет'].some(str => event.value[0].toLowerCase().includes(str))) {
       

          const BufferTasks = getEqualToBufferTasks()
         

          const str = event.value[0].toLowerCase();

          let priority;


          if (str.includes('срочн') && !str.includes('не срочн')) {
            priority = 'срочно';
          } else if (str.includes('желательно')) {
            priority =  'желательно';
          } else if (str.includes('не срочно')) {
            priority =  'не срочно';
          } else {
            Tts.speak('Вы не указали новый приоритет.', { androidParams: AndroidParams })
          }


          if (BufferTasks.length > 0) {

            realm.write(() => {
              // Изменяем свойства объектов, как вам необходимо
              BufferTasks.forEach(task => {
                      task.priority = priority
                      // замените на новое значение
                      // ... другие изменения
              });

              Tts.speak('Приоритет изменен.', { androidParams: AndroidParams }) 
            });
        
          } else {
            Tts.speak('Задач не найдено.', { androidParams: AndroidParams })
          }
       
  
        }  else if (['измени','исправь','поменяй','корректир','извин'].some(str => event.value[0].toLowerCase().includes(str))&& ['статус'].some(str => event.value[0].toLowerCase().includes(str))) {
       
          const BufferTasks = getEqualToBufferTasks()
         

          const str = event.value[0].toLowerCase();

          let status;

          if (str.includes('не выполн')) {
            status = 'не выполнено';
          } else if (str.includes('выполн') && !str.includes('не выполн')) {
            status =  'выполнено';
          } else if (str.includes('в процессе')) {
            status =  'в процессе';
          } else {
            Tts.speak('Вы не указали новый статус', { androidParams: AndroidParams })
          }

          if (BufferTasks.length > 0) {

            realm.write(() => {
              // Изменяем свойства объектов, как вам необходимо
              BufferTasks.forEach(task => {
                      task.status = status
                      // замените на новое значение
                      // ... другие изменения
            });

            Tts.speak('Статус изменен', { androidParams: AndroidParams })

          });
      
          } else {
            Tts.speak('Задач не найдено.', { androidParams: AndroidParams })
          }
          
       
  
        } else if (['удал'].some(str => event.value[0].toLowerCase().includes(str)) && ['номер'].some(str => event.value[0].toLowerCase().includes(str))&& ['один','два','три','четыре','пять','шесть','семь','восемь','девять'].some(str => event.value[0].toLowerCase().includes(str))) {
          
          const flattenArray = (arr) => {
            return arr.reduce((acc, task) => {
              return acc.concat(...task);
            }, []);
          };

          const text = event.value[0].toLowerCase()
          console.log(text);
          const matches = numbers.filter(number => text.includes(number));
          console.log(matches);
          const parsedMatches = matches.map(i=>NumParser(i))
          console.log(parsedMatches);
          const tasksToDelete = parsedMatches.reduce((acc, i) => {
            const tasks = realm.objects('User').filtered('id = $0', i)
            return acc.concat([...tasks]);
          }, []);
          console.log(1);
          console.log(tasksToDelete);

   

          if (tasksToDelete.length > 0) {

              realm.write(() => {
                tasksToDelete.forEach(task => {
                  task.trashCan = true 
                  // замените на новое значение
                  // ... другие изменения
                });
              });
              console.log('Удалено');
              Tts.speak(tasksToDelete.length > 1 ? 'задачи в корзине' : 'задача в корзине', { androidParams: AndroidParams })
          } else {
              console.log('Задача не найдена. Не удалось удалить задачу. в ACTIONS');
              Tts.speak('задача не найдена', { androidParams: AndroidParams })
          }
           
        } else if(['удал'].some(str => event.value[0].toLowerCase().includes(str)) && ['номер'].some(str => event.value[0].toLowerCase().includes(str)) && numRegex.test(event.value[0].toLowerCase())) {
         
          const matches = numRegexArr(event.value[0].toLowerCase())
          console.log(matches);
          const parsedMatches = matches.map(i=>parseInt(i))
          const tasksToDelete = parsedMatches.reduce((acc, i) => {
            const tasks = realm.objects('User').filtered('id = $0', i)
            return acc.concat([...tasks]);
          }, []);

          console.log(tasksToDelete);

          if (tasksToDelete.length > 0) {

            realm.write(() => {
              tasksToDelete.forEach(task => {
                task.trashCan = true 
                // замените на новое значение
                // ... другие изменения
              });
            });
            console.log('Удалено');
            Tts.speak(tasksToDelete.length > 1 ? 'задачи в корзине' : 'задача в корзине', { androidParams: AndroidParams })
        } else {
            console.log('Задача не найдена. Не удалось удалить задачу. в ACTIONS');
            Tts.speak('задача не найдена', { androidParams: AndroidParams })
        }
        
        } else if (['очист','удал'].some(str => event.value[0].toLowerCase().includes(str)) && ['корзин'].some(str => event.value[0].toLowerCase().includes(str))) {

          const trashCanTasks = realm.objects('User').filtered('trashCan = $0 ', true);

          if(trashCanTasks.length > 0) {
              realm.write(() => {
                  realm.delete(trashCanTasks)
              });
                
              Tts.speak('корзина очищена', { androidParams: AndroidParams })
          } else {
              Tts.speak('в корзине нет задач', { androidParams: AndroidParams })
          }
       
  
        } else if (['как','что'].some(str => event.value[0].toLowerCase().includes(str)) && ['в корзин'].some(str => event.value[0].toLowerCase().includes(str))) {

          const trashCanTasks = realm.objects('User').filtered('trashCan = $0 ', true);

          if (trashCanTasks.length > 0) {
            console.log(`Найдена задача ${trashCanTasks[0].name} в ${trashCanTasks[0].time} ${trashCanTasks[0].date}`);
            const foundedTasks = trashCanTasks.reduce((acc,i,index)=> {
              return acc + ` ${i.id}) ${i.name} ${i.time === 'не указано' ? 'время не указано' :  `в ${i.time.substring(11,16)}`} ${i.time === 'не указано' ? 'дата не указана' : i.date.substring(8,10) + ' ' + parseMonth(i.date.substring(5,7))} ... статус: ${i.status}... приоритет: ${i.priority}`
            },`Задач: ${trashCanTasks.length}'. `)
            console.log(trashCanTasks);
            console.log(17);
            console.log(foundedTasks);
            Tts.speak(foundedTasks, { androidParams: AndroidParams })
          } else {
              Tts.speak('в корзине нет задач', { androidParams: AndroidParams })
          }
       
  
        }   else if (
              ['перенеси эти задач','перенести эти задач','перенести эта задач','принести эти задач','принести эта задач',
                'принеси эти задач','принеси эта задач','принеси ее','принести ее','принеси их','принести их','перенести эта задач',
                'исправь эти задач','исправь все эти задач','перенеси все эти задач','измени эти задач','измени все эти задач',
                'извини эти задач','извини все эти задач','отредактируй эти задач','отредактируй все эти задач','перепиши эти задач',
                'перепиши все эти задач','перенеси эту задач','перенести эту задач','исправь эту задач','измени эту задач','извини эту задач',
                'перенести эта задач','исправить эта задач','исправь ее', 'измени ее','извини ее', 'поменяй ее','перенеси ее','исправь их', 
                'измени их','извини их', 'поменяй их','перенеси их','корректируй ее','корректируй их','корректируй эти задач',
                'корректируй все эти задач','корректируй эту задач','измени дату','измени дату', 'измени время', 'измени исполните',
                'измени дат','поменяй дат','исправь дат','извини дат','корректируй дат','редактируй дат','перенеси дат','перенести дат',
                'принести дат','перенеси дат','поставь дат','поставь врем','измени врем','поменяй врем','исправь врем','извини врем','корректируй врем','редактируй врем',
                'перенеси врем','перенести врем','принести врем','перенеси врем','поставь исполн','измени исполни','поменяй исполни','исправь исполнит',
                'извини исполни','корректируй исполн','редактируй исполн','перенеси исполн','перенести исполн','принести исполн',
                'перенеси исполн','измени эт','поменяй эт','исправь эт', 'извини эт','корректируй эт','редактируй эт','перенеси эт',
                'перенести эт','принести эт','перенеси эт'
              ].some(str => event.value[0].toLowerCase().includes(str))
            ) {
          
          try {
            const response = await axios.post('http://194.61.2.184:8080/process', {text: event.value[0]}, {
              headers: {
                'Content-Type': 'application/json', // Указываем, что отправляем JSON данные
              },
            });
            console.log(313);
            Log.w(response.data)
            const updateAnswer = updateBufferTask(response.data[0])
            console.log(414);
            console.log(updateAnswer);
            TTS_Speaker(updateAnswer)
            // Tts.speak(updateAnswer, { androidParams: AndroidParams })

          } catch (error) {
            Tts.speak('ошибка сервера', { androidParams: AndroidParams })
          }
       
  
        } else if (['исчезни'].some(str => event.value[0].toLowerCase().includes(str))) {
          try {
            await porcupineManager.stop()
            ttsEventEmitter.removeAllListeners('tts-finish')
            eventEmitter.removeAllListeners('onSpeechError')
            stopRecordingRedux()
            await BackgroundJob.stop()
            Voice.stop()
            Tts.speak('исчезаю', { androidParams: AndroidParams })
          } catch (error) {
            Alert.alert('Ошибка исчезновения', error.message);
          }
    
        } else {
          try {
            const response = await axios.post('http://194.61.2.184:8080/process', {text: event.value[0]}, {
              headers: {
                'Content-Type': 'application/json', // Указываем, что отправляем JSON данные
              },
            });
            console.log(313);
            Log.w(response.data)
            console.log(response.data);
            const routerAnswer = TaskRouter(response.data)
            console.log(444);
            console.log(routerAnswer);
            TTS_Speaker(routerAnswer)

          } catch (error) {
            Tts.speak('ошибка сервера', { androidParams: AndroidParams })
          }
          
        }

      });


    console.log('Porcupine ANNA Listener Initialised')
      
    eventEmitter.addListener('tts-finish', (event) => {
        startRecording()
        console.log('Speech finished' + event);
    })

  console.log('TTS_FINISH_ANNA_LISTENER OK')

}


initializePorcupine();

    // createUserRecord(2, 'John Dueo');
    // const users = getAllUsers();
    // console.log(users);


const startRecording = async () => {
    console.log('RN-Voice/Voice starting')
    await porcupineManager.stop()
    try {
        console.log('rus')
        await Voice.start('ru-RU').then(()=> console.log('Started Voice'))
        
      } catch (error) {
        console.log(error)
      }
}



const WakeWordTask = async taskData => {
      
    await porcupineManager.start()

    await new Promise( async resolve => {
        const {delay} = taskData
        console.log(BackgroundJob.isRunning(), delay)
        eventAudioFocusEmitter.removeAllListeners('audioFocusChange')
        const subscription = eventAudioFocusEmitter.addListener('audioFocusChange', async (focusChange) => {
          console.log(typeof focusChange);
          console.log(focusChange);

          if (focusChange === 'AUDIOFOCUS_LOSS') {
            await porcupineManager.stop();
            console.log('hello marry Finished LOSS');
            const checkMicrophone = () => {
              console.log('CHECKING_MICROPHONE');
              MicrophoneModule.isMicrophoneOn(async (isMicOn) => {
                console.log(isMicOn)
                
                if (isMicOn) {
                    setTimeout(checkMicrophone, 5000);
                } else {
                    await porcupineManager.start().then(()=> console.log('started micro'))
                }

              });
            };
              
            setTimeout(async () => {
              console.log('LoopingStartFunction');
              checkMicrophone();
            }, 5000);
          } 

          else if (focusChange === "AUDIOFOCUS_LOSS_TRANSIENT") {
            await porcupineManager.stop()
            console.log('hello marry Finished LOSS_TRANSIENT ')
          } 
            
          else if (focusChange === "AUDIOFOCUS_GAIN") {
            console.log('AUFIOFOCUS_GAIN Start')
          } 

          else if (focusChange === "AUDIOFOCUS_GAIN_TRANSIENT") {
                console.log('AUDIOFOCUS_GAIN_TRANSIENT')

          } else {
              await porcupineManager.start()
              console.log('hello marry start')
          }
        });

        await BackgroundJob.updateNotification({
            taskDesc: 'Помощник активирован',
            progressBar: 2,
          })
        // for (let i=0; BackgroundJob.isRunning(); i++) {
         
        //   console.log('Runned ->', i);
  
        //   await sleep(delay)
        // }
    })
}


const options = {
    taskName: 'Анна ',
    taskTitle: 'Анна ',
    taskDesc: 'Анна, голосовой менеджер',
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
      if (!BackgroundJob.isRunning()) {
        try {
          console.log('TRYING TO START');
          startRecordingRedux();
          const ttsStarter = eventEmitter.addListener('tts-finish', (event) => {
            startRecording();
            console.log('Speech finished' + event);
          });
          await BackgroundJob.start(WakeWordTask, options);
          console.log('Successful start');
        } catch (error) {
          console.log('Error', error);
        }
      } else {
        console.log('Stopping');
        try {
          await Tts.stop()
          await BackgroundJob.stop();
          console.log('Stop background service');
          await porcupineManager.stop();
          console.log('Stop recording');
          stopRecordingRedux();
        } catch (error) {
          console.log('Error', error);
        }
      }
};


function App() {

 
    const isRecording = useSelector((state) => state.recording.isRecording);
     
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.status}>
          <Text style={styles.statusText}>
            {isRecording ? 'Приложение работает' : 'Приложение неактивно '}
          </Text>
        </View>

        <TouchableOpacity
          onPress={async () => {
            runStartBackground()  

            // // deleteAllUsers()
            // try {
            //   const response = await axios.post('http://194.61.2.184:5000/process', {text: 'перенеси задачи у меня через 2 недели на неделю вперед и добавь для лены задачу сходить в поликлинику '}, {
            //     headers: {
            //       'Content-Type': 'application/json', // Указываем, что отправляем JSON данные
            //     },
            //   });

            //   ;
            // console.log(313);
            // console.log(response.data);
            // const routerAnswer = TaskRouter(response.data)
            // console.log(444);
            // console.log(routerAnswer);
            //   // const answer = TaskRouter(response.data)

            //   // console.log('1444');
            //   // console.log(answer);





            // } catch (error) {
            //   console.error('Error:', error);
            //   return null;
            // }

            // let newTask = {
            //   ACT: 'найти задачу',
            //   PER: 'У вас',
            //   DATE: '2017-06-06T26:23:53',
            //   TIME: '2017-06-06T29:23:53',
            //   TASK: 'Помыть полы',
            //   DATE2:'2017-06-06T26:23:53',
            // }  

            // createUserTask(newTask)
            // moveTask(newTask)
            // // console.log(getAllUsers());
            // // console.log(getAllUsers()[0].time);
            // // console.log(typeof getAllUsers()[0].time);
            // const users = getTasks(newTask)
            // console.log('найдены');
            // console.log(users)
          }
          }
          style={{...styles.recordButton, backgroundColor: isRecording === true ? 'red' : 'green' }}
        >
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Остановить' : 'Начать'}
          </Text>
          <Text style={styles.recordButtonText}>
            запись
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }


const styles = StyleSheet.create({
  container: {
  flex: 1,
  },
  status: {
  alignSelf: 'center',
  marginTop: 110,
  },
  statusText: {
  fontSize: 20,
  color: 'black'
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
  color: 'white'
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
