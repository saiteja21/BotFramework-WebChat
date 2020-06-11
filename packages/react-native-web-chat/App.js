import { Composer } from 'botframework-webchat-component';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import Chat from './Chat';
import createDirectLine from './createDirectLine';

export default function App() {
  const [directLine, setDirectLine] = useState();

  useEffect(() => {
    (async function() {
      const res = await fetch('https://webchat-mockbot.azurewebsites.net/directline/token', {
        headers: {
          origin: 'http://localhost:5000/'
        },
        method: 'POST'
      });

      if (!res.ok) {
        return console.warn('Failed to retrieve Direct Line token.');
      }

      const { token } = await res.json();

      setDirectLine(createDirectLine({ token }));
    })();
  }, [setDirectLine]);

  return (
    <SafeAreaView style={styles.outer}>
      <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.inner}>
          {!!directLine && (
            <Composer directLine={directLine}>
              <Chat />
            </Composer>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  inner: {
    flex: 1,
    justifyContent: 'space-around'
  },

  outer: {
    flex: 1
  }
});
