import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

function AuthLayout() {
  const { user } = useAuth();

  return user ? (
    <Redirect href={"(tabs)"} />
  ) : (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}

export default AuthLayout;
