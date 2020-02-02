import React, { useState } from "react";
import { Text, View, TouchableOpacity, TextInput, Image } from "react-native";
import ApolloClient from "apollo-boost";
const usersClient = new ApolloClient({ uri: "http:localhost:3000/users" });
const entriesClient = new ApolloClient({ uri: "http:localhost:3000/entries" });
import gql from "graphql-tag";
import { ApolloProvider, Query, Mutation, useQuery } from "react-apollo";
import BottomDrawer from "rn-bottom-drawer";
import styled from "styled-components";
import Carousel, { KindnessCarousel } from "../components/Carousel";

const userId = 1;
const colorBank = ["#574b90", "#f19066", "#C44569", "#546de5", "#F5CD79 "];
const emotions = [
  {
    number: 1,
    mood: "DOWN",
    color: "rgba(120, 111, 166, 0.25)"
  },
  {
    number: 2,
    mood: "ANXIOUS",
    color: "rgba(243, 166, 131, 0.25)"
  },
  {
    number: 3,
    mood: "UPSET",
    color: "rgba(207, 106, 135, 0.25)"
  },
  {
    number: 4,
    mood: "CALM",
    color: "rgba(119, 139, 235, 0.25)"
  },
  {
    number: 5,
    mood: "JOYFUL",
    color: "rgba(247, 215, 148, 0.25)"
  }
];

const userGroupsQuery = gql`
  {
    userGroups(userId: 1) {
      id
      name
      description
      userCount
    }
  }
`;
// This query's function is to return aggregated count, but the way it's written
// is highly inefficient...

const entriesQuery = gql`
  {
    entries(userId: 1) {
      emotion
    }
  }
`;

const addEntry = gql`
  mutation addEntry($text: String, $emotion: Int, $question: String) {
    createEntry(
      userId: 1
      text: $text
      emotion: $emotion
      question: $question
    ) {
      sentiment
    }
  }
`;

const getQuestion = () => {
  const questions = [
    "I am grateful for: ",
    "3 things that I loved today: ",
    "I felt most happy today when: "
  ];
  const n = Math.floor(Math.random() * Math.floor(questions.length - 1));
  return questions[n];
};

const EntryNumber = () => (
  <ApolloProvider client={entriesClient}>
    <Query query={entriesQuery}>
      {({ loading, error, data }) => {
        if (loading || error)
          return (
            <View>
              <Text style={{ fontFamily: "Optican-Sans", fontSize: 14 }}>
                NEW ENTRY
              </Text>
            </View>
          );
        return (
          <View>
            <Text
              style={{
                fontFamily: "Optican-Sans",
                fontSize: 14,
                color: "rgb(142, 142, 147)"
              }}
            >
              ENTRY #{data.entries.length + 1}
            </Text>
          </View>
        );
      }}
    </Query>
  </ApolloProvider>
);

const EmotionOption = styled(TouchableOpacity)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const InputLabel = styled(Text)`
  margin-bottom: 32;
  font-size: 18;
`;
const JournalCard = () => {
  const [entry, setEntry] = useState({
    userId,
    text: "",
    emotion: -1,
    posing: getQuestion(),
    question: ""
  });

  return (
    <ApolloProvider client={entriesClient}>
      <View style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 32 }}>
        <Mutation mutation={addEntry}>
          {createEntryMutation => (
            <>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%"
                }}
              >
                <EntryNumber />
                <TouchableOpacity
                  onPress={e => {
                    createEntryMutation({
                      variables: {
                        emotion: entry.emotion,
                        text: entry.text,
                        question: entry.posing + entry.question
                      }
                    })
                      .then(r => console.log(r))
                      .catch(e => console.log(e));
                  }}
                >
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require("../assets/Right/Dark.png")}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontFamily: "DMSans-Bold",
                  fontSize: 18,
                  marginTop: 8
                }}
              >
                Today, I felt:
              </Text>
              <EmotionOptions style={{ marginTop: 32, marginBottom: 64 }}>
                {emotions.map(({ number, mood, color }) => (
                  <EmotionOption
                    key={number}
                    onPress={e => setEntry({ ...entry, emotion: number })}
                  >
                    <View
                      style={{
                        height: 56,
                        width: 56,
                        borderRadius: 56 / 2,
                        backgroundColor:
                          entry.emotion === number
                            ? colorBank[number - 1]
                            : color
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: "Optican-Sans",
                        fontSize: 14,
                        color:
                          entry.emotion === number
                            ? "black"
                            : "rgb(142, 142, 147)",
                        marginTop: 8
                      }}
                    >
                      {mood}
                    </Text>
                  </EmotionOption>
                ))}
              </EmotionOptions>

              <InputLabel
                style={{
                  fontFamily: "DMSans-Bold",
                  fontSize: 18
                }}
              >
                {entry.posing}
              </InputLabel>
              <TextInput
                style={{
                  height: 56,
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "rgb(229, 229, 234)"
                }}
                value={entry.question}
                onChangeText={text => setEntry({ ...entry, question: text })}
              />
              <Text
                style={{
                  fontFamily: "Optican-Sans",
                  fontSize: 12,
                  color: "rgb(142, 142, 147)",
                  marginTop: 12,
                  marginBottom: 64
                }}
              >
                {entry.question.length}/140 CHARACTERS
              </Text>

              <InputLabel
                style={{
                  fontFamily: "DMSans-Bold",
                  fontSize: 18
                }}
              >
                A thought, or two about my day:
              </InputLabel>
              <TextInput
                value={entry.text}
                style={{
                  height: 168 - 56,
                  borderWidth: 1,
                  borderRadius: 8,
                  borderColor: "rgb(229, 229, 234)"
                }}
                multiline
                onChangeText={text => setEntry({ ...entry, text })}
              />
              <Text
                style={{
                  fontFamily: "Optican-Sans",
                  fontSize: 12,
                  color: "rgb(142, 142, 147)",
                  marginTop: 12,
                  marginBottom: 64
                }}
              >
                {entry.text.length}/280 CHARACTERS
              </Text>
            </>
          )}
        </Mutation>
      </View>
    </ApolloProvider>
  );
};

const EmotionOptions = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

export const Home = () => {
  const [open, toggle] = useState(false);
  return (
    <ApolloProvider client={usersClient}>
      <Query query={userGroupsQuery}>
        {({ loading, error, data }) => {
          if (loading || error)
            return (
              <View>
                <Text>LOADING OR ERROR</Text>
              </View>
            );
          return (
            <>
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
                  ACTS OF KINDNESS
                </Text>
                <KindnessCarousel />
              </View>
              <Carousel data={data.userGroups} />
              <BottomDrawer
                containerHeight={640}
                offset={110}
                startUp={false}
                downDisplay={500}
              >
                <JournalCard />
              </BottomDrawer>
            </>
          );
        }}
      </Query>
    </ApolloProvider>
  );
};
