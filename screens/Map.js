import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

export default function Map() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      });
    })();
  }, []);

  const handleLongPress = (event) => {
    const coordinate = event.nativeEvent.coordinate;
    setMarkers([...markers, coordinate]);
  };

  if (!location) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={location}
        onLongPress={handleLongPress}
      >
        {markers.map((marker, index) => (
          <Marker key={index} coordinate={marker} />
        ))}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? Constants.statusBarHeight : 0,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
