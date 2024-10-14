import { View, Text, StyleSheet, TouchableOpacity, Button, Alert, Share } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import axios from 'axios';
import jsPDF from 'jspdf';

export default function ShareComponent() {
  const [selectExport, setSelectExport] = useState('PDF');
  const formats = ['PDF', 'CSV'];
  const router = useRouter();
  const [weather, setWeather] = useState([]);

  const report = `
  Weather Report:
  City: ${lastweather?.city || 'N/A'}
  Temperature: ${lastweather?.temperature || 'N/A'}
  Humidity: ${lastweather?.humidity + '%' || 'N/A'}
  Air Quality: ${lastweather?.airQuality || 'N/A'}
  CO2 Level: ${lastweather?.co2Level || 'N/A'}
`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:3000/environmentalData');
        setWeather(response.data); 
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const lastweather = weather[weather.length -1];

  const generateReport = () => {
    let report = "Weather Report:\n\n";
    report += `City: ${lastweather?.city || 'N/A'}\n`;
    report += `Temperature: ${lastweather?.temperature || 'N/A'}\n`;
    report += `Humidity: ${lastweather?.humidity + '%' || 'N/A'}\n`;
    report += `Air Quality: ${lastweather?.airQuality || 'N/A'}\n`;
    report += `CO2 Level: ${lastweather?.co2Level || 'N/A'}\n`;
    Alert.alert("Weather Report", report);
    console.log(report);
  };


  const exportData = async () => {
    Alert.alert("Data have been expoted.");
  };

  const shareReport = async () => {
    if (!weather.length) {
      Alert.alert("Error", "No weather data available for sharing.");
      return;
    }

    // Create report string
    let report = `
      Weather Report:
      City: ${lastweather?.city || 'N/A'}
      Temperature: ${lastweather?.temperature || 'N/A'}
      Humidity: ${lastweather?.humidity + '%' || 'N/A'}
      Air Quality: ${lastweather?.airQuality || 'N/A'}
      CO2 Level: ${lastweather?.co2Level || 'N/A'}
    `;

    try {
      await Share.share({
        message: report,
        title: 'Weather Report',
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share the report.");
      console.log("Error sharing data", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Export Weather Data</Text>
      <Text style={styles.text}>Choose format to export:</Text>

      <Picker
        selectedValue={selectExport}
        style={styles.picker}
        onValueChange={(formatValue) => setSelectExport(formatValue)}
      >
        {formats.map((format) => (
          <Picker.Item label={format} value={format} key={format} />
        ))}
      </Picker>

      <Text style={styles.previewText}>
        Exporting weather data for: {lastweather?.city || 'Loading...'}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={exportData}
        >
          <Text style={styles.buttonText}>Confirm Export</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareReport}
        >
          <Text style={styles.buttonText}>Share Weather Data</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={generateReport}
      >
        <Text style={styles.buttonText}>Generate Report</Text>
      </TouchableOpacity>

      <View style={styles.exitButtonContainer}>
        <Button title="Back to Dashboard" onPress={() => router.push('/dashboard')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: { marginBottom: 20, fontSize: 16 },
  picker: { width: 200, backgroundColor: '#eee', marginBottom: 20 },
  previewText: { fontSize: 16, marginBottom: 20, fontStyle: 'italic' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  exportButton: { 
    backgroundColor: '#1E90FF', 
    padding: 15, 
    borderRadius: 20, 
    flex: 1, 
    marginRight: 5,
  },
  shareButton: { 
    backgroundColor: '#32CD32', 
    padding: 15, 
    borderRadius: 20, 
    flex: 1, 
    marginLeft: 5,
  },
  reportButton: { backgroundColor: '#114b5f', padding: 15, borderRadius: 20, marginBottom: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' },
  exitButtonContainer: { marginTop: 20 },
});
