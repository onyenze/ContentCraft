import express from "express";
import contentTypeRoutes from "./routes/contentTypeRoutes";

const app = express();

app.use(express.json());
app.use("/api", contentTypeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
