import { useRouter } from "expo-router";
import { Button, Text, View, ImageBackground, StyleSheet } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <ImageBackground 
      source={{uri: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Welcome to Your Weather Dashboard
        </Text>
        <Text style={styles.description}>
          Stay updated with real-time weather insights. Explore your personalized dashboard now.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Go to Dashboard"
            onPress={() => router.push('/dashboard')}
            color="#1E90FF" 
          />
          
          <Button
            title="Weather Forecast"
            onPress={() => router.push('/forecast')}
            color="#20B2AA"  
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 20,
  },
  welcomeText: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    gap: 20, // Adds spacing between the buttons
  },
});
