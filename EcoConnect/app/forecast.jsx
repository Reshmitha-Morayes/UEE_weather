import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, StyleSheet, ImageBackground, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { CalendarDaysIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weatherApi';
import * as Progress from 'react-native-progress';


export default function Humidity() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({})
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    //console.log("Location", loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
      //console.log('got forecast data: ', data);
    })
  };

  const handleSearch = value => {
    //fetch locations
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then(data => {
        setLocations(data);
      })
    }

  }

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: 'Colombo',
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false)
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])
  const { current, location } = weather;

  return (
    <View style={styles.container}>
      {/* StatusBar */}
      <StatusBar barStyle="light-content" />

      <ImageBackground
        blurRadius={70}
        source={{ uri: 'https://images.unsplash.com/photo-1689718107045-513b35f1a356?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2lyY2xlcyUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D' }}
        style={styles.imageBackground}
      />

      {
        loading ? (
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Progress.CircleSnail thickness={10} size={140} color={'#0bb3b2'} />
          </View>

        ) : (

          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View style={[styles.searchContainer, { backgroundColor: showSearch ? 'rgba(255,255,255,0.2)' : 'transparent' }]}>
                {showSearch && (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder="Search City"
                    placeholderTextColor="lightGray"
                    style={styles.textInput}
                  />
                )}

                <TouchableOpacity onPress={() => toggleSearch(!showSearch)} style={styles.searchButton}>
                  <MagnifyingGlassIcon size={25} color="white" />
                </TouchableOpacity>
              </View>

              {locations.length > 0 && showSearch && (
                <View style={styles.locationList}>
                  {locations.map((loc, index) => {
                    const showBorder = index + 1 !== locations.length;
                    return (
                      <TouchableOpacity
                        onPress={() => handleLocation(loc)}
                        key={index}
                        style={[styles.locationItem, showBorder && styles.borderBottom]}
                      >
                        <MapPinIcon size={20} color="gray" />
                        <Text style={styles.locationText}>{loc?.name}, {loc?.country}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            <View style={styles.locationContainer}>
              <Text style={styles.cityText}>{location?.name},</Text>
              <Text style={styles.countryText}>{" " + location?.country}</Text>
              <View style={styles.imgcontainer}>
                <Image
                  source={{ uri: 'https:' + current?.condition?.icon }}
                  style={{ width: 200, height: 200 }}
                />
              </View>

              {/* Degree Celsius */}
              <View style={styles.temperatureContainer}>
                <Text style={styles.temperatureText}>{current?.temp_c}&#176;</Text>
                <Text style={styles.weatherText}>{current?.condition?.text}</Text>
              </View>

              {/*Other stats*/}
              <View style={styles.rowcontainer}>
                <View style={styles.infoRow}>
                  <View style={styles.iconTextRow}>
                    <Image
                      source={require('../assets/icons/wind.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.text}>{current?.wind_kph}km</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconTextRow}>
                    <Image
                      source={require('../assets/icons/drop.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.text}>{current?.humidity}%</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.iconTextRow}>
                    <Image
                      source={require('../assets/icons/sun.png')}
                      style={styles.icon}
                    />
                    <Text style={styles.text}>{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Weather Forecast for upcoming 7 days */}
            <View style={styles.dailyForecast}>
              <View style={styles.forecastHeader}>
                <CalendarDaysIcon size={22} color={'#fff'} />
                <Text style={styles.forecastText}>Daily Forecast</Text>
              </View>

              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}>
                {
                  weather?.forecast?.forecastday?.map((item, index) => {
                    let date = new Date(item.date);
                    let options = { weekday: 'long' };
                    let dayName = date.toLocaleDateString('en-US', options);
                    dayName = dayName.split(',')[0]
                    return (
                      <View
                        key={index}
                        style={styles.forecastItem}>
                        <Image
                          source={{ uri: 'https:' + item?.day?.condition?.icon }}
                          style={{ width: 50, height: 50 }}
                        />
                        <Text style={styles.dayText}>{item.date}</Text>
                        <Text style={styles.dayText}>{dayName}</Text>
                        <Text style={styles.degreeText}>
                          {item?.day?.avgtemp_c}&#176;
                        </Text>
                      </View>
                    )
                  })
                }

              </ScrollView>
            </View>
          </SafeAreaView>

        )
      }

    </View >
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: '7%',
    marginHorizontal: 16,
    zIndex: 50,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingLeft: 6,
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 50,
    padding: 8,
    marginLeft: 8,
  },
  locationList: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#e0e0e0',
    top: 60,
    borderRadius: 15,
    zIndex: 99,
    marginTop: 25,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  locationText: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  locationContainer: {
    marginHorizontal: 16,
    justifyContent: 'space-around',
    flex: 1,
    marginBottom: 8,
  },
  cityText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  countryText: {
    fontSize: 18,
    color: '#B3B3B3',
    fontWeight: '600',
    textAlign: 'center',
  },
  imgcontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  temperatureText: {
    fontSize: 64,
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherText: {
    fontSize: 20,
    color: '#fff',
    letterSpacing: 2,
    textAlign: 'center',
  },
  rowcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  iconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  text: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  dailyForecast: {
    marginBottom: 16,
    paddingVertical: 16,
  },
  forecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 15,
  },
  forecastText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  forecastItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 96,
    borderRadius: 24,
    paddingVertical: 16,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dayText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  degreeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 18,
    marginTop: 4,
  },
});
