import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;
const client = axios.create({ baseURL: API });

// Profiles
export const getProfiles = (params = {}) => client.get("/profiles", { params }).then((r) => r.data);
export const getProfile = (id) => client.get(`/profiles/${id}`).then((r) => r.data);
export const getClubs = () => client.get("/clubs").then((r) => r.data);
export const createProfile = (p) => client.post("/profiles", p).then((r) => r.data);

// Rumors
export const getRumors = (id) => client.get(`/profiles/${id}/rumors`).then((r) => r.data);
export const getRecentRumors = (limit = 25) =>
  client.get("/rumors/recent", { params: { limit } }).then((r) => r.data);
export const createRumor = (p) => client.post("/rumors", p).then((r) => r.data);

// Sources & stats
export const getSources = () => client.get("/sources").then((r) => r.data);
export const getStats = () => client.get("/stats").then((r) => r.data);

// AI
export const consistencyCheck = (p) => client.post("/consistency-check", p).then((r) => r.data);

// Radar
export const getAlerts = (status) =>
  client.get("/radar/alerts", { params: status ? { status } : {} }).then((r) => r.data);
export const radarScan = () => client.post("/radar/scan").then((r) => r.data);
export const investigateAlert = (id) => client.post(`/radar/alerts/${id}/investigate`).then((r) => r.data);
export const dismissAlert = (id) => client.post(`/radar/alerts/${id}/dismiss`).then((r) => r.data);

// Pipeline & tasks
export const getPipeline = () => client.get("/pipeline").then((r) => r.data);
export const updatePipeline = (id, p) => client.patch(`/pipeline/${id}`, p).then((r) => r.data);
export const getTasks = () => client.get("/tasks").then((r) => r.data);
export const createTask = (p) => client.post("/tasks", p).then((r) => r.data);
export const updateTask = (id, p) => client.patch(`/tasks/${id}`, p).then((r) => r.data);
