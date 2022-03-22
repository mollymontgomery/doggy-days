import React, { useState, useEffect } from "react";
import { Container, Button, Card } from "react-bootstrap";
import Auth from "../utils/auth";
import { useMutation } from "@apollo/client";
import { SAVE_DOG } from "../utils/mutations";
import { saveDogIds, getSavedDogIds } from "../utils/localStorage";



const DinderCard = () => {
  const url =
    "https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=1";
  const [dog, setDog] = useState();

  const [savedDogs, setSavedDogs] = useState([]);

  const [savedDogIds, setSavedDogIds] = useState(getSavedDogIds());

  useEffect(() => {
    return () => saveDogIds(savedDogIds);
  });

  const [saveDog] = useMutation(SAVE_DOG);

  function getDog() {
    fetch(url, {
      method: "GET",
      headers: {
        "x-api-key": "a72d9af4-b56e-4f89-a1c0-f5b1961b9293",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDog(data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  useEffect(() => {
    getDog();
  }, []);

  const handleNextDog = () => {
    getDog();
  };

  const handleSaveDog = async (dogId) => {
    console.log(dogId, "dogId log");
    const dogData = dog.map(()=> ({
      image: dog[0].url,
      breed: dog[0].breeds[0].name,
      characteristics: dog[0].breeds[0].temperament,
      life_span: dog[0].breeds[0].life_span,
      weight: dog[0].breeds[0].weight.imperial,
      dogId: dog[0].id
    }))

    setSavedDogs(dogData);
    console.log(savedDogs, "savedDogs log");

    const dogToSave = dogData.find(() => dog[0].id === dogId);

    console.log(dogToSave, "dogtosave log")

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    console.log(savedDogIds, "savedDogIds log");

    if (!token) {
      return false;
    }

    try {
      await saveDog({
        variables: {
          image: "test string"
        }
      })
      console.log(dogToSave, "dogtosave inside try");
      setSavedDogIds([...savedDogIds, dogToSave.dogId]) 
      console.log(savedDogIds, "saveddogids inside try");
    } catch (err) {
      console.log(err)
    }

  };

  return (
    <section>
      {Auth.loggedIn() && (
        <Container>
          <Card.Body>
            <Card.Img
              src={dog && dog[0].url}
              alt={`This is a ${dog && dog[0].breeds[0].name}`}
            ></Card.Img>
            <Card.Title>{dog && dog[0].breeds[0].name}</Card.Title>
            <p>Characteristics: {dog && dog[0].breeds[0].temperament}</p>
            <p>Life Span: {dog && dog[0].breeds[0].life_span}</p>
            <p>Weight: {dog && dog[0].breeds[0].weight.imperial} lbs.</p>

            <>
              <Button
                disabled={savedDogIds?.some(
                  (savedDogId) => savedDogId === dog && dog[0].id
                )}
                onClick={() => handleSaveDog(dog[0].id)}
              > Save Dog
              </Button>
              <Button onClick={() => handleNextDog()}>Next</Button>
            </>
          </Card.Body>
        </Container>
      )}
    </section>
  );
};

export default DinderCard;

// <div className="App">
//   <h1>Doggy Days</h1>
//   <img src={dog && dog[0].url} alt="A dog"></img>
//   <p>Breed: {dog && dog[0].breeds[0].name}</p>
//   <p>Characteristics: {dog && dog[0].breeds[0].temperament}</p>
//   <p>Life Span: {dog && dog[0].breeds[0].life_span}</p>
//   <p>Weight: {dog && dog[0].breeds[0].weight.imperial} lbs.</p>
// </div>
