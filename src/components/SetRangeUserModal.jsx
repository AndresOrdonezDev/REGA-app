import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Switch,
} from "react-native";
import { Button, Icon, Input, ListItem } from "@rneui/themed";
//my functions
import { UserContext, user } from "../context/UserContext";
import UseRangeUser from "../hooks/UseRangeUser";

export default function SetRangeUserModal({
  onClose,
  visible,
  roles,
  selectedUser,
}){
  const { saveRangeUser } = UseRangeUser()
  const { rangeCitiesMain, user, rangeByUser, getAllRangeByUser } = useContext(UserContext);

  const [expandedRol, setExpandedRol] = useState(false);
  const [expandedRange, setExpandedRange] = useState(false);

  const [rolSelected, setRolSelected] = useState("");
  const [rangeSelected, setRangeSelected] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");

  const [rangeEndForm, setRangeEndForm] = useState(null);

  const handleSubmitRangeUser = async () => {
    console.log('rango selected ', rangeSelected)
    const errors = [
      !rangeSelected && registerError("Elije un rango de numeración"),
      (!selectedUser?.role_name && !rolSelected) && registerError('Elije un rol de usuario'),
      (!rangeEndForm || +rangeEndForm <= +rangeSelected.last || +rangeEndForm > +rangeSelected.range_end) && registerError(`El rango debe estar entre ${rangeSelected.last} y ${rangeSelected.range_end}`)
    ];

    if (errors.some((error) => error)) {
      return;
    }

    const data = { 
      user_id: +selectedUser.id, 
      range_init: +rangeSelected.last, 
      range_end: +rangeEndForm, 
      city_name: rangeSelected.city_name, 
      last: +rangeSelected.last
    }
    
    setIsLoading(true)

    //from admin to coordinator
    let isSendAdmin = user?.user.role_name === 'Administrador' ? true : false
    const dataUpdate = { ...rangeSelected, last: +rangeEndForm + 1}
    await saveRangeUser(data, dataUpdate, isSendAdmin)
    setIsLoading(false)
    onClose();
  };

  const registerError = (message) => {
    setMessageAlert(message);
    setTimeout(() => {
      setMessageAlert("");
    }, 3000);
    return true;
  };

  useEffect(() => {
    setRangeEndForm(null)
    setExpandedRol(false)
    setExpandedRange(false)
    setRangeSelected(null)
    setRolSelected("")
    getAllRangeByUser()
    //console.log('range by user ', rangeByUser)
  }, [visible]);


  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.closeContainer}>
            <Text style={{ flex: 1, fontSize: 15 }}>Rango por usuario </Text>
            <Button
              onPressOut={() => onClose()}
              icon={<Icon name="close" />}
              color="transparent"
            />
          </View>
          <ScrollView>
            <View>
              <Input
                style={styles.noOpacityDisabled}
                value={`${selectedUser.name} ${selectedUser.last_name} `}
                disabled={true}
                placeholder="Rango inicial"
              />

              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title>Rol Usuario </ListItem.Title>
                    <ListItem.Subtitle>
                      {selectedUser?.role_name ? selectedUser?.role_name : rolSelected ? rolSelected : "Elige un rol"}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                }
                isExpanded={expandedRol}
                onPress={() => setExpandedRol(!expandedRol)}
              >
                <ListItem>
                  <ListItem.Content>
                    {roles?.filter(rolUser => {
                      if (user.user.role_name === "Administrador") {
                        return rolUser
                      } else {
                        return rolUser.name_role !== user.user.role_name && rolUser.name_role !== 'Administrador'
                      }

                    }).map((rol) => (
                      <ListItem.Title
                        onPress={() => [
                          setRolSelected(rol?.name_role),
                          setExpandedRol(false),
                        ]}
                        style={styles.nameCity}
                        key={rol.id}
                      >
                        <Text style={{ fontWeight: "bold", color: "#00bfa5" }}>
                          {rol?.name_role}
                        </Text>
                      </ListItem.Title>
                    ))}
                  </ListItem.Content>
                </ListItem>
              </ListItem.Accordion>

              {/* range cities */}
              <ListItem.Accordion
                content={
                  <ListItem.Content>
                    <ListItem.Title>Rango numeración </ListItem.Title>
                    <ListItem.Subtitle>
                      {rangeSelected
                        ? `${rangeSelected.city_name}: ${rangeSelected.range_init} - ${rangeSelected.range_end}`
                        : "Elige un rango"}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                }
                isExpanded={expandedRange}
                onPress={() => setExpandedRange(!expandedRange)}
              >
                <ListItem>
                  {/* range to admin */}
                  {user?.user.role_name === 'Administrador' && <ListItem.Content>
                    {rangeCitiesMain?.filter(range => {
                      if (user?.user.role_name === 'Administrador') {
                        return range.is_active === '1'
                      }
                    }).map((range) => (
                      <ListItem.Title
                        onPress={() => [
                          setRangeSelected(range),
                          setExpandedRange(false),
                        ]}
                        style={styles.nameCity}
                        key={range.id}
                      >
                        <Text style={{ fontWeight: "bold", color: "#00bfa5" }}>
                          {range.city_name}: {range.range_init} - {range.range_end}
                        </Text>
                      </ListItem.Title>
                    ))}
                  </ListItem.Content>}
                  {/* range to coord */}
                  {user?.user.role_name !== 'Administrador' && <ListItem.Content>
                    {rangeByUser?.filter(range => {
                      if (user?.user.id === range.user_id) {
                        return range.completed === '0'
                      }
                    }).map((range) => (
                      <ListItem.Title
                        onPress={() => [
                          setRangeSelected(range),
                          setExpandedRange(false),
                        ]}
                        style={styles.nameCity}
                        key={range.id}
                      >
                        <Text style={{ fontWeight: "bold", color: "#00bfa5" }}>
                          {range.city_name}: {range.range_init} - {range.range_end}
                        </Text>
                      </ListItem.Title>
                    ))}
                  </ListItem.Content>}


                </ListItem>
              </ListItem.Accordion>
              {rangeSelected && (
                <View>
                  <Input
                    style={styles.noOpacityDisabled}
                    value={String(`Último asignado: ${rangeSelected.last}`)}
                    disabled={true}
                    placeholder="Rango inicial"
                  />

                  <Input
                    keyboardType="numeric"
                    value={rangeEndForm}
                    onChangeText={(text) => setRangeEndForm(text)}
                    placeholder="Rango final"
                  />
                </View>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "flex-end",
              paddingVertical: 10,
              flexDirection: "row",
              gap: 10,
            }}
          >
            {isLoading && <ActivityIndicator color="#00bfa5" size="large" />}
            <Button
              title="Guardar"
              color="#00bfa5"
              radius="lg"
              onPress={() => handleSubmitRangeUser()}
              disabled={isLoading}
            />
          </View>
          {messageAlert && <Text style={styles.alertText}>{messageAlert}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "70%",
  },
  closeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nameCity: {
    marginVertical: 3,
  },
  alertText: {
    color: "red",
    textAlign: "center",
    borderStartWidth: 2,
    borderRightColor: "red",
    fontSize: 15,
  },
  noOpacityDisabled: {
    opacity: 1,
    color: "#000",
  },
  textCityName: {
    color: "#333",
    textAlign: "right",
    fontWeight: "bold",
  },
});
