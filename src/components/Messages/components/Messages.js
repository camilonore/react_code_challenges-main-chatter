import React, { useContext, useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';
import config from '../../../config';
import LatestMessagesContext from '../../../contexts/LatestMessages/LatestMessages';
import TypingMessage from './TypingMessage';
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import '../styles/_messages.scss';

const socket = io(
  config.BOT_SERVER_ENDPOINT,
  { transports: ['websocket', 'polling', 'flashsocket'] }
);


function Messages() {
  
  const [playSend] = useSound(config.SEND_AUDIO_URL);
  const [isTyping, setIsTyping] = useState(false)
  const [playReceive] = useSound(config.RECEIVE_AUDIO_URL);
  const [message, setMessage] = useState('')
  const { messages, setLatestMessage } = useContext(LatestMessagesContext);
  const messagesRef = useRef()

  const scrollToBottom = (ref) => {
    ref.current.lastElementChild.scrollIntoView()
  }

  useEffect(() => {    
    socket.on('bot-typing', (message) => {
      setIsTyping(true)
      scrollToBottom(messagesRef)
    });
    
    socket.on('bot-message', (message) => {
      setIsTyping(false)
      setLatestMessage('bot', message)
      playReceive()
      scrollToBottom(messagesRef)
    });
    
    return () => {
      socket.disconnect()
      socket.removeAllListeners()
    }
  }, [])
  
  const onChangeMessage = (evt) => {
    setMessage(evt.target.value)
  }
  const sendMessage = () => {
    playSend()
    setLatestMessage('me', message)
    setMessage('')
    socket.emit('user-message', message)
    setTimeout(() => {
      scrollToBottom(messagesRef)
    },0)
  }
  
  return (
    <div className="messages">
      <Header />
      <div className="messages__list" id="message-list" ref={messagesRef}>
        {messages.map((message,index) => {
          return (
            <Message message={message} key={index} nextMessage={true} botTyping={message.user === 'bot'}/>
          )
        })}
        {isTyping && <TypingMessage/>}
      </div>
      <Footer message={message} sendMessage={sendMessage} onChangeMessage={onChangeMessage} />
    </div>
  );
}

export default Messages;
