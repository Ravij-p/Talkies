const { default: mongoose } = require("mongoose");
const password = encodeURIComponent("qwertyasdzx");
const uri = `mongodb+srv://RavijPatel:${password}@cluster0.izspskc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.log(e);
  });
