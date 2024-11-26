import { View, Text, StyleSheet } from "react-native";
import { Button, Icon } from '@rneui/themed'


export default function userListItems({user, index, getIdUser}) {

    const {name, last_name, cellphone, locality,document_number, city  } = user
    
    
    return (
        <View style={styles.userListItems}>
            <View style={{ flex: 2, flexDirection: 'row', alignItems: "center", }}>
                <View style={{ width: 20, height: 20, backgroundColor: '#fff', marginRight: 10, borderRadius: 50 }}>
                    <Text style={{ textAlign: 'center' }}>{index + 1}</Text>
                </View>
                <View>
                    <Text style={styles.userItemText}>{name} {last_name}</Text>
                    <Text style={styles.userItemText}>{cellphone}</Text>
                    <Text style={styles.userItemText}>{locality} - {city} </Text>
                </View>
            </View>
            <Button onPress={()=> getIdUser(document_number)} icon={<Icon name="keyboard-arrow-right" />} radius='lg' color='#fff' />
        </View>
    )
}
const styles = StyleSheet.create({
    
    userListItems: {
        padding: 10,
        backgroundColor: '#b2dfdb',
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userItemText: {
        color: '#333333',
        fontWeight: 'bold'
    }
})