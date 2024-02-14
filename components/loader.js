import React from 'react';
import { ActivityIndicator, Dimensions, Modal, StyleSheet, View } from 'react-native';
const Loader = (visible) => {
    return (

        <Modal visible={visible} transparent>
            <View style={styles.modalview}>
                <View style={styles.mainview}>
<ActivityIndicator size={'large'}/>
                </View>

            </View>
        </Modal>

    )
}
export default Loader;
const styles = StyleSheet.create({
    modalview: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: "center",
        alignItems: "center",

    },
    mainview:{
width:100,
height:100,
justifyContent:"center",
alignItems:"center",
borderRadius: 50,
backgroundColor:"white",
    }

})
