import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" options={{ title: ''}} />
      <Stack.Screen name="admin" options={{ title: 'Admin' }} />
      <Stack.Screen name="students" options={{ title: 'Students View'}} />
    </Stack>
    
  );
}
