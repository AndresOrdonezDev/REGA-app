import { View, Text, StyleSheet } from "react-native";
import CircularProgress from 'react-native-circular-progress-indicator';

export default function ProgressChart({ assignedRecords, totalUserLocal }) {

    return (
        <View>
            <View style={styles.chartContainer}>
                
                <CircularProgress
                    value={(totalUserLocal / assignedRecords) * 100}
                    valueSuffix={'%'}
                    radius={120}
                    duration={500}
                    activeStrokeColor={'#00bfa5'}
                    progressValueColor={'#00bfa5'}
                   
                    titleColor={'#00bfa5'}
                    titleStyle={{ fontWeight: 'bold' }}
                />

            </View>
            <View style={styles.chartInfo}>
                <Text style={styles.chartInfoTitle}>Historial de registros</Text>
                <Text style={styles.chartInfoText}>Asignados: <Text style={styles.span}>{assignedRecords}</Text> </Text>
                <Text style={styles.chartInfoText}>Registrados: <Text style={styles.span}>{totalUserLocal}</Text> </Text>
                <Text style={styles.chartInfoText}>Pendientes: <Text style={styles.span}>{assignedRecords - totalUserLocal}</Text> </Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50
    },
    chartInfo: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    chartInfoTitle: {
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom:15
    },
    chartInfoText: {
        textAlign: 'center',
        color: '#333',
        fontSize:20
    },
    span:{
        color:'#00bfa5',
        fontSize:25,
        fontWeight:'bold'
    }
})