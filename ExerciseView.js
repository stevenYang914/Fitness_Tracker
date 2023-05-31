import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Pressable,
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome5";
import { Card, Button } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker';

class ExerciseView extends React.Component {
    constructor() {
        super();
        this.state = {
            modalVisible: false,
            date: new Date(),
            mode: 'date',
            show: false,

            activityName: "",
            duration: "",
            calories: "",

            activities: [],
            actID: "",

            modalVisible2: false,
        };

        this.onChange = this.onChange.bind(this);
        this.showDatepicker = this.showDatepicker.bind(this);
        this.showTimepicker = this.showTimepicker.bind(this);
        this.handleAddActivity = this.handleAddActivity.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    // edit modal
    setModalVisible2 = (visible) => {
        this.setState({ modalVisible2: visible });
    }

    onChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({show: Platform.OS === 'ios'})
        this.setState({date: currentDate})
    };

    showMode = (currentMode) => {
        this.setState({show: true});
        this.setState({mode: currentMode})
    };

    showDatepicker = () => {
        this.showMode('date');
    };

    showTimepicker = () => {
        this.showMode('time');
    };

    handleDelete = (activityId) => {
        fetch("https://cs571.cs.wisc.edu/activities/" + activityId, {
            method: 'DELETE',
            headers: {
                'x-access-token': this.props.accessToken
            }
        })
        .then((res) => res.json())
        .then((res) => {
            this.fetchData();
            alert(JSON.stringify(res.message));
        })
    }

    getOriginalStats(activityId) {
        console.log(activityId);
        fetch("https://cs571.cs.wisc.edu/activities/" + activityId, {
          method: "GET",
          headers: { "x-access-token": this.props.accessToken },
        })
          .then((res) => res.json())
          .then((res) => {
            this.setState({
              activityName: res.name,
              duration: res.duration,
              date: res.date,
              calories: res.calories,
            });
          });
      }

