import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_SIZE } = Dimensions.get("window");
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13"; // const API_KEY = "8e60ddfd58d28006cd6cef1b95a1da4b";
const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
};
console.log(SCREEN_SIZE);

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);
    const getWeaher = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        setCity(location[0].region);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric` // `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        const json = await response.json();
        setDays(json.daily); // setDays(json);
        console.log(json);
    };
    useEffect(() => {
        getWeaher();
    }, []);
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                contentContainerStyle={styles.weather}
            >
                {days.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator
                            color="white"
                            style={{ marginTop: 10 }}
                            size="large"
                        />
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.day}>
                            <Text style={styles.tempText}>
                                {new Date(day.dt * 1000)
                                    .toString()
                                    .substring(0, 10)}
                            </Text>
                            <View
                                style={{ flexDirection: "row", width: "100%" }}
                            >
                                <Text style={styles.temp}>
                                    {parseFloat(day.temp.day).toFixed(1)}
                                </Text>
                                <Fontisto
                                    name={icons[day.weather[0].main]}
                                    size={40}
                                    color="white"
                                />
                            </View>

                            <Text style={styles.descripion}>
                                {day.weather[0].main}
                            </Text>
                            <Text style={styles.tinyText}>
                                {day.weather[0].description}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    city: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        color: "white",
        fontSize: 38,
        fontWeight: "500",
    },
    weather: {},
    day: {
        width: SCREEN_SIZE,
        flex: 1,
        // marginLeft: 10,
    },
    tempText: {
        fontSize: 40,
        color: "white",
    },
    temp: {
        marginTop: -20,
        fontSize: 120,
        color: "white",
    },
    descripion: {
        marginTop: -30,
        fontSize: 40,
        color: "white",
    },
    tinyText: {
        color: "white",
        fontSize: 13,
    },
});
