import React from "react";
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import { Card } from 'react-native-elements'

class TodayView extends React.Component {
    constructor() {
        super();
        this.state = {
            goalDailyActivity: 0.0,
            actualDailyActivity: 0.0,
            activities: [],
        }
    }

    fetchData() {
        fetch("https://cs571.cs.wisc.edu/users/" + this.props.username, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken,
            }
        })
            .then((res) => res.json())
            .then((res) => {
                this.setState({ goalDailyActivity: res.goalDailyActivity })
            })

        fetch("https://cs571.cs.wisc.edu/activities/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken,
            }
        })
            .then((res) => res.json())
            .then((res) => {
                this.setState({ activities: res.activities })
                let actualActTime = 0;
                for (const act of res.activities) {
                    if(new Date(act.date).getDate() === new Date().getDate() && new Date(act.date).getMonth() === new Date().getMonth()) {
                        actualActTime = actualActTime + act.duration
                    }
                }
                this.setState({ actualDailyActivity: actualActTime })
            })
    }

    componentDidMount() {
        this.fetchData();
        this.props.navigation.addListener('focus', () => {
            this.fetchData();
        })
    }

    getActivities() {
        const activityCards = [];
        for(const act of this.state.activities) {
            if(new Date(act.date).getDate() === new Date().getDate() && new Date(act.date).getMonth() === new Date().getMonth()) {
                activityCards.push(
                    <Card key={act.id}>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold'}}> {act.name} </Text>
                        </View>
                            <View style={styles.space} />
                        <View>    
                            <Text style={{fontSize: 15}}> Date: {new Date(act.date).toLocaleString()} </Text>
                            <Text style={{fontSize: 15}}> Calories Burnt: {act.calories} </Text>
                            <Text style={{fontSize: 15}}> Duration: {act.duration} Minutes </Text>
                        </View>
                    </Card>
                )
            }
        }
        return activityCards;
    }

    render() {
        return (
            <ScrollView
                style={styles.mainContainer}
                contentContainerStyle={{
                    flexGrow: 11,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View style={styles.space} />
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Icon
                        name="sun"
                        size={40}
                        color="#900"
                        style={{ marginRight: 20 }}
                    />
                    <Text style={styles.bigText}>Today</Text>
                </View>

                <View style={styles.spaceSmall}></View>
                <Text>What's on the agenda for today?</Text>
                <Text>Below are all of your goals and exercises.</Text>
                <View style={styles.space} />

                <Card> 
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 20}}> Goals Status </Text>
                        <View style={styles.space} />
                        <Text> Daily Activity: {this.state.actualDailyActivity}/{this.state.goalDailyActivity} minutes</Text>
                    </View>
                </Card>

                <View style={styles.space} />

                <View style={styles.space} />
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    <Icon
                        name="running"
                        size={40}
                        color="#900"
                        style={{ marginRight: 20 }}
                    />
                    <Text style={styles.bigText}>Exercises</Text>
                </View>

                {this.getActivities()}
                

            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    scrollView: {
      height: Dimensions.get("window").height,
    },
    mainContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    bigText: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 5,
    },
    spaceSmall: {
      width: 20, // or whatever size you need
      height: 10,
    },
    space: {
      width: 20, // or whatever size you need
      height: 20,
    },
    spaceHorizontal: {
      display: "flex",
      width: 20,
    },
    buttonInline: {
      display: "flex",
      margin: 5,
      padding: 10,
    },
    input: {
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: "#c9392c",
      borderWidth: 1,
    },
    inputInline: {
      flexDirection: "row",
      display: "flex",
      width: 200,
      padding: 10,
      margin: 5,
      height: 40,
      borderColor: "#c9392c",
      borderWidth: 1,
    },
    bottomButtons: {
      flexDirection: "row",
      display: "flex",
      margin: 5,
    },
  });

export default TodayView;