import { StyleSheet, SafeAreaView, } from "react-native";
import React from "react";
import Button1 from "../components/Button1";

function Menu({ route, navigation, ...props }) {
    return (
        <SafeAreaView style={styles.container}>


            <Button1 title="Main"
                onPress={() => navigation.navigate('main')} />

            <Button1 title="Meet"
                onPress={() => navigation.navigate('meet')}
            />

        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',

    },

});
export default Menu;