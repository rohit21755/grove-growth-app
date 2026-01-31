import { Stack } from "expo-router";

export default function UserProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="[id]"
        getId={({ params }) =>
          params?.id ? String(params.id) : String(Date.now())
        }
      />
    </Stack>
  );
}
