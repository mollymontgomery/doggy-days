import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me{
      _id
      name
      phoneNumber
      savedDogs {
        dogId
        image
        breed
        characteristics
        life_span
        weight
      }
    }
  }`