import { useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button, Icon } from '@rneui/themed'
export default function Header() {

    const { canGoBack, goBack } = useNavigation()

    const InfoUser = {
        name: 'Andrés Ordoñez',
        uri: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'
    }

    return (
        <View style={styles.container}>

            {canGoBack() ? (
                <View style={styles.arrowContainer}>
                    <Button onPress={()=> goBack()} icon={<Icon name="arrow-back" color='#333333'/>} color='transparent' /> 
                </View>
            ): undefined}

            <View style={styles.lefContainer}>
                <Text style={styles.name}>{InfoUser.name}</Text>
                <Text style={styles.text}>Administrador</Text>
            </View>
            <View style={styles.rightContainer}>
                <Image style={styles.image} source={{ uri: InfoUser.uri }} />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    lefContainer: {
        flex: 1,
        justifyContent:'center'
    },
    name: {
        fontWeight:'bold',
        fontSize:14,
        color:'#333333'
    },
    text: {
        fontSize:12,
        color:'#808080'
    },
    rightContainer:{
        flex:1,
        alignItems:'flex-end',
        justifyContent:'center'
    },
    image: {
       width:40,
       height:40,
    },
    arrowContainer:{
        marginLeft:-10
    }
})