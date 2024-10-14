import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title:"EcoConnect"}}/>
      <Stack.Screen name="dashboard" options={{title:"Dashboard"}}/>
      <Stack.Screen name="share" options={{title:"Share and Export"}}/>
      <Stack.Screen name="forecast" options={{title:"Weather Forecast"}}/>
    </Stack>
  );
}
