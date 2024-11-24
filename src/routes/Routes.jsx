import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack  = createNativeStackNavigator()
import Home from "../views/Home";
import AddUser from "../views/AddUser";

export default function Routes(){

    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name='Home' component={Home} options={{headerShown:false}}/>
                <Stack.Screen name='Nuevo Usuario' component={AddUser} options={{headerShown:false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}