    handleEdit = (activityId) => {
        fetch("https://cs571.cs.wisc.edu/activities/" + activityId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": this.props.accessToken,
            },
            body: JSON.stringify({
                name: this.state.activityName,
                duration: this.state.duration,
                date: this.state.date.toString(),
                calories: this.state.calories,
              }),
        })
            .then((res) => res.json())
            .then((res) => {
                this.fetchData();
                this.clearModalInput();
                alert("Your profile has been updated!");
                this.setModalVisible2(!this.state.modalVisible2)
            })
            .catch((err) => {
                alert(
                    "Something went wrong! Verify you have filled out the fields correctly."
                );
            });
    }

    handleAddActivity() {
        fetch("https://cs571.cs.wisc.edu/activities/", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            'x-access-token': this.props.accessToken,
          },
          body: JSON.stringify({
            name: this.state.activityName,
            duration: this.state.duration,
            date: this.state.date.toString(),
            calories: this.state.calories,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
              this.fetchData();
              this.clearModalInput();
            if (res.message === "Activity created!") {
              // create success!
              alert(JSON.stringify(res.message));
              this.setModalVisible(!this.state.modalVisible)
            } else {
              // create failure
              alert(JSON.stringify(res.message));
            }
          });
      }

    fetchData() {
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
            })
    }

    componentDidMount() {
        this.fetchData();
    }

      getActivities() {
        const activityCards = [];
        for(const act of this.state.activities) {
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
                        <View style={styles.space} />
                        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center"}}>
                                <Button
                                    style={styles.buttonInline}
                                    title="EDIT"
                                    onPress={() => {this.setModalVisible2(true); this.setState({actID: act.id}, function() {this.getOriginalStats(act.id)})}}
                                />
                                <View style={styles.spaceHorizontal} />
                                <Button
                                    style={styles.buttonInline}
                                    title="DELETE"
                                    onPress={() => this.handleDelete(act.id)}
                                />
                        </View>
                    </View>
                </Card>
            )
        }
        return activityCards;
    }

    clearModalInput() {
        this.setState({
            activityName: "",
            duration: "",
            date: new Date(),
            calories: "",
          });
    }
    

    render() {
        const { modalVisible } = this.state;
        const { modalVisible2 } = this.state;
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
                        name="running"
                        size={40}
                        color="#900"
                        style={{ marginRight: 20 }}
                    />
                    <Text style={styles.bigText}>Exercises</Text>
                </View>

                <View style={styles.spaceSmall}></View>
                <Text>Let's get to work!</Text>
                <Text>Record your exercises below.</Text>
                <View style={styles.spaceSmall}></View>
                <Button
                    title="ADD EXERCISE"
                    onPress={() => {this.setModalVisible(true); this.clearModalInput()}}
                  />
                <View style={styles.space} />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.spaceSmall}></View>
                            <Text style={styles.mediumText}>Exercise Details</Text>
                            <View style={styles.spaceSmall}></View>


                            <View>
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    Exercise Name
                                </Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Jogging"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(activityName) => this.setState({ activityName: activityName })}
                                value={this.state.activityName}
                                autoCapitalize="none"
                            />

                            <View style={styles.spaceSmall}></View>


                            <View>
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    Duration (minutes)
                                </Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="0"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(duration) => this.setState({ duration: duration })}
                                value={this.state.duration + ""}
                                autoCapitalize="none"
                            />

                            <View style={styles.spaceSmall}></View>

                            <View>
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    Calories Burnt
                                </Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="0"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(calories) => this.setState({ calories: calories })}
                                value={this.state.calories + ""}
                                autoCapitalize="none"
                            />

                            <View style={styles.spaceSmall}></View>

                            <View>
                                <Text style={{ textAlignVertical: "center", fontWeight: "700"}}>
                                    Exercise Date and Time
                                </Text>
                                <Text style={{ textAlignVertical: "center"}}> {this.state.date.toLocaleString()}</Text>
                            </View>

                            <View style={styles.spaceSmall}></View>

                            <View>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    <Button onPress={this.showDatepicker} title="SET DATE" />
                                    <View style={styles.spaceHorizontal} />
                                    <Button onPress={this.showTimepicker} title="SET TIME" />
                                </View>
                                {this.state.show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={new Date(this.state.date)}
                                        mode={this.state.mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChange}
                                    />
                                )}
                            </View>
                            <View> 
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    (Click to open the picker and adjust)
                                </Text>
                            </View>

                            <View style={styles.spaceSmall}></View>
                            <View style={styles.spaceSmall}></View>
                            <View style={styles.spaceSmall}></View>

                            <View> 
                                <Text style={{ textAlignVertical: "center", fontSize: 15, fontWeight: "700"}}>
                                    Looks good! Ready to save your work?
                                </Text>
                            </View>
                            <View style={styles.spaceSmall}></View>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                <Button
                                    style={styles.buttonInline}
                                    title="SAVE EXERCISE"
                                    onPress={this.handleAddActivity}
                                />
                                <View style={styles.spaceHorizontal} />
                                <Button
                                    style={styles.buttonInline}
                                    title="NEVERMIND!"
                                    onPress={() => {this.setModalVisible(!modalVisible)}}
                                />
                            </View>
                            
                        </View>
                    </View>
                </Modal>



                
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible2}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        this.setModalVisible2(!modalVisible2);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.spaceSmall}></View>
                            <Text style={styles.mediumText}>Exercise Details</Text>
                            <View style={styles.spaceSmall}></View>


                            <View>
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    Exercise Name
                                </Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Jogging"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(activityName) => this.setState({ activityName: activityName })}
                                value={this.state.activityName}
                                autoCapitalize="none"
                            />

                            <View style={styles.spaceSmall}></View>


                            <View>
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    Duration (minutes)
                                </Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="0"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(duration) => this.setState({ duration: duration })}
                                value={this.state.duration.toString()}
                                autoCapitalize="none"
                            />

                            <View style={styles.spaceSmall}></View>

                            <View>
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    Calories Burnt
                                </Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="0"
                                placeholderTextColor="#d9bebd"
                                onChangeText={(calories) => this.setState({ calories: calories })}
                                value={this.state.calories.toString()}
                                autoCapitalize="none"
                            />

                            <View style={styles.spaceSmall}></View>

                            <View>
                                <Text style={{ textAlignVertical: "center",fontWeight: "700"}}>
                                    Exercise Date and Time
                                </Text>
                                <Text style={{ textAlignVertical: "center"}}> {this.state.date.toLocaleString()}</Text>
                            </View>

                            <View style={styles.spaceSmall}></View>

                            <View>
                                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                    <Button onPress={this.showDatepicker} title="SET DATE" />
                                    <View style={styles.spaceHorizontal} />
                                    <Button onPress={this.showTimepicker} title="SET TIME" />
                                </View>
                                {this.state.show && (
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={new Date(this.state.date)}
                                        mode={this.state.mode}
                                        is24Hour={true}
                                        display="default"
                                        onChange={this.onChange}
                                    />
                                )}
                            </View>
                            <View> 
                                <Text style={{ textAlignVertical: "center", fontWeight: "700" }}>
                                    (Click to open the picker and adjust)
                                </Text>
                            </View>

                            <View style={styles.spaceSmall}></View>
                            <View style={styles.spaceSmall}></View>
                            <View style={styles.spaceSmall}></View>

                            <View> 
                                <Text style={{ textAlignVertical: "center", fontWeight: "700"}}>
                                    Looks good! Ready to save your work?
                                </Text>
                            </View>
                            <View style={styles.spaceSmall}></View>
                            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                                <Button
                                    style={styles.buttonInline}
                                    title="SAVE EXERCISE"
                                    onPress={() => this.handleEdit(this.state.actID)}
                                />
                                <View style={styles.spaceHorizontal} />
                                <Button
                                    style={styles.buttonInline}
                                    title="NEVERMIND!"
                                    onPress={() => this.setModalVisible2(!modalVisible2)}
                                />
                            </View>
                            
                        </View>
                    </View>
                </Modal>

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
    mediumText: {
        fontSize: 25,
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

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        width: 200,
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: "#c9392c",
        borderWidth: 1,
    },
    spaceHorizontal: {
        display: "flex",
        width: 10,
    },
    buttonInline: {
        display: "flex",
    },

});

export default ExerciseView;