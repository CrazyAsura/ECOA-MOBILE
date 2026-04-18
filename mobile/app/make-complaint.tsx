import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { Motion } from '@legendapp/motion';
import { Camera as CameraIcon, ChevronRight, ChevronLeft, MapPin, Cpu, Globe, Lock, CheckCircle, RotateCcw, X, Layers, Navigation } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';

// Gluestack UI components if available, otherwise fallback to custom centering
import { Center } from '@/components/ui/center';

const { width, height } = Dimensions.get('window');

type Step = 'photo' | 'type' | 'details' | 'ai' | 'publish';

export default function MakeComplaint() {
  const [step, setStep] = useState<Step>('photo');
  const [pollutionType, setPollutionType] = useState('');
  const [privacy, setPrivacy] = useState<'privado' | 'publico' | 'misto'>('publico');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationName, setLocationName] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState<Location.LocationPermissionResponse | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const environments = [
    { title: 'Oceano / Rios', icon: 'droplet', description: 'Poluição hídrica e marinha' },
    { title: 'Florestas / Parques', icon: 'tree', description: 'Áreas verdes e preservação' },
    { title: 'Áreas Urbanas', icon: 'building', description: 'Lixo nas ruas e poluição sonora' },
    { title: 'Zonas Industriais', icon: 'factory', description: 'Emissões e resíduos tóxicos' },
  ];

  const requestAllPermissions = async () => {
    const camStatus = await requestCameraPermission();
    const locStatus = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(locStatus);
  };

  // Check initial location permission
  React.useEffect(() => {
    (async () => {
      const locStatus = await Location.getForegroundPermissionsAsync();
      setLocationPermission(locStatus);
    })();
  }, []);

  const takePicture = async () => {
    try {
      if (cameraRef.current) {
        setLoadingLocation(true);
        const [photo, location] = await Promise.all([
          cameraRef.current.takePictureAsync(),
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
        ]);

        if (photo) {
          setCapturedImage(photo.uri);
          
          // Reverse geocode to get a readable address
          if (location) {
            const address = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });
            if (address.length > 0) {
              const main = address[0];
              setLocationName(`${main.street || 'Local Desconhecido'}, ${main.district || main.city || ''}`);
            }
          }
          
          setStep('type');
        }
      }
    } catch (e) {
      console.error(e);
      setStep('type');
    } finally {
      setLoadingLocation(false);
    }
  };

  if (!cameraPermission || !locationPermission) return <View style={styles.container} />;
  
  if (!cameraPermission.granted || !locationPermission.granted) {
    return (
      <View style={styles.container}>
        <Center className="flex-1 px-10">
          <Navigation size={60} color="#00FF9C" strokeWidth={1} />
          <Text style={[styles.title, { textAlign: 'center', marginTop: 20 }]}>Permissões ECOA</Text>
          <Text style={[styles.subtitle, { textAlign: 'center' }]}>
            Para uma queixa efetiva, precisamos acessar sua **Câmera** (evidências) e **Localização** (mapeamento automático).
          </Text>
          
          <TouchableOpacity style={[styles.primaryButton, { width: '100%' }]} onPress={requestAllPermissions}>
            <Text style={styles.buttonText}>Autorizar ECOA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
            <Text style={{ color: '#666' }}>Agora não</Text>
          </TouchableOpacity>
        </Center>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => step === 'photo' ? router.back() : setStep('photo')}>
        <ChevronLeft color="#00FF9C" size={30} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>ECOA • Queixa</Text>
      <View style={{ width: 30 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      {step !== 'photo' && renderHeader()}

      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={step !== 'photo'} bounces={false}>
        
        {/* Step 1: Real Camera Flow */}
        {step === 'photo' && (
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} ref={cameraRef}>
              <View style={styles.cameraOverlay}>
                <View style={styles.topControls}>
                  <TouchableOpacity style={styles.closeCamera} onPress={() => router.back()}>
                    <X color="#FFF" size={24} />
                  </TouchableOpacity>
                  <View style={styles.gpsBadge}>
                    <MapPin size={12} color="#00FF9C" />
                    <Text style={styles.gpsText}>GPS ATIVO</Text>
                  </View>
                </View>

                <View style={styles.scanFrame}>
                   <Motion.View 
                     animate={{ translateY: [0, 250, 0] }}
                     transition={{ duration: 3000, type: 'timing' }}
                     // @ts-ignore
                     repeat={Infinity}
                     style={styles.scanLine} 
                   />
                </View>

                <View style={styles.cameraControls}>
                  {loadingLocation ? (
                    <ActivityIndicator color="#00FF9C" size="large" style={{ marginBottom: 20 }} />
                  ) : (
                    <>
                      <Text style={styles.hintText}>Capture a evidência com geolocalização</Text>
                      <TouchableOpacity style={styles.shutterBtn} onPress={takePicture}>
                        <View style={styles.shutterInner} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </CameraView>
          </View>
        )}

        {/* Step 2: Environment Type */}
        {step === 'type' && (
          <Motion.View 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.stepContainer}
          >
            <Text style={styles.title}>Tipo de Ambiente</Text>
            <Text style={styles.subtitle}>Selecione o ecossistema afetado.</Text>
            
            <View style={styles.grid}>
              {environments.map((t) => (
                <TouchableOpacity 
                  key={t.title}
                  style={[
                    styles.typeCard,
                    pollutionType === t.title && styles.activeCard
                  ]}
                  onPress={() => setPollutionType(t.title)}
                >
                  <Text style={[styles.cardTitle, pollutionType === t.title && { color: '#000' }]}>{t.title}</Text>
                  <Text style={[styles.cardSub, pollutionType === t.title && { color: '#333' }]}>{t.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, !pollutionType && { opacity: 0.5 }]} 
              disabled={!pollutionType}
              onPress={() => setStep('details')}
            >
              <Text style={styles.buttonText}>Continuar</Text>
              <ChevronRight color="#000" size={20} />
            </TouchableOpacity>
          </Motion.View>
        )}

        {/* Step 3: Details */}
        {step === 'details' && (
          <Motion.View 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={styles.stepContainer}
          >
            <Text style={styles.title}>Detalhes & Local</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Área Detectada Automaticamente</Text>
              <View style={styles.inputWrapper}>
                <MapPin size={20} color="#00FF9C" />
                <TextInput 
                  value={locationName}
                  onChangeText={setLocationName}
                  placeholder="Obtendo localização..." 
                  placeholderTextColor="#666" 
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>O que você viu?</Text>
              <TextInput 
                multiline
                numberOfLines={4}
                placeholder="Descreva a situação em detalhes..." 
                placeholderTextColor="#666" 
                style={[styles.input, styles.textArea]}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('ai')}>
              <Text style={styles.buttonText}>Análise ECOA AI</Text>
              <Cpu color="#000" size={20} />
            </TouchableOpacity>
          </Motion.View>
        )}

        {/* (Steps 4 & 5 remain similar but with updated branding/values) */}
        {step === 'ai' && (
          <Motion.View 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.stepContainer}
          >
            <Text style={styles.title}>Processamento IA</Text>
            <View style={styles.aiCircle}>
              <Motion.View
                animate={{ rotate: '360deg' }}
                transition={{ duration: 2500, type: 'timing' }}
                // @ts-ignore
                repeat={Infinity}
                style={styles.aiScanner}
              />
              <Cpu size={50} color="#00FF9C" />
            </View>
            <Motion.View 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1000 }}
              style={styles.resultBadge}
            >
              <Text style={styles.resultBadgeText}>Análise Completa</Text>
            </Motion.View>
            <Text style={styles.aiResultText}>
              Evidência georeferenciada e validada. Detectamos possíveis irregularidades ambientais.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep('publish')}>
              <Text style={styles.buttonText}>Finalizar Queixa</Text>
            </TouchableOpacity>
          </Motion.View>
        )}

        {step === 'publish' && (
          <Motion.View 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.stepContainer}
          >
            <Text style={styles.title}>Visibilidade</Text>
            <Text style={styles.subtitle}>Como deseja publicar?</Text>
            <View style={styles.privacyGrid}>
              <TouchableOpacity style={[styles.privacyCard, privacy === 'privado' && styles.privacyCardActive]} onPress={() => setPrivacy('privado')}>
                <Lock size={24} color={privacy === 'privado' ? '#000' : '#888'} />
                <Text style={[styles.privacyTitle, privacy === 'privado' && { color: '#000' }]}>Privado</Text>
                <Text style={[styles.privacySub, privacy === 'privado' && { color: '#333' }]}>Apenas histórico</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.privacyCard, privacy === 'publico' && styles.privacyCardActive]} onPress={() => setPrivacy('publico')}>
                <Globe size={24} color={privacy === 'publico' ? '#000' : '#888'} />
                <Text style={[styles.privacyTitle, privacy === 'publico' && { color: '#000' }]}>Público</Text>
                <Text style={[styles.privacySub, privacy === 'publico' && { color: '#333' }]}>Mapa global</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.privacyCard, privacy === 'misto' && styles.privacyCardActive, { width: '100%' }]} onPress={() => setPrivacy('misto')}>
                <Layers size={24} color={privacy === 'misto' ? '#000' : '#888'} />
                <Text style={[styles.privacyTitle, privacy === 'misto' && { color: '#000' }]}>Público e Privado</Text>
                <Text style={[styles.privacySub, privacy === 'misto' && { color: '#333' }]}>Mapa global com anonimato</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={[styles.primaryButton, { marginTop: 40 }]} onPress={() => router.replace('/')}>
              <Text style={styles.buttonText}>Publicar Agora</Text>
              <CheckCircle color="#000" size={20} />
            </TouchableOpacity>
          </Motion.View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#00FF9C',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  cameraContainer: {
    flex: 1,
    height: height,
    width: width,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeCamera: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 156, 0.3)',
  },
  gpsText: {
    color: '#00FF9C',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scanFrame: {
    width: width * 0.75,
    height: height * 0.4,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 255, 156, 0.5)',
    borderRadius: 30,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#00FF9C',
    shadowColor: '#00FF9C',
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
  },
  cameraControls: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  hintText: {
    color: '#FFF',
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  shutterBtn: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  shutterInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 100,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 35,
  },
  primaryButton: {
    backgroundColor: '#00FF9C',
    height: 65,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  typeCard: {
    width: (width - 60) / 2,
    padding: 20,
    backgroundColor: '#161616',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#222',
    height: 140,
    justifyContent: 'center',
  },
  activeCard: {
    backgroundColor: '#00FF9C',
    borderColor: '#00FF9C',
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSub: {
    color: '#666',
    fontSize: 11,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: '#888',
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161616',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 60,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  textArea: {
    height: 140,
    backgroundColor: '#161616',
    borderRadius: 18,
    padding: 20,
    textAlignVertical: 'top',
  },
  aiCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#111',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  aiScanner: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: '#00FF9C',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  resultBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 255, 156, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 15,
  },
  resultBadgeText: {
    color: '#00FF9C',
    fontWeight: 'bold',
    fontSize: 12,
  },
  aiResultText: {
    color: '#BBB',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  privacyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  privacyCard: {
    width: (width - 63) / 2,
    padding: 20,
    backgroundColor: '#161616',
    borderRadius: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  privacyCardActive: {
    backgroundColor: '#00FF9C',
    borderColor: '#00FF9C',
  },
  privacyTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacySub: {
    color: '#666',
    fontSize: 10,
    lineHeight: 14,
  }
});
