import { View, Text, StyleSheet } from "react-native";
import { Button, Icon } from '@rneui/themed'


export default function userListItems({user, index, getIdUser}) {

    const {name, lastName, phoneNumber, municipality,idNumber} = user

    return (
        <View style={styles.userListItems}>
            <View style={{ flex: 2, flexDirection: 'row', alignItems: "center", }}>
                <View style={{ width: 20, height: 20, backgroundColor: '#fff', marginRight: 10, borderRadius: 50 }}>
                    <Text style={{ textAlign: 'center' }}>{index + 1}</Text>
                </View>
                <View>
                    <Text style={styles.userItemText}>{name} {lastName}</Text>
                    <Text style={styles.userItemText}>{phoneNumber}</Text>
                    <Text style={styles.userItemText}>{municipality}</Text>
                </View>
            </View>
            <Button onPress={()=> getIdUser(idNumber)} icon={<Icon name="keyboard-arrow-right" />} radius='lg' color='#fff' />
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