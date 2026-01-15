import { useContext, useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext();

export const ChatProvider=({children})=>{

    const [messages, setMessages]=useState([]);
    const [users, setUsers]=useState([]);
    const [selectedUser, setSelectedUser]=useState(null);
    const [unseenMessages, setUnseenMessages]=useState({});

    const {socket , axios} = useContext(AuthContext);


    //fuction to get all users for sidebar
    const getUsers= async ()=>{
        try {
          const{ data } = await axios.get("/api/messages/users");
          if(data.success){
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages);
          }  
        } catch (error) {
            toast.error(error.message)
        }
    }

    //fuction to get messages with a selected user
    const getMessages = async(userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    //fuction to send message to selected user
    const sendMessage = async (messageData) => {
  try {
    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      messageData
    );

    console.log("Sent message from backend:", data.newMessage);


    if (data.success) {
      setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


    // function to subscribe to messages for selected user
    // const subscribeToMessages = async ()=>{
    //     if(!socket) return;

    //     socket.on("newMessage", (newMessage)=>{
    //       if(selectedUser && newMessage.senderId === selectedUser._id){
    //         newMessage.seen =true;
    //         setMessages((prevMessages)=>[...prevMessages, newMessage]);
    //         axios.put(`/api/messages/mark/${newMessage._id}`);
    //             }else{
    //                 setUnseenMessages((prevUnseenMessages)=>({
    //                     ...prevUnseenMessages,[newMessage.senderId]:
    //                     prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
    //                 }))
    //             }
    //             });
    // }
    const subscribeToMessages = () => {
  if (!socket) return;

  socket.on("newMessage", async (newMessage) => {

    if (!newMessage || !newMessage._id) return;

    if (selectedUser && newMessage.senderId === selectedUser._id) {

      // ALWAYS mark seen (text OR image)
      setMessages(prev => [
        ...prev,
        { ...newMessage, seen: true }
      ]);

      try {
        await axios.put(`/api/messages/mark/${newMessage._id}`);
      } catch (err) {
        console.error("Failed to mark seen", err);
      }

    } else {
      setUnseenMessages(prev => ({
        ...prev,
        [newMessage.senderId]:
          prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1
      }));
    }
  });
};


    //fuction to unsubscribe from messages
    const unsubscribeFromMessages =()=>{
        if(socket) socket.off("newMessage");
    }
    
    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser]);

    const value={
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages

    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
} 