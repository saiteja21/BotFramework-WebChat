import { hooks } from 'botframework-webchat-component';
import { ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import React, { useCallback, useState } from 'react';

const { useActivities, useSendMessage } = hooks;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  filler: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 10000
  },

  sendBox: {
    borderTopColor: '#DDD',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 60,
    padding: 10
  },

  sendBoxInput: {
    flex: 1,
    fontSize: 18
  },

  transcript: {
    flex: 1
  },

  transcriptInner: {
    padding: 10
  },

  transcriptActivityContainerFromBot: {
    flexDirection: 'row',
    marginBottom: 10
  },

  transcriptActivityContainerFromUser: {
    flexDirection: 'row',
    marginBottom: 10
  },

  transcriptActivityBubbleFromBot: {
    backgroundColor: 'white',
    borderColor: '#E6E6E6',
    borderRadius: 10,
    borderWidth: 2,
    flexShrink: 1,
    maxWidth: 320,
    padding: 10
  },

  transcriptActivityBubbleFromUser: {
    backgroundColor: '#0063B1',
    borderColor: '#0063B1',
    borderRadius: 10,
    borderWidth: 2,
    flexShrink: 1,
    maxWidth: 320,
    padding: 10
  },

  transcriptActivityTextFromUser: {
    color: 'white'
  }
});

const Chat = () => {
  const [activities] = useActivities();
  const [sendBoxText, setSendBoxText] = useState('Hello, World!');
  const sendMessage = useSendMessage();

  const handleChangeText = useCallback(text => setSendBoxText(text), [setSendBoxText]);

  const handleSend = useCallback(() => {
    sendMessage(sendBoxText);
    setSendBoxText('');
  }, [sendBoxText, sendMessage, setSendBoxText]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.transcriptInner} scrollsToTop={true} style={styles.transcript}>
        <View style={styles.filler} />
        {activities.map((activity, id) =>
          activity.from.role === 'user' ? (
            <View key={id} style={styles.transcriptActivityContainerFromUser}>
              <View style={styles.filler} />
              <View style={styles.transcriptActivityBubbleFromUser}>
                <Text style={styles.transcriptActivityTextFromUser}>{activity.text}</Text>
              </View>
            </View>
          ) : (
            <View key={id} style={styles.transcriptActivityContainerFromBot}>
              <View style={styles.transcriptActivityBubbleFromBot}>
                <Text style={styles.transcriptActivityTextFromBot}>{activity.text}</Text>
              </View>
              <View style={styles.filler} />
            </View>
          )
        )}
      </ScrollView>
      <View style={styles.sendBox}>
        <TextInput
          autoCompleteType="off"
          dataDetectorTypes="none"
          onSubmitEditing={handleSend}
          onChangeText={handleChangeText}
          placeholder="Type your message"
          returnKeyType="send"
          style={styles.sendBoxInput}
          value={sendBoxText}
        />
        <Button onPress={handleSend} title="Send" />
      </View>
    </View>
  );
};

export default Chat;
