require("./config/db");
require('dotenv').config();

const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Form = require('./models/form');
const Response = require('./models/Response');
const userModel = require("./models/user");
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());


const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) return res.redirect("/login");
    req.user = data;
    next();
  });
};



app.get("/", async (req, res) => {
  const forms = await Form.find();
  const token = req.cookies.token;

  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = decoded;
    } catch (err) {
      
    }
  }

  res.render("index", { forms, user });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/dashboard", verifyToken, async (req, res) => {
  const forms = await Form.find(); 
  res.render("dashboard", { forms });
});


app.get("/create-form", verifyToken, (req, res) => {
  res.render("create-form");
});

app.get("/form/:id", async (req, res) => {
  const form = await Form.findById(req.params.id);

  const token = req.cookies.token;
  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      user = decoded;
    } catch (err) {
      
    }
  }

  res.render("form-page", { form, user });
});


app.get("/form/:id/responses", verifyToken, async (req, res) => {
  const form = await Form.findById(req.params.id);
  const responses = await Response.find({ formId: form._id });

  const summary = form.questions.map((q, i) => {
    const count = responses.filter(r => r.answers[i] && r.answers[i].trim() !== "").length;
    return {
      question: q,
      answered: count
    };
  });

  res.render("form-responses", { form, responses, summary });
});

const { Parser } = require('json2csv');

app.get("/form/:id/export", verifyToken, async (req, res) => {
  const form = await Form.findById(req.params.id);
  const responses = await Response.find({ formId: form._id });

  if (!form || form.adminEmail !== req.user.email) {
    return res.status(403).send("Unauthorized");
  }

  const fields = ["#"].concat(form.questions).concat(["Submitted At"]);

  const data = responses.map((r, i) => {
    const row = { "#": i + 1 };
    form.questions.forEach((q, idx) => {
      row[q] = r.answers[idx] || "";
    });
    row["Submitted At"] = r.submittedAt.toLocaleString();
    return row;
  });

  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(data);

  res.header("Content-Type", "text/csv");
  res.attachment(`${form.title.replace(/\s+/g, "_")}_responses.csv`);
  res.send(csv);
});


app.get("/form/:id/edit", verifyToken, async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (form.adminEmail !== req.user.email) return res.status(403).send("Unauthorized");
  res.render("edit-form", { form });
});



app.post("/create", async (req, res) => {
  const { username, email, password, adminSecret } = req.body;

  if (adminSecret !== ADMIN_SECRET) {
    return res.status(403).send("Invalid admin secret code.");
  }

  const hash = await bcrypt.hash(password, 10);
  await userModel.create({ username, email, password: hash });

  const token = jwt.sign({ email }, JWT_SECRET);
  res.cookie("token", token);
  res.redirect("/dashboard");
});

app.post("/login", async (req, res) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return res.send("User not found");

  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) return res.send("Wrong password");

  const token = jwt.sign({ email: user.email }, JWT_SECRET);
  res.cookie("token", token);
  res.redirect("/dashboard");
});

app.post("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});



app.post("/create-form", verifyToken, async (req, res) => {
  const { title, questions, types, options } = req.body;

  const qs = questions.map((text, i) => ({
    text,
    type: types[i],
    options: options[i] || ""
  }));

  await Form.create({ title, questions: qs, adminEmail: req.user.email });
  res.redirect("/dashboard");
});


app.post("/form/:id", async (req, res) => {
  const { answers } = req.body;

  await Response.create({
    formId: req.params.id,
    answers
  });

  res.render("thank-you"); 
});


app.post("/form/:id/edit", verifyToken, async (req, res) => {
  const form = await Form.findById(req.params.id);
  if (form.adminEmail !== req.user.email) return res.status(403).send("Unauthorized");

  const { title, questions } = req.body;
  const parsedQuestions = Array.isArray(questions) ? questions : [questions];

  form.title = title;
  form.questions = parsedQuestions;
  await form.save();

  res.redirect("/dashboard");
});

app.post('/form/:id/delete', async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    await Response.deleteMany({ formId: req.params.id });
    res.redirect('/dashboard');
  } catch (err) {
    res.status(500).send("Error deleting form");
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
