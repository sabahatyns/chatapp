import React, { useState,useEffect } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

//location
const Location = ({ onLocationSelected }) => {
      const [selectedLocation, setSelectedLocation] = useState(null);

      const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setSelectedLocation(coordinate);
      };

      const handleConfirmLocation = () => {
        if (selectedLocation) {
          // Call onLocationSelected with the selected location
          onLocationSelected(selectedLocation);
        }
      };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE} 
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onPress={handleMapPress}
            >
                {selectedLocation && <Marker title='home' coordinate={selectedLocation} />}
            </MapView>
            <View style={styles.buttonContainer}>
                <Button title="Confirm Location" onPress={handleConfirmLocation} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});

export default Location;
