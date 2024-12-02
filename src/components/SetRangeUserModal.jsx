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
import { UserContext } from "../context/UserContext";

export default function SetRangeUserModal({
  onClose,
  visible,
  roles,
  selectedUser,
}) {
  const { rangeCitiesMain, user } = useContext(UserContext);

  const [expandedRol, setExpandedRol] = useState(false);
  const [expandedRange, setExpandedRange] = useState(false);

  const [rolSelected, setRolSelected] = useState("");
  const [rangeSelected, setRangeSelected] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");

  const [userRangeData, setUserRangeData] = useState({
    name: "",
    range_end: 0,
  });

  const handleChange = (name, text) => {
    setUserRangeData({
      ...userRangeData,
      [name]: name === "name" ? text : Number(text),
    });
  };

  const handleSubmitRangeUser = async () => {
    const errors = [
      !rangeSelected && registrerError("Elije un arango de numeración"),
      !rangeSelected && registrerError("Elije un arango de numeración"),
    ];

    if (errors.some((error) => error)) {
      return;
    }

    console.log("paso");

    //onClose();
  };

  const registrerError = (message) => {
    setMessageAlert(message);
    setTimeout(() => {
      setMessageAlert("");
    }, 3000);
    return true;
  };

  useEffect(() => {
    setUserRangeData({
      name: "",
      range_end: 0,
    });

    // updateValuesToNewRegister()
    setExpandedRol(false);
    setExpandedRange(false);
    console.log("usuarios actual", user);
  }, [visible]);

  // const updateValuesToNewRegister = () => {
  //     const highestRangeEnd = rangeAllUsers.reduce((max, city) =>
  //         Math.max(max, city.range_end), 0);

  //     setLast(highestRangeEnd);
  // }
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
                      {rolSelected ? rolSelected : "Elige un rol"}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                }
                isExpanded={expandedRol}
                onPress={() => setExpandedRol(!expandedRol)}
              >
                <ListItem>
                  <ListItem.Content>
                    {roles?.map((rol) => (
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
                  <ListItem.Content>
                    {rangeCitiesMain?.map((range) => (
                      <ListItem.Title
                        onPress={() => [
                          setRangeSelected(range),
                          setExpandedRange(false),
                        ]}
                        style={styles.nameCity}
                        key={range.id}
                      >
                        <Text style={{ fontWeight: "bold", color: "#00bfa5" }}>
                          {range.city_name}: {range.last} - {range.range_end}
                        </Text>
                      </ListItem.Title>
                    ))}
                  </ListItem.Content>
                </ListItem>
              </ListItem.Accordion>
              {rangeSelected && (
                <View>
                  <Input
                    style={styles.noOpacityDisabled}
                    value={String(`Rango inicial: ${rangeSelected.last}`)}
                    disabled={true}
                    placeholder="Rango inicial"
                  />

                  <Input
                    keyboardType="numeric"
                    value={userRangeData.range_end}
                    onChangeText={(text) => handleChange("range_end", text)}
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
