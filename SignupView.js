import React from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

class SignupView extends React.Component {
  constructor() {
    super();

    // Initialize username and password states for TextInputs
    this.state = {
      username: "",
      password: "",
    };

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.backToLogin = this.backToLogin.bind(this);
  }

  /**
   * Handler for Create Account button.
   * Creates an account by sending a POST request to the `/users` endpoint.
   *
   */
  handleCreateAccount() {
    fetch("https://cs571.cs.wisc.edu/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message === "User created!") {
          // Signup success!
          alert(JSON.stringify(res.message));
          this.props.navigation.navigate("SignIn"); // navigate to the LoginView
        } else {
          // Signup failure
          alert(JSON.stringify(res.message));
        }
      });
  }

  /**
   * Handler for Nevermind! button. Navigates back to the LoginView.
   */
  backToLogin() {
    this.props.navigation.navigate("SignIn");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.bigText}>FitnessTracker</Text>
        <Text>New here? Let's get started!</Text>
        <Text>Please create an account below.</Text>
        <View style={styles.space} />
        <TextInput
          accessible={true}
          accessibilityLabel="Please type in your new"
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="Username"
          placeholderTextColor="#992a20"
          onChangeText={(username) => this.setState({ username: username })}
          value={this.state.username}
          autoCapitalize="none"
        />
        <TextInput
          accessible={true}
          accessibilityLabel="Please type in your new"
          style={styles.input}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          placeholder="Password"
          onChangeText={(password) => this.setState({ password: password })}
          value={this.state.password}
          placeholderTextColor="#992a20"
          autoCapitalize="none"
        />
        <View style={styles.space} />
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {/* <Button
            color="#942a21"
            style={styles.buttonInline}
            title="Create Account"
            onPress={this.handleCreateAccount}
          /> */}
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="This is the Create Account button"
            accessibilityHint="Double tap to finish creating your account, and if successful, it will navigate back to the login page for you to log in"
            onPress={this.handleCreateAccount}
          >
            <View>
              <Text style={[styles.buttonInline, {color: "#942a21", fontSize:19}]}> Create Account </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.spaceHorizontal} />
          {/* <Button
            color="#a1635f"
            style={styles.buttonInline}
            title="Nevermind!"
            onPress={this.backToLogin}
          /> */}
          <TouchableOpacity
            accessible={true}
            accessibilityLabel="Never mind button"
            onPress={this.backToLogin}
          >
            <View>
              <Text style={[styles.buttonInline, {color: "#942a21", fontSize:19}]}> Nevermind! </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  bigText: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 5,
  },
  space: {
    width: 20,
    height: 20,
  },
  spaceHorizontal: {
    display: "flex",
    width: 20,
  },
  buttonInline: {
    display: "flex",
  },
  input: {
    width: 200,
    padding: 10,
    margin: 5,
    height: 40,
    borderColor: "#c9392c",
    borderWidth: 1,
  },
});

export default SignupView;
