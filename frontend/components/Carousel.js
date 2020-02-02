import React, { Component } from "react";
import { Dimensions, View, Text, Image } from "react-native";
import { WebView } from "react-native-webview";
import SideSwipe from "react-native-sideswipe";
import _ from "lodash";
import ApolloClient from "apollo-boost";
const entriesClient = new ApolloClient({ uri: "http:localhost:3000/entries" });
import gql from "graphql-tag";
import { ApolloProvider, useQuery } from "react-apollo";
import Vis from "../components/Vis";

const groupEntriesQuery = gql`
  query getGroupEntry($groupId: ID!) {
    groupEntries(groupId: $groupId) {
      emotion
      magnitude
    }
  }
`;

const GroupVis = ({ groupId }) => {
  const { loading, error, data } = useQuery(groupEntriesQuery, {
    variables: { groupId }
  });
  if (loading)
    return (
      <View
        style={{
          width: 208,
          height: 208,
          borderRadius: 208 / 2,
          backgroundColor: "rgb(229, 229, 234)",
          marginBottom: 48
        }}
      />
    );
  if (error) return <Text>Whoops</Text>;

  // return <Vis data={data.groupEntries} />;
  return (
    <View style={{ height: 250, width: 270 }}>
      <WebView
        style={{ height: 250, width: 270 }}
        source={{ uri: "http://localhost:3001/" }}
      />
    </View>
  );
};

const GroupVisWrapper = ({ groupId }) => (
  <ApolloProvider client={entriesClient}>
    <GroupVis groupId={groupId} />
  </ApolloProvider>
);

const customComponentWidth = 283;
const CustomComponent = ({ id, name, description, userCount }) => (
  <View
    style={{
      width: customComponentWidth,
      border: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <GroupVisWrapper groupId={id} />
    <Text style={{ fontFamily: "DMSans-Bold", fontSize: 18, marginBottom: 3 }}>
      {name}
    </Text>
    <View style={{ display: "flex", flexDirection: "row" }}>
      <Text
        style={{
          fontFamily: "Optican-Sans",
          fontSize: 14,
          color: "rgb(142, 142, 147)"
        }}
      >
        {_.upperCase(description)}
      </Text>
      <Text
        style={{
          fontFamily: "Optican-Sans",
          fontSize: 14,
          color: "rgb(142, 142, 147)"
        }}
      >
        {" "}
        ·{" "}
      </Text>
      <Text
        style={{
          fontFamily: "Optican-Sans",
          fontSize: 14,
          color: "rgb(142, 142, 147)"
        }}
      >
        {userCount} MEMBERS
      </Text>
    </View>
  </View>
);

class Carousel extends Component {
  state = {
    currentIndex: 0
  };

  render() {
    // center items on screen
    const { width } = Dimensions.get("window");
    // const contentOffset = (width - CustomComponent.WIDTH) / 2;
    const contentOffset = (width - customComponentWidth) / 2;

    return (
      <SideSwipe
        index={this.state.currentIndex}
        itemWidth={customComponentWidth}
        style={{ width }}
        data={this.props.data}
        contentOffset={contentOffset}
        onIndexChange={index => this.setState(() => ({ currentIndex: index }))}
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
          <CustomComponent
            {...item}
            index={itemIndex}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
          />
        )}
      />
    );
  }
}

const data = [
  {
    action: "Start a chat",
    png: (
      <Image
        style={{ width: 18, height: 18, marginRight: 8 }}
        source={require("../assets/Chat/Light.png")}
      />
    )
  },
  {
    action: "Pay for coffee",
    png: (
      <Image
        style={{ width: 18, height: 18, marginRight: 8 }}
        source={require("../assets/Coffee/Light.png")}
      />
    )
  },
  {
    action: "Pay for dinner",
    png: (
      <Image
        style={{ width: 18, height: 18, marginRight: 8 }}
        source={require("../assets/Food/Light.png")}
      />
    )
  }
];

const KindnessAct = ({ action, png }) => (
  <View
    style={{
      minWidth: 124,
      height: 32,
      backgroundColor: "rgb(28, 28, 30)",
      borderRadius: 8,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 8,
      paddingRight: 8,
      marginRight: 12
    }}
  >
    {png}
    <Text
      style={{
        fontFamily: "DMSans-Medium",
        color: "rgb(255, 255, 255)",
        fontSize: 14
      }}
    >
      {action}
    </Text>
  </View>
);

export class KindnessCarousel extends Component {
  state = {
    currentIndex: 0
  };

  render() {
    // center items on screen
    const { width } = Dimensions.get("window");

    return (
      <SideSwipe
        index={this.state.currentIndex}
        itemWidth={124}
        style={{ width }}
        data={data}
        contentOffset={0}
        onIndexChange={index => this.setState(() => ({ currentIndex: index }))}
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
          <KindnessAct
            {...item}
            index={itemIndex}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
          />
        )}
      />
    );
  }
}

const Group = ({ name, index }) =>
  console.log(index) || (
    <View
      style={{
        minWidth: 124,
        height: 32,
        backgroundColor: index === 0 ? "rgb(28, 28, 30)" : "rgb(242, 242, 247)",
        borderRadius: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 8,
        paddingRight: 8,
        marginRight: 12
      }}
    >
      <Text
        style={{
          fontFamily: "DMSans-Medium",
          color: index === 0 ? "rgb(255, 255, 255)" : "rgb(142, 142, 147)",
          fontSize: 14
        }}
      >
        {name}
      </Text>
    </View>
  );

export class GroupsCarousel extends Component {
  state = {
    currentIndex: 0
  };

  render() {
    // center items on screen
    const { width } = Dimensions.get("window");

    return (
      <SideSwipe
        index={this.state.currentIndex}
        itemWidth={124}
        style={{ width }}
        data={this.props.data}
        contentOffset={0}
        onIndexChange={index => this.setState(() => ({ currentIndex: index }))}
        renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
          <Group
            {...item}
            index={itemIndex}
            currentIndex={currentIndex}
            animatedValue={animatedValue}
          />
        )}
      />
    );
  }
}

export default Carousel;
