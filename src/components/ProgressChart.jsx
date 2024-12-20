import { View, Text, StyleSheet } from "react-native";
import CircularProgress from 'react-native-circular-progress-indicator';
import { round } from "react-native-redash";

export default function ProgressChart({ assignedRecords, totalUserLocal }) {
    let total = 0    
    if(assignedRecords > 0){
        total = (totalUserLocal / assignedRecords)
    }

    return (
        <View>
            <View style={styles.chartContainer}>
                
                <CircularProgress
                    value={total * 100}
                    valueSuffix={'%'}
                    radius={100}
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
                <Text style={styles.chartInfoText}>Pendientes: <Text style={styles.span}>{round(assignedRecords - totalUserLocal) <= 0 ? 0:round(assignedRecords - totalUserLocal) }</Text> </Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 20
    },
    chartInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },
    chartInfoTitle: {
        textAlign: 'center',
        color: '#333',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom:5
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