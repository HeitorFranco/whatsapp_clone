import firebase from 'firebase/app'
import 'firebase/firebase-auth'
import 'firebase/firebase-firestore'

import firebaseConfig from './firebaseConfig'

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()

export default {
  firebaseApp,
  fbPopup: async () => {
    //const provider = new firebase.auth.FacebookAuthProvider()
    const provider = new firebase.auth.GoogleAuthProvider()
    let result = await firebaseApp.auth().signInWithPopup(provider)
    return result
  },
  addUser: async (u) => {
    await db.collection('users').doc(u.id).set({
      name: u.name,
      avatar: u.avatar
    }, {merge: true})
  },
  getContactList: async (userId) => {
    let list = []

    let results = await db.collection('users').get()
    results.forEach(result => {
      let data = result.data()
      if(result.id !== userId){
        list.push({
          id: result.id,
          name: data.name,
          avatar: data.avatar
        })
      }
    })

    return list;
  },
  addNewChat: async (user, user2) => {
    let u = await db.collection('users').doc(user.id).get()
    let uData = u.data()

    if(!uData.chats){
      let newChat = await db.collection('chats').add({
        messages: [],
        users: [user.id, user2.id]
      })
      
      db.collection('users').doc(user.id).update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          chatId: newChat.id,
          title: user2.name,
          image: user2.avatar,
          with: user2.id
        })
      })
      db.collection('users').doc(user2.id).update({
        chats: firebase.firestore.FieldValue.arrayUnion({
          chatId: newChat.id,
          title: user.name,
          image: user.avatar,
          with: user.id
        })
      })
      return
    }
    
    for(let e in uData.chats){
      if(uData.chats[e].with === user2.id){
        return
      }
    }
    let newChat = await db.collection('chats').add({
      messages: [],
      users: [user.id, user2.id]
    })
    
    db.collection('users').doc(user.id).update({
      chats: firebase.firestore.FieldValue.arrayUnion({
        chatId: newChat.id,
        title: user2.name,
        image: user2.avatar,
        with: user2.id
      })
    })
    db.collection('users').doc(user2.id).update({
      chats: firebase.firestore.FieldValue.arrayUnion({
        chatId: newChat.id,
        title: user.name,
        image: user.avatar,
        with: user.id
      })
    })
    
  },
  onChatList: async (userId, setChatList) => {
    return db.collection('users').doc(userId).onSnapshot((doc)=>{
      if(doc.exists){
        let data = doc.data()

        if(data.chats){
          let chats = [...data.chats]

          chats.sort((a,b) => {
            if(a.lastMessageDate === undefined){
              return -1
            }
            if(a.lastMessageDate.seconds < b.lastMessageDate.seconds){
              return 1
            }else{
              return -1
            }
          })


          setChatList(chats)
        }
      }
    })
  },
  onChatContent: (chatId, setList, setUsers) => {
    return db.collection('chats').doc(chatId).onSnapshot((doc)=>{
      if(doc.exists){
        let data = doc.data()

        setList(data.messages)
        setUsers(data.users)
      }
    })
  },
  sendMessage: async(chatData, userId, type, body, users) => {
    let now = new Date()

    db.collection('chats').doc(chatData.chatId).update({
      messages: firebase.firestore.FieldValue.arrayUnion({
        type,
        author: userId,
        body,
        date: now
      })
    })

    for(let i in users){
      let u = await db.collection('users').doc(users[i]).get()
      let uData = u.data()
      if(uData.chats){
        let chats = [...uData.chats]

        for(let e in chats){
          if(chats[e].chatId === chatData.chatId){
            chats[e].lastMessage = body
            chats[e].lastMessageDate = now
          }
        }

        await db.collection('users').doc(users[i]).update({
          chats
        })
      }
    }
  }

}