import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

export const getProfiles = (q) =>
  client.get("/profiles", { params: q ? { q } : {} }).then((r) => r.data);

export const getRumors = (profileId) =>
  client.get(`/profiles/${profileId}/rumors`).then((r) => r.data);

export const getSources = () => client.get("/sources").then((r) => r.data);

export const getStats = () => client.get("/stats").then((r) => r.data);

export const createRumor = (payload) =>
  client.post("/rumors", payload).then((r) => r.data);

export const createProfile = (payload) =>
  client.post("/profiles", payload).then((r) => r.data);

export const consistencyCheck = (payload) =>
  client.post("/consistency-check", payload).then((r) => r.data);
