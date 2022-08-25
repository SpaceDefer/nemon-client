import { atom } from "recoil";

export const machineState = atom({
    key: "machineState",
    default: [],
});

export const applicationState = atom({
    key: "applicationState",
    default: [],
});
