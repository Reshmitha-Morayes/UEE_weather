import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { fetchWeatherForecast } from '../api/weatherApi';
import axios from 'axios';

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState('Air Quality');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Past Hour');
  const [selectedLocation, setSelectedLocation] = useState('Colombo');
  const [environmentalData, setEnvironmentalData] = useState({});

  const filters = [
    { label: 'Air Quality', icon: '🌫️' },
    { label: 'Temperature', icon: '🌡️' },
    { label: 'CO2 Levels', icon: '💨' },
    { label: 'Humidity', icon: '💧' },
  ];

  const timeRanges = ['24 Hours'];
  const locations = ['Colombo', 'Kandy', 'Galle', 'Jaffna'];

  const router = useRouter();

  const handleFilterSelect = (filter) => setSelectedFilter(filter);

  const saveData = async (data) => {
    try {
      const response = await axios.post('http://10.0.2.2:3000/createEnvironmentalData', {
        city: data.location?.name,
        country: data.location?.country,
        airQuality: data.current?.air_quality?.pm10,
        temperature: data.current?.temp_c,
        co2Level: data.current?.air_quality?.co,
        humidity: data.current?.humidity,
      });
      console.log('Data saved:', response.data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleLocation = (newLocation, newDay) => {
    setSelectedLocation(newLocation);
    setSelectedTimeRange(newDay);

    const days = newDay === '7 Days' ? 7 : newDay === '24 Hours' ? 1 : 0;

    fetchWeatherForecast({
      cityName: newLocation,
      days: days,
    })
      .then(data => {
        console.log("Fetched data:", data);
        if (data) {
          setEnvironmentalData(data);
          saveData(data);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };

  const { current, location } = environmentalData;

  // Function to get data based on selected filter
  const getFilteredData = () => {
    switch (selectedFilter) {
      case 'Air Quality':
        return `Air Quality: ${current?.air_quality?.pm10}%`;
      case 'Temperature':
        return `Temperature: ${current?.temp_c}°C`;
      case 'CO2 Levels':
        return `CO2 Level: ${current?.air_quality?.co}`;
      case 'Humidity':
        return `Humidity: ${current?.humidity}%`;
      default:
        return 'No data available';
    }
  };

  return (
    <ScrollView horizontal={true} style={styles.horizontalScroll}>
      <View style={styles.container}>
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Data Filters</Text>
          {filters.map((filter) => (
            <TouchableOpacity key={filter.label} onPress={() => handleFilterSelect(filter.label)}>
              <View style={styles.filterItem}>
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text style={[styles.filterLabel, selectedFilter === filter.label && styles.selectedFilter]}>
                  {filter.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <Text style={styles.sidebarTitle}>Time Range</Text>
          <Picker
            selectedValue={selectedTimeRange}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedTimeRange(itemValue)}
          >
            {timeRanges.map((timeRange) => (
              <Picker.Item label={timeRange} value={timeRange} key={timeRange} />
            ))}
          </Picker>

          <Text style={styles.sidebarTitle}>Location</Text>
          <Picker
            selectedValue={selectedLocation}
            style={styles.picker}
            onValueChange={(itemValue) => handleLocation(itemValue, selectedTimeRange)}
          >
            {locations.map((location) => (
              <Picker.Item label={location} value={location} key={location} />
            ))}
          </Picker>

          <TouchableOpacity style={styles.exportButton} onPress={() => router.push('/share')}>
            <Text style={styles.exportButtonText}>Share & Export</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>Dashboard</Text>
          {/* Display filtered data based on the selected filter */}
          {environmentalData ? (
            <View>
              <Text style={styles.dataLabel}> City: {location?.name}</Text>
              <Text style={styles.dataLabel}> Country: {location?.country}</Text>
              <Text style={styles.dataLabel}>{getFilteredData()}</Text>
            </View>
          ) : (
            <Text style={styles.emptyMessage}>No data available</Text>
          )}
          <View style={styles.insightsContainer}>
            {/* Insights for Air Quality */}
            {current?.air_quality?.pm10 > 100 ? (
              <Text style={[styles.insightText, styles.highWarning]}>
                ⚠️ The air quality is currently poor. Consider wearing a mask outdoors.
              </Text>
            ) : (
              <Text style={[styles.insightText, styles.normalMessage]}>
                🌿 The air quality is good today. Enjoy fresh air!
              </Text>
            )}

            {/* Insights for Temperature */}
            {current?.temp_c > 30 ? (
              <Text style={[styles.insightText, styles.highWarning]}>
                🌡️ It's quite hot today. Stay hydrated!
              </Text>
            ) : current?.temp_c >= 20 && current?.temp_c <= 30 ? (
              <Text style={[styles.insightText, styles.normalMessage]}>
                🌞 The weather is pleasant today. Enjoy your day!
              </Text>
            ) : (
              <Text style={[styles.insightText, styles.lowWarning]}>
                🧥 It's a bit chilly today. You might want to wear a jacket.
              </Text>
            )}

            {/* Insights for CO2 Levels */}
            {current?.air_quality?.co > 1000 ? (
              <Text style={[styles.insightText, styles.highWarning]}>
                💨 CO2 levels are high. Try to stay in well-ventilated areas.
              </Text>
            ) : (
              <Text style={[styles.insightText, styles.normalMessage]}>
                🌬️ CO2 levels are normal. You're breathing clean air.
              </Text>
            )}

            {/* Insights for Humidity */}
            {current?.humidity > 70 ? (
              <Text style={[styles.insightText, styles.highWarning]}>
                💧 It's quite humid today. Keep yourself cool.
              </Text>
            ) : current?.humidity <= 70 && current?.humidity >= 30 ? (
              <Text style={[styles.insightText, styles.normalMessage]}>
                🌤️ Humidity levels are comfortable. Enjoy the pleasant weather!
              </Text>
            ) : (
              <Text style={[styles.insightText, styles.lowWarning]}>
                🌵 The air is quite dry. Consider using a humidifier.
              </Text>
            )}
          </View>



        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontalScroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  sidebar: {
    width: 220,
    backgroundColor: '#2b2b2b',
    padding: 15,
    borderRightWidth: 1,
    borderRightColor: '#444',
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#3b3b3b',
  },
  filterIcon: {
    fontSize: 24,
    marginRight: 10,
    color: '#ffcc00',
  },
  filterLabel: {
    color: '#bbb',
    fontSize: 16,
  },
  selectedFilter: {
    color: '#ffcc00',
    fontWeight: 'bold',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#444',
    marginBottom: 15,
    borderRadius: 10,
    padding: 5,
  },
  exportButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  mainContent: {
    padding: 20,
    flex: 1,
    width: 400,
    backgroundColor: '#fff',
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#bbb',
    marginTop: 20,
    textAlign: 'center',
  },
  dataLabel: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  insightsContainer: {
    marginTop: 50, 
    padding: 15,                  
    borderRadius: 10,             
    borderWidth: 2,               
    borderColor: '#000',             
  },
  insightText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  highWarning: {
    color: '#FF4C4C',  // Red for high/critical values
  },
  lowWarning: {
    color: '#1E90FF',  // Blue for low values
  },
  normalMessage: {
    color: '#32CD32',  // Green for normal values
  },

});
