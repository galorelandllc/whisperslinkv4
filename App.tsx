/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CameraView from './components/CameraView';
import {useGazeCapture} from './hooks/useGazeCapture';
import * as tf from '@tensorflow/tfjs';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  // const [isTfReady, setIsTfReady] = useState(false);
  // const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [status, setStatus] = useState('');
  const [agentResponse, setAgentResponse] = useState('');
  // const {cameraRef, captureGaze} = useGazeCapture();
  const isDarkMode = useColorScheme() === 'dark';
  const {cameraRef, captureGaze} = useGazeCapture();
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  const userId = 'user123';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Simulated function to trigger emergency alert
  async function triggerEmergency(userId: string, context: string) {
    console.log(
      `[API Call] Triggering emergency for user ${userId} with context:`,
      context,
    );
    const response = await fetch(
      'http://localhost:3000/api/emergency/trigger',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId, context}),
      },
    );

    // console.log('Response status:', response.status);

    if (!response.ok) {
      // Handle HTTP error status codes
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json(); // 👈 This gets the parsed JSON body
    if (!data.success) {
      throw new Error(`API error: ${data.message}`);
    }
    console.log('Emergency alert sent successfully:', data.message);
    setAgentResponse(data.message);

    // console.log('✅ Response body:', data);
  }

  const handleManualTrigger = async () => {
    try {
      setStatus('Sending manual alert...');
      await triggerEmergency(
        userId,
        'I am in danger but cannot speak. Please send a list of public emergency phone numbers that is not 911 but limited to National Human Trafficking Hotlines. Respond with only the numbers. generate one emergency phone number without dashes or spaces.',
      );
      setStatus('Sent successfully ✅');
    } catch (error) {
      console.error(error);
      setStatus('Failed to send ❌');
    }
    setTimeout(() => setStatus(''), 3000);
  };
  const handleCaptureGaze = async () => {
    try {
      setStatus('Capturing gaze frame...');
      const data =  await captureGaze(userId);

      if (model && data) {
        const input = tf.tensor([[0]]); // TODO: Replace with processed data
        const result = model.predict(input) as tf.Tensor;
        console.log('Model output:', result.toString());
      }

      console.log('Gaze Data Sent:', data);
      setStatus('Gaze captured ✅');
    } catch (error) {
      console.error(error);
      setStatus('Gaze capture failed ❌');
    }
    setTimeout(() => setStatus(''), 3000);
  };

  const safePadding = '5%';

  return (
    <View style={styles.container}>
      {/* <CameraView cameraRef={cameraRef} /> */}

      {/* <TouchableOpacity
        onPress={handleManualTrigger}
        style={styles.invisibleButton}>
        <Text style={styles.hidden}> </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.visibleTrigger}
        onPress={handleManualTrigger}>
        <Text style={styles.buttonText}>Manual Emergency Trigger</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.visibleTrigger}
        onPress={handleCaptureGaze}>
        <Text style={styles.buttonText}>Capture Gaze</Text> 
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.visibleTrigger}
        onPress={async () => {
          // Linking.openURL(`tel:+81800000000`);
          const phoneNumber = '+18180000000';

          const url = `tel:${phoneNumber}`;
          const supported = Linking.canOpenURL(url);
          console.log(`Phone call is supported?: ${supported}`);

          // if (supported) {
          //   Linking.openURL(url);
          //   console.log(`Calling ${phoneNumber}...`);
          //   Alert.alert('Calling', `Calling ${phoneNumber}...`);
          // } else {
          //   console.log(`Calling error: Phone calls not supported`);

          //   Alert.alert(
          //     'Error',
          //     'Phone calls are not supported on this device',
          //   );
          // }
        }}>
        <Text style={styles.hidden}> Call Phone </Text>
      </TouchableOpacity> */}

      <ScrollView
        style={{
          flex: 1,
          flexDirection: 'column',
        }}
        contentContainerStyle={{
          justifyContent: 'flex-end',
          flex: 1,
          flexDirection: 'column',
        }}>
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            marginVertical: 20,
            fontSize: 18,
          }}>
          {!agentResponse && 'Press the button to trigger an emergency alert'}
        </Text>
        {agentResponse ? (
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              marginVertical: 20,
              fontSize: 18,
            }}>
            Agent Response: {agentResponse}
          </Text>
        ) : null}
        <CameraView />
      </ScrollView>

      {/* <TouchableOpacity
        style={styles.visibleTrigger}
        // onPress={handleCaptureGaze}
      >
        <Text style={styles.buttonText}>Capture Gaze</Text>
      </TouchableOpacity> */}

      {status ? <Text style={styles.status}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    flexDirection: 'column-reverse',
    paddingBottom: 40,
  },
  status: {
    position: 'absolute',
    bottom: 20,
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    width: '100%',
  },
  visibleTrigger: {
    margin: 12,
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  invisibleButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hidden: {
    color: 'black',
  },
});

export default App;
