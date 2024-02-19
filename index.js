import express from "express";
import bodyParser from "body-parser";

// Express app definition
const app = express();
const port = 3000;

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

let currentDate = new Date();

let year = currentDate.getFullYear();
// Zero-based
let month = currentDate.getMonth() + 1;
let day = currentDate.getDate();

// YYYY-MM-DD
let formattedDate = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');

var post_array = [{
    title: "Exploring the Wonders of Nature",
    authors: "Jane Doe",
    date: "2024-02-08",
    content: "Aliquam erat volutpat. Vestibulum quis consequat orci. Morbi malesuada ultrices magna ornare faucibus. Fusce justo enim, lobortis sit amet vehicula vitae, dictum sit amet lacus. Vestibulum in ipsum sed turpis feugiat condimentum. Sed mauris magna, ultrices sed commodo vitae, aliquet nec ligula. Quisque risus augue, vulputate ac ultricies quis, sagittis ut risus. Donec id rhoncus odio. Duis mattis ultrices magna ac elementum. Nulla facilisi. Nullam vel vulputate ex, vitae iaculis diam. Donec ante mi, ultrices nec rhoncus a, porttitor sit amet turpis. Duis tempus aliquet ligula, vel efficitur dolor elementum quis. Suspendisse efficitur nibh leo, quis ornare eros suscipit feugiat."
}];

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.get("/contact", (req, res) => {
    res.render("partials/contact.ejs")
})

app.post("/edit-menu", (req, res) => {
    const editTitle = req.body.btnEdit;
    res.render("partials/edit.ejs", { editTitle: editTitle });
});

app.post("/edit", (req, res) => {
    const existingPost = post_array.find(post => post.title === req.body.submitBtn);
    const titleExists = post_array.some(post => post.title === req.body.postTitle);
    // Do not accept the new title if it already exists in another post
    if (titleExists && (req.body.submitBtn !== req.body.postTitle)) {
        res.render("partials/return.ejs")
    }
    else {
        existingPost.authors = req.body.postAuthor || existingPost.authors;
        existingPost.title = req.body.postTitle || existingPost.title;
        existingPost.content = req.body.postContent || existingPost.content;
        const selectedPost = post_array[0]
        const data = {
            posts: post_array,
            selectedPost: selectedPost,
        }
        res.render("partials/viewPosts.ejs", data);
    }
})

app.get("/create-post", (req, res) => {
    // Choose a random post
    var random_post = post_array[(Math.floor(Math.random() * post_array.length))]
    const data = {
        posts: post_array,
        random_post: random_post
    }
    res.render("partials/createPost.ejs", data)
})

app.get("/view-posts", (req, res) => {
    // By default, show the first post
    const selectedPost = post_array[0]
    const data = {
        posts: post_array,
        selectedPost: selectedPost
    }
    res.render("partials/viewPosts.ejs", data)
})

app.post("/submit", (req, res) => {
    const newTitle = req.body['postTitle'];
    const titleExists = post_array.some(post => post.title === newTitle);
    if (titleExists) {
        res.render("partials/return.ejs");
    }
    else {
        const post = {
            title: req.body['postTitle'],
            content: req.body['postContent'],
            authors: req.body['postAuthor'],
            date: formattedDate,
        }
        post_array.push(post);
        const selectedPost = post_array[0];
        const data = {
            posts: post_array,
            selectedPost: selectedPost,
        }
        res.render("partials/viewPosts.ejs", data);
    }
});

app.post("/delete", (req, res) => {
    const deletedPostTitle = req.body.btnDelete
    const index = post_array.findIndex(post => post.title === deletedPostTitle);
    // Remove the post
    post_array.splice(index, 1);
    const selectedPost = post_array[0]
    const data = {
        posts: post_array,
        selectedPost: selectedPost
    }
    res.render("partials/viewPosts.ejs", data);
})

app.get("/view-post", (req, res) => {
    const selectedPostTitle = req.query.title;
    const selectedPost = post_array.find(post => post.title === selectedPostTitle);

    const data = {
        posts: post_array,
        selectedPost: selectedPost
    }
    res.render("partials/viewPosts.ejs", data)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

