import { StyleSheet, Button, Text, Image, SafeAreaView, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button1 from "../components/Button1";
// import DrawerNavigator from "./drawer";

function Welcome(props) {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require("../assets/logo.jpg")}
                style={styles.image} />
            <Button1 title="Let's Go"
                onPress={() => props.navigation.navigate('signin')}
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

    image: {
        width: 200,
        height: 200,
        marginBottom: 25,

    },


});
export default Welcome;