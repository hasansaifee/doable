import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { firebase } from '../../firebase/config'
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

export default function HomeScreen(props) {

  const [entityText, setEntityText] = useState('')
  const [entities, setEntities] = useState([])

  const entityRef = firebase.firestore().collection('entities')
  const userID = props?.extraData?.id

  useEffect(() => {
    if (userID) {
      entityRef
        .where("authorID", "==", userID)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
            querySnapshot => {
                const newEntities = []
                querySnapshot.forEach(doc => {
                    const entity = doc.data()
                    entity.id = doc.id
                    newEntities.push(entity)
                });
                setEntities(newEntities)
            },
            error => {
                console.log(error)
            }
        )  
    }
  }, [])

  const onAddButtonPress = () => {
    if (entityText && entityText.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        text: entityText,
        authorID: userID,
        createdAt: timestamp,
      };
      entityRef
        .add(data)
        .then(_doc => {
            setEntityText('')
            Keyboard.dismiss()
        })
        .catch((error) => {
            alert(error)
        });
    }
  }

  const onLogoutPress = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
          props.logout()
      })
      .catch(error => {
          alert(error)
      })
  }

  const onTrashPress = (id) => {
    entityRef.doc(id).delete().then(function() {
      alert("document successfully deleted.");
    }).catch(function(error) {
      alert(error);
    });
  }

  const renderEntity = ({item, index}) => {
    return (
      <View style={styles.entityContainer}>
        <Text style={styles.entityText}>
          {index}. {item.text}
        </Text>
        <TouchableOpacity
          onPress={console.log("bitch")}>
          <Ionicons name="ios-trash" onPress={console.log("damn it")} size={20} color="gray" />
        </TouchableOpacity>
      </View>
    )
  }

  // const renderSeparator = () => {
  //   return (
  //     <View
  //       style={{
  //         height: 1,
  //         width: "86%",
  //         backgroundColor: "#CED0CE",
  //         marginLeft: "14%"
  //       }}
  //     />
  //   )
  // }

  
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder='Add new entity'
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEntityText(text)}
          value={entityText}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
          style={styles.button}
          onPress={onLogoutPress}>
          <Text style={styles.buttonTitle}>Log out</Text>
        </TouchableOpacity>
      { entities && (
        <View style={styles.listContainer}>
          <FlatList
            data={entities}
            renderItem={renderEntity}
            keyExtractor={(item) => item.id}
            removeClippedSubviews={true}
            // ItemSeparatorComponent={renderSeparator}
          />
        </View>
      )}
    </View>
  )
}