import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import ApolloClient from "apollo-boost";
const usersClient = new ApolloClient({ uri: "http:localhost:3000/users" });
const entriesClient = new ApolloClient({ uri: "http:localhost:3000/entries" });
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";
import { GroupsCarousel } from "../components/Carousel";

const userGroupsQuery = gql`
  {
    userGroups(userId: 1) {
      name
    }
  }
`;

const entriesQuery = gql`
  {
    entries(userId: 1) {
      emotion
      createdAt
    }
  }
`;
const colorBank = ["#574b90", "#f19066", "#C44569", "#546de5", "#F5CD79 "];

export const Profile = () => (
  <View>
    <View
      style={{
        paddingLeft: 16,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        marginBottom: 48
      }}
    >
      <Text
        style={{
          fontFamily: "Optican-Sans",
          fontSize: 14,
          color: "rgb(142,142,147)",
          marginBottom: 13,
          marginTop: 32
        }}
      >
        CIRCLES
      </Text>
      <ApolloProvider client={usersClient}>
        <Query query={userGroupsQuery}>
          {({ loading, error, data }) => {
            if (loading || error) return <View></View>;
            return (
              <GroupsCarousel data={[{ name: "You" }, ...data.userGroups]} />
            );
          }}
        </Query>
      </ApolloProvider>
    </View>

    <ApolloProvider client={entriesClient}>
      <Query query={entriesQuery}>
        {({ loading, error, data }) => {
          if (loading || error) return <View></View>;
          let sum = 0;
          data.entries.forEach(({ emotion }) => (sum += Number(emotion)));
          const averageEmotion = Math.ceil(sum / data.entries.length);
          return (
            <View
              style={{
                marginTop: 36,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: 137,
                  height: 137,
                  borderRadius: 137 / 2,
                  backgroundColor: colorBank[averageEmotion - 1],
                  marginBottom: 43
                }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 32
                }}
              >
                <TouchableOpacity>
                  <Image
                    style={{ width: 24, height: 24, marginRight: 4 }}
                    source={require("../assets/Back/Dark.png")}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    fontFamily: "DMSans-Bold",
                    fontSize: 18
                  }}
                >
                  Feburary
                </Text>
                <TouchableOpacity>
                  <Image
                    style={{ width: 24, height: 24, marginLeft: 4 }}
                    source={require("../assets/Forward/Dark.png")}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: "100%",
                  borderTop: 1,
                  borderBottom: 1,
                  borderColor: "rgb(224, 224, 224)",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  paddingLeft: 16,
                  paddingRight: 16
                }}
              >
                {["S", "M", "T", "W", "T", "F", "S"].map(day => (
                  <Text style={{ fontFamily: "DMSans-Bold", fontSize: 16 }}>
                    {day}
                  </Text>
                ))}
              </View>
            </View>
          );
        }}
      </Query>
    </ApolloProvider>
  </View>
);
