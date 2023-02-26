import House from "./house";

interface Deal {
    profit: number,
    distance: number,
    house: House,
    relevantSoldHouses: House[];
}

export default Deal;