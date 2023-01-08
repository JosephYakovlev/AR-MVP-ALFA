
import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Modal, ImageBackground, Image, Dimensions, Linking } from 'react-native';
import ImageView from "react-native-image-viewing";
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { MotiView, useAnimationState } from 'moti';
import { Svg, Defs, Rect, Mask } from "react-native-svg";
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

export default function App() {

  const windowWidth = Dimensions.get('window').height;
  const windowHeight = Dimensions.get('window').width - 20;
  console.log(windowHeight)

  const devices = useCameraDevices()
  const device = devices.back


  const [quest, setQuest] = useState(0)
  const headerHeight = getStatusBarHeight()

  const [barcode, setBarcode] = useState('')
  
  const [frameProcessor, barcodes] =  useScanBarcodes([BarcodeFormat.QR_CODE])
  const images = [require('./assets/gerakl1.jpg'), require('./assets/lev1.jpg'), require('./assets/duh1.jpg'), require('./assets/drevo1.jpg'), require('./assets/ohr1.jpg'), require('./assets/yaga1.jpg')]
  
  const [scannerModal, setScannerModal] = useState(false)
  const [galViewerModal, setGalViewerModal] = useState(false)
  const [paperModal, setPaperModal] = useState(false)
  const [backPackModal, setBackPackModal] = useState(false)
  const [geraklModal, setGeraklModal] = useState(false)
  const [levModal, setLevModal] = useState(false)
  const [duhModal, setDuhModal] = useState(false)
  const [drevoModal, setDrevoModal] = useState(false)
  const [yagaModal, setYagaModal] = useState(false)
  const [ohrModal, setOhrModal] = useState(false)

  const [braker, setBraker] = useState(false)

  


  const loaderAnimationState = useAnimationState({
    start: {
      opacity: 1
    },
    stop: {
      opacity: 0
    }
  })

  const productAnimationState = useAnimationState({
    hide: {
      opacity: 0,
      translateY: -10
    },
    show: {
      opacity: 1,
      translateY: 20
    }
  })


  const wispAnimationState = useAnimationState({
    hide: {
      opacity: 0,
      translateY: -10
    },
    show: {
      opacity: 1,
      translateY: 250
    }
  })

  const trentAnimationState = useAnimationState({
    hide: {
      opacity: 0,
      translateY:  0,
      
    },
    show: {
      opacity: 1,
      translateY: 300
    }
  })

  


  const toggleActiveState = async () => {
    if (barcodes && barcodes.length > 0 && isScanned === false) {
      setIsScanned(true)

      barcodes.forEach(async (scannedBarcode) => {
        if (scannedBarcode.rawValue !== "") {
          setBarcode(scannedBarcode.rawValue)
          productAnimationState.transitionTo("show")
        }
      } )
    }
  }

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission()

    if(permission === 'denied') await Linking.openSettings()


  }, [])

  

  useEffect(()=> {

    requestCameraPermission()

    loaderAnimationState.transitionTo('stop')
    productAnimationState.transitionTo('hide')
    wispAnimationState.transitionTo('hide')
    trentAnimationState.transitionTo('hide')
    

  },[])

  

  const [imageViewerProps, setImageViewerProps] = useState({
    visible: false,
  })





   

  return (
    <View style={styles.container}>


    



        <ImageView
            images={images}
            imageIndex={imageViewerProps.index}
            visible={imageViewerProps.visible}
            onRequestClose={() => setImageViewerProps({...imageViewerProps, visible: false})}
        />






                <Modal 
                    visible={scannerModal}  
                    transparent
                    onRequestClose = {()=>
                    setScannerModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <View style={{flex: 1}}>
                    <Camera
                      style={{flex: 1}}
                      device={device}
                      isActive={true}
                      enableZoomGesture
                      frameProcessor={frameProcessor}
                      frameProcessorFps={5}
                    />

                    


                    <MotiView 
                      state={loaderAnimationState}
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }} >


                        <Text style={{ fontSize: 16}}>
                          Поиск...
                        </Text>

                        <View style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                          <Svg
                            height="100%"
                            width="100%"
                          >
                            <Defs>
                              <Mask
                                id="mask"
                                x="0"
                                y="0"
                                height="100%"
                                width="100%"
                                
                              >

                                <Rect 
                                  height="100%" 
                                  width="100%" 
                                  fill="#fff"
                                />

                                <Rect 
                                  x="19%"
                                  y="30%"
                                  width="250"
                                  height="250"
                                  fill="black"
                                />
                              </Mask>
                            </Defs>

                                <Rect
                                  height = "100%"
                                  width = "100%"
                                  fill="rgba(0, 0, 0, 0.8)"
                                  mask="url(#mask)"        
                                />

                                <Rect 
                                  x="19%"
                                  y="30%"
                                  width="250"
                                  height="250"
                                  strokeWidth="5"
                                  stroke="#fff"
                                />


                          </Svg>
                        </View> 

                    </MotiView>

                    <MotiView 
                      state={productAnimationState}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 120,
                        paddingVertical: 5,
                        alignItems: 'center',
                        zIndex: 1,
                      }}
                    >
                    <TouchableOpacity style={{ width: '100%', height:80, alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'white', flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1}}>
                   
                      
                        <Image source ={require('./assets/trent3.png')} style={{
                              width: windowHeight/7,
                              height: windowHeight/7,
                            }} />
                     

                      <View style={{ height: 60, width: (windowHeight/7)*5.5,}}>
                            <Text style={{fontWeight: 'bold', fontSize: 17, color: 'green'}}>
                              Новый предмет!
                            </Text>

                            <Text style={{fontWeight: 'bold', fontSize: 19, color: 'black', marginLeft: 10}}>
                              Галограмма мудрого дерева.
                            </Text>

                      </View>

                    </TouchableOpacity>

                    </MotiView>




                    <View style={{width: '100%', height: 60, position: 'absolute', bottom: 40, flexDirection: 'row', alignItems:'center', justifyContent: 'space-around'}}>
                      <TouchableOpacity

                        onPress={()=>{
                          loaderAnimationState.transitionTo('start')
                          console.log(1)

                          setTimeout(()=>{
                            loaderAnimationState.transitionTo('stop')
                            console.log(2)
                          }, 4000)
                        }}
                        style={{width: 130, height: 130, backgroundColor: 'lightgrey', borderRadius: 90, borderWidth: 2, alignItems: 'center', justifyContent:'center'}}>

                        <Text style={{fontSize:18, fontWeight: 'bold'}}>
                          Сканировать
                        </Text>


                      </TouchableOpacity>
                    </View>
                </View>
            </Modal>
























            <Modal 
                    visible={galViewerModal}  
                    transparent
                    onRequestClose = {()=>
                     setGalViewerModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <View style={{flex: 1}}>
                    <Camera
                      style={{flex: 1}}
                      device={device}
                      isActive={true}
                      enableZoomGesture
                    />

                    <MotiView 
                      state={wispAnimationState}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 120,
                        paddingVertical: 5,
                        alignItems: 'center',
                        zIndex: 1,
                        justifyContent: 'center'
                      }}
                    >

                    <Image source ={require('./assets/wisp2.gif')} style={{
                          width: 300,
                          height: 300,
                        }} />


                        <Text style={{fontSize: 27, fontWeight: 'bold', color: 'black', marginTop: -45}}>
                          Нам нужна твоя помощь,
                        </Text>
                        <Text style={{fontSize: 27, fontWeight: 'bold', color: 'black'}}>
                          чужеземец!
                        </Text>
                      

                    </MotiView>

                    {braker == true && <View 
                      
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        alignItems: 'center',
                        zIndex: 1,
                        justifyContent: 'center',
                      }}
                    >

                        <Text style={{fontSize: 27, fontWeight: 'bold', color: 'black'}}>
                          Нам нужна твоя помощь,
                        </Text>
                        <Text style={{fontSize: 27, fontWeight: 'bold', color: 'black'}}>
                          чужеземец!
                        </Text> 

                    <Image source ={require('./assets/trent3.png')} style={{
                          width: 300,
                          height: 300,
                        }} />

                    <Image source ={require('./assets/hand.png')} style={{
                          width: '100%',
                          height: 299,
                    }} />

                    </View>}


                    <View style={{position: 'absolute', height: 120, bottom: 10, width: '100%', backgroundColor: 'grey', borderBottomWidth: 1, borderTopWidth: 1}}>
                      <Text style={{fontWeight: 'bold', marginLeft: 15, fontSize: 17, color: 'white', marginTop: 4}}>
                        Доступно:
                      </Text>

                      <View style={{minHeight: 80, flexDirection: 'row', width: '100%', paddingHorizontal: 10, marginTop: 8}}>
                        
                        <TouchableOpacity onPress={()=>{
                          wispAnimationState.transitionTo('show')
                          console.log(1)

                          setTimeout(()=>{
                            wispAnimationState.transitionTo('hide')
                            console.log(2)
                          }, 2000)
                        }}>
                          <Image source ={require('./assets/ohr33.png')} style={{
                            width: 70,
                            height: 70,
                          }} />
                        </TouchableOpacity>


                        <TouchableOpacity onPress={()=>{
                          setBraker(true)
                          console.log(1)

                          setTimeout(()=>{
                            setBraker(false)
                            console.log(2)
                          }, 2000)
                        }}>
                          <Image source ={require('./assets/trent3.png')} style={{
                              width: 70,
                              height: 70,
                            }} />
                        </TouchableOpacity>

                      
                      </View>

                    
                    </View>

                </View>
            </Modal>
















                <Modal 
                    visible={backPackModal}  
                    transparent
                    onRequestClose = {()=>
                    setBackPackModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setBackPackModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                  <ImageBackground source ={require('./assets/backpackopen.png')} style={{
                      width: windowHeight,
                      height: windowHeight*1.3,
                      top: headerHeight,
                      alignItems: 'center',
                      position: 'absolute',
                      marginTop: 70
                  }} >

                    <TouchableOpacity onPress={() => setPaperModal(true)} style={{position: 'absolute',left: 61, bottom: '10%'}}>
                      <Image source ={require('./assets/scrollicon2.png')} style={{
                          width: 80,
                          height: 80,
                        }} />
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => setGalViewerModal(true)} style={{position: 'absolute',left: 145, bottom: '10%'}}>
                      <Image source ={require('./assets/ohr31.png')} style={{
                          width: 75,
                          height: 75,
                        }} />
                    </TouchableOpacity>


                  </ImageBackground>
                
                </TouchableOpacity>

            </Modal>




                <Modal 
                    visible={paperModal}  
                    transparent
                    onRequestClose = {()=>
                    setPaperModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setPaperModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                  <ImageBackground source ={require('./assets/paperscroll1.png')} style={{
                      width: windowHeight,
                      height: windowHeight*1.16,
                      top: headerHeight,
                      alignItems: 'center',
                      position: 'absolute',
                      marginTop: 70
                  }} >

                    <TouchableOpacity onPress={() => setBackPackModal(true)} style={{position: 'absolute',left: 61, bottom: '10%'}}>
                   
                    </TouchableOpacity>


                  </ImageBackground>
                
                </TouchableOpacity>

            </Modal>







              <Modal 
                    visible={geraklModal}  
                    transparent
                    onRequestClose = {()=>
                    setGeraklModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setGeraklModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                
                    <View style={{...styles.purposeModalTitle, height: 360, backgroundColor: 'white', width: '97%'}}>
                        <TouchableOpacity onPress={()=>setImageViewerProps({visible: true, index: 0})}>

                        <Image source ={require('./assets/gerakl1.jpg')} style={{
                                    width: 350,
                                    height: 250,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: 'black'
                                }} />


                          <Text style={{ alignSelf: 'center', marginVertical: 20, fontSize: 16, fontWeight: 'bold'}}>
                            Восьмой подвиг будет вашим.
                          </Text>

                        </TouchableOpacity>
                        
                    </View>
                


 
                </TouchableOpacity>

            </Modal>



            <Modal 
                    visible={levModal}  
                    transparent
                    onRequestClose = {()=>
                    setLevModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setLevModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                
                    <View style={{...styles.purposeModalTitle, height: 360, backgroundColor: 'white', width: '97%'}}>
                        <TouchableOpacity onPress={()=>setImageViewerProps({visible: true, index: 1})}>

                        <Image source ={require('./assets/lev1.jpg')} style={{
                                    width: 350,
                                    height: 250,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: 'black'
                                }} />


                          <Text style={{ alignSelf: 'center', marginVertical: 20, fontSize: 16, fontWeight: 'bold'}}>
                            Спросите у льва как набраться мужества...
                          </Text>

                        </TouchableOpacity>
                        
                    </View>
                


 
                </TouchableOpacity>

            </Modal>



            <Modal 
                    visible={duhModal}  
                    transparent
                    onRequestClose = {()=>
                    setDuhModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setDuhModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                
                    <View style={{...styles.purposeModalTitle, height: 360, backgroundColor: 'white', width: '97%'}}>
                        <TouchableOpacity onPress={()=>setImageViewerProps({visible: true, index: 2})} >

                        <Image source ={require('./assets/duh1.jpg')} style={{
                                    width: 350,
                                    height: 250,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: 'black'
                                }} />


                          <Text style={{ alignSelf: 'center', marginVertical: 20, fontSize: 16, fontWeight: 'bold'}}>
                            Эти существа говорят цифрами...
                          </Text>

                        </TouchableOpacity>
                        
                    </View>
                


 
                </TouchableOpacity>

            </Modal>



            <Modal 
                    visible={drevoModal}  
                    transparent
                    onRequestClose = {()=>
                    setDrevoModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setDrevoModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                
                    <View style={{...styles.purposeModalTitle, height: 360, backgroundColor: 'white', width: '97%'}}>
                        <TouchableOpacity onPress={()=>setImageViewerProps({visible: true, index: 3})}>

                        <Image source ={require('./assets/drevo1.jpg')} style={{
                                    width: 350,
                                    height: 250,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: 'black'
                                }} />


                          <Text style={{ alignSelf: 'center', marginVertical: 20, fontSize: 16, fontWeight: 'bold'}}>
                            Первое испытание - ваш настрой
                          </Text>

                        </TouchableOpacity>
                        
                    </View>
                


 
                </TouchableOpacity>

            </Modal>




            <Modal 
                    visible={yagaModal}  
                    transparent
                    onRequestClose = {()=>
                    setYagaModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setYagaModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                
                    <View style={{...styles.purposeModalTitle, height: 360, backgroundColor: 'white', width: '97%'}}>
                        <TouchableOpacity onPress={()=>setImageViewerProps({visible: true, index: 5})}>

                        <Image source ={require('./assets/yaga1.jpg')} style={{
                                    width: 350,
                                    height: 250,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: 'black'
                                }} />


                          <Text style={{ alignSelf: 'center', marginVertical: 20, fontSize: 16, fontWeight: 'bold'}}>
                            Вот её стоит бояться...
                          </Text>

                        </TouchableOpacity>
                        
                    </View>
                


 
                </TouchableOpacity>

            </Modal>



            <Modal 
                    visible={ohrModal}  
                    transparent
                    onRequestClose = {()=>
                    setOhrModal(false)
                    }
                    hardwareAccelerated
                    animationType='none'
                >
                
                <TouchableOpacity onPress={()=> setOhrModal(false)} style={{...styles.achievModal, alignItems: 'center', justifyContent: 'center', minHeight: '100%'}} >

                
                    <View style={{...styles.purposeModalTitle, height: 360, backgroundColor: 'white', width: '97%'}}>
                        <TouchableOpacity onPress={()=>setImageViewerProps({visible: true, index: 4})} >

                        <Image source ={require('./assets/ohr1.jpg')} style={{
                                    width: 350,
                                    height: 250,
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    borderColor: 'black'
                                }} />


                          <Text style={{ alignSelf: 'center', marginVertical: 20, fontSize: 16, fontWeight: 'bold'}}>
                            Он точно что-то знает...
                          </Text>

                        </TouchableOpacity>
                        
                    </View>
                


 
                </TouchableOpacity>

            </Modal>












            
        <ImageBackground source ={require('./assets/back3.jpg')} style={{
                    width: '100%',
                    height: windowWidth - headerHeight,
                    alignItems: 'center',
                    position: 'absolute'
                }} >













          <View style={{ position: 'absolute', bottom: 35, left: 20}}>
            <Text style={{alignSelf: 'center', fontSize: 15, color: 'green', fontWeight: 'bold'}}>
              ВАША
            </Text> 

            <View style={{ alignSelf: 'center', flexDirection: 'row'}}>
              <Text style={{fontSize: 15, color: 'green', fontWeight: 'bold'}}>
                СКИДКА:
              </Text> 

              <Text style={{marginLeft: 5, fontSize: 15, color: 'green'}}>
                0 %
              </Text> 
            </View>



            <TouchableOpacity onPress={() => setQuest(1)} style={{ alignSelf: 'center', flexDirection: 'row', marginTop: 10}}>
              <Text style={{fontSize: 15, color: quest == 1 ? 'blue' : 'green', fontWeight: 'bold'}}>
                КВЕСТ 1:
              </Text> 

              <Text style={{marginLeft: 5, fontSize: 16, color: 'red', fontWeight: 'bold'}}>
                Х
              </Text> 
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setQuest(2)} style={{ alignSelf: 'center', flexDirection: 'row'}}>
              <Text style={{fontSize: 15, color: quest == 2 ? 'blue' : 'green', fontWeight: 'bold'}}>
                КВЕСТ 2:
              </Text> 

              <Text style={{marginLeft: 5, fontSize: 16, color: 'red', fontWeight: 'bold'}}>
                X
              </Text> 
            </TouchableOpacity>


            <TouchableOpacity onPress={() => setQuest(3)} style={{ alignSelf: 'center', flexDirection: 'row'}}>
              <Text style={{fontSize: 15, color: quest == 3 ? 'blue' : 'green', fontWeight: 'bold'}}>
                КВЕСТ 3:
              </Text> 

              <Text style={{marginLeft: 5, fontSize: 16, color: 'red', fontWeight: 'bold'}}>
                Х
              </Text> 
            </TouchableOpacity>



            <TouchableOpacity onPress={() => setQuest(4)} style={{ alignSelf: 'center', flexDirection: 'row'}}>
              <Text style={{fontSize: 15, color: quest == 4 ? 'blue' : 'green', fontWeight: 'bold'}}>
                КВЕСТ 4:
              </Text> 

              <Text style={{marginLeft: 5, fontSize: 16, color: 'red', fontWeight: 'bold'}}>
                X
              </Text> 
            </TouchableOpacity>

          </View>













          <View style={{ position: 'absolute', top: 15, left: 20, width: '75%'}}>
            <Text style={{alignSelf: 'center', fontSize: 15, color: 'black', fontWeight: 'bold'}}>
              Игровые персонажи:
            </Text> 

            <View style={{ flexDirection: 'row', width: '100%'}}>
              <View style={{width:'50%'}}>
                <TouchableOpacity onPress={()=>(setQuest(1),setDrevoModal(true))} style={{ width: '95%', borderRadius: 3, borderWidth: 1, height: 30, justifyContent: 'center', marginTop: 4, backgroundColor: quest == 1 ? 'lightblue' : null}}>
                  <Text style={{fontSize: quest == 1 ? 18 : 15, color: 'black', fontWeight: 'bold', alignSelf: 'center'}}>
                    Мудрое дерево
                  </Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>(setQuest(4), setGeraklModal(true))} style={{ width: '95%', borderRadius: 3, borderWidth: 1, height: 30, justifyContent: 'center', marginTop: 4, backgroundColor: quest == 4 ? 'lightblue' : null}}>
                  <Text style={{fontSize: quest == 4 ? 18 : 15, color: 'black', fontWeight: 'bold', alignSelf: 'center'}}>
                    Геракл
                  </Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={() => (setQuest(6),setYagaModal(true))} style={{ width: '95%', borderRadius: 3, borderWidth: 1, height: 30, justifyContent: 'center', marginTop: 4, backgroundColor: quest == 6 ? 'lightblue' : null}}>
                  <Text style={{fontSize: quest == 6 ? 18 : 15, color: 'black', fontWeight: 'bold', alignSelf: 'center'}}>
                    Баба-Яга
                  </Text> 
                </TouchableOpacity>

                
              </View> 

              

              <View style={{width:'50%'}}>
                <TouchableOpacity onPress={()=>(setQuest(2),setLevModal(true))} style={{ width: '95%', borderRadius: 3, borderWidth: 1, height: 30, justifyContent: 'center', marginTop: 4, backgroundColor: quest == 2 ? 'lightblue' : null}}>
                  <Text style={{fontSize: quest == 2 ? 18 : 15, color: 'black', fontWeight: 'bold', alignSelf: 'center'}}>
                    Храбый лев
                  </Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>(setQuest(3),setDuhModal(true))} style={{ width: '95%', borderRadius: 3, borderWidth: 1, height: 30, justifyContent: 'center', marginTop: 4, backgroundColor: quest == 3 ? 'lightblue' : null}}>
                  <Text style={{fontSize: quest == 3 ? 18 : 15, color: 'black', fontWeight: 'bold', alignSelf: 'center'}}>
                    Дух камня
                  </Text> 
                </TouchableOpacity>

                <TouchableOpacity onPress={() => (setQuest(5), setOhrModal(true))} style={{ width: '95%', borderRadius: 3, borderWidth: 1, height: 30, justifyContent: 'center', marginTop: 4, backgroundColor: quest == 5 ? 'lightblue' : null}}>
                  <Text style={{fontSize: quest == 5 ? 18 : 15, color: 'black', fontWeight: 'bold', alignSelf: 'center'}}>
                    Охранник
                  </Text> 
                </TouchableOpacity>
              </View> 
            </View>

          </View>



          <TouchableOpacity onPress={() => setBackPackModal(true)} style={{position: 'absolute',right: 67, top: '34%'}}>
            <Image source ={require('./assets/backpack.png')} style={{
                                    width: 100,
                                    height: 100,
                                }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>(setQuest(4), setGeraklModal(true))} style={{position: 'absolute',left: '33%',top: '22%'}}>
            <Image source ={require('./assets/gerakl.jpg')} style={{
                                    width: quest == 4 ? 60 : 40,
                                    height: quest == 4 ? 90 : 60,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: quest == 4 ? 'blue' : null
                                }} />
          </TouchableOpacity>
          

          <TouchableOpacity onPress={() => (setQuest(6),setYagaModal(true))} style={{position: 'absolute',left: '55%', top: '61%' }}>
            <Image source ={require('./assets/1.jpg')} style={{
                                    width: quest == 6 ? 60 : 40,
                                    height: quest == 6 ? 90 : 60,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: quest == 6 ? 'blue' : null
                                }} />
          </TouchableOpacity>
          

          <TouchableOpacity onPress={()=>(setQuest(2),setLevModal(true))} style={{position: 'absolute',left: 77,top: '37%',}}>
            <Image source ={require('./assets/lionquest.png')} style={{
                                    width: quest == 2 ? 70 : 50,
                                    height: quest == 2 ? 70 : 50,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: quest == 2 ? 'blue' : null
                                }} />
          </TouchableOpacity>
          

          <TouchableOpacity onPress={() => (setQuest(5), setOhrModal(true))} style={{position: 'absolute',left: 107,top: '49%'}} >
            <Image source ={require('./assets/ohrannik.jpg')} style={{
                                    width: quest == 5 ? 60 : 40,
                                    height: quest == 5 ? 90 : 60,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: quest == 5 ? 'blue' : null
                                }} />
          </TouchableOpacity>
   

          <TouchableOpacity onPress={()=>(setQuest(3),setDuhModal(true))} style={{position: 'absolute',left: '62%',top: '49%',}}>
            <Image source ={require('./assets/element.jpg')} style={{
                                    width: quest == 3 ? 60 : 40,
                                    height: quest == 3 ? 85 : 60,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: quest == 3 ? 'blue' : null
                                }} />
          </TouchableOpacity>                      
          
          <TouchableOpacity onPress={()=>(setQuest(1),setDrevoModal(true))} style={{position: 'absolute',left: 147,top: '67%',}}>
            <Image source ={require('./assets/drevo.png')} style={{
                                    width: quest == 1 ? 60 : 45,
                                    height: quest == 1 ? 85 : 60,
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    borderColor: quest == 1 ? 'blue' : null
                                }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setScannerModal(true)} style={{position: 'absolute',right: 25 ,bottom: 75, width: 80, height: 80, borderRadius: 60, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Сканер
            </Text>

            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              QR
            </Text>
          </TouchableOpacity>
         
                                







        </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purposeModalTitle:{
      height: 70,
      backgroundColor: 'white',
      margin: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent:'center',
      backgroundColor: 'lightgreen',
      borderColor: 'white',
      borderWidth: 3,
  }
});
