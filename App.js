import React from 'react';
import { View, StyleSheet, Alert, Image, TouchableHighlight, BackHandler } from 'react-native';
import Status from './components/Status';
import MessageList from './components/MessageList';
import {
  createTextMessage,
  createImageMessage,
  createLocationMessage,
} from './utils/MessageUtils';

export default class App extends React.Component {
  state = {
    messages: [
      createImageMessage('https://static.wikia.nocookie.net/evade-nextbot/images/b/b1/Biggest_Loser.png/revision/latest?cb=20250504214621'),
      createTextMessage('Android to'),
      createTextMessage('Sa'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324,
      }),
    ],
    fullscreenImageId: null,
  };

  componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription?.remove();
  }

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert('Delete message?', 'Do you want to delete this message?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', onPress: () => this.deleteMessage(id) },
        ]);
        break;
      case 'image':
        this.setState({ fullscreenImageId: id });
        break;
      default:
        break;
    }
  };

  deleteMessage = id => {
    this.setState(prevState => ({
      messages: prevState.messages.filter(msg => msg.id !== id),
    }));
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;
    const image = messages.find(msg => msg.id === fullscreenImageId);
    if (!image) return null;
    const { uri } = image;
    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
      >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  render() {
    const { messages } = this.state;
    return (
      <View style={styles.container}>
        <Status />
        <View style={styles.content}>
          <MessageList
            messages={messages}
            onPressMessage={this.handlePressMessage}
          />
        </View>
        {this.renderFullscreenImage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: { flex: 1 },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
