import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Container, Header, Left, Body, Right, Title } from "native-base";
import { Home } from "./screens/Home";
import { Profile } from "./screens/Profile";
import * as Font from "expo-font";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

class HomeScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header
          style={{
            height: 75,
            backgroundColor: "#f2f2f7",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <Left>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Profile")}
            >
              <Image
                style={{ width: 24, height: 24, marginLeft: 12 }}
                source={require("./assets/Calendar/Dark.png")}
              />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title
              style={{
                fontFamily: "DMSans-Bold",
                fontSize: 16
              }}
            >
              Your Circles
            </Title>
          </Body>
          <Right>
            <TouchableOpacity>
              <Image
                style={{ width: 24, height: 24, marginRight: 12 }}
                source={require("./assets/Add-Group/Dark.png")}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <Home />
      </Container>
    );
  }
}
class ProfileScreen extends React.Component {
  render() {
    return (
      <Container>
        <Header
          style={{
            height: 75,
            backgroundColor: "#f2f2f7",
            display: "flex",
            flexDirection: "row"
          }}
        >
          <Left />
          <Body style={{ flex: 3 }}>
            <Title
              style={{
                fontFamily: "DMSans-Bold",
                fontSize: 16
              }}
            >
              Entry Calendar
            </Title>
          </Body>
          <Right>
            <TouchableOpacity>
              <Image
                style={{ width: 24, height: 24, marginRight: 12 }}
                source={require("./assets/Close/Dark.png")}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <Profile />
      </Container>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: null
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    navigationOptions: {
      header: null
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };
  async componentDidMount() {
    await Font.loadAsync({
      "DMSans-Bold": require("./assets/DMSans-Bold.ttf"),
      "DMSans-BoldItalic": require("./assets/DMSans-BoldItalic.ttf"),
      "DMSans-Italic": require("./assets/DMSans-Italic.ttf"),
      "DMSans-Medium": require("./assets/DMSans-Medium.ttf"),
      "DMSans-MediumItalic": require("./assets/DMSans-MediumItalic.ttf"),
      "DMSans-Regular": require("./assets/DMSans-Regular.ttf"),
      "Optican-Sans": require("./assets/Optician-Sans.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  render() {
    if (!this.state.fontLoaded) return <View></View>;
    return <AppContainer />;
  }
}
