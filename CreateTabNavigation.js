import React from "react";

import LoginView from "./LoginView";
import SignupView from "./SignupView";
import ProfileView from "./ProfileView";
import TodayView from "./TodayView";
import ExerciseView from "./ExerciseView";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

class CreateTabNavigation extends React.Component {
    constructor() {
        super();
    }

    render() {
        const TabNavigation = createBottomTabNavigator();

        return (
            <TabNavigation.Navigator
                screenOptions={{
                    headerShown: false,
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray',
                }}>

                <TabNavigation.Screen
                    name="Today"
                    options={{
                        accessible: true,
                        tabBarAccessibilityLabel: "This is Today tab, double tap to navigate to Today View to check your daily activities and goal",
                        title: "header",
                        tabBarLabel: 'Today',
                        activeTintColor: 'tomato',
                        inactiveTintColor: 'gray',
                        tabBarIcon: () => {
                          return <Icon
                          name="calendar-week"
                          size={25}
                        />;
                        },
                        animationEnabled: true,
                      }}
                >
                    {(props) => (
                        <TodayView
                            {...props}
                            accessToken={this.props.accessToken}
                            username={this.props.username}
                        />
                    )}
                    
                </TabNavigation.Screen>

                <TabNavigation.Screen
                    name="Exercise"
                    options={{
                        accessible: true,
                        tabBarAccessibilityLabel: "This is Exercise tab, double tap to navigate to Exercise View, to edit, add, and delete your activities",
                        title: "header",
                        tabBarLabel: 'Exercise',
                        activeTintColor: 'tomato',
                        inactiveTintColor: 'gray',
                        tabBarIcon: () => {
                          return <Icon
                            name="dumbbell"
                            size={25}
                          />;
                        },
                        animationEnabled: true,
                      }}
                >
                    {(props) => (
                        <ExerciseView
                            {...props}
                            accessToken={this.props.accessToken}
                            username={this.props.username}
                        />
                    )}
                    
                </TabNavigation.Screen>

                <TabNavigation.Screen
                    name ="Me"
                    options={{
                        accessible: true,
                        tabBarAccessibilityLabel: "This is Me tab, double tap to navigate to your profile View, to edit your daily fitness goals and other informations",
                        title: "header",
                        tabBarLabel: 'Me',
                        activeTintColor: 'tomato',
                        inactiveTintColor: 'gray',
                        tabBarIcon: () => {
                          return <Icon
                          name="user-alt"
                          size={25}
                        />;
                        },
                        animationEnabled: true,
                      }}
                >
                    {(props) => (
                        <ProfileView
                            {...props}
                            username={this.props.username}
                            accessToken={this.props.accessToken}
                            revokeAccessToken={this.props.revokeAccessToken}
                      />
                    )}
                </TabNavigation.Screen>

            </TabNavigation.Navigator>
        )
    }
}

export default CreateTabNavigation;