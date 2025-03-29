import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { captureRef } from 'react-native-view-shot';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as FileSystem from 'expo-file-system';
import chargersData from '../assets/data/chargers.json';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = "159695834629-0fb4711000dq7gjofo90e4djmab9hpr.apps.googleusercontent.com"; // 🔁 Replace this

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

type Charger = {
  id: string;
  name: string;
  address: string;
  distance: string;
  distance_metrics: string;
  latitude: string;
  longitude: string;
  connector_types: string[];
};

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const chargers: Charger[] = chargersData.chargers;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
      // @ts-ignore
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      responseType: 'token',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setAccessToken(access_token);
    }
  }, [response]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );
    })();
  }, []);

  const handleCapture = async () => {
    try {
      const uri = await captureRef(mapRef, {
        format: 'png',
        quality: 1,
      });

      const fileBase64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const metadata = {
        name: 'ev-map-screenshot.png',
        mimeType: 'image/png',
      };

      const boundary = 'foo_bar_baz';
      const body =
        `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
        JSON.stringify(metadata) +
        `\r\n--${boundary}\r\nContent-Type: image/png\r\nContent-Transfer-Encoding: base64\r\n\r\n` +
        fileBase64 +
        `\r\n--${boundary}--`;

      const upload = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      });

      if (!upload.ok) throw new Error('Upload failed');

      const result = await upload.json();
      Alert.alert('Upload Successful', `File ID: ${result.id}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Upload Failed', (err as Error).message);
    }
  };

  const handleLoginAndCapture = async () => {
    try {
      if (!accessToken) {
        const result = await promptAsync();
        if (result?.type !== 'success') {
          Alert.alert('Login failed');
          return;
        }
        const token = result.params.access_token;
        setAccessToken(token);
        await new Promise((resolve) => setTimeout(resolve, 500)); // slight delay for token to set
      }

      await handleCapture();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong during login or upload.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: location?.latitude || 17.385044,
          longitude: location?.longitude || 78.486671,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {chargers.map((charger) => (
          <Marker
            key={charger.id}
            coordinate={{
              latitude: parseFloat(charger.latitude),
              longitude: parseFloat(charger.longitude),
            }}
            title={charger.name}
            description={charger.address}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.fab} onPress={handleLoginAndCapture}>
        <Text style={styles.fabIcon}>📸</Text>
        <Text style={styles.fabText}>Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  fab: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 40,
    right: 20,
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  fabIcon: {
    fontSize: 18,
    color: 'white',
  },
});
